/**
 * attn — AI command router (server only).
 *
 *   text (voice transcript or typed)  →  context + capability whitelist  →  Claude
 *   →  structured reply { type, actions[], spokenResponse, ... }
 *   →  validate every action  →  run the whitelisted ones through actions.js
 *   →  save through the normal persistence path  →  honest outcome for the device
 *
 * The model decides WHAT the user means. This file decides HOW it happens.
 * The model never edits state JSON and never sees secrets.
 *
 * Conversation memory is deliberately tiny: the last few turns per device,
 * kept in memory for ten minutes, enough for "What time?" → "Five." and
 * "Actually make that 3:30."
 */
import { MODULE_META, MODULE_IDS, ITEM_TYPES, LIMITS } from '../public/js/state.js';
import { ASSISTANT_ACTIONS, ASSISTANT_ACTION_TYPES, LIST_MODULES, findItem } from '../public/js/actions.js';
import { interpret, isConfigured, isMock, getModel, AssistantError } from './claude.js';
import { localToInstant, instantToLocal, formatWhen, formatRange, describeNow, isValidTimeZone, isValidLocale } from './time.js';

export const ASSISTANT_NAME = process.env.ASSISTANT_NAME || 'Andrew';

const MAX_TEXT = 500;
const MAX_ACTIONS = 6;
const CONVERSATION_TTL_MS = 10 * 60 * 1000;
const MAX_TURNS = 6;
const conversations = new Map();

// ----------------------------------------------------------------- schema
const nullable = (schema) => ({ anyOf: [schema, { type: 'null' }] });
const PARAM_PROPERTIES = {
  module: nullable({ type: 'string', enum: MODULE_IDS }),
  title: nullable({ type: 'string' }),
  at: nullable({ type: 'string', description: 'Local wall time, YYYY-MM-DDTHH:mm, in the user timezone' }),
  subtitle: nullable({ type: 'string' }),
  type: nullable({ type: 'string', enum: ITEM_TYPES }),
  itemId: nullable({ type: 'string' }),
  enabled: nullable({ type: 'boolean' }),
  label: nullable({ type: 'string' }),
  durationMinutes: nullable({ type: 'integer' }),
  text: nullable({ type: 'string' }),
  append: nullable({ type: 'boolean' }),
};

/** The one reply shape the model may produce (structured outputs). */
export const RESPONSE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['type', 'actions', 'spokenResponse', 'clarificationQuestion', 'highlightItemIds'],
  properties: {
    type: { type: 'string', enum: ['execute', 'clarify', 'respond'], description: 'execute = run actions; clarify = one short question, no actions; respond = answer from the context, no actions' },
    actions: {
      type: 'array',
      description: 'Ordered actions to run (empty unless type is execute)',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['type', 'parameters'],
        properties: {
          type: { type: 'string', enum: ASSISTANT_ACTION_TYPES },
          parameters: { type: 'object', additionalProperties: false, required: Object.keys(PARAM_PROPERTIES), properties: PARAM_PROPERTIES },
        },
      },
    },
    spokenResponse: { type: 'string', description: 'What Andrew says out loud: one or two short sentences' },
    clarificationQuestion: nullable({ type: 'string' }),
    highlightItemIds: { type: 'array', items: { type: 'string' }, description: 'Existing item ids to highlight on the device while speaking (summaries)' },
  },
};

// ----------------------------------------------------------------- prompt
function capabilityList() {
  return ASSISTANT_ACTION_TYPES.map((type) => {
    const a = ASSISTANT_ACTIONS[type];
    const params = Object.entries(a.params).map(([k, v]) => `${k}: ${v}`).join('; ');
    return `- ${type} — ${a.description}\n  parameters: ${params}`;
  }).join('\n');
}

