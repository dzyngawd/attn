/**
 * attn — server.
 *
 * One small Express app that:
 *   1. serves the static frontend  (/  /control  /device  + css/js/icons)
 *   2. holds the ONE shared attn state in memory
 *   3. exposes it as JSON:   GET /api/state   POST /api/state   GET /api/status
 *   4. mirrors it to a JSON file (data/state.json) so restarts keep the demo
 *
 * The device polls GET /api/state every ~1.5s. The Control Centre POSTs the
 * whole state whenever something changes. Last write wins — simple and reliable.
 *
 * Voice (VOICE_PROVIDER=openai, default): the device talks to OpenAI Realtime
 * over WebRTC using a short-lived client secret from POST /api/realtime/token;
 * the model's function calls are executed by POST /api/realtime/tool through
 * public/js/actions.js + applyState(). Legacy (VOICE_PROVIDER=legacy):
 * Chrome speech → POST /api/assistant/command (Gemini) — rollback only.
 * No permanent API key ever leaves the server.
 */
import './lib/env.js'; // loads a local .env first (optional)
import express from 'express';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeState, DEFAULT_STATE } from './public/js/state.js';
import { handleCommand, ASSISTANT_NAME } from './lib/assistant.js';
import { isConfigured, isMock, getModel, PROVIDER } from './lib/gemini.js';
import * as realtime from './lib/realtime.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, 'public');
const PORT = Number(process.env.PORT) || 3000;
// Point ATTN_STATE_FILE at a mounted volume on hosts that offer one.
const STATE_FILE = process.env.ATTN_STATE_FILE || path.join(__dirname, 'data', 'state.json');
const DEVICE_ONLINE_WINDOW_MS = 6000; // a device is "connected" if it polled within this window

// ---------------------------------------------------------------- shared state
let state = loadState();
let lastDeviceSeenAt = 0;

function loadState() {
  try {
    const parsed = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    console.log(`[attn] loaded state from ${STATE_FILE}`);
    return normalizeState(parsed);
  } catch (err) {
    if (err.code !== 'ENOENT') console.warn('[attn] state file unreadable, starting fresh:', err.message);
    return normalizeState(DEFAULT_STATE);
  }
}

// Writes are serialised and atomic (write temp file, then rename).
let writing = Promise.resolve();
function persist(snapshot) {
  writing = writing
    .then(async () => {
      await fsp.mkdir(path.dirname(STATE_FILE), { recursive: true });
      const tmp = `${STATE_FILE}.tmp`;
      await fsp.writeFile(tmp, JSON.stringify(snapshot, null, 2));
      await fsp.rename(tmp, STATE_FILE);
    })
    .catch((err) => console.warn('[attn] could not write state file:', err.message));
  return writing;
}

/** The single write path: normalise, bump revision, stamp time, persist. */
function applyState(input) {
  const next = normalizeState(input);
  next.revision = state.revision + 1;
  next.updatedAt = new Date().toISOString();
  state = next;
  persist(state);
  return state;
}

// ------------------------------------------------------------------------ app
const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '256kb' }));

const noStore = (res) => res.set('Cache-Control', 'no-store');

app.get('/api/state', (req, res) => {
  if (req.query.client === 'device') lastDeviceSeenAt = Date.now();
  noStore(res).json(state);
});

app.post('/api/state', (req, res) => {
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return noStore(res).status(400).json({ ok: false, error: 'Expected a JSON object' });
  }
  noStore(res).json(applyState(body));
});

app.get('/api/status', (req, res) => {
  const now = Date.now();
  noStore(res).json({
    ok: true,
    revision: state.revision,
    updatedAt: state.updatedAt,
    device: { online: now - lastDeviceSeenAt < DEVICE_ONLINE_WINDOW_MS, lastSeenAt: lastDeviceSeenAt || null },
    now,
  });
});

// ------------------------------------------------------------------ assistant
app.get('/api/assistant/status', (req, res) => {
  const voiceProvider = realtime.getProvider() === 'legacy' ? 'legacy' : 'openai';
  noStore(res).json({
    ok: true,
    name: ASSISTANT_NAME,
    voiceProvider,
    realtime: { configured: realtime.isConfigured(), model: realtime.getModel(), voice: realtime.getVoice() },
    // legacy (Gemini) interpretation, kept for VOICE_PROVIDER=legacy
    configured: voiceProvider === 'openai' ? realtime.isConfigured() : isConfigured(),
    mock: isMock(),
    provider: voiceProvider === 'openai' ? 'openai-realtime' : (isMock() ? 'mock' : PROVIDER),
    model: voiceProvider === 'openai' ? realtime.getModel() : (isMock() ? 'mock' : getModel()),
    commit: (process.env.RENDER_GIT_COMMIT || '').slice(0, 7) || null,
    node: process.version,
  });
});

