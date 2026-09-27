/**
 * attn — AI command router (server only).
 *
 *   text (voice transcript or typed)  →  context + capability whitelist  →  Gemini
 *   →  function calls  →  validate every call  →  run the whitelisted ones through
 *   actions.js  →  save through the normal persistence path  →  the model sees the
 *   real results and phrases one short spoken reply  →  device
 *
 * The model decides WHAT the user means. This file decides HOW it happens.
 * The model never edits state JSON, never runs code and never sees secrets.
 *
 * Reply contract to the device (unchanged from the first voice phase):
 *   { type: execute | clarify | respond, spokenResponse, clarificationQuestion,
 *     results[], highlightItemIds[], state? }
 *
 * Conversation memory is deliberately tiny: the last few turns per device,
 * kept in memory for ten minutes, enough for "What time?" → "Five." and
 * "Actually make that 3:30."
 */
import { MODULE_META, MODULE_IDS, ITEM_TYPES, LIMITS } from '../public/js/state.js';
import { ASSISTANT_ACTIONS, ASSISTANT_ACTION_TYPES, LIST_MODULES, findItem } from '../public/js/actions.js';
import * as gemini from './gemini.js';
import { localToInstant, instantToLocal, formatWhen, formatRange, describeNow, isValidTimeZone, isValidLocale } from './time.js';
import { stripWakePhrase } from '../public/js/wake.js';

const { AssistantError } = gemini;
const log = (...args) => console.log('[attn ▸ assistant]', ...args);
export const ASSISTANT_NAME = process.env.ASSISTANT_NAME || 'Andrew';

const MAX_TEXT = 500;
const MAX_ACTIONS = 6;
const CONVERSATION_TTL_MS = 10 * 60 * 1000;
const MAX_TURNS = 6;
const conversations = new Map();

// ----------------------------------------------------------------- functions the model may call
const str = (description, extra = {}) => ({ type: 'string', description, ...extra });
/** JSON-schema parameters per action; shared with the OpenAI Realtime tools (lib/realtime.js). */
export const ACTION_SCHEMAS = {
  add_item: {
    properties: {
      module: str('attention = reminders/to-dos ("Pay attention to"), calendar = events ("Upcoming"), mail = emails to handle ("Important email")', { enum: LIST_MODULES }),
      title: str('Short title, sentence case, no trailing period, no time in it'),
      at: str('Local wall time YYYY-MM-DDTHH:mm in the user timezone, when the item has a time'),
      subtitle: str('Short detail shown under the title ONLY when there is no time, e.g. "Before lunch"'),
      type: str('Tile glyph', { enum: ITEM_TYPES }),
    },
    required: ['module', 'title'],
  },
  update_item: {
    properties: {
      itemId: str('id of an existing item from CONTEXT (use lastTouchedItemIds for "actually make that…")'),
      title: str('New title'),
      at: str('New local wall time YYYY-MM-DDTHH:mm'),
      subtitle: str('New detail, only when there is no time'),
      module: str('Move the item to another list', { enum: LIST_MODULES }),
    },
    required: ['itemId'],
  },
  complete_item: { properties: { itemId: str('id of an existing item from CONTEXT that the user is done with') }, required: ['itemId'] },
  remove_item: { properties: { itemId: str('id of an existing item from CONTEXT to delete for good') }, required: ['itemId'] },
  set_module_visibility: {
    properties: { module: str('Which module', { enum: MODULE_IDS }), enabled: { type: 'boolean', description: 'true to show, false to hide' } },
    required: ['module', 'enabled'],
  },
  set_focus: {
    properties: {
      enabled: { type: 'boolean', description: 'true to turn Focus mode on, false to turn it off' },
      label: str('What the focus is for, e.g. "Deep work", "Deep Focus" or "Frequency music"'),
      at: str('Optional local start time YYYY-MM-DDTHH:mm'),
      durationMinutes: { type: 'integer', description: 'Length in minutes (default 60 when a start time is given)' },
      notificationsBlocked: { type: 'boolean', description: 'true when the user asks to block/silence notifications for deep focus (shown on the card; simulated, nothing on the phone changes)' },
    },
    required: ['enabled'],
  },
  schedule_reminder: {
    properties: {
      title: str('What to remind, short sentence case, without the time, e.g. "Catch your bus"'),
      dueAt: str('Local wall time YYYY-MM-DDTHH:mm for absolute times ("at 3:30")'),
      inMinutes: { type: 'number', description: 'For relative requests ("in five minutes"): minutes from now' },
      inSeconds: { type: 'number', description: 'For very short test reminders ("in ten seconds"): seconds from now' },
    },
    required: ['title'],
  },
  start_focus_music: { properties: {}, required: [] },
  stop_focus_music: { properties: {}, required: [] },
  end_focus_mode: { properties: {}, required: [] },
  set_note: {
    properties: { text: str('The note text, max 240 characters'), append: { type: 'boolean', description: 'true to add to the existing note instead of replacing it' } },
    required: ['text'],
  },
};

