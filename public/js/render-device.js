/**
 * attn — device renderer.
 *
 * Shared by the full-screen /device page and the Control Centre's live preview,
 * so both draw EXACTLY the same thing from the same state.
 *
 *   const dev = createDeviceRenderer(rootEl, { preview: false });
 *   dev.update(state);                         // reconcile modules + items by id
 *   dev.setClock(new Date());                  // time + date lines
 *   dev.setConnection('online', 'Connected');  // top-right pill
 *   dev.setInstall(true, onClick);             // "Install attn" (device page only)
 *
 * Rendering rules:
 *   - text changes update in place (no flash, no rebuild)
 *   - new modules/items animate in with a stagger; removed ones collapse out
 *   - reordering moves existing nodes instead of recreating them
 *   - at most MAX_VISIBLE_ITEMS per module, then "+N more"
 *
 * FUTURE (voice phase): listening / thinking / speaking is an overlay layer to
 * add inside `.dv-safe`, driven by a new state field — not a rewrite of this file.
 */
import { MODULE_META } from './state.js';
import { tileSvg } from './icons.js';
import { LOGO_SVG } from './brand.js';

const MAX_VISIBLE_ITEMS = 3;
const LEAVE_MS = 400;   // a little above --dur-leave so the collapse finishes
const REACT_MS = 2600;  // how long the face smiles after new content arrives

// Exact eye geometry from the Figma "Display" frames (see design-system/components/device/AttnFace.jsx)
const EYE = 'M 10.485 0 L 80.384 5.483 L 90.869 16.45 L 90.869 87.734 L 80.384 100.071 L 15.145 94.588 L 0 82.25 L 0 12.338 L 10.485 0 Z';
const HIGHLIGHT = '59.813,17.253 81.668,18.403 81.668,39.108 59.813,37.95';
const FACE_SVG = `
<svg class="dv-face-svg" viewBox="-8 -8 376 180" aria-hidden="true">
  <defs><linearGradient id="dvEyeG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgb(43,43,45)"/><stop offset="1" stop-color="rgb(37,37,39)"/></linearGradient></defs>
  <g class="dv-face-float">
    <g class="dv-eye dv-eye-l"><path d="${EYE}" fill="url(#dvEyeG)"/><polygon points="${HIGHLIGHT}" fill="#fff"/></g>
    <g transform="translate(359.451 0) scale(-1 1)"><g class="dv-eye dv-eye-r"><path d="${EYE}" fill="url(#dvEyeG)"/><polygon points="${HIGHLIGHT}" fill="#fff"/></g></g>
    <rect class="dv-mouth dv-mouth-neutral" x="146.656" y="141.49" width="65.564" height="11.502" fill="rgb(39,39,41)"/>
    <path class="dv-mouth dv-mouth-happy" d="M 143 110 Q 179.7 168 216.4 110" fill="none" stroke="rgb(39,39,41)" stroke-width="11.5" stroke-linecap="round"/>
  </g>
</svg>`;

const SKELETON = `
<div class="dv-bg" aria-hidden="true">
  <div class="dv-glow dv-glow-a"></div><div class="dv-glow dv-glow-b"></div><div class="dv-glow dv-glow-c"></div>
  <div class="dv-vignette"></div>
</div>
<div class="dv-safe">
  <header class="dv-top">
    <span class="dv-logo">${LOGO_SVG}</span>
    <div class="dv-conn" data-status="connecting"><span class="dv-conn-dot"></span><span class="dv-conn-text">Connecting to attn…</span></div>
  </header>
  <section class="dv-hero">
    <div class="dv-clock">
      <div class="dv-time"><span class="dv-time-digits">--:--</span><span class="dv-time-period"></span></div>
      <div class="dv-date">&nbsp;</div>
    </div>
    <div class="dv-face" data-expression="neutral">${FACE_SVG}</div>
  </section>
  <main class="dv-stack"></main>
  <div class="dv-empty" hidden>
    <div class="dv-empty-title">You're all caught up.</div>
    <div class="dv-empty-sub">Turn something on in the Control Centre and it shows up here.</div>
  </div>
  <button class="dv-install" type="button" hidden>Install attn</button>
</div>`;

