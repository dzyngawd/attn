/**
 * attn — time helpers for the assistant (server only).
 *
 * The model answers in the USER's local wall-clock time ("2026-09-26T14:30",
 * no offset). These helpers turn that into a real instant using the browser's
 * IANA timezone, and format instants back into the short human labels the
 * device already uses ("2:30 PM", "Tomorrow, 9:00 AM"). No date library:
 * Node's Intl is enough.
 */

const LOCAL_ISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/;

export function isValidTimeZone(tz) {
  try { new Intl.DateTimeFormat('en-US', { timeZone: tz }); return true; } catch { return false; }
}

export function isValidLocale(locale) {
  try { return Intl.DateTimeFormat.supportedLocalesOf([locale]).length > 0; } catch { return false; }
}

/** Wall-clock parts of `date` in `timeZone`. */
function partsIn(date, timeZone) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const out = {};
  for (const p of fmt.formatToParts(date)) if (p.type !== 'literal') out[p.type] = Number(p.value);
  if (out.hour === 24) out.hour = 0;
  return out;
}

/** Minutes east of UTC for `timeZone` at the instant `date`. */
export function zoneOffsetMinutes(date, timeZone) {
  const p = partsIn(date, timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return Math.round((asUtc - date.getTime()) / 60000);
}

/** "YYYY-MM-DDTHH:mm" local wall time in `timeZone` → Date (instant), or null. */
export function localToInstant(localIso, timeZone) {
  const m = LOCAL_ISO.exec(String(localIso || '').trim());
  if (!m) return null;
  const [, y, mo, d, h, mi, s] = m.map(Number);
  if (mo < 1 || mo > 12 || d < 1 || d > 31 || h > 23 || mi > 59) return null;
  const guess = Date.UTC(y, mo - 1, d, h, mi, s || 0);
  let t = guess - zoneOffsetMinutes(new Date(guess), timeZone) * 60000;
  const off2 = zoneOffsetMinutes(new Date(t), timeZone);
  t = guess - off2 * 60000; // second pass settles DST edges
  return new Date(t);
}

/** Date (instant) → "YYYY-MM-DDTHH:mm" local wall time in `timeZone`. */
export function instantToLocal(date, timeZone) {
  const p = partsIn(date, timeZone);
  const pad = (n) => String(n).padStart(2, '0');
  return `${p.year}-${pad(p.month)}-${pad(p.day)}T${pad(p.hour)}:${pad(p.minute)}`;
}

export function localDateKey(date, timeZone) {
  return instantToLocal(date, timeZone).slice(0, 10);
}

/** Short device label: "2:30 PM" · "Tomorrow, 9:00 AM" · "Mon, 9:00 AM" · "Oct 3, 9:00 AM". */
export function formatWhen(date, { timeZone, locale = 'en-US', now = new Date() } = {}) {
  const time = new Intl.DateTimeFormat(locale, { timeZone, hour: 'numeric', minute: '2-digit' }).format(date);
  const day = localDateKey(date, timeZone);
  const today = localDateKey(now, timeZone);
  const tomorrow = localDateKey(new Date(now.getTime() + 86400000), timeZone);
  const yesterday = localDateKey(new Date(now.getTime() - 86400000), timeZone);
  if (day === today) return time;
  if (day === tomorrow) return `Tomorrow, ${time}`;
  if (day === yesterday) return `Yesterday, ${time}`;
  const diffDays = Math.round((Date.UTC(...day.split('-').map(Number)) - Date.UTC(...today.split('-').map(Number))) / 86400000);
  if (diffDays > 0 && diffDays < 7) {
    return `${new Intl.DateTimeFormat(locale, { timeZone, weekday: 'short' }).format(date)}, ${time}`;
  }
  return `${new Intl.DateTimeFormat(locale, { timeZone, month: 'short', day: 'numeric' }).format(date)}, ${time}`;
}

/** Human line for the model's context: "Saturday, September 26, 2026 at 4:35 PM". */
export function describeNow(date, { timeZone, locale = 'en-US' }) {
  return new Intl.DateTimeFormat(locale, {
    timeZone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit',
  }).format(date);
}

/** A short time range label: "10:00–11:00 AM" (locale-formatted). */
export function formatRange(start, minutes, { timeZone, locale = 'en-US', now = new Date() } = {}) {
  const end = new Date(start.getTime() + minutes * 60000);
  const t = (d) => new Intl.DateTimeFormat(locale, { timeZone, hour: 'numeric', minute: '2-digit' }).format(d);
  return `${formatWhen(start, { timeZone, locale, now })}–${t(end)}`;
}
