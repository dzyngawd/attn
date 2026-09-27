/**
 * attn — device page.
 *
 * Boots the renderer, polls GET /api/state every POLL_MS and only re-renders
 * when the server's `revision` changes. Connection problems never show a
 * browser error: the device keeps its last state and recovers automatically.
 *
 * The device is landscape-only: the manifest prefers landscape, an installed
 * PWA asks the Screen Orientation API to lock (best effort, never fatal), and a
 * phone held upright sees a small "Rotate attn" screen until it is turned.
 *
 * Voice: the server's VOICE_PROVIDER picks ONE stack — 'openai' (realtime.js:
 * OpenAI Realtime over WebRTC, the production path) or 'legacy' (assistant.js:
 * Chrome speech + Gemini, rollback only). They are never loaded together.
 * /device?debug=1 adds a typed command box and window.attnDebug for development.
 */
import { api } from './api.js';
import { normalizeState } from './state.js';
import { createDeviceRenderer } from './render-device.js';

const POLL_MS = 1500;
const CACHE_KEY = 'attn.device.state';

// /device?debug=1 (or #debug) keeps a typed command box and a console handle for development
const DEBUG = /[?&#]debug(=1)?\b/.test(location.search + location.hash);
const device = createDeviceRenderer(document.getElementById('device'), { debug: DEBUG });
let lastRevision = -1;
let failures = 0;
let status = '';
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

function adopt(state) {
  const s = normalizeState(state);
  lastRevision = s.revision;
  device.update(s);
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(s)); } catch { /* storage full or blocked */ }
  return s;
}

// ---- instant paint from the last known state (PWA relaunch feels immediate)
try {
  const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
  if (cached) { const s = normalizeState(cached); lastRevision = s.revision; device.update(s); }
} catch { /* ignore a bad cache */ }

function setStatus(next) {
  if (next === status) return;
  status = next;
  device.setConnection(next);
  if (DEBUG) console.log('[Device] connection:', next);
}
setStatus('connecting');

// ---- polling: the whole sync mechanism for the device
async function poll() {
  try {
    const state = normalizeState(await api.getState('device'));
    failures = 0;
    if (state.revision !== lastRevision) adopt(state);
    setStatus('online');
  } catch {
    failures += 1;
    if (failures >= 2) setStatus('offline'); // one blip is fine; two in a row is worth noting
  }
}
poll();
setInterval(() => { if (document.visibilityState !== 'hidden') poll(); }, POLL_MS);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') poll(); });
window.addEventListener('online', poll);

// ---- swipe right → done: archived on the server, then the stack closes the gap
device.on('complete', async (itemId) => {
  const r = await api.completeItem(itemId, 'swipe'); // throws on failure → the card springs back
  if (r?.state) adopt(r.state);
  console.log('[Completed] swipe:', r?.completed?.title || itemId);
});

// ---- clock
const tick = () => device.setClock(new Date());
tick();
setInterval(tick, 1000);

// ---- landscape only
const portraitQuery = window.matchMedia('(orientation: portrait)');
const applyOrientation = () => device.setOrientation(portraitQuery.matches && window.innerHeight > window.innerWidth);
applyOrientation();
portraitQuery.addEventListener?.('change', applyOrientation);
window.addEventListener('resize', applyOrientation);
async function lockLandscape() {
  try {
    if (screen.orientation?.lock) { await screen.orientation.lock('landscape'); console.log('[Viewport] orientation locked to landscape'); }
  } catch (err) { console.log('[Viewport] orientation lock unavailable:', err?.name || err?.message || err); }
}
if (isStandalone) lockLandscape();
// browsers only allow the lock from a user gesture (and often only when installed); try again on the first tap
window.addEventListener('pointerdown', () => { if (!isStandalone) return; lockLandscape(); }, { once: true });

// ---- viewport diagnostics for the physical Samsung (console only, never in the UI)
function logViewport(reason) {
  console.log(`[Viewport] ${reason}: ${window.innerWidth}×${window.innerHeight} css px · dpr ${window.devicePixelRatio} · ${screen.orientation?.type || 'orientation n/a'} · screen ${screen.width}×${screen.height} · ${isStandalone ? 'installed PWA' : 'browser tab'} · portrait=${portraitQuery.matches}`);
}
logViewport('load');
let viewportTimer = null;
window.addEventListener('resize', () => { clearTimeout(viewportTimer); viewportTimer = setTimeout(() => logViewport('resize'), 250); });
screen.orientation?.addEventListener?.('change', () => logViewport('orientation change'));

// ---- PWA: install prompt + service worker
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (isStandalone) return;
  device.setInstall(true, async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    try { await deferredPrompt.userChoice; } catch { /* dismissed */ }
    deferredPrompt = null;
    device.setInstall(false);
  });
});
window.addEventListener('appinstalled', () => device.setInstall(false));
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').catch(() => { /* not fatal */ });
}

// ---- the assistant (voice + typed commands). The name comes from the server (ASSISTANT_NAME).
api.assistantStatus()
  .catch(() => ({ name: 'Andrew', voiceProvider: 'openai' }))
  .then(async (s) => {
    const name = s.name || 'Andrew';
    if (s.voiceProvider === 'legacy') {
      const { createAssistant } = await import('./assistant.js');
      const assistant = createAssistant({ device, name, debug: DEBUG });
      if (DEBUG) { window.attnDebug = { device, assistant, provider: 'legacy', simulate: (t) => assistant.simulateTranscript(t) }; console.log('[Andrew] debug (legacy): window.attnDebug.simulate("Hey Andrew, …")'); }
      return;
    }
    const { createRealtimeAssistant } = await import('./realtime.js');
    const assistant = createRealtimeAssistant({ device, name, debug: DEBUG });
    if (DEBUG) { window.attnDebug = { device, assistant, provider: 'openai', simulateEvent: (ev) => assistant.simulateEvent(ev), say: (t) => assistant.submitText(t) }; console.log('[Realtime] debug: window.attnDebug.say("…") / simulateEvent({type})'); }
  });

// ---- keep the screen awake while attn is showing (no-op where unsupported)
async function keepAwake() {
  try {
    if ('wakeLock' in navigator && document.visibilityState === 'visible') await navigator.wakeLock.request('screen');
  } catch { /* denied or unsupported */ }
}
keepAwake();
document.addEventListener('visibilitychange', keepAwake);
