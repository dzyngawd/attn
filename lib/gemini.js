/**
 * attn — the only file that talks to Gemini. Server-side only.
 *
 * Environment:
 *   GEMINI_API_KEY          required (never shipped to the browser)
 *   GEMINI_MODEL            optional, default gemini-3.8-flash (any Gemini Flash model)
 *   GEMINI_THINKING_LEVEL   optional: LOW | MEDIUM | HIGH | off (default LOW = fast replies)
 *   ATTN_ASSISTANT_MOCK     optional, "1" answers with the built-in stub in lib/assistant.js
 *
 * Function calling: the model may only call the functions we declare (the
 * ATTN action registry plus `clarify` and `respond`). It never runs code and
 * never edits state — lib/assistant.js validates and executes every call.
 *
 * Two turns per command that changes something:
 *   decide()  user text → function calls
 *   finish()  function results → one or two spoken sentences
 */
import { GoogleGenAI, ApiError, FunctionCallingConfigMode } from '@google/genai';

const DEFAULT_MODEL = 'gemini-3.8-flash';
const TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS) || 25000;
const THINKING_LEVELS = ['LOW', 'MEDIUM', 'HIGH']; // what Gemini 3.x Flash accepts (default MEDIUM; LOW keeps replies quick)

export const PROVIDER = 'gemini';
export const getModel = () => process.env.GEMINI_MODEL || DEFAULT_MODEL;
export const isMock = () => process.env.ATTN_ASSISTANT_MOCK === '1';
export const isConfigured = () => isMock() || Boolean(process.env.GEMINI_API_KEY);

export class AssistantError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}

let client = null;
function getClient() {
  if (!client) {
    client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        timeout: TIMEOUT_MS,
        // one quick retry on transient server errors; 429 (quota) is surfaced to the user instead
        retryOptions: { attempts: 2, initialDelay: 400, maxDelay: 1500, httpStatusCodes: [500, 502, 503, 504] },
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

function toAssistantError(err) {
  if (err instanceof ApiError) {
    const msg = err.message || '';
    if (err.status === 401 || err.status === 403 || /api key/i.test(msg)) return new AssistantError('auth', `Gemini rejected the API key (HTTP ${err.status})`);
    if (err.status === 429) return new AssistantError('rate_limit', 'Gemini rate limit or free-tier quota reached');
    if (err.status === 404) return new AssistantError('model', `Gemini model "${getModel()}" is not available to this key`);
    if (err.status >= 500) return new AssistantError('api', `Gemini API error ${err.status}`);
    return new AssistantError('api', `Gemini API error ${err.status}: ${msg.slice(0, 200)}`);
  }
  if (err?.name === 'AbortError' || /timed? ?out|timeout/i.test(err?.message || '')) return new AssistantError('timeout', 'Gemini took too long');
  return new AssistantError('network', err?.message || 'Could not reach Gemini');
}

async function generate({ system, contents, functionDeclarations, mode, maxOutputTokens }) {
  if (!process.env.GEMINI_API_KEY) throw new AssistantError('not_configured', 'GEMINI_API_KEY is not set');
  const request = {
    model: getModel(),
    contents,
    config: {
      systemInstruction: system,
      tools: [{ functionDeclarations }],
      toolConfig: { functionCallingConfig: { mode } },
      temperature: 0.2,
      maxOutputTokens,
      thinkingConfig: thinkingConfig(),
    },
  };
  try {
    return await getClient().models.generateContent(request);
  } catch (err) {
    // A model that does not accept thinkingLevel answers 400 — retry once without it.
    if (err instanceof ApiError && err.status === 400 && /thinking/i.test(err.message || '') && request.config.thinkingConfig) {
      delete request.config.thinkingConfig;
      try { return await getClient().models.generateContent(request); } catch (err2) { throw toAssistantError(err2); }
    }
    throw toAssistantError(err);
  }
}

function checkFinish(response) {
  const candidate = response.candidates?.[0];
  const reason = candidate?.finishReason;
  const blocked = response.promptFeedback?.blockReason;
  if (blocked || ['SAFETY', 'PROHIBITED_CONTENT', 'BLOCKLIST', 'SPII'].includes(reason)) {
    throw new AssistantError('refusal', `Gemini blocked the request (${blocked || reason})`);
  }
  if (reason === 'MALFORMED_FUNCTION_CALL') throw new AssistantError('invalid_response', 'Gemini produced a malformed function call');
  if (reason === 'MAX_TOKENS') throw new AssistantError('truncated', 'Gemini reply was cut off');
  return candidate;
}

/** Turn 1: what does the user want? → { calls, text, content } */
export async function decide({ system, userMessage, functionDeclarations }) {
  const response = await generate({
    system,
    contents: [{ role: 'user', parts: [{ text: userMessage }] }],
    functionDeclarations,
    mode: FunctionCallingConfigMode.ANY, // always express the answer as a function call
    maxOutputTokens: 1024,
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
