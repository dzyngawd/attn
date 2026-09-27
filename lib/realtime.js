/**
 * attn — OpenAI Realtime bridge (server side).
 *
 *   browser ──POST /api/realtime/token──▶ createClientSecret()  ──▶ OpenAI /v1/realtime/client_secrets
 *   browser ──POST /api/realtime/tool───▶ executeTool()         ──▶ actions.js + applyState()
 *
 * The permanent OPENAI_API_KEY lives only here. The browser gets a short-lived
 * client secret whose session already carries Andrew's instructions, voice,
 * turn detection and the tool list built from the REAL action registry.
 * The model decides WHAT; executeTool() validates and runs it through the same
 * functions the Control Centre uses. The model never edits state.
 *
 * Environment:
 *   OPENAI_API_KEY               required (server only)
 *   OPENAI_REALTIME_MODEL        default gpt-realtime-2.1
 *   OPENAI_REALTIME_VOICE        default cedar (try marin)
 *   OPENAI_REALTIME_VAD          semantic (default) | server
 *   OPENAI_REALTIME_TRANSCRIBE   input transcription model for logs/UI (default gpt-4o-mini-transcribe; "off" disables)
 *   VOICE_PROVIDER               openai (default) | legacy (Chrome speech + Gemini, rollback only)
 */
import { ASSISTANT_ACTIONS, ASSISTANT_ACTION_TYPES, findItem } from '../public/js/actions.js';
import { MODULE_META } from '../public/js/state.js';
import { ACTION_SCHEMAS, compactState, validateAction, ASSISTANT_NAME } from './assistant.js';
import { isValidTimeZone, isValidLocale, describeNow, instantToLocal } from './time.js';

const OPENAI_BASE = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
const SECRET_TTL_S = 600;

export const getProvider = () => (process.env.VOICE_PROVIDER || 'openai').toLowerCase();
export const getModel = () => process.env.OPENAI_REALTIME_MODEL || 'gpt-realtime-2.1';
export const getVoice = () => process.env.OPENAI_REALTIME_VOICE || 'cedar';
export const isConfigured = () => Boolean(process.env.OPENAI_API_KEY);

const log = (...args) => console.log('[Realtime]', ...args);

// ---------------------------------------------------------------- tools (from the real registry)
const TOOL_DESCRIPTIONS = {
  add_item: 'Add a reminder, to-do, event or email-to-handle to a list on the device. module: "attention" (Pay attention to: reminders/to-dos), "calendar" (Upcoming: scheduled events), "mail" (Important email). "Add it to my calendar too" = a second add_item with module calendar. The list becomes visible automatically. Returns the created item with its id.',
  update_item: 'Change an existing item by id: title, time (at) or detail. Use for corrections such as "actually make that noon" or "move it to 3:30" — take the id from the most recent tool result.',
  remove_item: 'Remove an item by id when the user is done with it, has handled it, or wants it cleared.',
  set_module_visibility: 'Show or hide a whole card on the device: attention, calendar, mail, focus or note.',
  set_focus: 'Turn the Focus mode card on or off with a label and an optional time block. attn cannot play audio: for music requests set focus with a matching label and say plainly that music cannot be played yet.',
  set_note: 'Write the Quick note card (replace, or append).',
};

export const TOOLS = [
  ...ASSISTANT_ACTION_TYPES.map((name) => ({
    type: 'function',
    name,
    description: TOOL_DESCRIPTIONS[name] || ASSISTANT_ACTIONS[name].description,
    parameters: { type: 'object', ...ACTION_SCHEMAS[name] },
  })),
  {
    type: 'function',
    name: 'query_attn_state',
    description: 'Read what is currently on the device (every card and item with ids and times) plus the current local time. Call this before answering questions like "what should I pay attention to in the next three hours", "what is coming up", "anything important". Changes nothing.',
    parameters: { type: 'object', properties: {}, required: [] },
  },
  {
    type: 'function',
    name: 'highlight_items',
    description: 'Visually highlight existing items on the device while you talk about them (after query_attn_state). Changes nothing.',
    parameters: { type: 'object', properties: { itemIds: { type: 'array', items: { type: 'string' }, description: 'ids of the items you are mentioning' } }, required: ['itemIds'] },
  },
];