/** Stable across requests (so it caches). Everything that varies goes in the user message. */
export function buildSystemPrompt() {
  const name = ASSISTANT_NAME;
  return `You are ${name}, the voice of attn — a small personal attention device that sits on a desk and shows only what deserves attention right now. attn has a few cards on its screen: "Pay attention to" (module attention: reminders and to-dos), "Upcoming" (module calendar: scheduled events), "Important email" (module mail: emails to handle), "Focus mode" (module focus: one focus block) and "Quick note" (module note: free text). Everything lives inside attn; there are no real external accounts yet.

Latency-sensitive; begin your visible answer immediately.

YOUR JOB
Turn what the user said into the fewest correct actions from the list below, or answer a question from the CONTEXT. You decide what the user means; the application runs the actions. Reply ONLY in the required JSON shape.

ACTIONS YOU MAY REQUEST (nothing else exists)
${capabilityList()}

THINGS attn CANNOT DO (never claim to)
send or reply to email, read a real inbox or calendar, play or stop music or any audio, set phone alarms or notifications, call or message people, browse the web, remember anything beyond this short conversation.
When asked for one of these, do the closest supported thing and say plainly what you cannot do. "Reply to Sarah at 11" → add_item to attention titled "Reply to Sarah's email" at 11:00, and say you'll remind them but can't send it. "Play focus music" → set_focus with label "Focus music" and say attn can't play music yet.

HOW TO INTERPRET
- The user speaks naturally, often with a name first ("Hey ${name}", "${name}", "Hey attn"). Ignore such prefixes and filler; they are not part of the task.
- One sentence can hold several requests ("add it to my calendar too", "and play music then"). Return every action, in the order they should run.
- Module choice: reminders, to-dos, "remind me", "don't let me forget" → attention. Meetings, events, "schedule", "put on my calendar", "block time" → calendar. "Add it to my calendar as well" → an extra add_item to calendar with the same title and time. Emails → attention (a reminder to reply) unless the user clearly wants it listed under Important email.
- Titles: short, sentence case, no trailing period, no time in the title (the time goes in "at").
- Times: resolve everything to the user's local wall time as YYYY-MM-DDTHH:mm using CONTEXT.now. "at 11" with no AM/PM → the next sensible occurrence (11:00 today if still ahead, otherwise tomorrow; 1–6 without AM/PM usually means afternoon). "half two" = 14:30. "noon" = 12:00. "in three hours" = now + 3h. "tomorrow morning" = 09:00 tomorrow. "this afternoon" = 15:00 today. "this evening"/"tonight" = 19:00 today. "after lunch" = 13:30.
- Ask ONE short clarification (type "clarify", no actions) only when a needed value is genuinely missing and guessing would change the result — mainly a missing time for "later today" / "later" / "at some point today" reminders: ask "What time today?" If the user gives a bare number in reply to your question ("Five"), it is that hour today (17:00 if the morning slot has passed).
- Corrections: "actually make that 3:30", "call it design sync", "move it to tomorrow" refer to the most recent item you created or changed (see CONTEXT.lastTouchedItemIds and recentConversation) → update_item with that itemId.
- "Done with / handled / clear / remove the X" → remove_item with the matching itemId from CONTEXT.
- "Show/hide my calendar / email things" → set_module_visibility.
- Questions like "what should I pay attention to in the next three hours", "what's important today", "anything urgent", "what's happening before four" → type "respond": answer from CONTEXT only, using item titles and times, and list those items' ids in highlightItemIds. Compare item "at" times with CONTEXT.now. If nothing matches, say so briefly.
- If the request is unclear or unsupported, respond honestly in one short sentence; never invent capabilities or pretend something happened.

HOW ${name.toUpperCase()} SPEAKS (spokenResponse)
Short, calm, personable, plain words. One or two sentences, under 25 words unless summarising several items. Confirm what will happen, with the time in words the user would say ("at eleven", "at 2:30"). Never mention JSON, ids, modules, "state" or the system. No emoji. Examples: "Sure. I'll remind you at eleven." · "Done — design review at 2:30, and it's on your calendar too." · "What time today should I remind you?" · "Two things: your design review at 2:30, and reply to Sarah before four." · "I've put focus music on your focus card, but I can't play audio yet."`;
}

// ----------------------------------------------------------------- context
function compactState(state, timeCtx) {
  const modules = state.moduleOrder.map((id) => {
    const mod = state.modules[id];
    const meta = MODULE_META[id];
    const base = { id, label: mod.title || meta.label, shown: mod.enabled };
    if (meta.kind === 'list') {
      base.items = mod.items.filter((it) => it.title.trim()).map((it) => {
        const out = { id: it.id, title: it.title, type: it.type };
        if (it.subtitle) out.when = it.subtitle;
        if (it.at) out.at = instantToLocal(new Date(it.at), timeCtx.timeZone);
        return out;
      });
    } else if (meta.kind === 'focus') base.detail = mod.subtitle;
    else base.text = mod.text;
    return base;
  });
  return modules;
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
      return { ok: true, params };
    }
    case 'set_note':
      if (typeof p.text !== 'string') return { ok: false, message: 'The note needs some text.' };
      return { ok: true, params: { text: clean(p.text, LIMITS.note), append: p.append === true } };
    default:
      return { ok: false, message: 'Unsupported action.' };
  }
}

