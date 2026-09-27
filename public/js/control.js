/**
 * attn — Control Centre.
 *
 * "This is where I decide what attn knows about and what appears on my device."
 *
 * Flow:  edit → local state → live preview (instant) → debounced POST /api/state
 *        → "Synced just now".  GET /api/status every few seconds shows whether
 *        the phone is polling, and adopts changes made from another window.
 *
 * Resilience: the last saved state is also kept in localStorage. If the server
 * ever comes back empty (fresh deploy on an ephemeral host) it is restored
 * automatically, so a demo never has to start from scratch.
 */
import { api } from './api.js';
import { normalizeState, DEFAULT_STATE, MODULE_META, SOURCE_META, SOURCE_IDS, ITEM_TYPES, LIMITS } from './state.js';
import { addItem, removeItem, setModuleVisibility, moveModule, connectSource as connectSourceAction, disconnectSource } from './actions.js';
import { TILES, tileSvg } from './icons.js';
import { LOGO_SVG } from './brand.js';
import { createDeviceRenderer } from './render-device.js';

const SAVE_DEBOUNCE_MS = 350;
const STATUS_POLL_MS = 3000;
const BACKUP_KEY = 'attn.control.backup';

const $ = (sel, el = document) => el.querySelector(sel);
const els = {
  boot: $('#boot'), app: $('#app'),
  sources: $('#sources'), modules: $('#modules'),
  sync: $('#sync-status'), device: $('#device-status'), toast: $('#toast'),
  previewFrame: $('#preview-frame'), previewScaler: $('#preview-scaler'), previewDevice: $('#preview-device'),
};

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const icon = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
const ICON = { up: icon('m6 15 6-6 6 6'), down: icon('m6 9 6 6 6-6'), cross: icon('M6 6l12 12M18 6 6 18'), plus: icon('M12 5v14M5 12h14') };

// ------------------------------------------------------------------ state
let state = normalizeState(DEFAULT_STATE);
let changes = 0;        // bumps on every local edit
let savedChanges = 0;   // value of `changes` the server has confirmed
let saving = false;
let saveTimer = null;
let syncState = 'connecting';
let lastSyncedAt = null;
let toastTimer = null;
const dirty = () => changes !== savedChanges;

const preview = createDeviceRenderer(els.previewDevice, { preview: true });
preview.setConnection('online', 'Connected');

function setPath(obj, path, value) {
  const keys = path.split('.');
  let cur = obj;
  for (const k of keys.slice(0, -1)) { if (cur == null) return; cur = cur[k]; }
  if (cur != null) cur[keys.at(-1)] = value;
}

// ------------------------------------------------------------------ boot
async function boot() {
  for (;;) {
    try { state = normalizeState(await api.getState('control')); break; }
    catch { await sleep(1500); }
  }
  await restoreBackupIfServerIsFresh();
  $('#logo').innerHTML = LOGO_SVG;
  els.boot.hidden = true;
  els.app.hidden = false;
  renderAll();
  fitPreview();
  new ResizeObserver(fitPreview).observe(els.previewFrame);
  preview.setClock(new Date());
  setInterval(() => preview.setClock(new Date()), 1000);
  lastSyncedAt = Date.now();
  setSync('synced');
  pollStatus();
  setInterval(pollStatus, STATUS_POLL_MS);
  setInterval(refreshSyncLabel, 10000);
}

async function restoreBackupIfServerIsFresh() {
  if (state.revision !== 0) return;
  let backup = null;
  try { backup = JSON.parse(localStorage.getItem(BACKUP_KEY) || 'null'); } catch { /* ignore */ }
  if (!backup || !(backup.revision > 0)) return;
  state = normalizeState(backup);
  try {
    state = normalizeState(await api.saveState(state));
    showToast('Restored your last setup');
  } catch { /* the regular save loop will retry */ }
}

// ------------------------------------------------------------------ rendering
function renderAll() {
  renderSources();
  renderModules();
  preview.update(state);
}

function renderSources() {
  els.sources.innerHTML = SOURCE_IDS.map((id) => {
    const meta = SOURCE_META[id];
    const connected = state.sources[id].connected;
    const foot = meta.always
      ? '<span class="chip chip-ready">Ready</span>'
      : connected
        ? `<span class="chip chip-connected"><span class="chip-dot"></span>Connected</span><button class="btn-text" type="button" data-action="disconnect-source" data-source="${id}">Disconnect</button>`
        : `<button class="btn btn-dark" type="button" data-action="connect-source" data-source="${id}">Connect</button>`;
    return `<article class="source-card${connected ? ' is-connected' : ''}">
      <div class="tile" data-type="${meta.type}">${tileSvg(meta.type)}</div>
      <div class="source-name">${esc(meta.name)}</div>
      <div class="source-desc">${esc(meta.description)}</div>
      <div class="source-foot">${foot}</div>
    </article>`;
  }).join('');
}