/** Gemini function declarations: the action registry + two ways to answer without acting. */
export const FUNCTION_DECLARATIONS = [
  ...ASSISTANT_ACTION_TYPES.map((name) => ({
    name,
    description: ASSISTANT_ACTIONS[name].description,
    parametersJsonSchema: { type: 'object', ...ACTION_SCHEMAS[name] },
  })),
  {
    name: 'clarify',
    description: 'Ask ONE short question when a value needed to act is genuinely missing (mainly a missing time for "later today" / "later" reminders). Do not call any other function in the same turn.',
    parametersJsonSchema: { type: 'object', properties: { question: str('The short question to speak, e.g. "What time today should I remind you?"') }, required: ['question'] },
  },
  {
    name: 'respond',
    description: 'Answer without changing anything: questions about what is on the device ("what should I pay attention to in the next three hours"), greetings, or requests attn cannot do. Answer from CONTEXT only.',
    parametersJsonSchema: {
      type: 'object',
      properties: {
        spokenResponse: str('What to say out loud: one or two short sentences'),
        highlightItemIds: { type: 'array', description: 'ids of the CONTEXT items you mention, so the device can highlight them', items: { type: 'string' } },
      },
      required: ['spokenResponse'],
    },
  },
];
const META_FUNCTIONS = ['clarify', 'respond'];

// ----------------------------------------------------------------- prompt
function capabilityList() {
  return ASSISTANT_ACTION_TYPES.map((type) => `- ${type}: ${ASSISTANT_ACTIONS[type].description}`).join('\n');
}

