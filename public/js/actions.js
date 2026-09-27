/**
 * attn — the ONE place state is mutated.
 *
 * Every change to the shared state goes through these functions, whether it
 * comes from a Control Centre click or from the voice assistant. They are plain,
 * dependency-free and isomorphic (browser + Node), mutate the state object they
 * are given, and return a small result: { ok, message, itemId?, module? }.
 *
 * ASSISTANT_ACTIONS is the whitelist the AI is allowed to request. The model
 * only ever names one of these with parameters; the server validates and runs
 * it here. The AI never touches state JSON directly.
 */
import { MODULE_META, MODULE_IDS, ITEM_TYPES, LIMITS, SOURCE_META, createItem } from './state.js';

export const LIST_MODULES = MODULE_IDS.filter((id) => MODULE_META[id].kind === 'list');

const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/** Find an item by id across all list modules. */
export function findItem(state, itemId) {
  for (const module of LIST_MODULES) {
    const index = state.modules[module].items.findIndex((it) => it.id === itemId);
    if (index !== -1) return { module, index, item: state.modules[module].items[index] };
  }
  return null;
}

export function addItem(state, { module = 'attention', title = '', subtitle = '', type, at = null } = {}) {
  if (!LIST_MODULES.includes(module)) return { ok: false, message: `There is no "${module}" list.` };
  const mod = state.modules[module];
  if (mod.items.length >= LIMITS.items) return { ok: false, message: `${mod.title || MODULE_META[module].label} is full (${LIMITS.items} items).` };
  const item = createItem({ title: str(title, LIMITS.title), subtitle: str(subtitle, LIMITS.subtitle), type: ITEM_TYPES.includes(type) ? type : MODULE_META[module].type });
  if (at) item.at = at;
  mod.items.push(item);
  mod.enabled = true; // something new to look at should be visible
  return { ok: true, message: `Added "${item.title || 'Untitled'}"${item.subtitle ? ` (${item.subtitle})` : ''} to ${mod.title || MODULE_META[module].label}.`, itemId: item.id, module };
}

export function updateItem(state, { itemId, title, subtitle, type, at, module } = {}) {
  const found = findItem(state, itemId);
  if (!found) return { ok: false, message: "I couldn't find that item any more." };
  const { item } = found;
  if (typeof title === 'string' && title.trim()) item.title = str(title, LIMITS.title);
  if (typeof subtitle === 'string') item.subtitle = str(subtitle, LIMITS.subtitle);
  if (at !== undefined) item.at = at || null;
  if (ITEM_TYPES.includes(type)) item.type = type;
  let target = found.module;
  if (module && module !== found.module && LIST_MODULES.includes(module)) {
    state.modules[found.module].items.splice(found.index, 1);
    state.modules[module].items.push(item);
    state.modules[module].enabled = true;
    target = module;
  }
  return { ok: true, message: `Updated "${item.title}"${item.subtitle ? ` to ${item.subtitle}` : ''}.`, itemId: item.id, module: target };
}

export function removeItem(state, { itemId, module, index } = {}) {
  const found = itemId
    ? findItem(state, itemId)
    : (LIST_MODULES.includes(module) && state.modules[module].items[index] ? { module, index, item: state.modules[module].items[index] } : null);
  if (!found) return { ok: false, message: "I couldn't find that item any more." };
  state.modules[found.module].items.splice(found.index, 1);
  return { ok: true, message: `Cleared "${found.item.title}".`, itemId: found.item.id, module: found.module };
}

export function setModuleVisibility(state, { module, enabled } = {}) {
  if (!MODULE_IDS.includes(module)) return { ok: false, message: `There is no "${module}" module.` };
  state.modules[module].enabled = Boolean(enabled);
  return { ok: true, message: `${enabled ? 'Showing' : 'Hid'} ${state.modules[module].title || MODULE_META[module].label}.`, module };
}

export function setFocus(state, { enabled = true, title, subtitle } = {}) {
  const focus = state.modules.focus;
  focus.enabled = Boolean(enabled);
  if (typeof title === 'string' && title.trim()) focus.title = str(title, LIMITS.moduleTitle);
  if (typeof subtitle === 'string') focus.subtitle = str(subtitle, LIMITS.subtitle);
  return { ok: true, message: enabled ? `Focus mode is on${focus.subtitle ? `: ${focus.subtitle}` : ''}.` : 'Focus mode is off.', module: 'focus' };
}

