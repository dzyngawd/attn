/**
 * attn — Completed (Control Centre › /control/completed).
 *
 * Every task ever marked done, newest first, grouped Today / Yesterday / Earlier.
 * Reads state.completed from the shared state (same file, same API); polls
 * /api/status so a swipe on the phone shows up here within a few seconds.
 */
import { api } from './api.js';
import { normalizeState, DEFAULT_STATE, THEMES } from './state.js';
import { setTheme } from './actions.js';
import { tileSvg } from './icons.js';
import { LOGO_SVG } from './brand.js';
import { faceSvg } from './render-device.js';
import { mountThemePicker } from './theme-picker.js';

const STATUS_POLL_MS = 3000;
const $ = (sel, el = document) => el.querySelector(sel);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const METHOD = { swipe: 'Swiped on attn', voice: 'Told Andrew', control: 'Control Centre' };

let state = normalizeState(DEFAULT_STATE);
let toastTimer = null;

const themePicker = mountThemePicker($('#theme-picker'), {
  async onSelect(theme) {
    if (!setTheme(state, { theme }).ok) return;
    applyTheme(theme);
    try { state = normalizeState(await api.saveState(state)); } catch { showToast('Can’t reach attn right now'); }
  },
});
function applyTheme(theme) {
  const t = THEMES.includes(theme) ? theme : 'sky';
  document.documentElement.dataset.theme = t;
  themePicker.set(t);
}

const dayKey = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
function groupLabel(date, now) {
  const key = dayKey(date);
  if (key === dayKey(now)) return 'Today';
  if (key === dayKey(new Date(now.getTime() - 86400000))) return 'Yesterday';
  return 'Earlier';
}
const fmtTime = (d) => new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(d);
const fmtDate = (d) => new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: d.getFullYear() === new Date().getFullYear() ? undefined : 'numeric' }).format(d);

function row(c) {
  const done = new Date(c.completedAt);
  const meta = [c.moduleLabel, c.subtitle].filter((s) => s && s.trim()).map(esc);
  return `<div class="done-row">
    <div class="tile" data-type="${esc(c.type)}">${tileSvg(c.type)}</div>
    <div class="done-text">
      <div class="done-title">${esc(c.title) || '<span style="color:var(--fg-4)">Untitled</span>'}</div>
      <div class="done-meta">${meta.join(' · ')}${meta.length ? ' ' : ''}<span class="chip chip-${esc(c.completionMethod)}">${METHOD[c.completionMethod] || 'Done'}</span></div>
    </div>
    <div class="done-when"><div class="done-time">${fmtTime(done)}</div><div class="done-date">${fmtDate(done)}</div></div>
  </div>`;
}

function render() {
  applyTheme(state.device.theme);
  $('#completed-count').textContent = String(state.completed.length);
  const root = $('#completed');
  if (!state.completed.length) {
    root.innerHTML = `<div class="done-empty"><div class="done-empty-face" data-expression="happy">${faceSvg('dvEyeDone')}</div><div class="done-empty-title">Nothing crossed off yet.</div><div class="done-empty-sub">Swipe a card right on attn, or tell Andrew you're done with something, and it lands here.</div></div>`;
    return;
  }
  const now = new Date();
  const groups = new Map();
  for (const c of state.completed) {
    const label = groupLabel(new Date(c.completedAt), now);
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label).push(c);
  }
  root.innerHTML = ['Today', 'Yesterday', 'Earlier'].filter((g) => groups.has(g))
    .map((g) => `<div class="done-group-title">${g} · ${groups.get(g).length}</div><div class="done-list">${groups.get(g).map(row).join('')}</div>`).join('');
}

function showToast(text) {
  const t = $('#toast');
  t.textContent = text;
  t.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('is-visible'), 2600);
}

async function boot() {
  for (;;) {
    try { state = normalizeState(await api.getState('control')); break; }
    catch { await sleep(1500); }
  }
  $('#logo').innerHTML = LOGO_SVG;
  $('#boot').hidden = true;
  $('#app').hidden = false;
  render();
  setInterval(async () => {
    try {
      const s = await api.getStatus();
      if (s.revision > state.revision) { state = normalizeState(await api.getState('control')); render(); }
    } catch { /* next time */ }
  }, STATUS_POLL_MS);
}
boot();