/** Stable across requests. Everything that varies goes in the user message. */
export function buildSystemPrompt() {
  const name = ASSISTANT_NAME;
  return `You are ${name}, the voice of attn — a small personal attention device that sits on a desk and shows only what deserves attention right now. attn has a few cards on its screen: "Pay attention to" (module attention: reminders and to-dos), "Upcoming" (module calendar: scheduled events), "Important email" (module mail: emails to handle), "Focus mode" (module focus: one focus block) and "Quick note" (module note: free text). Everything lives inside attn; there are no real external accounts yet.

YOUR JOB
Turn what the user said into the fewest correct function calls, or answer a question from the CONTEXT with respond(). You decide what the user means; the application runs the functions and tells you what happened. Then you say it in a sentence or two.

FUNCTIONS THAT CHANGE THE DEVICE
${capabilityList()}
Plus clarify(question) to ask one short question, and respond(spokenResponse, highlightItemIds) to answer without changing anything. Every turn must be expressed through these functions.

THINGS attn CANNOT DO (never claim to)
send or reply to email, read a real inbox or calendar, play or stop music or any audio, set phone alarms or notifications, call or message people, browse the web, remember anything beyond this short conversation.
When asked for one of these, do the closest supported thing and say plainly what you cannot do. "Reply to Sarah at 11" → add_item to attention titled "Reply to Sarah's email" at 11:00, then say you'll remind them but can't send it. "Play focus music" → start_focus_music (a track from the configured focus playlist starts on the device); "stop the music" → stop_focus_music; "end focus mode" → end_focus_mode. "Remind me to X in five minutes" → schedule_reminder; attn speaks it itself when due.

HOW TO INTERPRET
- The user speaks naturally, often with a name first ("Hey ${name}", "${name}", "Hey attn"). That is a wake phrase, never the intent: ignore it and act on the words after it. Only when the text is nothing but a greeting reply with a two-word respond() such as "Yes?" — never greet when a request follows.
- One sentence can hold several requests ("add it to my calendar too", "and play music then"). Call every function needed, in the order they should run.
- Module choice: reminders, to-dos, "remind me", "don't let me forget" → attention. Meetings, events, "schedule", "put on my calendar", "block time" → calendar. "Add it to my calendar as well" → an extra add_item to calendar with the same title and time. Emails → attention (a reminder to reply) unless the user clearly wants it listed under Important email.
- Titles: short, sentence case, no trailing period, no time in the title (the time goes in "at").
- Times: resolve everything to the user's local wall time as YYYY-MM-DDTHH:mm using CONTEXT.now. "at 11" with no AM/PM → the next sensible occurrence (11:00 today if still ahead, otherwise tomorrow; 1–6 without AM/PM usually means afternoon). "half two" = 14:30. "noon" = 12:00. "in three hours" = now + 3h. "tomorrow morning" = 09:00 tomorrow. "this afternoon" = 15:00 today. "this evening"/"tonight" = 19:00 today. "after lunch" = 13:30.
- Call clarify() only when a needed value is genuinely missing and guessing would change the result — mainly a missing time for "later today" / "later" / "at some point today" reminders: ask "What time today?" If the user gives a bare number in reply to your question ("Five"), it is that hour today (17:00 if the morning slot has passed) and you should now add the item they asked for (see recentConversation).
- Corrections: "actually make that 3:30", "call it design sync", "move it to tomorrow" refer to the most recent item you created or changed (CONTEXT.lastTouchedItemIds and recentConversation) → update_item with that itemId.
- "Done with / finished / handled the X" → complete_item with the matching itemId from CONTEXT (it moves to Completed). Only "delete / get rid of / remove the X" → remove_item.
- "Show/hide my calendar / email things" → set_module_visibility.
- Questions like "what should I pay attention to in the next three hours", "what's important today", "anything urgent", "what's happening before four" → respond(): answer from CONTEXT only, using item titles and times, and list those items' ids in highlightItemIds. Compare item "at" times with CONTEXT.now. If nothing matches, say so briefly.
- If the request is unclear or unsupported, respond() honestly in one short sentence; never invent capabilities or pretend something happened.

HOW ${name.toUpperCase()} SPEAKS (spokenResponse, and your reply after function results)
Short, calm, personable, plain words. One or two sentences, under 25 words unless summarising several items. Confirm what happened, with the time in words the user would say ("at eleven", "at 2:30"). If a function result says something failed, say so plainly; never claim it worked. Never mention JSON, ids, functions, modules, "state" or the system. No emoji, no markdown. Examples: "Sure. I'll remind you at eleven." · "Done — design review at 2:30, and it's on your calendar too." · "What time today should I remind you?" · "Two things: your design review at 2:30, and reply to Sarah before four." · "I've put focus music on your focus card, but I can't play audio yet."`;
}

// ----------------------------------------------------------------- context
/** The small read-only view of the device the assistant reasons about (also the Realtime query tool result). */
export function compactState(state, timeCtx) {
  return state.moduleOrder.map((id) => {
    const mod = state.modules[id];
    const meta = MODULE_META[id];
    const base = { id, label: mod.title || meta.label, shown: mod.enabled };
    if (meta.kind === 'list') {
      base.items = mod.items.filter((it) => it.title.trim()).map((it) => {
        const out = { id: it.id, title: it.title, type: it.type };
        if (it.subtitle) out.when = it.subtitle;
        if (it.at) out.at = instantToLocal(new Date(it.at), timeCtx.timeZone);
        if (it.spokenReminder) out.spokenReminder = it.reminderTriggered ? 'already spoken' : 'pending';
        return out;
      });
    } else if (meta.kind === 'focus') { base.detail = mod.subtitle; base.notificationsBlocked = mod.notificationsBlocked; base.music = mod.musicPlaying ? 'playing' : mod.currentTrackId ? 'starting' : 'off'; }
    else base.text = mod.text;
    return base;
  });
}

function buildUserMessage({ text, state, timeCtx, convo }) {
  const context = {
    now: { local: instantToLocal(timeCtx.now, timeCtx.timeZone), display: describeNow(timeCtx.now, timeCtx), timeZone: timeCtx.timeZone, locale: timeCtx.locale },
    modules: compactState(state, timeCtx),
    lastTouchedItemIds: convo.touched.slice(0, 3),
    recentConversation: convo.turns.map((t) => ({
      user: t.user,
      [ASSISTANT_NAME]: t.assistant,
      ...(t.question ? { askedForClarification: true } : {}),
      ...(t.actions.length ? { did: t.actions.map((a) => `${a.type}${a.itemId ? ` (${a.itemId})` : ''}: ${a.ok ? a.message : `FAILED — ${a.message}`}`) } : {}),
    })),
  };
  return `CONTEXT (JSON):\n${JSON.stringify(context)}\n\nUSER SAID: "${text}"`;
}

