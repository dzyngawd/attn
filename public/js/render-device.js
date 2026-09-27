/**
 * attn — device renderer (landscape, one screen).
 *
 * Shared by the full-screen /device page and the Control Centre's live preview,
 * so both draw EXACTLY the same thing from the same state.
 *
 *   const dev = createDeviceRenderer(rootEl, { preview: false });
 *   dev.update(state);                         // theme + one prioritised stack, reconciled by key
 *   dev.setClock(new Date());                  // time + date lines
 *   dev.setConnection('online', 'Connected');  // no visible badge any more (data-conn on the root, debug only)
 *   dev.setInstall(true, onClick);             // "Install" pill (device page only)
 *   dev.setOrientation(portrait)               // "Rotate attn" screen while the phone is held upright
 *
 * Layout (measured from the design reference at 780×360):
 *   left  ≈ 51%  clock (Agbalumo) · date · the attn face, centred on one axis
 *   right ≈ 49%  "Needs attn. (N)" fixed · the dark cards below scroll when more than three (the page never does)
 * All enabled list modules feed ONE stack, ordered by urgency (timed items first,
 * soonest first). Focus mode takes the first card while it is on; a Quick note the last.
 * N counts every outstanding item even when only three are drawn.
 *
 * Swipe right on a card → the card follows the finger, a "Done" layer appears behind it,
 * past the threshold it flies out and 'complete' is emitted with the item id. The state
 * update that follows collapses the gap and the next item moves up.
 *
 * Voice layer (device page only; hidden in the preview) — driven by realtime.js.
 * assistantState ∈ idle | listening | processing | speaking | clarifying | success | error.
 * Idle and success show the dashboard; every other state brings the face forward on the same
 * sky (reference frames 2–4): eyes + waveform mouth, ink on the gradient, subtle motion.
 *   dev.setAssistantState(state, { text, transcript, action })
 *   dev.setExpression('auto' | 'neutral' | 'happy' | 'puzzled' | 'surprised')
 *   dev.setHighlights({ itemIds, modules })
 *   dev.setSetup({ text, action, subtle } | null)
 *   dev.setTypeBox(open) · dev.setAssistantName(name)
 *   dev.on('talk' | 'faceTap' | 'submitText' | 'enable' | 'update' | 'startAudio' | 'complete', fn)
 */
import { MODULE_META, THEMES } from './state.js';
import { tileSvg } from './icons.js';
import { LOGO_SVG } from './brand.js';

const FIT_CARDS = 3; // how many cards fill the column; the rest scroll underneath the heading
const LEAVE_MS = 420;
const REACT_MS = 1400;       // how long the face reacts to new content
const HIGHLIGHT_MS = 2600;
const URGENT_WINDOW_MS = 12 * 60 * 60 * 1000;
const SWIPE_MIN_PX = 70;     // never below this
const SWIPE_RATIO = 0.28;    // …or 28% of the card width, whichever is larger

// Exact geometry from the Figma "Display" frames (design-system/components/device/AttnFace.jsx):
// blocky polygon eyes with a square highlight, mirrored; the mouth family from the mascot card.
const EYE = 'M 10.485 0 L 80.384 5.483 L 90.869 16.45 L 90.869 87.734 L 80.384 100.071 L 15.145 94.588 L 0 82.25 L 0 12.338 L 10.485 0 Z';
const HIGHLIGHT = '59.813,17.253 81.668,18.403 81.668,39.108 59.813,37.95';
const BUBBLE = 'M 14.947 0 L 141.5 0 L 141.5 95.662 L 62.778 101.641 L 46.835 119.577 L 49.824 100.644 L 0 95.662 L 0 12.954 L 4.982 12.954 L 4.982 4.982 L 14.947 4.982 L 14.947 0 Z';
// Sound-wave mouth (mascot guideline bar heights ×3), centred under the eyes
const WAVE = [27, 51, 72, 84, 57, 30].map((h, i) => `<rect class="dv-wave-bar" x="${(123.7 + i * 20).toFixed(1)}" y="${(150 - h / 2).toFixed(1)}" width="12" height="${h}" rx="6" style="--d:${[-0.1, -0.3, -0.5, -0.2, -0.4, -0.6][i]}s"/>`).join('');

