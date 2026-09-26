/**
 * attn — shared state model.
 *
 * Imported by BOTH the Node server (server.js) and the browser (control.js,
 * device.js), so it stays dependency-free and side-effect-free.
 *
 * It defines:
 *   - DEFAULT_STATE   what a fresh attn starts with
 *   - MODULE_META     the modules the device can show
 *   - SOURCE_META     the (demo-only) sources the Control Centre offers
 *   - normalizeState  coerces ANY input (missing, partial, malformed) into a
 *                     valid state — the reason neither side can crash on bad data
 *
 * Later phases should extend this shape rather than invent a new one:
 * real integrations fill `modules.calendar.items` instead of manual input, and
 * voice requests end up mutating the same object through the server.
 */

export const STATE_VERSION = 1;

/** Small limits keep the state tiny and the device readable. */
export const LIMITS = { items: 8, title: 60, subtitle: 60, moduleTitle: 40, note: 240, name: 24 };

export const THEMES = ['sky'];

/** Item types map to a tile glyph + colour (see icons.js / tokens.css). */
export const ITEM_TYPES = ['calendar', 'mail', 'task', 'focus', 'note', 'manual'];

/** Modules the device can display, in default order. `kind` decides the editor + renderer. */
export const MODULE_META = {
  attention: { label: 'Pay attention to', kind: 'list',  type: 'task',     hint: 'The few things that matter right now' },
  calendar:  { label: 'Upcoming',         kind: 'list',  type: 'calendar', hint: 'Next events from your calendar' },
  mail:      { label: 'Important email',  kind: 'list',  type: 'mail',     hint: 'Mail that needs a reply' },
  focus:     { label: 'Focus mode',       kind: 'focus', type: 'focus',    hint: 'One block of deep work' },
  note:      { label: 'Quick note',       kind: 'note',  type: 'note',     hint: 'Free text, straight to the device' },
};
export const MODULE_IDS = Object.keys(MODULE_META);

/**
 * Sources are hard-coded for Phase 1: "Connect" only flips a flag (no OAuth).
 * `seeds` adds demo content to a module the first time a source is connected,
 * so enabling that module on the device has something to show.
 */
export const SOURCE_META = {
  calendar: { name: 'Google Calendar', description: 'Meetings and events', type: 'calendar',
    seeds: { module: 'calendar', items: [
      { title: 'Design review', subtitle: '2:30 PM', type: 'calendar' },
      { title: 'Team stand-up', subtitle: 'Tomorrow, 9:00 AM', type: 'calendar' },
    ] } },
  gmail:    { name: 'Gmail', description: 'Email that needs a reply', type: 'mail',
    seeds: { module: 'mail', items: [
      { title: 'Reply to David', subtitle: 'Before 4 PM', type: 'mail' },
      { title: 'Invoice from Studio', subtitle: 'Due Friday', type: 'mail' },
    ] } },
  focus:    { name: 'Focus / YouTube', description: 'Music and focus sessions', type: 'focus', seeds: null },
  tasks:    { name: 'Tasks', description: 'To-dos and reminders', type: 'task',
    seeds: { module: 'attention', items: [
      { title: 'Send the deck', subtitle: 'Today', type: 'task' },
    ] } },
  manual:   { name: 'Manual input', description: 'Type anything yourself', type: 'manual', seeds: null, always: true },
};
export const SOURCE_IDS = Object.keys(SOURCE_META);

export const DEFAULT_STATE = {
  version: STATE_VERSION,
  revision: 0,
  updatedAt: null,
  device: { name: 'attn', theme: 'sky' },
  sources: {
    calendar: { connected: false },
    gmail: { connected: false },
    focus: { connected: false },
    tasks: { connected: false },
    manual: { connected: true },
  },
  moduleOrder: ['attention', 'calendar', 'mail', 'focus', 'note'],
  modules: {
    attention: { enabled: true, title: 'Pay attention to', items: [
      { id: 'seed-1', title: 'Design review', subtitle: '2:30 PM', type: 'calendar' },
      { id: 'seed-2', title: 'Reply to Sarah', subtitle: 'Important email', type: 'mail' },
    ] },
    calendar: { enabled: false, title: 'Upcoming', items: [] },
    mail: { enabled: false, title: 'Important email', items: [] },
    focus: { enabled: false, title: 'Focus mode', subtitle: 'Deep work' },
    note: { enabled: false, title: 'Quick note', text: '' },
  },
};

// ---------- helpers ----------
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const str = (v, fallback, max) => (typeof v === 'string' ? v.slice(0, max) : fallback);
const oneOf = (v, list, fallback) => (list.includes(v) ? v : fallback);
const nonNegInt = (v, fallback) => (Number.isInteger(v) && v >= 0 ? v : fallback);

export function newId() {
  return 'i' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function createItem({ title = '', subtitle = '', type = 'manual' } = {}) {
  return { id: newId(), title, subtitle, type: oneOf(type, ITEM_TYPES, 'manual') };
}

function normalizeItem(raw) {
  if (typeof raw === 'string') raw = { title: raw };
  if (!isObj(raw)) return null;
  return {
    id: str(raw.id, '', 40) || newId(),
    title: str(raw.title, '', LIMITS.title),
    subtitle: str(raw.subtitle, '', LIMITS.subtitle),
    type: oneOf(raw.type, ITEM_TYPES, 'manual'),
  };
}

/**
 * Turn anything into a valid state object. Unknown fields are dropped, missing
 * ones get defaults, strings are capped. Always returns a NEW object.
 */
export function normalizeState(input) {
  const src = isObj(input) ? input : {};
  const out = {
    version: STATE_VERSION,
    revision: nonNegInt(src.revision, 0),
    updatedAt: typeof src.updatedAt === 'string' ? src.updatedAt : null,
    device: {
      name: str(src.device?.name, 'attn', LIMITS.name) || 'attn',
      theme: oneOf(src.device?.theme, THEMES, 'sky'),
    },
    sources: {},
    moduleOrder: [],
    modules: {},
  };

  for (const id of SOURCE_IDS) {
    const connected = Boolean(src.sources?.[id]?.connected) || Boolean(SOURCE_META[id].always);
    out.sources[id] = { connected };
  }

  for (const id of MODULE_IDS) {
    const meta = MODULE_META[id];
    const m = isObj(src.modules?.[id]) ? src.modules[id] : {};
    const mod = { enabled: Boolean(m.enabled), title: str(m.title, meta.label, LIMITS.moduleTitle) };
    if (meta.kind === 'list') {
      mod.items = (Array.isArray(m.items) ? m.items : []).map(normalizeItem).filter(Boolean).slice(0, LIMITS.items);
    } else if (meta.kind === 'focus') {
      mod.subtitle = str(m.subtitle, '', LIMITS.subtitle);
    } else if (meta.kind === 'note') {
      mod.text = str(m.text, '', LIMITS.note);
    }
    out.modules[id] = mod;
  }

  const requested = (Array.isArray(src.moduleOrder) ? src.moduleOrder : []).filter((id) => MODULE_IDS.includes(id));
  out.moduleOrder = [...new Set([...requested, ...MODULE_IDS])];
  return out;
}

/** True when a module has something worth drawing on the device. */
export function moduleHasContent(id, mod) {
  const kind = MODULE_META[id]?.kind;
  if (kind === 'list') return mod.items.some((it) => it.title.trim());
  if (kind === 'focus') return true;
  if (kind === 'note') return mod.text.trim().length > 0;
  return false;
}