// ---------------------------------------------------------------- instructions
export function timeContext(input = {}) {
  const timeZone = isValidTimeZone(input.timezone) ? input.timezone : 'UTC';
  const locale = isValidLocale(input.locale) ? input.locale : 'en-US';
  const parsed = Date.parse(input.currentTime);
  const now = Number.isNaN(parsed) ? new Date() : new Date(parsed);
  return { now, timeZone, locale };
}

export function buildInstructions(timeCtx) {
  const name = ASSISTANT_NAME;
  return `You are ${name}, the voice of attn — a small attention-management device on the user's desk, not a general assistant. The device shows a few cards: "Pay attention to" (attention: reminders and to-dos), "Upcoming" (calendar: scheduled events), "Important email" (mail), "Focus mode" (focus) and "Quick note" (note). Everything lives inside attn; there are no real email, calendar or music integrations.

NOW: ${describeNow(timeCtx.now, timeCtx)} (${timeCtx.timeZone}, local ${instantToLocal(timeCtx.now, timeCtx.timeZone)}). Resolve every time the user says into local wall time "YYYY-MM-DDTHH:mm" for the "at" parameters: "at 11" means the next 11 o'clock still ahead today (or tomorrow if it has passed; 1–6 without am/pm usually means afternoon), "half two" = 14:30, "noon" = 12:00, "in three hours" = now + 3h, "later today" needs a time — ask "What time today?", "tomorrow morning" = 09:00 tomorrow, "this evening" = 19:00.

WAKE PHRASE: users start a new request with "Hey ${name}" or "${name}". That is an address, never the intent. If a request follows in the same utterance, do it immediately — never answer a request with a greeting. If the user says only "Hey ${name}", reply with a very short "Yeah?" and wait. During a follow-up, correction or clarification the user will not repeat the name. If speech is clearly not addressed to you, stay silent (reply with nothing).

DOING THINGS: use the tools; they are the only way anything changes. Call as many as the request needs, in order (two requests in one sentence = two calls). Never say something is done until the tool result says success. Tool results include item ids: use them for corrections like "actually make that noon", "move it to 3:30", "remove that". For questions about the device, call query_attn_state first, answer from it, and call highlight_items with the ids you mention. Ask one short clarification only when a needed value cannot be safely inferred (mainly a missing time). Never invent capabilities: you cannot send or read email, touch a real calendar, play music or audio, set alarms or notifications, call anyone, or browse. Do the closest supported thing (a reminder to reply, a Focus card) and say briefly what you cannot do.

VOICE: calm, warm, brief — one or two short sentences, under 20 words unless summarising several items. Say times the way people do ("at eleven", "at 2:30"). No lists, no markdown, no emoji, never mention tools, ids or JSON.`;
}

/** The session the browser will run, minted on the server so instructions/tools/voice cannot be changed client-side. */
export function sessionConfig(timeCtx) {
  const vad = (process.env.OPENAI_REALTIME_VAD || 'semantic').toLowerCase() === 'server'
    ? { type: 'server_vad', threshold: 0.5, prefix_padding_ms: 300, silence_duration_ms: 700, create_response: true, interrupt_response: true }
    : { type: 'semantic_vad', eagerness: 'low', create_response: true, interrupt_response: true };
  const transcribe = (process.env.OPENAI_REALTIME_TRANSCRIBE ?? 'gpt-4o-mini-transcribe').trim();
  const input = { turn_detection: vad, noise_reduction: { type: 'near_field' } };
  if (transcribe && transcribe !== 'off') input.transcription = { model: transcribe };
  return {
    type: 'realtime',
    model: getModel(),
    instructions: buildInstructions(timeCtx),
    audio: { input, output: { voice: getVoice() } },
    tools: TOOLS,
    tool_choice: 'auto',
    output_modalities: ['audio'],
    max_output_tokens: 600,
  };
}

export class RealtimeError extends Error {
  constructor(code, message, status) { super(message); this.code = code; this.status = status; }
}