export const faceSvg = (id) => `
<svg class="dv-face-svg" viewBox="-8 -8 376 226" aria-hidden="true">
  <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgb(43,43,45)"/><stop offset="1" stop-color="rgb(37,37,39)"/></linearGradient></defs>
  <g class="dv-face-float">
    <g class="dv-face-look">
      <g class="dv-eye dv-eye-l"><path d="${EYE}" fill="url(#${id})"/><polygon points="${HIGHLIGHT}" fill="#fff"/></g>
      <g transform="translate(359.451 0) scale(-1 1)"><g class="dv-eye dv-eye-r"><path d="${EYE}" fill="url(#${id})"/><polygon points="${HIGHLIGHT}" fill="#fff"/></g></g>
    </g>
    <rect class="dv-mouth dv-mouth-neutral" x="146.656" y="144.49" width="65.564" height="11.502" rx="5.75" fill="rgb(39,39,41)"/>
    <path class="dv-mouth dv-mouth-happy" d="M 110 166 Q 179.7 234 249.4 166" fill="none" stroke="rgb(39,39,41)" stroke-width="20" stroke-linecap="round"/>
    <ellipse class="dv-mouth dv-mouth-surprised" cx="179.7" cy="158" rx="19" ry="17" fill="rgb(39,39,41)"/>
    <g class="dv-mouth dv-mouth-wave" fill="rgb(39,39,41)">${WAVE}</g>
  </g>
  <g transform="translate(4 -104) scale(-1 1)"><g class="dv-bubble"><path d="${BUBBLE}" fill="rgb(228,227,224)"/><text class="dv-bubble-text" x="70" y="78" text-anchor="middle" transform="translate(141.5 0) scale(-1 1)">?</text></g></g>
</svg>`;

const MIC_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>';
const KEYBOARD_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="3"/><path d="M7 10h.01M11 10h.01M15 10h.01M7 14h10"/></svg>';
const SEND_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
const CHECK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7"/></svg>';
const ROTATE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M3 12a9 9 0 0 1 3-6.7M21 12a9 9 0 0 1-3 6.7"/><path d="m4.5 3.5 1.5 1.8-2 1.2M19.5 20.5 18 18.7l2-1.2"/></svg>';

