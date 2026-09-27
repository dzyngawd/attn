/**
 * attn — the only file that talks to Gemini. Server-side only.
 *
 * Environment:
 *   GEMINI_API_KEY          required (never shipped to the browser)
 *   GEMINI_MODEL            optional, default gemini-3.8-flash (any Gemini Flash model)
 *   GEMINI_FALLBACK_MODEL   optional, default gemini-3.5-flash-lite: used for one retry when the primary
 *                           model answers 429 (free-tier quota), so a demo survives one exhausted bucket
 *   GEMINI_THINKING_LEVEL   optional: LOW | MEDIUM | HIGH | off (default LOW = fast replies)
 *   ATTN_DEBUG              optional, "1" also logs the full request/response JSON (temporary debugging aid)
 *   ATTN_ASSISTANT_MOCK     optional, "1" answers with the built-in stub in lib/assistant.js
 *
 * Function calling: the model may only call the functions we declare (the
 * ATTN action registry plus `clarify` and `respond`). It never runs code and
 * never edits state — lib/assistant.js validates and executes every call.
 *
 * Two turns per command that changes something:
 *   decide()  user text → function calls (or plain text for a conversational answer)
 *   finish()  function results → one or two spoken sentences
 *
 * Time budget: every call has a hard overall deadline (OVERALL_MS) plus a
 * per-attempt timeout, so the device never waits longer than its own 25 s.
 * NOTE: the SDK's retry delays are in SECONDS.
 */
import { GoogleGenAI, ApiError, FunctionCallingConfigMode } from '@google/genai';

const DEFAULT_MODEL = 'gemini-3.8-flash';
const ATTEMPT_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS) || 12000; // one HTTP attempt
const OVERALL_MS = Number(process.env.GEMINI_DEADLINE_MS) || 20000;         // whole call incl. one retry
const THINKING_LEVELS = ['LOW', 'MEDIUM', 'HIGH']; // what Gemini 3.x Flash accepts (default MEDIUM; LOW keeps replies quick)
const DEBUG = process.env.ATTN_DEBUG === '1';

export const PROVIDER = 'gemini';
export const getModel = () => process.env.GEMINI_MODEL || DEFAULT_MODEL;
export const getFallbackModel = () => { const m = process.env.GEMINI_FALLBACK_MODEL ?? 'gemini-3.5-flash-lite'; return m && m !== getModel() && m !== '0' ? m : null; };
export const isMock = () => process.env.ATTN_ASSISTANT_MOCK === '1';
export const isConfigured = () => isMock() || Boolean(process.env.GEMINI_API_KEY);

export class AssistantError extends Error {
  constructor(code, message, status) { super(message); this.code = code; this.status = status; }
}

const log = (...args) => console.log('[attn ▸ gemini]', ...args);

let client = null;
function getClient() {
  if (!client) {
    client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        timeout: ATTEMPT_TIMEOUT_MS,
        // One quick retry on transient server errors. Delays are SECONDS in this SDK.
        retryOptions: { attempts: 2, initialDelay: 0.5, maxDelay: 1, jitter: 0, httpStatusCodes: [500, 502, 503, 504] },
      },
    });
  }
  return client;
}

function thinkingConfig() {
  const level = (process.env.GEMINI_THINKING_LEVEL || 'LOW').toUpperCase();
  if (level === 'OFF' || level === 'NONE') return undefined;
  return { thinkingLevel: THINKING_LEVELS.includes(level) ? level : 'LOW' };
}

/** Map anything thrown by the SDK to a code the router and the device understand. */
function toAssistantError(err) {
  const msg = err?.message || '';
  if (err instanceof ApiError || typeof err?.status === 'number') {
    const status = err.status;
    if (status === 401 || status === 403 || /api key/i.test(msg)) return new AssistantError('auth', `Gemini rejected the API key (HTTP ${status}): ${msg.slice(0, 200)}`, status);
    if (status === 429) return new AssistantError('rate_limit', `Gemini rate limit / quota reached (HTTP 429): ${msg.slice(0, 200)}`, status);
    if (status === 404 || (status === 400 && /model|not found|not supported/i.test(msg))) return new AssistantError('model', `Gemini model "${getModel()}" problem (HTTP ${status}): ${msg.slice(0, 200)}`, status);
    if (status >= 500) return new AssistantError('api', `Gemini server error (HTTP ${status}): ${msg.slice(0, 200)}`, status);
    return new AssistantError('api', `Gemini API error (HTTP ${status}): ${msg.slice(0, 300)}`, status);
  }
  if (err?.name === 'AbortError' || err?.name === 'TimeoutError' || /abort|timed? ?out|timeout/i.test(msg)) return new AssistantError('timeout', `Gemini took longer than ${OVERALL_MS} ms`);
  return new AssistantError('network', `Could not reach Gemini: ${msg.slice(0, 200)}`);
}