/** Mint a short-lived client secret bound to Andrew's session config. Never logs the secret. */
export async function createClientSecret(input = {}) {
  if (!isConfigured()) throw new RealtimeError('not_configured', 'OPENAI_API_KEY is not set', 503);
  const timeCtx = timeContext(input);
  const body = { expires_after: { anchor: 'created_at', seconds: SECRET_TTL_S }, session: sessionConfig(timeCtx) };
  log(`minting client secret: model=${body.session.model} voice=${body.session.audio.output.voice} vad=${body.session.audio.input.turn_detection.type} tools=${TOOLS.length} tz=${timeCtx.timeZone}`);
  let res;
  try {
    res = await fetch(`${OPENAI_BASE}/realtime/client_secrets`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });
  } catch (err) {
    throw new RealtimeError(err?.name === 'TimeoutError' ? 'timeout' : 'network', `Could not reach OpenAI: ${err?.message || err}`, 502);
  }
  const text = await res.text();
  if (!res.ok) {
    let detail = text.slice(0, 300);
    try { detail = JSON.parse(text)?.error?.message || detail; } catch { /* keep raw */ }
    const code = res.status === 401 ? 'auth' : res.status === 429 ? 'rate_limit' : res.status >= 500 ? 'api' : 'bad_request';
    log(`client secret FAILED (HTTP ${res.status}): ${detail}`);
    throw new RealtimeError(code, `OpenAI ${res.status}: ${detail}`, res.status === 401 ? 502 : res.status);
  }
  let data;
  try { data = JSON.parse(text); } catch { throw new RealtimeError('api', 'OpenAI returned invalid JSON', 502); }
  if (!data?.value) throw new RealtimeError('api', 'OpenAI returned no client secret', 502);
  log(`client secret created (expires in ${Math.max(0, Math.round((data.expires_at || 0) - Date.now() / 1000))} s)`);
  return { value: data.value, expires_at: data.expires_at, model: body.session.model, voice: body.session.audio.output.voice, instructions: body.session.instructions };
}

// ---------------------------------------------------------------- tool execution
const summarize = (state, itemId) => {
  const found = itemId ? findItem(state, itemId) : null;
  return found ? { id: found.item.id, title: found.item.title, time: found.item.subtitle || null, module: found.module, list: state.modules[found.module].title || MODULE_META[found.module].label } : null;
};

/**
 * Run one tool call the model asked for. Returns the JSON the model gets back as
 * function_call_output, plus `state`/`highlightItemIds` for the device.
 */
export function executeTool({ name, args }, { getState, applyState }, input = {}) {
  const timeCtx = timeContext(input);
  const state = getState();
  if (name === 'query_attn_state') {
    return { output: { success: true, now: { local: instantToLocal(timeCtx.now, timeCtx.timeZone), display: describeNow(timeCtx.now, timeCtx), timeZone: timeCtx.timeZone }, cards: compactState(state, timeCtx) }, changed: false, highlightItemIds: [] };
  }
  if (!ASSISTANT_ACTION_TYPES.includes(name)) {
    return { output: { success: false, error: `${name} is not something attn can do.` }, changed: false, highlightItemIds: [] };
  }
  const working = structuredClone(state);
  const v = validateAction({ type: name, parameters: args && typeof args === 'object' ? args : {} }, working, timeCtx);
  if (!v.ok) return { output: { success: false, error: v.message }, changed: false, highlightItemIds: [] };
  const r = ASSISTANT_ACTIONS[name].run(working, v.params);
  if (!r.ok) return { output: { success: false, error: r.message }, changed: false, highlightItemIds: [] };
  const saved = applyState(working);
  const output = { success: true, message: r.message };
  if (r.itemId && name !== 'remove_item') output.item = summarize(saved, r.itemId);
  if (name === 'remove_item') output.removed = { id: r.itemId, title: (r.message.match(/"([^"]+)"/) || [])[1] || '' };
  if (name === 'set_focus') output.focus = { on: saved.modules.focus.enabled, detail: saved.modules.focus.subtitle, canPlayAudio: false };
  if (name === 'set_module_visibility') output.module = { id: v.params.module, visible: saved.modules[v.params.module].enabled };
  if (name === 'set_note') output.note = saved.modules.note.text;
  return { output, changed: true, state: saved, highlightItemIds: r.itemId && name !== 'remove_item' ? [r.itemId] : [] };
}