// ----------------------------------------------------------------- validation
const isStr = (v) => typeof v === 'string' && v.trim().length > 0;
const clean = (v, max) => String(v).trim().slice(0, max);

/** Check one requested action; resolve times; return { ok, params } or { ok:false, message }. */
export function validateAction(action, state, timeCtx) {
  if (!action || !ASSISTANT_ACTION_TYPES.includes(action.type)) return { ok: false, message: `"${action?.type ?? '?'}" is not something attn can do.` };
  const p = action.parameters && typeof action.parameters === 'object' ? action.parameters : {};
  const resolveAt = (value) => {
    if (value == null || value === '') return { at: null };
    const instant = localToInstant(value, timeCtx.timeZone);
    if (!instant) return { error: `"${value}" is not a time I understand.` };
    return { at: instant.toISOString(), label: formatWhen(instant, timeCtx), instant };
  };
  switch (action.type) {
    case 'add_item': {
      const module = LIST_MODULES.includes(p.module) ? p.module : 'attention';
      if (!isStr(p.title)) return { ok: false, message: 'That item needs a title.' };
      const t = resolveAt(p.at);
      if (t.error) return { ok: false, message: t.error };
      return { ok: true, params: { module, title: clean(p.title, LIMITS.title), at: t.at, subtitle: t.label || (isStr(p.subtitle) ? clean(p.subtitle, LIMITS.subtitle) : ''), type: ITEM_TYPES.includes(p.type) ? p.type : undefined } };
    }
    case 'update_item': {
      if (!isStr(p.itemId) || !findItem(state, p.itemId)) return { ok: false, message: "I couldn't find that item to update." };
      const params = { itemId: p.itemId };
      if (isStr(p.title)) params.title = clean(p.title, LIMITS.title);
      if (p.at != null && p.at !== '') {
        const t = resolveAt(p.at);
        if (t.error) return { ok: false, message: t.error };
        params.at = t.at;
        params.subtitle = t.label;
      } else if (isStr(p.subtitle)) { params.subtitle = clean(p.subtitle, LIMITS.subtitle); params.at = null; }
      if (LIST_MODULES.includes(p.module)) params.module = p.module;
      if (ITEM_TYPES.includes(p.type)) params.type = p.type;
      return { ok: true, params };
    }
    case 'complete_item':
      if (!isStr(p.itemId) || !findItem(state, p.itemId)) return { ok: false, message: "I couldn't find that item to mark done." };
      return { ok: true, params: { itemId: p.itemId, method: 'voice' } };
    case 'remove_item':
      if (!isStr(p.itemId) || !findItem(state, p.itemId)) return { ok: false, message: "I couldn't find that item to remove." };
      return { ok: true, params: { itemId: p.itemId } };
    case 'set_module_visibility':
      if (!MODULE_IDS.includes(p.module)) return { ok: false, message: 'There is no module by that name.' };
      return { ok: true, params: { module: p.module, enabled: p.enabled !== false } };
    case 'set_focus': {
      const enabled = p.enabled !== false;
      const parts = [];
      if (isStr(p.label)) parts.push(clean(p.label, 40));
      if (p.at != null && p.at !== '') {
        const t = resolveAt(p.at);
        if (t.error) return { ok: false, message: t.error };
        const minutes = Number.isInteger(p.durationMinutes) && p.durationMinutes > 0 ? Math.min(p.durationMinutes, 480) : 60;
        parts.push(formatRange(t.instant, minutes, timeCtx));
      }
      const params = { enabled };
      if (parts.length) params.subtitle = parts.join(' · ');
      if (typeof p.notificationsBlocked === 'boolean') params.notificationsBlocked = p.notificationsBlocked;
      return { ok: true, params };
    }
    case 'set_note':
      if (typeof p.text !== 'string') return { ok: false, message: 'The note needs some text.' };
      return { ok: true, params: { text: clean(p.text, LIMITS.note), append: p.append === true } };
    case 'schedule_reminder': {
      if (!isStr(p.title)) return { ok: false, message: 'That reminder needs a title.' };
      let instant = null;
      const secs = Number(p.inSeconds);
      const mins = Number(p.inMinutes);
      if (Number.isFinite(secs) && secs > 0) instant = new Date(timeCtx.now.getTime() + secs * 1000);
      else if (Number.isFinite(mins) && mins > 0) instant = new Date(timeCtx.now.getTime() + mins * 60000);
      else if (p.dueAt != null && p.dueAt !== '') { const t = resolveAt(p.dueAt); if (t.error) return { ok: false, message: t.error }; instant = t.instant; }
      if (!instant) return { ok: false, message: 'When should I remind you?' };
      return { ok: true, params: { title: clean(p.title, LIMITS.title), at: instant.toISOString(), subtitle: formatWhen(instant, timeCtx) } };
    }
    case 'start_focus_music':
    case 'stop_focus_music':
    case 'end_focus_mode':
      return { ok: true, params: {} };
    default:
      return { ok: false, message: 'Unsupported action.' };
  }
}