/** Never let a partial failure sound like success. */
export function composeSpoken(reply, results) {
  if (reply.type !== 'execute' || results.length === 0) return reply.spokenResponse;
  const failed = results.filter((r) => !r.ok);
  if (failed.length === 0) return reply.spokenResponse;
  const done = results.filter((r) => r.ok);
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

const wakePattern = () => new RegExp(`^\\s*(?:hey|hi|ok|okay|yo)?[\\s,]*(?:${ASSISTANT_NAME.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|attn)[\\s,.!?:]+`, 'i');
export const stripWakeWords = (text) => text.replace(wakePattern(), '').trim() || text.trim();

const FRIENDLY = {
  not_configured: `${ASSISTANT_NAME} isn't set up yet. Add ANTHROPIC_API_KEY on the server.`,
  auth: `${ASSISTANT_NAME}'s API key was rejected. Check ANTHROPIC_API_KEY on the server.`,
  rate_limit: "I'm getting too many requests. Try again in a moment.",
  timeout: "That took too long. Try again.",
  network: "I couldn't connect. Try again.",
  api: "I couldn't connect. Try again.",
  refusal: "I can't help with that one.",
  truncated: "I didn't get all of that. Try again.",
  invalid_response: "I didn't get that. Try again.",
};

// ----------------------------------------------------------------- entry point
/**
 * @param {object} input   { text, currentTime, timezone, locale, conversationId }
 * @param {object} ctx     { getState(): state, applyState(next): savedState }
 * @returns {{ status:number, body:object }}
 */
export async function handleCommand(input, { getState, applyState }) {
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

  if (!isConfigured()) return { status: 200, body: { ok: false, error: 'not_configured', spokenResponse: FRIENDLY.not_configured, conversationId } };

  // 1. interpret
  const state = getState();
  let reply;
  try {
    reply = await interpret({
      system: buildSystemPrompt(),
      messages: [{ role: 'user', content: buildUserMessage({ text, state, timeCtx, convo }) }],
      schema: RESPONSE_SCHEMA,
      mock: () => mockInterpret(text, state, timeCtx, convo),
    });
  } catch (err) {
    const code = err instanceof AssistantError ? err.code : 'network';
    console.warn('[attn] assistant:', code, err.message);
    return { status: 200, body: { ok: false, error: code, spokenResponse: FRIENDLY[code] || FRIENDLY.network, conversationId } };
  }
  if (!reply || !['execute', 'clarify', 'respond'].includes(reply.type) || typeof reply.spokenResponse !== 'string') {
    return { status: 200, body: { ok: false, error: 'invalid_response', spokenResponse: FRIENDLY.invalid_response, conversationId } };
  }

  // 2. validate + execute (on a copy; nothing is saved unless something succeeded)
  const working = structuredClone(state);
  const results = [];
  const touched = [];
  const requested = reply.type === 'execute' && Array.isArray(reply.actions) ? reply.actions.slice(0, MAX_ACTIONS) : [];
  for (const action of requested) {
    const v = validateAction(action, working, timeCtx);
    if (!v.ok) { results.push({ type: action?.type ?? 'unknown', ok: false, message: v.message }); continue; }
    const r = ASSISTANT_ACTIONS[action.type].run(working, v.params);
    results.push({ type: action.type, ok: r.ok, message: r.message, itemId: r.itemId, module: r.module });
    if (r.ok && r.itemId) touched.push(r.itemId);
  }
  const changed = results.some((r) => r.ok);
  const saved = changed ? applyState(working) : null;

  // 3. honest outcome
  const spokenResponse = clean(composeSpoken(reply, results), 400);
  const clarificationQuestion = reply.type === 'clarify' ? (isStr(reply.clarificationQuestion) ? reply.clarificationQuestion : reply.spokenResponse) : null;
  const finalState = saved || state;
  const highlightItemIds = [...new Set([...touched, ...(Array.isArray(reply.highlightItemIds) ? reply.highlightItemIds : [])])].filter((id) => findItem(finalState, id));

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
      results,
      highlightItemIds,
      changed,
      revision: finalState.revision,
      state: saved || undefined,
      conversationId,
      model: isMock() ? 'mock' : getModel(),
    },
  };
}