const setText = (el, text) => { if (el.textContent !== text) el.textContent = text; };
const liveChildren = (parent) => [...parent.children].filter((el) => !el.classList.contains('is-leaving'));
const findChild = (parent, key, value) => [...parent.children].find((el) => el.dataset[key] === value);

/** Put `desired` nodes in that order, touching only nodes that are out of place. */
function order(parent, desired) {
  let live = liveChildren(parent);
  desired.forEach((el, i) => {
    if (live[i] === el) return;
    parent.insertBefore(el, live[i] || null);
    live = liveChildren(parent);
  });
}

function enter(el, index) {
  el.classList.add('is-entering');
  el.style.setProperty('--enter-i', index);
  const done = (e) => { if (!e || e.target === el) { el.classList.remove('is-entering'); el.removeEventListener('animationend', done); } };
  el.addEventListener('animationend', done);
  setTimeout(done, 900);
}

/** Collapse + fade, then remove. Reversible via revive() if it comes back mid-animation. */
function leave(el) {
  if (el.classList.contains('is-leaving')) return;
  el.classList.remove('is-entering');
  const gap = parseFloat(getComputedStyle(el.parentElement).rowGap) || 0;
  el.style.height = `${el.offsetHeight}px`;
  el.style.marginBottom = '0px';
  el.classList.add('is-leaving');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    el.style.height = '0px';
    el.style.marginBottom = `-${gap}px`;
    el.style.opacity = '0';
    el.style.transform = 'scale(.96)';
  }));
  el._leaveTimer = setTimeout(() => { if (el.classList.contains('is-leaving')) el.remove(); }, LEAVE_MS);
}

function revive(el) {
  clearTimeout(el._leaveTimer);
  el.classList.remove('is-leaving');
  el.style.height = el.style.marginBottom = el.style.opacity = el.style.transform = '';
}

function createModule(id) {
  const meta = MODULE_META[id];
  const el = document.createElement('section');
  el.className = 'dv-module';
  el.dataset.module = id;
  el.dataset.kind = meta.kind;
  if (meta.kind === 'list') {
    el.innerHTML = '<h2 class="dv-eyebrow"></h2><div class="dv-items"></div><div class="dv-more" hidden></div><div class="dv-placeholder" hidden>Nothing here yet</div>';
  } else if (meta.kind === 'focus') {
    el.innerHTML = `<article class="dv-card dv-card-focus"><div class="dv-tile" data-type="focus">${tileSvg('focus')}</div><div class="dv-card-text"><div class="dv-card-title"></div><div class="dv-card-sub"></div></div><span class="dv-live" aria-hidden="true"></span></article>`;
  } else {
    el.innerHTML = `<h2 class="dv-eyebrow"></h2><article class="dv-card dv-card-note"><div class="dv-tile" data-type="note">${tileSvg('note')}</div><div class="dv-card-text"><p class="dv-note-text"></p></div></article>`;
  }
  return el;
}

function createItemEl() {
  const el = document.createElement('article');
  el.className = 'dv-item';
  el.innerHTML = '<div class="dv-item-body"><div class="dv-tile"></div><div class="dv-item-text"><div class="dv-item-title"></div><div class="dv-item-sub"></div></div></div>';
  return el;
}

function fillItem(el, item) {
  const tile = el.querySelector('.dv-tile');
  if (tile.dataset.type !== item.type) { tile.dataset.type = item.type; tile.innerHTML = tileSvg(item.type); }
  setText(el.querySelector('.dv-item-title'), item.title);
  const sub = el.querySelector('.dv-item-sub');
  setText(sub, item.subtitle);
  sub.hidden = !item.subtitle.trim();
}

