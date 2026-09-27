/**
 * attn — spoken reminder scheduler (device side).
 *
 * The state is the source of truth: any item with `at`, `spokenReminder` and
 * not yet `reminderTriggered` is a pending reminder. Instead of one timer per
 * reminder, the scheduler looks at the current state and arms ONE timer for
 * the next due one; `sync(state)` is called whenever the state changes (poll,
 * tool result, reconnect, page visible), so a refresh never loses a reminder.
 * When a reminder is due it is marked on the server first (so it can never fire
 * twice, even from two devices) and only then handed to `onDue`.
 *
 * This works only while the page is open and in the foreground: there are no
 * OS alarms or push notifications here.
 */
const MAX_DELAY_MS = 24 * 60 * 60 * 1000; // setTimeout's practical ceiling; re-armed by later syncs anyway
const LATE_GRACE_MS = 10 * 60 * 1000;     // a reminder found >10 min overdue (device was closed) is still spoken, just late

export function createReminderScheduler({ onDue, markTriggered, canFire = () => true, log = () => {} }) {
  let timer = null;
  let latest = null;
  let firing = false;
  let waitingOn = null; // reminder id we already logged a wait for (keeps the console quiet)

  const pending = (state) => (state?.moduleOrder || [])
    .flatMap((id) => (state.modules[id]?.items || []).map((it) => ({ ...it, module: id })))
    .filter((it) => it.spokenReminder && !it.reminderTriggered && it.at && !Number.isNaN(Date.parse(it.at)))
    .sort((a, b) => Date.parse(a.at) - Date.parse(b.at));

  function sync(state) {
    latest = state;
    clearTimeout(timer);
    timer = null;
    const next = pending(state)[0];
    if (!next) return;
    const delay = Date.parse(next.at) - Date.now();
    if (delay <= 0) { fire(next); return; }
    log(`next reminder "${next.title}" in ${Math.round(delay / 1000)} s`);
    timer = setTimeout(() => sync(latest), Math.min(delay, MAX_DELAY_MS));
  }

  async function fire(item) {
    if (firing) return;
    if (!canFire()) {
      if (waitingOn !== item.id) { waitingOn = item.id; log(`reminder "${item.title}" is due but the device cannot speak yet (busy or not connected) — retrying every 5 s`); }
      timer = setTimeout(() => sync(latest), 5000);
      return;
    }
    waitingOn = null;
    firing = true;
    try {
      const late = Date.now() - Date.parse(item.at);
      const marked = await markTriggered(item.id); // server-side, first
      if (marked?.state) latest = marked.state;
      log(`reminder due: "${item.title}"${late > LATE_GRACE_MS ? ` (${Math.round(late / 60000)} min late)` : ''}`);
      await onDue(item, { late });
    } catch (err) {
      log('reminder could not be spoken:', err.message);
    } finally {
      firing = false;
      setTimeout(() => sync(latest), 1500); // the marked state (or a later poll) removes it from the pending set
    }
  }

  return { sync, recheck: () => sync(latest), get pending() { return pending(latest); } };
}
