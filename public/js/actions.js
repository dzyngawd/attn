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
import { MODULE_META, MODULE_IDS, ITEM_TYPES, LIMITS, SOURCE_META, THEMES, COMPLETION_METHODS, createItem } from './state.js';

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

export function addItem(state, { module = 'attention', title = '', subtitle = '', type, at = null, spokenReminder = false } = {}) {
  if (!LIST_MODULES.includes(module)) return { ok: false, message: `There is no "${module}" list.` };
  const mod = state.modules[module];
  if (mod.items.length >= LIMITS.items) return { ok: false, message: `${mod.title || MODULE_META[module].label} is full (${LIMITS.items} items).` };
  const item = createItem({ title: str(title, LIMITS.title), subtitle: str(subtitle, LIMITS.subtitle), type: ITEM_TYPES.includes(type) ? type : MODULE_META[module].type, spokenReminder: Boolean(spokenReminder && at) });
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
  if (at !== undefined) { if (at && at !== item.at) item.reminderTriggered = false; item.at = at || null; if (!item.at) item.spokenReminder = false; }
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

/**
 * Mark an item DONE: it leaves its list and is archived in state.completed with
 * when and how it was finished. Every completion path (a swipe on the device,
 * Andrew, the Control Centre) comes through here. removeItem() is the true delete.
 */
export function completeItem(state, { itemId, method = 'control', module, index } = {}) {
  const found = itemId
    ? findItem(state, itemId)
    : (LIST_MODULES.includes(module) && state.modules[module].items[index] ? { module, index, item: state.modules[module].items[index] } : null);
  if (!found) return { ok: false, message: "I couldn't find that item any more." };
  const { item } = found;
  state.modules[found.module].items.splice(found.index, 1);
  const record = {
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
    type: item.type,
    module: found.module,
    moduleLabel: state.modules[found.module].title || MODULE_META[found.module].label,
    source: item.type,
    at: item.at || null,
    createdAt: item.createdAt || null,
    completedAt: new Date().toISOString(),
    completionMethod: COMPLETION_METHODS.includes(method) ? method : 'control',
  };
  if (!Array.isArray(state.completed)) state.completed = [];
  state.completed = [record, ...state.completed.filter((c) => c.id !== record.id)].slice(0, LIMITS.completed);
  return { ok: true, message: `Done: "${item.title}".`, itemId: item.id, module: found.module, completed: record };
}

/** True deletion: the item is gone and does not appear under Completed. */
export function removeItem(state, { itemId, module, index } = {}) {
  const found = itemId
    ? findItem(state, itemId)
    : (LIST_MODULES.includes(module) && state.modules[module].items[index] ? { module, index, item: state.modules[module].items[index] } : null);
  if (!found) return { ok: false, message: "I couldn't find that item any more." };
  state.modules[found.module].items.splice(found.index, 1);
  return { ok: true, message: `Cleared "${found.item.title}".`, itemId: found.item.id, module: found.module };
}

export function setTheme(state, { theme } = {}) {
  if (!THEMES.includes(theme)) return { ok: false, message: 'Unknown theme.' };
  state.device.theme = theme;
  return { ok: true, message: `Theme: ${theme}.` };
}

export function setModuleVisibility(state, { module, enabled } = {}) {
  if (!MODULE_IDS.includes(module)) return { ok: false, message: `There is no "${module}" module.` };
  state.modules[module].enabled = Boolean(enabled);
  return { ok: true, message: `${enabled ? 'Showing' : 'Hid'} ${state.modules[module].title || MODULE_META[module].label}.`, module };
}

export function setFocus(state, { enabled = true, title, subtitle, notificationsBlocked } = {}) {
  const focus = state.modules.focus;
  focus.enabled = Boolean(enabled);
  if (typeof notificationsBlocked === 'boolean') focus.notificationsBlocked = notificationsBlocked; // presentation only
  if (focus.enabled && !focus.startedAt) focus.startedAt = new Date().toISOString();
  if (!focus.enabled) { focus.musicPlaying = false; focus.currentTrackId = null; focus.notificationsBlocked = false; focus.startedAt = null; }
  if (typeof title === 'string' && title.trim()) focus.title = str(title, LIMITS.moduleTitle);
  if (typeof subtitle === 'string') focus.subtitle = str(subtitle, LIMITS.subtitle);
  // attn cannot play audio: say so whenever the focus block is about music, even in the plain fallback wording
  const audio = /music|audio|sound|playlist|song|frequenc|noise|beats/i.test(focus.subtitle);
  return { ok: true, message: enabled ? `Focus mode is on${focus.subtitle ? `: ${focus.subtitle}` : ''}.${audio ? " I can't play audio yet." : ''}` : 'Focus mode is off.', module: 'focus' };
}

export function setNote(state, { text = '', append = false } = {}) {
  const note = state.modules.note;
  const next = append && note.text.trim() ? `${note.text.trim()}\n${text.trim()}` : text;
  note.text = str(next, LIMITS.note);
  note.enabled = true;
  return { ok: true, message: note.text ? 'Note updated.' : 'Note cleared.', module: 'note' };
}

/** A reminder Andrew will SAY when its time comes (only while the device is open). */
export function scheduleReminder(state, { title = '', at = null, subtitle = '' } = {}) {
  if (!at) return { ok: false, message: 'A spoken reminder needs a time.' };
  return addItem(state, { module: 'attention', title, subtitle, type: 'task', at, spokenReminder: true });
}

/** Device-side scheduler: a due reminder is marked once so it can never fire twice. */
export function markReminderTriggered(state, { itemId } = {}) {
  const found = findItem(state, itemId);
  if (!found) return { ok: false, message: 'Reminder not found.' };
  found.item.reminderTriggered = true;
  return { ok: true, message: `Reminder "${found.item.title}" spoken.`, itemId: found.item.id, module: found.module };
}

/** Demo focus audio: the device plays the configured YouTube track; `trackId` is chosen by the caller. */
export function startFocusMusic(state, { trackId } = {}) {
  const focus = state.modules.focus;
  if (!trackId) return { ok: false, message: 'No focus track configured.' };
  focus.enabled = true;
  focus.musicPlaying = true;
  focus.currentTrackId = String(trackId).slice(0, 20);
  if (!focus.startedAt) focus.startedAt = new Date().toISOString();
  return { ok: true, message: 'Focus audio started.', module: 'focus' };
}

export function stopFocusMusic(state) {
  const focus = state.modules.focus;
  const was = focus.musicPlaying;
  focus.musicPlaying = false;
  return { ok: true, message: was ? 'Focus audio stopped.' : 'No focus audio was playing.', module: 'focus' };
}

export function endFocusMode(state) {
  const focus = state.modules.focus;
  focus.enabled = false;
  focus.musicPlaying = false;
  focus.currentTrackId = null;
  focus.notificationsBlocked = false;
  focus.startedAt = null;
  return { ok: true, message: 'Focus mode ended.', module: 'focus' };
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
  complete_item: {
    description: 'Mark an item DONE by id — when the user says it is done, finished, handled, reviewed or sorted. The item leaves the device and is kept under Completed in the Control Centre.',
    params: { itemId: 'id of an existing item' },
    run: completeItem,
  },
  remove_item: {
    description: 'Delete an item by id, for good — only when the user explicitly wants it removed, cleared or deleted rather than done (nothing is archived).',
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
  schedule_reminder: {
    description: 'A reminder attn will SAY out loud when its time comes, while the device is open: "remind me to catch my bus in five minutes", "remind me about my meeting at 3:30". Creates an item on Pay attention to with a real due time.',
    params: { title: 'what to remind, as a short sentence case phrase without the time', dueAt: 'local time YYYY-MM-DDTHH:mm (or use inMinutes / inSeconds for relative requests)', inMinutes: 'minutes from now', inSeconds: 'seconds from now (testing)' },
    run: scheduleReminder,
  },
  start_focus_music: {
    description: 'Play a random track from the configured focus playlist (frequency music) inside the Focus card. Only after the user agreed.',
    params: {},
    run: startFocusMusic,
  },
  stop_focus_music: {
    description: 'Stop the focus music but stay in Focus mode: "stop the music", "turn that off", "that is enough music".',
    params: {},
    run: stopFocusMusic,
  },
  end_focus_mode: {
    description: 'Leave Focus mode entirely: stops any music, hides the Focus card: "end focus mode", "I am done focusing".',
    params: {},
    run: endFocusMode,
  },
};
export const ASSISTANT_ACTION_TYPES = Object.keys(ASSISTANT_ACTIONS);
