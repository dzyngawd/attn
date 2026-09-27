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
 *   dev.setInstall(true, onClick);             // "Install" pill (device page only)
 *
 * Voice layer (device page only; hidden in the preview) — driven by assistant.js:
 *   dev.setVoice({ status: 'listening' | 'thinking' | 'idle', label, transcript })  // Figma voice overlay
 *   dev.setReply({ text, action, tone } | null)                                       // Andrew's caption card
 *   dev.setExpression('auto' | 'neutral' | 'happy' | 'puzzled' | 'surprised' | 'listening' | 'speaking')
 *   dev.setHighlights({ itemIds, modules })                                            // pulse the cards it changed
 *   dev.setTypeBox(open) · dev.setAssistantName(name) · dev.on('talk' | 'cancel' | 'submitText' | 'replyAction', fn)
 *
 * Rendering rules:
 *   - text changes update in place (no flash, no rebuild)
 *   - new modules/items animate in with a stagger; removed ones collapse out
 *   - reordering moves existing nodes instead of recreating them
 *   - at most MAX_VISIBLE_ITEMS per module, then "+N more"
 */
import { MODULE_META } from './state.js';
import { tileSvg } from './icons.js';
import { LOGO_SVG } from './brand.js';

const MAX_VISIBLE_ITEMS = 3;
const LEAVE_MS = 400;        // a little above --dur-leave so the collapse finishes
const REACT_MS = 2600;       // how long the face smiles after new content arrives
const HIGHLIGHT_MS = 2600;

// Exact geometry from the Figma "Display" frames (design-system/components/device/AttnFace.jsx, AttnOrb.jsx)
const EYE = 'M 10.485 0 L 80.384 5.483 L 90.869 16.45 L 90.869 87.734 L 80.384 100.071 L 15.145 94.588 L 0 82.25 L 0 12.338 L 10.485 0 Z';
const HIGHLIGHT = '59.813,17.253 81.668,18.403 81.668,39.108 59.813,37.95';
const BUBBLE = 'M 14.947 0 L 141.5 0 L 141.5 95.662 L 62.778 101.641 L 46.835 119.577 L 49.824 100.644 L 0 95.662 L 0 12.954 L 4.982 12.954 L 4.982 4.982 L 14.947 4.982 L 14.947 0 Z';
const BLOB = 'M 203.92 91.629 C 203.92 173.811 143.615 137.915 47.505 164.365 C 34.313 174.441 6.422 200.638 0.392 224.821 C -5.639 249.003 59.44 278.35 92.733 290 C 137.962 284.017 247.641 255.049 324.529 187.036 C 401.418 119.023 323.901 34.007 275.532 0 C 251.661 3.149 203.92 25.883 203.92 91.629 Z';
// Sound-wave mouth from the mascot guideline (bar heights ×3 for the 360-unit face)
const WAVE = [27, 51, 72, 84, 57, 30].map((h, i) => `<rect class="dv-wave-bar" x="${(123.7 + i * 20).toFixed(1)}" y="${(147 - h / 2).toFixed(1)}" width="12" height="${h}" rx="6" style="--d:${[-0.1, -0.3, -0.5, -0.2, -0.4, -0.6][i]}s"/>`).join('');