const SKELETON = `
<div class="dv-bg" aria-hidden="true">
  <div class="dv-sky"></div>
  <div class="dv-glow dv-glow-a"></div><div class="dv-glow dv-glow-b"></div><div class="dv-glow dv-glow-c"></div>
  <div class="dv-rim"></div>
</div>
<div class="dv-safe">
  <section class="dv-left">
    <div class="dv-clock">
      <div class="dv-time"><span class="dv-time-digits">--:--</span><span class="dv-time-period"></span></div>
      <div class="dv-date">&nbsp;</div>
    </div>
    <button class="dv-face" type="button" data-expression="happy" aria-label="Talk to attn">${faceSvg('dvEyeG')}</button>
    <div class="dv-player" hidden><div class="dv-player-frame"></div><button class="dv-player-start" type="button" hidden>Start focus audio</button></div>
    <div class="dv-bar">
      <button class="dv-setup" type="button" hidden><span class="dv-setup-icon">${MIC_SVG}</span><span class="dv-setup-text"></span></button>
      <button class="dv-type-toggle" type="button" aria-label="Type instead" hidden>${KEYBOARD_SVG}</button>
      <button class="dv-install" type="button" hidden>Install attn</button>
    </div>
  </section>
  <section class="dv-right">
    <h2 class="dv-heading"><span class="dv-heading-text">Needs attn.</span> <span class="dv-heading-count">(0)</span></h2>
    <div class="dv-stack"></div>
    <div class="dv-empty" hidden>
      <div class="dv-empty-title">You're all caught up.</div>
      <div class="dv-empty-sub">Anything new from the Control Centre or Andrew shows up here.</div>
    </div>
  </section>
</div>
<form class="dv-typebox" hidden>
  <input class="dv-typebox-input" type="text" autocomplete="off" enterkeyhint="send" maxlength="240" placeholder="Ask attn…" aria-label="Type a command">
  <button class="dv-typebox-send" type="submit" aria-label="Send">${SEND_SVG}</button>
</form>
<!-- the character comes forward on the same sky for listening / processing / speaking / clarifying / error -->
<div class="dv-facemode" hidden>
  <div class="dv-bigface" data-expression="neutral" aria-hidden="true">${faceSvg('dvEyeBig')}</div>
  <div class="dv-facemode-text">
    <div class="dv-facemode-who">attn</div>
    <div class="dv-facemode-line"></div>
    <div class="dv-facemode-sub"></div>
    <button class="dv-facemode-action" type="button" hidden></button>
  </div>
  <div class="dv-facemode-hint"></div>
</div>
<!-- held upright: attn is a landscape device -->
<div class="dv-rotate" aria-hidden="true">
  <div class="dv-rotate-face" data-expression="puzzled">${faceSvg('dvEyeRot')}</div>
  <div class="dv-rotate-title"><span class="dv-rotate-icon">${ROTATE_SVG}</span>Rotate attn</div>
  <div class="dv-rotate-sub">attn lives sideways. Turn the phone to landscape.</div>
  <div class="dv-rotate-logo">${LOGO_SVG}</div>
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
  el.classList.remove('is-leaving', 'is-done');
  el.style.height = el.style.marginBottom = el.style.opacity = el.style.transform = '';
  el.style.setProperty('--dx', '0px');
  el.style.setProperty('--p', 0);
}

// ---------------------------------------------------------------- the stack
/**
 * Everything the device could show, in priority order:
 *   focus (while on) → list items (timed first, soonest first, then the user's order) → note.
 * Returns { entries, total } where total counts the outstanding list items (the header N).
 */
export function stackEntries(state) {
  const entries = [];
  const items = [];
  let position = 0;
  for (const id of state.moduleOrder) {
    const mod = state.modules[id];
    const meta = MODULE_META[id];
    if (!mod?.enabled) continue;
    if (meta.kind === 'focus') entries.push({ key: 'focus', kind: 'focus', mod });
    else if (meta.kind === 'list') for (const item of mod.items) if (item.title.trim()) items.push({ key: `item:${item.id}`, kind: 'item', item, module: id, position: position++ });
  }
  const time = (e) => (e.item.at ? Date.parse(e.item.at) : Number.POSITIVE_INFINITY);
  items.sort((a, b) => (time(a) - time(b)) || (a.position - b.position));
  entries.push(...items);
  const note = state.modules.note;
  if (note?.enabled && note.text.trim()) entries.push({ key: 'note', kind: 'note', mod: note });
  return { entries, total: items.length };
}

/** Attention items are always urgent (that is what the list is for); other items when due within 12 h. */
function isUrgent(entry, now) {
  if (entry.module === 'attention') return true;
  if (!entry.item.at) return false;
  const dt = Date.parse(entry.item.at) - now;
  return dt < URGENT_WINDOW_MS;
}

let deviceAudio = null; // 'loading' | 'playing' | 'blocked' | 'paused' | null — what the YouTube player really reports on this device
function musicLabel(mod) {
  if (!mod.currentTrackId) return '';
  if (deviceAudio === 'blocked') return 'Tap to start focus audio';
  if (deviceAudio === 'loading') return 'Starting focus audio…';
  if (deviceAudio === 'paused') return 'Focus audio paused';
  if (deviceAudio === 'playing' || mod.musicPlaying) return 'Focus audio playing';
  return 'Focus audio';
}

function createCard(entry) {
  const el = document.createElement('article');
  el.className = `dv-card dv-card-${entry.kind}`;
  el.dataset.key = entry.key;
  if (entry.kind === 'item') {
    el.dataset.id = entry.item.id;
    el.innerHTML = `<div class="dv-done" aria-hidden="true"><span class="dv-done-check">${CHECK_SVG}</span><span class="dv-done-text">Done</span></div>
      <div class="dv-card-body"><div class="dv-tile"></div><div class="dv-card-text"><div class="dv-card-title"></div><div class="dv-card-sub"></div></div></div>`;
  } else if (entry.kind === 'focus') {
    el.innerHTML = `<div class="dv-card-body"><div class="dv-tile" data-type="focus">${tileSvg('focus')}</div><div class="dv-card-text"><div class="dv-card-title"></div><div class="dv-card-sub"></div><div class="dv-card-meta" hidden></div></div><span class="dv-live" aria-hidden="true"></span></div>`;
  } else {
    el.innerHTML = `<div class="dv-card-body"><div class="dv-tile" data-type="note">${tileSvg('note')}</div><div class="dv-card-text"><div class="dv-card-title"></div><p class="dv-note-text"></p></div></div>`;
  }
  return el;
}

function fillCard(el, entry, now) {
  if (entry.kind === 'item') {
    const { item } = entry;
    const tile = el.querySelector('.dv-tile');
    if (tile.dataset.type !== item.type) { tile.dataset.type = item.type; tile.innerHTML = tileSvg(item.type); }
    setText(el.querySelector('.dv-card-title'), item.title);
    const sub = el.querySelector('.dv-card-sub');
    setText(sub, item.subtitle);
    sub.hidden = !item.subtitle.trim();
    const urgent = isUrgent(entry, now);
    el.dataset.urgent = urgent ? 'true' : 'false';
    el.dataset.module = entry.module;
    el.classList.toggle('is-reminder', Boolean(item.spokenReminder && !item.reminderTriggered));
    return;
  }
  if (entry.kind === 'focus') {
    const { mod } = entry;
    setText(el.querySelector('.dv-card-title'), mod.title.trim() || MODULE_META.focus.label);
    const sub = el.querySelector('.dv-card-sub');
    setText(sub, mod.subtitle);
    sub.hidden = !mod.subtitle.trim();
    const flags = [mod.notificationsBlocked ? 'Notifications blocked' : '', musicLabel(mod)].filter(Boolean);
    const metaEl = el.querySelector('.dv-card-meta');
    setText(metaEl, flags.join(' · '));
    metaEl.hidden = flags.length === 0;
    el.classList.toggle('is-music', Boolean(mod.currentTrackId));
    return;
  }
  setText(el.querySelector('.dv-card-title'), entry.mod.title.trim() || MODULE_META.note.label);
  setText(el.querySelector('.dv-note-text'), entry.mod.text.trim());
}

// ---------------------------------------------------------------- swipe to complete
function attachSwipe(el, onComplete) {
  let pid = null;
  let startX = 0;
  let startY = 0;
  let dx = 0;
  let active = false;
  let captured = false;
  const threshold = () => Math.max(SWIPE_MIN_PX, el.offsetWidth * SWIPE_RATIO);
  const reset = () => {
    el.classList.remove('is-touching', 'is-swiping', 'is-past');
    el.style.setProperty('--dx', '0px');
    el.style.setProperty('--p', 0);
  };
  el.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || el.classList.contains('is-done') || el.classList.contains('is-leaving')) return;
    pid = e.pointerId; startX = e.clientX; startY = e.clientY; dx = 0; active = true; captured = false;
    el.classList.add('is-touching');
  });
  el.addEventListener('pointermove', (e) => {
    if (!active || e.pointerId !== pid) return;
    const mx = e.clientX - startX;
    const my = e.clientY - startY;
    if (!captured) {
      if (Math.abs(mx) < 6 && Math.abs(my) < 6) return;           // a tap, not a swipe
      if (Math.abs(my) > Math.abs(mx)) { active = false; el.classList.remove('is-touching'); return; } // vertical: ignore
      captured = true;
      try { el.setPointerCapture(pid); } catch { /* ignore */ }
      el.classList.add('is-swiping');
    }
    dx = mx > 0 ? mx : mx * 0.25;                                   // rightwards only; left has resistance
    const p = Math.min(1, Math.max(0, dx / threshold()));
    el.style.setProperty('--dx', `${dx}px`);
    el.style.setProperty('--p', p.toFixed(3));
    el.classList.toggle('is-past', dx >= threshold());
  });
  const end = (e) => {
    if (!active || e.pointerId !== pid) return;
    active = false;
    el.classList.remove('is-touching', 'is-swiping');
    if (captured && dx >= threshold()) {
      el.classList.add('is-done');
      el.classList.remove('is-past');
      el.style.setProperty('--dx', `${el.offsetWidth + 48}px`);
      el.style.setProperty('--p', 1);
      Promise.resolve(onComplete()).catch(() => { el.classList.remove('is-done'); reset(); });
    } else reset();
  };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);
}

export function createDeviceRenderer(root, { preview = false, debug = false } = {}) {
  root.classList.add('attn-device');
  root.classList.toggle('is-preview', preview);
  root.classList.toggle('is-debug', debug);
  root.innerHTML = SKELETON;
  const q = (sel) => root.querySelector(sel);
  const els = {
    stack: q('.dv-stack'), empty: q('.dv-empty'), face: q('.dv-face'), count: q('.dv-heading-count'), heading: q('.dv-heading'),
    digits: q('.dv-time-digits'), period: q('.dv-time-period'), date: q('.dv-date'),
    install: q('.dv-install'), player: q('.dv-player'), playerFrame: q('.dv-player-frame'), playerStart: q('.dv-player-start'),
    facemode: q('.dv-facemode'), bigface: q('.dv-bigface'), fmWho: q('.dv-facemode-who'), fmLine: q('.dv-facemode-line'), fmSub: q('.dv-facemode-sub'), fmAction: q('.dv-facemode-action'), fmHint: q('.dv-facemode-hint'),
    typebox: q('.dv-typebox'), typeInput: q('.dv-typebox-input'), typeToggle: q('.dv-type-toggle'),
    setup: q('.dv-setup'), setupText: q('.dv-setup-text'),
  };
  let firstRender = true;
  let lastState = null;
  let override = null;              // assistant-driven expression, or null for auto (happy)
  let reactTimer = null;
  let installHandler = null;
  let highlightTimer = null;
  const handlers = { talk: [], faceTap: [], submitText: [], enable: [], update: [], startAudio: [], complete: [] };
  let assistantState = 'idle';
  let hideTimer = null;
  const emit = (event, ...args) => handlers[event].map((fn) => fn(...args));

  const applyExpression = () => { els.face.dataset.expression = override || 'happy'; };

  /** Something new arrived: a small "oh!" then back to the smile. */
  function react() {
    if (override) return;
    els.face.dataset.expression = 'surprised';
    clearTimeout(reactTimer);
    reactTimer = setTimeout(() => { reactTimer = null; applyExpression(); }, REACT_MS);
  }

  function applyTheme(theme) {
    const t = THEMES.includes(theme) ? theme : 'sky';
    if (root.dataset.theme !== t) root.dataset.theme = t;
    if (!preview && document.documentElement.dataset.theme !== t) {
      document.documentElement.dataset.theme = t;
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', getComputedStyle(root).getPropertyValue('--theme-primary').trim() || '#25B4F5');
    }
  }

  function update(state) {
    applyTheme(state.device?.theme);
    const now = Date.now();
    const { entries, total } = stackEntries(state);
    const shown = entries; // every card is reachable: the stack scrolls
    let added = 0;
    for (const el of liveChildren(els.stack)) if (!shown.some((e) => e.key === el.dataset.key)) leave(el);
    const desired = shown.map((entry, i) => {
      let el = findChild(els.stack, 'key', entry.key);
      if (el && el.classList.contains('is-leaving')) revive(el);
      if (!el) {
        el = createCard(entry);
        if (entry.kind === 'item' && !preview) attachSwipe(el, () => Promise.all(emit('complete', entry.item.id)));
        enter(el, added++);
      }
      el.style.setProperty('--i', i);
      fillCard(el, entry, now);
      return el;
    });
    order(els.stack, desired);
    setText(els.count, `(${total})`);
    els.heading.classList.toggle('is-zero', total === 0);
    const nothing = shown.length === 0;
    els.empty.hidden = !nothing;
    els.stack.hidden = nothing;
    if (!firstRender && added > 0) react();
    else if (!reactTimer) applyExpression();
    firstRender = false;

    // Deep Focus audio: the visible player takes the mascot's place while a track is requested/playing
    const focus = state.modules.focus;
    const requested = Boolean(focus?.enabled && focus.currentTrackId);
    els.player.hidden = !requested;
    root.classList.toggle('is-playing', requested);
    lastState = state;
    emit('update', state);
  }

  /** The persistent YouTube player slot (always present; hidden until a track is requested, so the player can be created early). */
  function focusMount() { return els.playerFrame; }
  /** What the player really reports on this device: drives the Focus card label and the one-tap fallback. */
  function setAudioState(audio) {
    deviceAudio = audio;
    els.playerStart.hidden = audio !== 'blocked';
    const card = els.stack.querySelector('.dv-card[data-key="focus"]');
    if (card && lastState) fillCard(card, { key: 'focus', kind: 'focus', mod: lastState.modules.focus }, new Date());
  }
  const setAudioBlocked = (blocked) => setAudioState(blocked ? 'blocked' : null);

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

  /** Connection is infrastructure: no badge. The status lives on the root for debugging only. */
  function setConnection(status) { root.dataset.conn = status; }

  function setInstall(visible, handler) {
    if (installHandler) els.install.removeEventListener('click', installHandler);
    installHandler = visible ? handler : null;
    if (installHandler) els.install.addEventListener('click', installHandler);
    els.install.hidden = !visible;
  }

  function setOrientation(portrait) { root.classList.toggle('is-portrait', Boolean(portrait)); }

  // ---------------------------------------------------------------- voice layer (state machine)
  const FACE_FOR = { listening: 'listening', processing: 'thinking', speaking: 'speaking', clarifying: 'puzzled', error: 'surprised' };
  const HINT_FOR = { listening: 'Tap anywhere to cancel', processing: 'Tap to cancel', speaking: 'Tap to skip', clarifying: '', error: '' };
  const FACE_STATES = ['listening', 'processing', 'speaking', 'clarifying', 'error'];

  /** Render one assistant lifecycle state. Idle and success show the dashboard; the rest bring the face forward. */
  function setAssistantState(state, { text = '', transcript = '', action = null } = {}) {
    assistantState = state;
    root.dataset.assistant = state;
    const forward = FACE_STATES.includes(state);
    clearTimeout(hideTimer);
    if (forward) {
      els.facemode.hidden = false;
      els.bigface.dataset.expression = FACE_FOR[state];
      setText(els.fmLine, text);
      els.fmLine.classList.toggle('is-empty', !text);
      setText(els.fmSub, transcript ? '“' + transcript + '”' : '');
      els.fmAction.hidden = !action;
      setText(els.fmAction, action || '');
      setText(els.fmHint, HINT_FOR[state]);
      els.fmWho.hidden = !text;
      requestAnimationFrame(() => els.facemode.classList.add('is-visible'));
    } else {
      els.facemode.classList.remove('is-visible');
      hideTimer = setTimeout(() => { if (!FACE_STATES.includes(assistantState)) els.facemode.hidden = true; }, 460);
      if (state === 'success') { setExpression('happy'); setTimeout(() => { if (assistantState === 'success' || assistantState === 'idle') setExpression('auto'); }, REACT_MS); }
    }
    root.classList.toggle('is-voice', forward);
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
      ...itemIds.map((id) => root.querySelector(`.dv-card[data-id="${CSS.escape(id)}"]`)),
      ...modules.map((m) => root.querySelector(`.dv-card[data-key="${m}"]`)),
    ].filter(Boolean);
    targets.forEach((el) => el.classList.add('is-highlight'));
    highlightTimer = setTimeout(() => targets.forEach((el) => el.classList.remove('is-highlight')), HIGHLIGHT_MS);
  }

  function setTypeBox(open) {
    els.typebox.hidden = !open;
    root.classList.toggle('is-typing', open);
    if (open) setTimeout(() => els.typeInput.focus(), 50);
    else els.typeInput.blur();
  }

  function setAssistantName(name) {
    setText(els.fmWho, name);
    els.typeInput.placeholder = `Ask ${name}…`;
  }

  /** One-time browser requirements (microphone permission, speech unlock). null hides the pill. */
  function setSetup(setup) {
    if (!setup) { els.setup.hidden = true; return; }
    setText(els.setupText, setup.action ? `${setup.text} · ${setup.action}` : setup.text);
    els.setup.classList.toggle('is-subtle', Boolean(setup.subtle));
    els.setup.disabled = !setup.action;
    els.setup.hidden = false;
  }

  function on(event, fn) { handlers[event]?.push(fn); return () => { handlers[event] = handlers[event].filter((f) => f !== fn); }; }

  if (!preview) {
    els.setup.addEventListener('click', () => emit('enable'));
    els.face.addEventListener('click', () => emit('talk'));
    if (debug) els.typeToggle.hidden = false;
    els.facemode.addEventListener('click', (e) => { if (e.target !== els.fmAction) emit('faceTap', assistantState, false); });
    els.fmAction.addEventListener('click', () => emit('faceTap', assistantState, true));
    els.typeToggle.addEventListener('click', () => setTypeBox(els.typebox.hidden));
    els.typebox.addEventListener('submit', (e) => { e.preventDefault(); const text = els.typeInput.value.trim(); if (!text) return; els.typeInput.value = ''; emit('submitText', text); });
    els.playerStart.addEventListener('click', () => emit('startAudio'));
    els.typeInput.addEventListener('keydown', (e) => { if (e.key === 'Escape') setTypeBox(false); });
  }

  return { root, update, setClock, setConnection, setInstall, setOrientation, setAssistantState, setExpression, setHighlights, setTypeBox, setAssistantName, setSetup, focusMount, setAudioState, setAudioBlocked, on, get assistantState() { return assistantState; } };
}