function hintFor(id, mod) {
  const meta = MODULE_META[id];
  if (!mod.enabled) return meta.hint;
  if (meta.kind === 'list') {
    const n = mod.items.filter((it) => it.title.trim()).length;
    return n === 0 ? 'On · nothing to show yet' : `On · ${n} item${n === 1 ? '' : 's'}`;
  }
  if (meta.kind === 'focus') return `On · ${mod.subtitle.trim() || meta.hint}`;
  return mod.text.trim() ? 'On · showing your note' : 'On · nothing written yet';
}

function itemRow(id, it, i) {
  return `<div class="item-row" data-index="${i}">
    <input class="input item-title" data-path="modules.${id}.items.${i}.title" value="${esc(it.title)}" maxlength="${LIMITS.title}" placeholder="What is it?" aria-label="Item title">
    <input class="input item-sub" data-path="modules.${id}.items.${i}.subtitle" value="${esc(it.subtitle)}" maxlength="${LIMITS.subtitle}" placeholder="When or why" aria-label="Item detail">
    <select class="input select item-type" data-path="modules.${id}.items.${i}.type" aria-label="Item type">${ITEM_TYPES.map((t) => `<option value="${t}"${t === it.type ? ' selected' : ''}>${TILES[t].label}</option>`).join('')}</select>
    <button class="icon-btn item-remove" type="button" data-action="remove-item" data-module="${id}" data-index="${i}" aria-label="Remove item">${ICON.cross}</button>
  </div>`;
}

function editorFor(id, mod, meta) {
  const label = `<label class="field"><span class="field-label">Label on attn</span><input class="input" data-path="modules.${id}.title" value="${esc(mod.title)}" maxlength="${LIMITS.moduleTitle}" placeholder="${esc(meta.label)}"></label>`;
  if (meta.kind === 'list') {
    return `<div class="editor">${label}
      <div class="field"><span class="field-label">Items</span><div class="items">${mod.items.map((it, i) => itemRow(id, it, i)).join('')}</div></div>
      <div><button class="btn btn-light" type="button" data-action="add-item" data-module="${id}">${ICON.plus}Add item</button></div>
    </div>`;
  }
  if (meta.kind === 'focus') {
    return `<div class="editor">${label}
      <label class="field"><span class="field-label">What you're focusing on</span><input class="input" data-path="modules.${id}.subtitle" value="${esc(mod.subtitle)}" maxlength="${LIMITS.subtitle}" placeholder="Deep work"></label>
    </div>`;
  }
  return `<div class="editor">${label}
    <label class="field"><span class="field-label">Note</span><textarea class="input" data-path="modules.${id}.text" maxlength="${LIMITS.note}" rows="3" placeholder="Anything you want to see on attn">${esc(mod.text)}</textarea></label>
  </div>`;
}

function renderModules() {
  const last = state.moduleOrder.length - 1;
  els.modules.innerHTML = state.moduleOrder.map((id, index) => {
    const meta = MODULE_META[id];
    const mod = state.modules[id];
    return `<section class="module${mod.enabled ? ' is-on' : ''}" data-module="${id}">
      <div class="module-row">
        <div class="tile tile-sm" data-type="${meta.type}">${tileSvg(meta.type)}</div>
        <div class="module-text">
          <div class="module-title">${esc(mod.title || meta.label)}</div>
          <div class="module-hint">${esc(hintFor(id, mod))}</div>
        </div>
        <div class="module-order">
          <button class="icon-btn" type="button" data-action="move-module" data-module="${id}" data-dir="-1" aria-label="Move up"${index === 0 ? ' disabled' : ''}>${ICON.up}</button>
          <button class="icon-btn" type="button" data-action="move-module" data-module="${id}" data-dir="1" aria-label="Move down"${index === last ? ' disabled' : ''}>${ICON.down}</button>
        </div>
        <label class="switch"><input type="checkbox" data-action="toggle-module" data-module="${id}"${mod.enabled ? ' checked' : ''} aria-label="Show ${esc(mod.title || meta.label)} on attn"><span class="switch-track"><span class="switch-knob"></span></span></label>
      </div>
      <div class="module-editor"><div class="module-editor-inner">${editorFor(id, mod, meta)}</div></div>
    </section>`;
  }).join('');
}

function updateHint(id) {
  const hint = $(`.module[data-module="${id}"] .module-hint`, els.modules);
  if (hint) hint.textContent = hintFor(id, state.modules[id]);
}

// ------------------------------------------------------------------ edits
function touch() {
  changes += 1;
  preview.update(state);
  scheduleSave();
}