/** Fill a module's DOM from its state. Returns how many NEW items appeared. */
function fillModule(el, id, mod) {
  const meta = MODULE_META[id];
  if (meta.kind === 'list') {
    setText(el.querySelector('.dv-eyebrow'), mod.title.trim() || meta.label);
    const items = mod.items.filter((it) => it.title.trim());
    const shown = items.slice(0, MAX_VISIBLE_ITEMS);
    const wrap = el.querySelector('.dv-items');
    let added = 0;
    for (const itemEl of liveChildren(wrap)) if (!shown.some((it) => it.id === itemEl.dataset.id)) leave(itemEl);
    const desired = shown.map((it, i) => {
      let itemEl = findChild(wrap, 'id', it.id);
      if (itemEl && itemEl.classList.contains('is-leaving')) revive(itemEl);
      if (!itemEl) { itemEl = createItemEl(); itemEl.dataset.id = it.id; enter(itemEl, added++); }
      itemEl.style.setProperty('--i', i);
      fillItem(itemEl, it);
      return itemEl;
    });
    order(wrap, desired);
    const more = el.querySelector('.dv-more');
    const extra = items.length - shown.length;
    more.hidden = extra <= 0;
    if (extra > 0) setText(more, `+${extra} more`);
    el.querySelector('.dv-placeholder').hidden = items.length > 0;
    return added;
  }
  if (meta.kind === 'focus') {
    setText(el.querySelector('.dv-card-title'), mod.title.trim() || meta.label);
    const sub = el.querySelector('.dv-card-sub');
    setText(sub, mod.subtitle);
    sub.hidden = !mod.subtitle.trim();
    return 0;
  }
  setText(el.querySelector('.dv-eyebrow'), mod.title.trim() || meta.label);
  const text = el.querySelector('.dv-note-text');
  setText(text, mod.text.trim() || 'Nothing written yet');
  text.classList.toggle('is-placeholder', !mod.text.trim());
  return 0;
}

export function createDeviceRenderer(root, { preview = false } = {}) {
  root.classList.add('attn-device');
  root.classList.toggle('is-preview', preview);
  root.innerHTML = SKELETON;
  const q = (sel) => root.querySelector(sel);
  const els = {
    stack: q('.dv-stack'), empty: q('.dv-empty'), face: q('.dv-face'),
    conn: q('.dv-conn'), connText: q('.dv-conn-text'),
    digits: q('.dv-time-digits'), period: q('.dv-time-period'), date: q('.dv-date'),
    install: q('.dv-install'),
  };
  let firstRender = true;
  let baseExpression = 'neutral';
  let reactTimer = null;
  let installHandler = null;

  function react() {
    els.face.dataset.expression = 'happy';
    clearTimeout(reactTimer);
    reactTimer = setTimeout(() => { reactTimer = null; els.face.dataset.expression = baseExpression; }, REACT_MS);
  }

  function update(state) {
    const visible = state.moduleOrder.filter((id) => state.modules[id]?.enabled);
    let added = 0;
    for (const el of liveChildren(els.stack)) if (!visible.includes(el.dataset.module)) leave(el);
    const desired = visible.map((id) => {
      let el = findChild(els.stack, 'module', id);
      if (el && el.classList.contains('is-leaving')) revive(el);
      if (!el) { el = createModule(id); enter(el, added++); }
      added += fillModule(el, id, state.modules[id]);
      return el;
    });
    order(els.stack, desired);

    const nothing = visible.length === 0;
    els.empty.hidden = !nothing;
    baseExpression = nothing ? 'happy' : 'neutral';
    if (!firstRender && added > 0) react();
    else if (!reactTimer) els.face.dataset.expression = baseExpression;
    firstRender = false;
  }

  function setClock(date) {
    let digits = '';
    let period = '';
    for (const p of new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).formatToParts(date)) {
      if (p.type === 'hour' || p.type === 'minute') digits += p.value;
      else if (p.type === 'literal' && p.value.trim()) digits += p.value.trim();
      else if (p.type === 'dayPeriod') period = p.value;
    }
    setText(els.digits, digits);
    setText(els.period, period);
    setText(els.date, new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(date));
  }

  function setConnection(status, text) {
    els.conn.dataset.status = status;
    setText(els.connText, text);
  }

  function setInstall(visible, handler) {
    if (installHandler) els.install.removeEventListener('click', installHandler);
    installHandler = visible ? handler : null;
    if (installHandler) els.install.addEventListener('click', installHandler);
    els.install.hidden = !visible;
  }

  return { root, update, setClock, setConnection, setInstall };
}