const FACE_SVG = `
<svg class="dv-face-svg" viewBox="-8 -8 376 180" aria-hidden="true">
  <defs><linearGradient id="dvEyeG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgb(43,43,45)"/><stop offset="1" stop-color="rgb(37,37,39)"/></linearGradient></defs>
  <g class="dv-face-float">
    <g class="dv-face-look">
      <g class="dv-eye dv-eye-l"><path d="${EYE}" fill="url(#dvEyeG)"/><polygon points="${HIGHLIGHT}" fill="#fff"/></g>
      <g transform="translate(359.451 0) scale(-1 1)"><g class="dv-eye dv-eye-r"><path d="${EYE}" fill="url(#dvEyeG)"/><polygon points="${HIGHLIGHT}" fill="#fff"/></g></g>
    </g>
    <rect class="dv-mouth dv-mouth-neutral" x="146.656" y="141.49" width="65.564" height="11.502" fill="rgb(39,39,41)"/>
    <path class="dv-mouth dv-mouth-happy" d="M 143 110 Q 179.7 168 216.4 110" fill="none" stroke="rgb(39,39,41)" stroke-width="11.5" stroke-linecap="round"/>
    <ellipse class="dv-mouth dv-mouth-surprised" cx="179.7" cy="139" rx="18" ry="15" fill="rgb(39,39,41)"/>
    <g class="dv-mouth dv-mouth-wave" fill="rgb(39,39,41)">${WAVE}</g>
  </g>
  <g transform="translate(4 -104) scale(-1 1)"><g class="dv-bubble"><path d="${BUBBLE}" fill="rgb(228,227,224)"/><text class="dv-bubble-text" x="70" y="78" text-anchor="middle" transform="translate(141.5 0) scale(-1 1)">?</text></g></g>
</svg>`;