// ------------------------------------------------------------- OpenAI Realtime bridge
app.post('/api/realtime/token', async (req, res) => {
  if (realtime.getProvider() === 'legacy') return noStore(res).status(400).json({ ok: false, error: 'provider_disabled', message: 'VOICE_PROVIDER is legacy' });
  try {
    const secret = await realtime.createClientSecret(req.body || {});
    noStore(res).json({ ok: true, ...secret, name: ASSISTANT_NAME });
  } catch (err) {
    const status = err.status && err.status >= 400 && err.status < 600 ? err.status : 502;
    console.warn('[Realtime] token:', err.code || 'error', err.message);
    noStore(res).status(status).json({ ok: false, error: err.code || 'error', message: err.message });
  }
});

app.post('/api/realtime/tool', (req, res) => {
  const { name, arguments: rawArgs, call_id: callId } = req.body || {};
  if (typeof name !== 'string') return noStore(res).status(400).json({ ok: false, error: 'bad_request' });
  let args = rawArgs;
  if (typeof rawArgs === 'string') { try { args = JSON.parse(rawArgs || '{}'); } catch { args = null; } }
  if (args !== null && typeof args !== 'object') args = null;
  console.log(`[Realtime] tool: ${name} ${JSON.stringify(args)}`);
  if (args === null) return noStore(res).json({ ok: true, call_id: callId, output: { success: false, error: 'The arguments were not valid JSON.' }, changed: false, highlightItemIds: [] });
  try {
    const result = realtime.executeTool({ name, args }, { getState: () => state, applyState }, req.body || {});
    console.log(`[Realtime] action result: ${result.output.success ? 'success' : 'failed'} ${result.output.message || result.output.error || ''}`);
    noStore(res).json({ ok: true, call_id: callId, ...result });
  } catch (err) {
    console.error('[Realtime] tool crashed:', err);
    noStore(res).json({ ok: true, call_id: callId, output: { success: false, error: 'attn could not run that action.' }, changed: false, highlightItemIds: [] });
  }
});

app.post('/api/realtime/instructions', (req, res) => {
  noStore(res).json({ ok: true, instructions: realtime.buildInstructions(realtime.timeContext(req.body || {})) });
});

app.post('/api/assistant/command', async (req, res, next) => {
  try {
    const { status, body } = await handleCommand(req.body || {}, { getState: () => state, applyState });
    noStore(res).status(status).json(body);
  } catch (err) {
    next(err);
  }
});

// ------------------------------------------------------------------- frontend
const page = (file) => (req, res) => res.set('Cache-Control', 'no-cache').sendFile(path.join(PUBLIC_DIR, file));
app.get('/', page('index.html'));
app.get('/control', page('control.html'));
app.get('/device', page('device.html'));

app.use(express.static(PUBLIC_DIR, {
  setHeaders(res, filePath) {
    // Never let the browser hold on to the shell or the service worker across deploys.
    if (/\.(html)$|service-worker\.js$|manifest\.json$/.test(filePath)) res.set('Cache-Control', 'no-cache');
  },
}));

// Unknown routes → the landing page (never a bare 404 page during a demo).
app.use((req, res) => res.status(404).set('Cache-Control', 'no-cache').sendFile(path.join(PUBLIC_DIR, 'index.html')));

// Malformed JSON bodies and anything unexpected → clean JSON, never a stack trace.
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.type === 'entity.parse.failed' ? 400 : err.status || 500;
  if (status >= 500) console.error('[attn]', err);
  noStore(res).status(status).json({ ok: false, error: status === 400 ? 'Invalid JSON' : 'Server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  const lan = Object.values(os.networkInterfaces()).flat()
    .filter((i) => i && i.family === 'IPv4' && !i.internal)
    .map((i) => i.address);
  console.log(`[attn] running on http://localhost:${PORT}`);
  console.log(`[attn]   Control Centre  http://localhost:${PORT}/control`);
  console.log(`[attn]   Device          http://localhost:${PORT}/device`);
  for (const ip of lan) console.log(`[attn]   Phone on same Wi-Fi  http://${ip}:${PORT}/device`);
  const voice = realtime.getProvider() === 'legacy'
    ? `legacy (Chrome speech + ${isMock() ? 'MOCK' : isConfigured() ? getModel() : 'Gemini not configured'})`
    : `OpenAI Realtime ${realtime.getModel()} · voice ${realtime.getVoice()} · ${realtime.isConfigured() ? 'ready' : 'NOT configured — set OPENAI_API_KEY'}`;
  console.log(`[attn] assistant "${ASSISTANT_NAME}": ${voice}`);
});
