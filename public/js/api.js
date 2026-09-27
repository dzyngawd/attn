/**
 * attn — API client.
 * Two endpoints hold the whole product together:
 *   GET  /api/state   → the shared state (the device polls this)
 *   POST /api/state   → replace the shared state (the Control Centre saves this)
 * plus a tiny GET /api/status for the "Device connected / Synced" pills.
 *
 * Every call has a timeout and throws a normal Error on any failure, so callers
 * can show a calm "Connecting…" state instead of a browser error.
 */
const TIMEOUT_MS = 4000;

async function request(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeout ?? TIMEOUT_MS);
  options.signal?.addEventListener('abort', () => controller.abort(), { once: true });
  try {
    const res = await fetch(url, { cache: 'no-store', ...options, signal: controller.signal });
    if (!res.ok) {
      // keep the server's error code/message so callers can react (e.g. not_configured vs. a blip)
      let body = null;
      try { body = await res.json(); } catch { /* not JSON */ }
      const err = new Error(body?.message || body?.spokenResponse || `HTTP ${res.status}`);
      err.status = res.status;
      err.code = body?.error || `http_${res.status}`;
      throw err;
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

export const api = {
  /** `client` lets the server know who is polling ("device" powers the connected pill). */
  getState: (client) => request(`/api/state${client ? `?client=${encodeURIComponent(client)}` : ''}`),
  saveState: (state) => request('/api/state', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state),
  }),
  getStatus: () => request('/api/status'),
  /** Voice/text command → { ok, type, spokenResponse, results, state?, ... } (see lib/assistant.js). */
  command: (payload, signal) => request('/api/assistant/command', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    timeout: 25000, // the server answers within ~20 s (lib/gemini.js OVERALL_MS), so this only guards a dead connection
    signal,
  }),
  assistantStatus: () => request('/api/assistant/status'),
  /** OpenAI Realtime bridge: short-lived client secret, tool execution, refreshed instructions. */
  realtimeToken: (payload) => request('/api/realtime/token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), timeout: 20000 }),
  realtimeTool: (payload) => request('/api/realtime/tool', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), timeout: 10000 }),
  realtimeInstructions: (payload) => request('/api/realtime/instructions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
};