/** Deterministic, honest sentence from the results — used when the model's own wording is missing or glosses over a failure. */
export function composeSpoken(results, modelText = '') {
  const failed = results.filter((r) => !r.ok);
  const done = results.filter((r) => r.ok);
  if (failed.length === 0) return modelText || done.map((r) => r.message).join(' ');
  if (modelText && /couldn'?t|can'?t|unable|didn'?t|not able|failed|wasn'?t|no longer|isn'?t/i.test(modelText)) return modelText;
  if (done.length === 0) return `Sorry, I couldn't do that. ${failed[0].message}`;
  return `${done.map((r) => r.message).join(' ')} But I couldn't do the rest: ${failed.map((r) => r.message).join(' ')}`;
}

// ----------------------------------------------------------------- conversation memory
function getConversation(id) {
  const now = Date.now();
  for (const [key, c] of conversations) if (now - c.updatedAt > CONVERSATION_TTL_MS) conversations.delete(key);
  if (!conversations.has(id)) conversations.set(id, { turns: [], touched: [], updatedAt: now });
  const c = conversations.get(id);
  c.updatedAt = now;
  return c;
}

/** The wake phrase is never the intent: shared logic with the device (public/js/wake.js). */
export const stripWakeWords = (text) => stripWakePhrase(text, ASSISTANT_NAME);

const FRIENDLY = {
  not_configured: `${ASSISTANT_NAME} isn't set up yet. Add GEMINI_API_KEY on the server.`,
  auth: `${ASSISTANT_NAME}'s API key was rejected. Check GEMINI_API_KEY on the server.`,
  model: `${ASSISTANT_NAME}'s model isn't available. Check GEMINI_MODEL on the server.`,
  rate_limit: "I'm getting too many requests right now. Try again in a moment.",
  timeout: 'That took too long. Try again.',
  network: "I couldn't process that right now. Try again.",
  api: "I couldn't process that right now. Try again.",
  refusal: "I can't help with that one.",
  truncated: "I didn't get all of that. Try again.",
  invalid_response: "I didn't get that. Try again.",
};

// ----------------------------------------------------------------- entry point
/**
 * @param {object} input     { text, currentTime, timezone, locale, conversationId }
 * @param {object} ctx       { getState(): state, applyState(next): savedState }
 * @param {object} provider  { decide, finish } — Gemini by default; injectable for tests
 * @returns {{ status:number, body:object }}
 */
export async function handleCommand(input, { getState, applyState }, provider = gemini) {
  const raw = typeof input?.text === 'string' ? input.text.trim() : '';
  if (!raw) return { status: 400, body: { ok: false, error: 'empty', spokenResponse: "I didn't catch that. Try again." } };
  const text = stripWakeWords(raw.slice(0, MAX_TEXT));
  const timeZone = isValidTimeZone(input.timezone) ? input.timezone : 'UTC';
  const locale = isValidLocale(input.locale) ? input.locale : 'en-US';
  const parsed = Date.parse(input.currentTime);
  const now = Number.isNaN(parsed) ? new Date() : new Date(parsed);
  const timeCtx = { now, timeZone, locale };
  const conversationId = typeof input.conversationId === 'string' && input.conversationId ? input.conversationId.slice(0, 64) : `c${Date.now().toString(36)}`;
  const convo = getConversation(conversationId);
  // `detail` is a diagnostic sentence for the console/curl (temporary; never contains the key)
  const fail = (code, detail) => ({ status: 200, body: { ok: false, error: code, spokenResponse: FRIENDLY[code] || FRIENDLY.network, conversationId, ...(detail ? { detail: String(detail).slice(0, 600) } : {}) } });

  log(`command ${JSON.stringify(text)} tz=${timeZone} locale=${locale} conversation=${conversationId} provider=${gemini.isMock() ? 'mock' : gemini.PROVIDER} model=${gemini.isMock() ? 'mock' : gemini.getModel()}`);
  if (!gemini.isConfigured()) { log('not configured — GEMINI_API_KEY missing'); return fail('not_configured'); }

  // 1. interpret → { type, actions, spokenResponse, clarificationQuestion, highlightItemIds, followUp? }
  const state = getState();
  const system = buildSystemPrompt();
  const userMessage = buildUserMessage({ text, state, timeCtx, convo });
  let reply;
  try {
    reply = gemini.isMock() ? mockInterpret(text, state, timeCtx, convo) : await interpretWithFunctions({ system, userMessage, provider });
  } catch (err) {
    const code = err instanceof AssistantError ? err.code : 'network';
    log(`interpret FAILED → ${code}: ${err.message}`);
    return fail(code, err.message);
  }
  if (!reply || !['execute', 'clarify', 'respond'].includes(reply.type) || typeof reply.spokenResponse !== 'string') { log('interpret returned an unusable reply', JSON.stringify(reply).slice(0, 300)); return fail('invalid_response'); }
  log(`interpreted as ${reply.type}${reply.actions?.length ? ' actions=' + JSON.stringify(reply.actions.map((a) => ({ type: a.type, parameters: a.parameters }))) : ''}${reply.type !== 'execute' ? ' say=' + JSON.stringify(reply.spokenResponse) : ''}`);

  // 2. validate + execute (on a copy; nothing is saved unless something succeeded)
  const working = structuredClone(state);
  const results = [];
  const touched = [];
  const requested = reply.type === 'execute' && Array.isArray(reply.actions) ? reply.actions.slice(0, MAX_ACTIONS) : [];
  for (const action of requested) {
    const v = validateAction(action, working, timeCtx);
    if (!v.ok) { log(`action ${action?.type} rejected: ${v.message}`); results.push({ id: action?.id, name: action?.type, type: action?.type ?? 'unknown', ok: false, message: v.message }); continue; }
    const r = ASSISTANT_ACTIONS[action.type].run(working, v.params);
    log(`action ${action.type} ${JSON.stringify(v.params)} → ${r.ok ? 'ok' : 'FAILED'}: ${r.message}`);
    results.push({ id: action.id, name: action.type, type: action.type, ok: r.ok, message: r.message, itemId: r.itemId, module: r.module });
    if (r.ok && r.itemId) touched.push(r.itemId);
  }
  const changed = results.some((r) => r.ok);
  const saved = changed ? applyState(working) : null;

  // 3. the spoken outcome: the model phrases it from the real results; a deterministic sentence is the safety net
  let spokenResponse = reply.spokenResponse;
  if (reply.type === 'execute') {
    let modelText = reply.spokenResponse || '';
    // GEMINI_FOLLOW_UP=0 skips the second model turn (halves quota use on the free tier); the deterministic sentence is used instead
    if (reply.followUp && results.length && process.env.GEMINI_FOLLOW_UP !== '0') {
      try { modelText = (await reply.followUp(results)) || modelText; } catch (err) { log(`follow-up FAILED (using deterministic wording): ${err.message}`); }
    }
    spokenResponse = composeSpoken(results, modelText);
  }
  spokenResponse = clean(spokenResponse, 400);
  const clarificationQuestion = reply.type === 'clarify' ? (isStr(reply.clarificationQuestion) ? reply.clarificationQuestion : reply.spokenResponse) : null;
  const finalState = saved || state;
  const highlightItemIds = [...new Set([...touched, ...(Array.isArray(reply.highlightItemIds) ? reply.highlightItemIds : [])])].filter((id) => typeof id === 'string' && findItem(finalState, id));

  log(`outcome type=${reply.type} changed=${changed} revision=${finalState.revision} say=${JSON.stringify(spokenResponse)}`);
  convo.turns.push({ user: text, assistant: spokenResponse, type: reply.type, question: clarificationQuestion, actions: results.map((r) => ({ type: r.type, ok: r.ok, itemId: r.itemId, message: r.message })) });
  if (convo.turns.length > MAX_TURNS) convo.turns.splice(0, convo.turns.length - MAX_TURNS);
  if (touched.length) convo.touched = [...touched.reverse(), ...convo.touched].slice(0, 5);

  return {
    status: 200,
    body: {
      ok: true,
      type: reply.type,
      spokenResponse,
      clarificationQuestion,
      results: results.map(({ type, ok, message, itemId, module }) => ({ type, ok, message, itemId, module })),
      highlightItemIds,
      changed,
      revision: finalState.revision,
      state: saved || undefined,
      conversationId,
      model: gemini.isMock() ? 'mock' : gemini.getModel(),
    },
  };
}

/** Gemini function calls → the router's reply shape. */
async function interpretWithFunctions({ system, userMessage, provider }) {
  const decision = await provider.decide({ system, userMessage, functionDeclarations: FUNCTION_DECLARATIONS });
  const calls = Array.isArray(decision?.calls) ? decision.calls : [];
  const actionCalls = calls.filter((c) => ASSISTANT_ACTION_TYPES.includes(c.name));
  const clarifyCall = calls.find((c) => c.name === 'clarify');
  const respondCall = calls.find((c) => c.name === 'respond');
  const unknown = calls.filter((c) => !ASSISTANT_ACTION_TYPES.includes(c.name) && !META_FUNCTIONS.includes(c.name));
  if (unknown.length) log('ignored unknown function call(s):', unknown.map((c) => c.name).join(', '));
  if (calls.length === 0 && decision?.text) log('no function call — conversational text reply');

  if (clarifyCall && actionCalls.length === 0) {
    const question = isStr(clarifyCall.args?.question) ? clean(clarifyCall.args.question, 200) : 'Could you say that again with a bit more detail?';
    return { type: 'clarify', actions: [], spokenResponse: question, clarificationQuestion: question, highlightItemIds: [] };
  }
  if (actionCalls.length === 0) {
    const spoken = isStr(respondCall?.args?.spokenResponse) ? respondCall.args.spokenResponse : decision?.text;
    if (!isStr(spoken)) throw new AssistantError('invalid_response', `Gemini returned neither a function call nor text (calls=${calls.map((c) => c.name).join(',') || 'none'})`);
    const ids = Array.isArray(respondCall?.args?.highlightItemIds) ? respondCall.args.highlightItemIds : [];
    return { type: 'respond', actions: [], spokenResponse: clean(spoken, 400), clarificationQuestion: null, highlightItemIds: ids };
  }
  return {
    type: 'execute',
    actions: actionCalls.map((c) => ({ id: c.id, type: c.name, parameters: c.args })),
    spokenResponse: '',
    clarificationQuestion: null,
    highlightItemIds: [],
    followUp: (results) => (decision.content
      ? provider.finish({ system, userMessage, modelContent: decision.content, results, functionDeclarations: FUNCTION_DECLARATIONS })
      : Promise.resolve('')),
  };
}

// ----------------------------------------------------------------- dev stub
/**
 * ATTN_ASSISTANT_MOCK=1: a deliberately dumb stand-in so the whole pipeline
 * (device UI, execution, persistence) can be exercised without an API key.
 * It is NOT the product; the real interpreter is Gemini.
 */
const WORD_HOURS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, noon: 12, midnight: 0 };
function mockTime(text, timeCtx) {
  const local = instantToLocal(timeCtx.now, timeCtx.timeZone);
  const day = local.slice(0, 10);
  const nowH = Number(local.slice(11, 13));
  const m = /(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)?/i.exec(text);
  let h = null; let min = 0;
  if (m) { h = Number(m[1]); min = Number(m[2] || 0); const ap = (m[3] || '').toLowerCase(); if (ap.startsWith('p') && h < 12) h += 12; if (ap.startsWith('a') && h === 12) h = 0; if (!ap && h <= 7) h += 12; }
  else { const w = Object.keys(WORD_HOURS).find((k) => new RegExp(`\\b${k}\\b`, 'i').test(text)); if (w) { h = WORD_HOURS[w]; if (h <= 7 && h !== 0) h += 12; } }
  if (h == null) return null;
  const pad = (n) => String(n).padStart(2, '0');
  const d = h < nowH ? instantToLocal(new Date(timeCtx.now.getTime() + 86400000), timeCtx.timeZone).slice(0, 10) : day;
  return `${d}T${pad(h)}:${pad(min)}`;
}
function mockInterpret(text, state, timeCtx, convo) {
  const t = text.toLowerCase();
  const reply = (type, actions, spokenResponse, extra = {}) => ({ type, actions, spokenResponse, clarificationQuestion: null, highlightItemIds: [], ...extra });
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const items = LIST_MODULES.flatMap((m) => state.modules[m].items.filter((i) => i.title.trim()));
  if (/^(what|anything|show me what|whats|what's)/.test(t) && !/calendar|email|mail/.test(t)) {
    const list = items.slice(0, 3).map((i) => `${i.title}${i.subtitle ? ` at ${i.subtitle}` : ''}`).join(', ');
    return reply('respond', [], items.length ? `${items.length} thing${items.length === 1 ? '' : 's'}: ${list}.` : 'Nothing needs your attention right now.', { highlightItemIds: items.slice(0, 3).map((i) => i.id) });
  }
  if (/actually|make that|change (it|that)|move it/.test(t) && convo.touched[0]) {
    const at = mockTime(t, timeCtx);
    return at ? reply('execute', [{ type: 'update_item', parameters: { itemId: convo.touched[0], at } }], 'Okay, updated.') : reply('clarify', [], 'To what time?', { clarificationQuestion: 'To what time?' });
  }
  if (/^(five|six|seven|eight|nine|ten|eleven|noon|\d{1,2}(:\d{2})?( ?[ap]m)?)\.?$/.test(t) && convo.turns.at(-1)?.question) {
    const at = mockTime(t, timeCtx);
    const title = /remind me to (.+?)( later| today|$)/.exec(convo.turns.at(-1).user)?.[1] || 'Reminder';
    return reply('execute', [{ type: 'add_item', parameters: { module: 'attention', title: cap(title), at } }], "Done. I'll remind you then.");
  }
  if (/hide|show/.test(t) && /calendar|email|mail|focus|note/.test(t)) {
    const module = /calendar/.test(t) ? 'calendar' : /mail/.test(t) ? 'mail' : /focus/.test(t) ? 'focus' : 'note';
    const enabled = !/hide/.test(t);
    return reply('execute', [{ type: 'set_module_visibility', parameters: { module, enabled } }], enabled ? 'Showing it now.' : 'Hidden.');
  }
  if (/focus|music/.test(t)) {
    const at = mockTime(t, timeCtx);
    return reply('execute', [{ type: 'set_focus', parameters: { enabled: true, label: /music/.test(t) ? 'Focus music' : 'Deep work', at, durationMinutes: at ? 60 : undefined } }], /music/.test(t) ? "Focus is on, but I can't play music yet." : 'Focus mode is on.');
  }
  if (/note|write down/.test(t)) return reply('execute', [{ type: 'set_note', parameters: { text: text.replace(/^(note|write down)( that)?\s*/i, ''), append: false } }], 'Noted.');
  if (/remind|pay attention|add|schedule|put/.test(t)) {
    const at = mockTime(t, timeCtx);
    if (!at && /later|some point|this (afternoon|evening)/.test(t)) return reply('clarify', [], 'What time today?', { clarificationQuestion: 'What time today?' });
    const title = cap((/(?:remind me to|pay attention to|add|schedule|put)\s+(?:my\s+)?(.+?)(?:\s+(?:at|for|on|to my)\b.*)?$/i.exec(text)?.[1] || 'Reminder').replace(/\s+(later|today|tomorrow)$/i, ''));
    const actions = [{ type: 'add_item', parameters: { module: /schedule|meeting/.test(t) ? 'calendar' : 'attention', title, at } }];
    if (/calendar/.test(t) && !/schedule/.test(t)) actions.push({ type: 'add_item', parameters: { module: 'calendar', title, at } });
    return reply('execute', actions, at ? "Sure. I'll remind you." : 'Added.');
  }
  return reply('respond', [], "I'm in mock mode, so I only understand simple reminders, focus, notes and questions.");
}