async function generate({ system, contents, functionDeclarations, mode, maxOutputTokens, label, plain = false, model = getModel() }) {
  if (!process.env.GEMINI_API_KEY) throw new AssistantError('not_configured', 'GEMINI_API_KEY is not set');
  const request = {
    model,
    contents,
    config: {
      systemInstruction: system,
      tools: [{ functionDeclarations }],
      toolConfig: { functionCallingConfig: { mode } },
      temperature: plain ? 0 : 0.2,
      maxOutputTokens,
      thinkingConfig: plain ? undefined : thinkingConfig(),
      abortSignal: AbortSignal.timeout(OVERALL_MS), // hard deadline for the whole call, retries included
    },
  };
  log(`${label}: model=${request.model} mode=${mode} thinking=${request.config.thinkingConfig?.thinkingLevel ?? 'off'} functions=[${functionDeclarations.map((f) => f.name).join(', ')}] contents=${contents.length} maxOutputTokens=${maxOutputTokens}`);
  if (DEBUG) log(`${label} request JSON:`, JSON.stringify({ ...request, config: { ...request.config, abortSignal: undefined } }));
  const started = Date.now();
  let response;
  try {
    response = await getClient().models.generateContent(request);
  } catch (err) {
    // A model that does not accept thinkingLevel answers 400 — retry once without it.
    if (err instanceof ApiError && err.status === 400 && /thinking/i.test(err.message || '') && request.config.thinkingConfig) {
      log(`${label}: 400 mentions thinking — retrying without thinkingConfig`);
      delete request.config.thinkingConfig;
      try { response = await getClient().models.generateContent(request); } catch (err2) { throw logged(toAssistantError(err2), err2, label, started); }
    } else if (err instanceof ApiError && err.status === 429 && getFallbackModel() && model !== getFallbackModel()) {
      // Free-tier quota on the primary model: try the fallback model once (separate quota bucket).
      log(`${label}: 429 on ${model} — retrying on fallback model ${getFallbackModel()}`);
      return generate({ system, contents, functionDeclarations, mode, maxOutputTokens, label: `${label}(fallback)`, plain, model: getFallbackModel() });
    } else {
      throw logged(toAssistantError(err), err, label, started);
    }
  }
  const candidate = response.candidates?.[0];
  const calls = response.functionCalls || [];
  // Gemini occasionally emits a call it cannot parse itself (finishReason MALFORMED_FUNCTION_CALL),
  // most often with thinking on. One retry with thinking off and temperature 0 usually fixes it.
  if (candidate?.finishReason === 'MALFORMED_FUNCTION_CALL' && !plain) {
    log(`${label}: MALFORMED_FUNCTION_CALL after ${Date.now() - started} ms — retrying once with thinking off`);
    return generate({ system, contents, functionDeclarations, mode, maxOutputTokens, label: `${label}(retry)`, plain: true });
  }
  log(`${label}: ${Date.now() - started} ms finishReason=${candidate?.finishReason ?? '?'} functionCalls=${calls.length ? JSON.stringify(calls.map((c) => ({ name: c.name, args: c.args }))) : 'none'} text=${response.text ? JSON.stringify(response.text.slice(0, 200)) : 'none'}`);
  if (DEBUG) log(`${label} response JSON:`, JSON.stringify(response.candidates ?? response).slice(0, 4000));
  return response;
}

function logged(assistantError, raw, label, started) {
  log(`${label}: FAILED after ${Date.now() - started} ms → ${assistantError.code}: ${assistantError.message} (raw: ${raw?.name || 'Error'}${raw?.status ? ` status ${raw.status}` : ''})`);
  return assistantError;
}

function checkFinish(response) {
  const candidate = response.candidates?.[0];
  const reason = candidate?.finishReason;
  const blocked = response.promptFeedback?.blockReason;
  if (blocked || ['SAFETY', 'PROHIBITED_CONTENT', 'BLOCKLIST', 'SPII'].includes(reason)) {
    throw new AssistantError('refusal', `Gemini blocked the request (${blocked || reason})`);
  }
  if (reason === 'MALFORMED_FUNCTION_CALL') throw new AssistantError('invalid_response', `Gemini produced a malformed function call (finishReason=${reason}, finishMessage=${candidate?.finishMessage ?? 'none'})`);
  if (reason === 'MAX_TOKENS') throw new AssistantError('truncated', 'Gemini reply was cut off');
  return candidate;
}

/** Turn 1: what does the user want? → { calls, text, content } */
export async function decide({ system, userMessage, functionDeclarations }) {
  const response = await generate({
    label: 'decide',
    system,
    contents: [{ role: 'user', parts: [{ text: userMessage }] }],
    functionDeclarations,
    mode: FunctionCallingConfigMode.AUTO, // functions for changes; plain text is fine for conversation
    maxOutputTokens: 4096, // thinking tokens count against this on Gemini 3
  });
  const candidate = checkFinish(response);
  const calls = (response.functionCalls || [])
    .filter((c) => c && typeof c.name === 'string')
    .map((c) => ({ id: c.id, name: c.name, args: c.args && typeof c.args === 'object' ? c.args : {} }));
  return { calls, text: (response.text || '').trim() || null, content: candidate?.content || null };
}

/** Turn 2: the model sees what actually happened and says it in one or two sentences. */
export async function finish({ system, userMessage, modelContent, results, functionDeclarations }) {
  const parts = results.map((r) => ({
    functionResponse: {
      ...(r.id ? { id: r.id } : {}),
      name: r.name,
      response: { ok: r.ok, message: r.message, ...(r.itemId ? { itemId: r.itemId } : {}) },
    },
  }));
  const response = await generate({
    label: 'finish',
    system,
    // the model's own turn is echoed back unchanged (it carries any thought signature)
    contents: [{ role: 'user', parts: [{ text: userMessage }] }, modelContent, { role: 'user', parts }],
    functionDeclarations,
    mode: FunctionCallingConfigMode.NONE, // words only now
    maxOutputTokens: 256,
  });
  checkFinish(response);
  return (response.text || '').trim();
}