els.modules.addEventListener('input', (e) => {
  const path = e.target.dataset.path;
  if (!path) return;
  setPath(state, path, e.target.value);
  const edited = path.match(/^modules\.(\w+)\.items\.(\d+)\.subtitle$/);
  if (edited) state.modules[edited[1]].items[Number(edited[2])].at = null; // a typed time wins over the assistant's timestamp
  const m = path.match(/^modules\.(\w+)\.title$/);
  if (m) $(`.module[data-module="${m[1]}"] .module-title`, els.modules).textContent = state.modules[m[1]].title || MODULE_META[m[1]].label;
  const mod = path.match(/^modules\.(\w+)\./)?.[1];
  if (mod) updateHint(mod);
  touch();
});

els.modules.addEventListener('change', (e) => {
  if (!e.target.matches('[data-action="toggle-module"]')) return;
  const id = e.target.dataset.module;
  setModuleVisibility(state, { module: id, enabled: e.target.checked });
  $(`.module[data-module="${id}"]`, els.modules).classList.toggle('is-on', e.target.checked);
  updateHint(id);
  touch();
});

document.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const { action, module: id, source, index, dir } = btn.dataset;
  if (action === 'connect-source') connectSource(source);
  else if (action === 'disconnect-source') {
    disconnectSource(state, source);
    renderSources();
    touch();
    showToast(`${SOURCE_META[source].name} disconnected`);
  } else if (action === 'add-item') {
    const added = addItem(state, { module: id });
    if (!added.ok) { showToast(`Up to ${LIMITS.items} items per module`); return; }
    renderModules();
    $(`.module[data-module="${id}"] .item-row[data-index="${state.modules[id].items.length - 1}"] .item-title`, els.modules)?.focus();
    touch();
  } else if (action === 'remove-item') {
    removeItem(state, { module: id, index: Number(index) });
    renderModules();
    updateHint(id);
    touch();
  } else if (action === 'move-module') {
    if (!moveModule(state, { module: id, direction: Number(dir) }).ok) return;
    renderModules();
    touch();
  }
});

function connectSource(id) {
  const meta = SOURCE_META[id];
  const { seeded } = connectSourceAction(state, id);
  renderSources();
  if (seeded) renderModules();
  touch();
  showToast(seeded ? `${meta.name} connected · ${seeded} added to “${state.modules[meta.seeds.module].title}”` : `${meta.name} connected`);
}

// ------------------------------------------------------------------ saving + status
function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(save, SAVE_DEBOUNCE_MS);
  setSync('saving');
}

async function save() {
  if (saving) return; // the in-flight request reschedules when it finishes
  saving = true;
  const at = changes;
  setSync('saving');
  try {
    const saved = normalizeState(await api.saveState(state));
    state.revision = saved.revision;
    state.updatedAt = saved.updatedAt;
    savedChanges = at;
    lastSyncedAt = Date.now();
    try { localStorage.setItem(BACKUP_KEY, JSON.stringify(state)); } catch { /* ignore */ }
    setSync('synced');
  } catch {
    setSync('offline');
    setTimeout(() => { if (dirty()) scheduleSave(); }, 2000);
  } finally {
    saving = false;
    if (changes !== at) scheduleSave();
  }
}

const isEditing = () => els.modules.contains(document.activeElement) && document.activeElement.matches('input, textarea, select');

async function pollStatus() {
  try {
    const s = await api.getStatus();
    setDevice(s.device?.online ? 'online' : 'waiting');
    if (syncState === 'offline' && !dirty()) setSync('synced');
    if (!dirty() && !saving && s.revision > state.revision && !isEditing()) {
      const remote = normalizeState(await api.getState('control'));
      if (!dirty() && !saving) { state = remote; renderAll(); showToast('Updated from another window'); }
    }
  } catch {
    setDevice('unknown');
    if (!saving) setSync('offline');
  }
}

function setSync(kind) {
  syncState = kind;
  els.sync.dataset.state = kind;
  refreshSyncLabel();
}

function refreshSyncLabel() {
  const t = $('.pill-text', els.sync);
  if (syncState === 'saving') t.textContent = 'Saving…';
  else if (syncState === 'offline') t.textContent = 'Can’t reach attn · retrying';
  else if (syncState === 'connecting') t.textContent = 'Connecting…';
  else {
    const s = lastSyncedAt ? Math.round((Date.now() - lastSyncedAt) / 1000) : 0;
    t.textContent = s < 10 ? 'Synced just now' : s < 60 ? `Synced ${s}s ago` : `Synced ${Math.round(s / 60)} min ago`;
  }
}

function setDevice(kind) {
  els.device.dataset.state = kind;
  $('.pill-text', els.device).textContent = { online: 'Device connected', waiting: 'Waiting for device', unknown: 'Device status unknown' }[kind];
}

function fitPreview() {
  els.previewScaler.style.transform = `scale(${els.previewFrame.clientWidth / 360})`;
}

function showToast(text) {
  els.toast.textContent = text;
  els.toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove('is-visible'), 2600);
}

boot();
