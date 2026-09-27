/**
 * attn — device page.
 *
 * Boots the renderer, polls GET /api/state every POLL_MS and only re-renders
 * when the server's `revision` changes. Connection problems show a calm
 * "Reconnecting…" pill (never a browser error) and recover automatically.
 *
 * Voice: see assistant.js — tap the face or the Talk pill; typed commands via
 * the keyboard button. Both call POST /api/assistant/command.
 */
import { api } from './api.js';
import { normalizeState } from './state.js';
import { createDeviceRenderer } from './render-device.js';
import { createAssistant } from './assistant.js';

const POLL_MS = 1500;
const CACHE_KEY = 'attn.device.state';

const device = createDeviceRenderer(document.getElementById('device'));
let lastRevision = -1;
let failures = 0;
let status = '';

// ---- instant paint from the last known state (PWA relaunch feels immediate)
try {
  const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
  if (cached) { const s = normalizeState(cached); lastRevision = s.revision; device.update(s); }
} catch { /* ignore a bad cache */ }

function setStatus(next) {
  if (next === status) return;
  status = next;
  const label = { online: 'Connected', offline: 'Reconnecting…', connecting: 'Connecting to attn…' }[next];
  device.setConnection(next, label);
}
setStatus('connecting');

// ---- polling: the whole sync mechanism for the device
async function poll() {
  try {
    const state = normalizeState(await api.getState('device'));
    failures = 0;
    if (state.revision !== lastRevision) {
      lastRevision = state.revision;
      device.update(state);
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(state)); } catch { /* storage full or blocked */ }
    }
    setStatus('online');
  } catch {
    failures += 1;
    if (failures >= 2) setStatus('offline'); // one blip is fine; two in a row is worth showing
  }
}
poll();
setInterval(() => { if (document.visibilityState !== 'hidden') poll(); }, POLL_MS);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') poll(); });
window.addEventListener('online', poll);

// ---- clock
const tick = () => device.setClock(new Date());
tick();
setInterval(tick, 1000);

// ---- PWA: install prompt + service worker
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
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
  .then((s) => createAssistant({ device, name: s.name || 'attn' }))
  .catch(() => createAssistant({ device, name: 'attn' }));

// ---- keep the screen awake while attn is showing (no-op where unsupported)
async function keepAwake() {
  try {
    if ('wakeLock' in navigator && document.visibilityState === 'visible') await navigator.wakeLock.request('screen');
  } catch { /* denied or unsupported */ }
}
keepAwake();
document.addEventListener('visibilitychange', keepAwake);