// ----------------------------------------------------------------- dev stub
/**
 * ATTN_ASSISTANT_MOCK=1: a deliberately dumb stand-in so the whole pipeline
 * (device UI, execution, persistence) can be exercised without an API key.
 * It is NOT the product; the real interpreter is Claude.
 */
const WORD_HOURS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, noon: 12, midnight: 0 };
function mockTime(text, timeCtx) {
  const local = instantToLocal(timeCtx.now, timeCtx.timeZone);
  const day = local.slice(0, 10);
  const nowH = Number(local.slice(11, 13));
  let m = /(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)?/i.exec(text);
  let h = null; let min = 0;
  if (m) { h = Number(m[1]); min = Number(m[2] || 0); const ap = (m[3] || '').toLowerCase(); if (ap.startsWith('p') && h < 12) h += 12; if (ap.startsWith('a') && h === 12) h = 0; if (!ap && h <= 7) h += 12; }
  else { const w = Object.keys(WORD_HOURS).find((k) => new RegExp(`\\b${k}\\b`, 'i').test(text)); if (w) { h = WORD_HOURS[w]; if (h <= 7 && h !== 0) h += 12; } }
  if (h == null) return null;
  const pad = (n) => String(n).padStart(2, '0');
  const tomorrow = h < nowH;
  const d = tomorrow ? instantToLocal(new Date(timeCtx.now.getTime() + 86400000), timeCtx.timeZone).slice(0, 10) : day;
  return `${d}T${pad(h)}:${pad(min)}`;
}
function mockInterpret(text, state, timeCtx, convo) {
  const t = text.toLowerCase();
  const reply = (type, actions, spokenResponse, extra = {}) => ({ type, actions: actions.map((a) => ({ type: a.type, parameters: { ...Object.fromEntries(Object.keys(PARAM_PROPERTIES).map((k) => [k, null])), ...a.parameters } })), spokenResponse, clarificationQuestion: null, highlightItemIds: [], ...extra });
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
    return reply('execute', [{ type: 'add_item', parameters: { module: 'attention', title: title.charAt(0).toUpperCase() + title.slice(1), at } }], `Done. I'll remind you then.`);
  }
  if (/hide|show/.test(t) && /calendar|email|mail|focus|note/.test(t)) {
    const module = /calendar/.test(t) ? 'calendar' : /mail/.test(t) ? 'mail' : /focus/.test(t) ? 'focus' : 'note';
    const enabled = !/hide/.test(t);
    return reply('execute', [{ type: 'set_module_visibility', parameters: { module, enabled } }], enabled ? 'Showing it now.' : 'Hidden.');
  }
  if (/focus|music/.test(t)) {
    const at = mockTime(t, timeCtx);
    return reply('execute', [{ type: 'set_focus', parameters: { enabled: true, label: /music/.test(t) ? 'Focus music' : 'Deep work', at, durationMinutes: at ? 60 : null }, ...(at ? {} : {}) }], /music/.test(t) ? "Focus is on, but I can't play music yet." : 'Focus mode is on.');
  }
  if (/note|write down/.test(t)) return reply('execute', [{ type: 'set_note', parameters: { text: text.replace(/^(note|write down)( that)?\s*/i, ''), append: false } }], 'Noted.');
  if (/remind|pay attention|add|schedule|put/.test(t)) {
    const at = mockTime(t, timeCtx);
    if (!at && /later|some point|this (afternoon|evening)/.test(t)) return reply('clarify', [], 'What time today?', { clarificationQuestion: 'What time today?' });
    const title = (/(?:remind me to|pay attention to|add|schedule|put)\s+(?:my\s+)?(.+?)(?:\s+(?:at|for|on|to my)\b.*)?$/i.exec(text)?.[1] || 'Reminder').replace(/\s+(later|today|tomorrow)$/i, '');
    const actions = [{ type: 'add_item', parameters: { module: /schedule|calendar|meeting/.test(t) ? 'calendar' : 'attention', title: title.charAt(0).toUpperCase() + title.slice(1), at } }];
    if (/calendar/.test(t) && !/schedule/.test(t)) actions.push({ type: 'add_item', parameters: { module: 'calendar', title: title.charAt(0).toUpperCase() + title.slice(1), at } });
    return reply('execute', actions, at ? `Sure. I'll remind you.` : 'Added.');
  }
  return reply('respond', [], "I'm in mock mode, so I only understand simple reminders, focus, notes and questions.");
}