export function setNote(state, { text = '', append = false } = {}) {
  const note = state.modules.note;
  const next = append && note.text.trim() ? `${note.text.trim()}\n${text.trim()}` : text;
  note.text = str(next, LIMITS.note);
  note.enabled = true;
  return { ok: true, message: note.text ? 'Note updated.' : 'Note cleared.', module: 'note' };
}

export function moveModule(state, { module, direction } = {}) {
  const order = state.moduleOrder;
  const from = order.indexOf(module);
  const to = from + Number(direction);
  if (from === -1 || to < 0 || to >= order.length) return { ok: false, message: 'Cannot move further.' };
  [order[from], order[to]] = [order[to], order[from]];
  return { ok: true, message: 'Moved.', module };
}

/** Demo-only: flip a source flag and seed its module the first time. */
export function connectSource(state, id) {
  const meta = SOURCE_META[id];
  if (!meta) return { ok: false, message: 'Unknown source.' };
  state.sources[id].connected = true;
  let seeded = 0;
  if (meta.seeds) {
    const mod = state.modules[meta.seeds.module];
    if (mod.items.every((it) => !it.title.trim())) {
      mod.items = meta.seeds.items.map(createItem);
      seeded = mod.items.length;
    }
  }
  return { ok: true, message: `${meta.name} connected.`, seeded, module: meta.seeds?.module };
}

export function disconnectSource(state, id) {
  if (!SOURCE_META[id] || SOURCE_META[id].always) return { ok: false, message: 'Cannot disconnect.' };
  state.sources[id].connected = false;
  return { ok: true, message: `${SOURCE_META[id].name} disconnected.` };
}

/**
 * What the assistant may do. `params` documents the parameters for the model;
 * the server validates them (see lib/assistant.js) before calling `run`.
 * Time parameters arrive as the user's local wall time "YYYY-MM-DDTHH:mm" and
 * are resolved to instants + display labels by the server before `run`.
 */
export const ASSISTANT_ACTIONS = {
  add_item: {
    description: 'Add a reminder, task, event or email-to-handle to one of the lists shown on the device. Use module "attention" for reminders and to-dos (the "Pay attention to" list), "calendar" for scheduled events/meetings ("Upcoming"), "mail" for emails to reply to or read ("Important email"). The module becomes visible automatically.',
    params: { module: 'attention | calendar | mail', title: 'short title, sentence case, no trailing period', at: 'optional local time YYYY-MM-DDTHH:mm', subtitle: 'optional short detail used only when there is no time (e.g. "Before lunch")', type: 'optional tile glyph: calendar | mail | task | focus | note | manual' },
    run: addItem,
  },
  update_item: {
    description: 'Change an existing item (title, time, detail) by its id — for corrections like "actually make that 3:30" or "call it design sync". Prefer the most recently created item when the user does not name one.',
    params: { itemId: 'id of an existing item', title: 'optional new title', at: 'optional new local time YYYY-MM-DDTHH:mm', subtitle: 'optional new detail (only when no time)', module: 'optional: move to attention | calendar | mail' },
    run: updateItem,
  },
  remove_item: {
    description: 'Remove an item by id — when the user says it is done, reviewed, handled, or should be cleared/deleted.',
    params: { itemId: 'id of an existing item' },
    run: removeItem,
  },
  set_module_visibility: {
    description: 'Show or hide a whole module on the device: attention ("Pay attention to"), calendar ("Upcoming"), mail ("Important email"), focus ("Focus mode"), note ("Quick note").',
    params: { module: 'attention | calendar | mail | focus | note', enabled: 'true to show, false to hide' },
    run: setModuleVisibility,
  },
  set_focus: {
    description: 'Turn the Focus mode card on or off and describe the focus block. Cannot play audio: if the user asks for music or sounds, set focus with a matching label and say plainly that attn cannot play music yet.',
    params: { enabled: 'true or false', label: 'what the focus is for, e.g. "Deep work" or "Frequency music"', at: 'optional local start time YYYY-MM-DDTHH:mm', durationMinutes: 'optional length in minutes (default 60 when a start time is given)' },
    run: setFocus,
  },
  set_note: {
    description: 'Write free text on the Quick note card (replace, or append when the user adds to it).',
    params: { text: 'the note text, max 240 characters', append: 'true to add to the existing note instead of replacing it' },
    run: setNote,
  },
};
export const ASSISTANT_ACTION_TYPES = Object.keys(ASSISTANT_ACTIONS);