const ORB_SVG = `<svg class="dv-orb-svg" viewBox="0 0 203 203" aria-hidden="true"><rect width="203" height="203" fill="#fff"/><g transform="translate(6 -50.5)"><path d="${BLOB}" fill="rgb(0,159,254)"/></g><g transform="matrix(-0.991 0.135 -0.135 -0.991 202.966 195.831)"><path d="${BLOB}" fill="rgb(255,214,0)"/></g></svg>`;
const MIC_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>';
const KEYBOARD_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="3"/><path d="M7 10h.01M11 10h.01M15 10h.01M7 14h10"/></svg>';
const SEND_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';

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
    <button class="dv-face" type="button" data-expression="neutral" aria-label="Talk to attn">${FACE_SVG}</button>
  </section>
  <main class="dv-stack"></main>
  <div class="dv-empty" hidden>
    <div class="dv-empty-title">You're all caught up.</div>
    <div class="dv-empty-sub">Turn something on in the Control Centre and it shows up here.</div>
  </div>
  <div class="dv-reply" hidden>
    <div class="dv-reply-orb">${ORB_SVG}</div>
    <div class="dv-reply-text"><div class="dv-reply-who">attn</div><p class="dv-reply-body"></p></div>
    <button class="dv-reply-action" type="button" hidden></button>
  </div>
  <form class="dv-typebox" hidden>
    <input class="dv-typebox-input" type="text" autocomplete="off" enterkeyhint="send" maxlength="240" placeholder="Ask attn…" aria-label="Type a command">
    <button class="dv-typebox-send" type="submit" aria-label="Send">${SEND_SVG}</button>
  </form>
  <div class="dv-bar">
    <button class="dv-talk" type="button"><span class="dv-talk-icon">${MIC_SVG}</span><span class="dv-talk-label">Talk to attn</span></button>
    <button class="dv-type-toggle" type="button" aria-label="Type instead">${KEYBOARD_SVG}</button>
    <button class="dv-install" type="button" hidden>Install</button>
  </div>
  <div class="dv-voice" data-status="idle" hidden>
    <div class="dv-orb-wrap"><span class="dv-orb-ring"></span><span class="dv-orb-ring"></span><div class="dv-orb">${ORB_SVG}</div></div>
    <div class="dv-voice-label">Listening</div>
    <div class="dv-voice-transcript"></div>
    <div class="dv-voice-hint">Tap anywhere to cancel</div>
  </div>
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
    voice: q('.dv-voice'), voiceLabel: q('.dv-voice-label'), voiceTranscript: q('.dv-voice-transcript'),
    reply: q('.dv-reply'), replyWho: q('.dv-reply-who'), replyBody: q('.dv-reply-body'), replyAction: q('.dv-reply-action'),
    typebox: q('.dv-typebox'), typeInput: q('.dv-typebox-input'), typeToggle: q('.dv-type-toggle'),
    talk: q('.dv-talk'), talkLabel: q('.dv-talk-label'),
  };
  let firstRender = true;
  let baseExpression = 'neutral';   // what the face does when nobody is talking
  let override = null;              // assistant-driven expression, or null for auto
  let reactTimer = null;
  let installHandler = null;
  let highlightTimer = null;
  const handlers = { talk: [], cancel: [], submitText: [], replyAction: [] };
  const emit = (event, ...args) => handlers[event].forEach((fn) => fn(...args));

  const applyExpression = () => { els.face.dataset.expression = override || baseExpression; };

  function react() {
    if (override) return;
    els.face.dataset.expression = 'happy';
    clearTimeout(reactTimer);
    reactTimer = setTimeout(() => { reactTimer = null; applyExpression(); }, REACT_MS);
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
    else if (!reactTimer) applyExpression();
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

  // ---------------------------------------------------------------- voice layer
  function setVoice({ status = 'idle', label = '', transcript = '' } = {}) {
    els.voice.dataset.status = status;
    els.voice.hidden = status === 'idle';
    setText(els.voiceLabel, label);
    setText(els.voiceTranscript, transcript ? `“${transcript}”` : '');
    root.classList.toggle('is-voice', status !== 'idle');
  }

  function setReply(reply) {
    if (!reply) { els.reply.hidden = true; els.reply.classList.remove('is-visible'); return; }
    setText(els.replyBody, reply.text || '');
    els.reply.dataset.tone = reply.tone || 'default';
    els.replyAction.hidden = !reply.action;
    setText(els.replyAction, reply.action || '');
    els.reply.hidden = false;
    requestAnimationFrame(() => els.reply.classList.add('is-visible'));
  }

  function setExpression(expr) {
    clearTimeout(reactTimer); reactTimer = null;
    override = expr === 'auto' ? null : expr;
    applyExpression();
  }

  function setHighlights({ itemIds = [], modules = [] } = {}) {
    clearTimeout(highlightTimer);
    root.querySelectorAll('.is-highlight').forEach((el) => el.classList.remove('is-highlight'));
    const targets = [
      ...itemIds.map((id) => root.querySelector(`.dv-item[data-id="${CSS.escape(id)}"]`)),
      ...modules.map((m) => root.querySelector(`.dv-module[data-module="${m}"] .dv-card`)),
    ].filter(Boolean);
    targets.forEach((el) => el.classList.add('is-highlight'));
    targets[0]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    highlightTimer = setTimeout(() => targets.forEach((el) => el.classList.remove('is-highlight')), HIGHLIGHT_MS);
  }

  function setTypeBox(open) {
    els.typebox.hidden = !open;
    root.classList.toggle('is-typing', open);
    if (open) setTimeout(() => els.typeInput.focus(), 50);
    else els.typeInput.blur();
  }

  function setAssistantName(name) {
    setText(els.replyWho, name);
    setText(els.talkLabel, `Talk to ${name}`);
    els.typeInput.placeholder = `Ask ${name}…`;
  }

  function on(event, fn) { handlers[event]?.push(fn); return () => { handlers[event] = handlers[event].filter((f) => f !== fn); }; }

  if (!preview) {
    els.talk.addEventListener('click', () => emit('talk'));
    els.face.addEventListener('click', () => emit('talk'));
    els.voice.addEventListener('click', () => emit('cancel'));
    els.replyAction.addEventListener('click', () => emit('replyAction'));
    els.typeToggle.addEventListener('click', () => setTypeBox(els.typebox.hidden));
    els.typebox.addEventListener('submit', (e) => { e.preventDefault(); const text = els.typeInput.value.trim(); if (!text) return; els.typeInput.value = ''; emit('submitText', text); });
    els.typeInput.addEventListener('keydown', (e) => { if (e.key === 'Escape') setTypeBox(false); });
  }

  return { root, update, setClock, setConnection, setInstall, setVoice, setReply, setExpression, setHighlights, setTypeBox, setAssistantName, on };
}
