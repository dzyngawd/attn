/**
 * attn — the only file that talks to Claude. Server-side only.
 *
 * Environment:
 *   ANTHROPIC_API_KEY     required (never shipped to the browser)
 *   ANTHROPIC_MODEL       optional, default claude-opus-5
 *   ATTN_ASSISTANT_MOCK   optional, "1" answers with a built-in stub (dev only)
 *
 * interpret() asks for ONE structured reply that must match a JSON schema
 * (structured outputs), so the router never has to parse prose.
 */
import Anthropic from '@anthropic-ai/sdk';

const DEFAULT_MODEL = 'claude-opus-5';
const TIMEOUT_MS = Number(process.env.ANTHROPIC_TIMEOUT_MS) || 25000;

export const getModel = () => process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;
export const isMock = () => process.env.ATTN_ASSISTANT_MOCK === '1';
export const isConfigured = () => isMock() || Boolean(process.env.ANTHROPIC_API_KEY);

let client = null;
function getClient() {
  if (!client) client = new Anthropic({ timeout: TIMEOUT_MS, maxRetries: 1 });
  return client;
}

export class AssistantError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}

/** Effort is only accepted on current-generation models; refusal fallbacks only on the Opus 5 / Fable family. */
const supportsEffort = (model) => !/haiku|sonnet-4-5|opus-4-5|claude-3/.test(model);
const supportsFallbacks = (model) => /opus-5|fable|mythos/.test(model);

/**
 * @param {object} opts
 * @param {string} opts.system        stable system prompt (cached)
 * @param {Array}  opts.messages      Anthropic message params
 * @param {object} opts.schema        JSON schema the reply must satisfy
 * @param {Function} [opts.mock]      returns a reply object when ATTN_ASSISTANT_MOCK=1
 */
export async function interpret({ system, messages, schema, mock }) {
  if (isMock()) return mock();
  if (!process.env.ANTHROPIC_API_KEY) throw new AssistantError('not_configured', 'ANTHROPIC_API_KEY is not set');
  const model = getModel();
  const request = {
    model,
    max_tokens: 2048,
    system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
    messages,
    output_config: {
      ...(supportsEffort(model) ? { effort: 'low' } : {}),
      format: { type: 'json_schema', schema },
    },
  };
  let response;
  try {
    response = supportsFallbacks(model)
      ? await getClient().beta.messages.create({ ...request, betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' })
      : await getClient().messages.create(request);
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) throw new AssistantError('auth', 'The Anthropic API key was rejected');
    if (err instanceof Anthropic.RateLimitError) throw new AssistantError('rate_limit', 'Rate limited by the Anthropic API');
    if (err instanceof Anthropic.APIConnectionTimeoutError) throw new AssistantError('timeout', 'The model took too long');
    if (err instanceof Anthropic.APIError) throw new AssistantError('api', `Anthropic API error ${err.status}: ${err.message}`);
    throw new AssistantError('network', err.message || 'Could not reach the Anthropic API');
  }
  if (response.stop_reason === 'refusal') throw new AssistantError('refusal', 'The model declined this request');
  if (response.stop_reason === 'max_tokens') throw new AssistantError('truncated', 'The reply was cut off');
  const text = response.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
  try {
    return JSON.parse(text);
  } catch {
    throw new AssistantError('invalid_response', 'The model returned invalid JSON');
  }
}
