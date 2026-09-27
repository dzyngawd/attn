/**
 * attn — wake phrase handling, shared by the device (local detection, no model
 * involved) and the server (defensive stripping before interpretation).
 *
 *   splitWake('Hey Andrew, remind me to reply to Sarah', 'Andrew')
 *   → { woke: true, command: 'remind me to reply to Sarah' }
 *   splitWake('Andrew', 'Andrew')            → { woke: true, command: '' }        (wake only)
 *   splitWake('I told Andrew about it', ..)  → { woke: false, command: '…' }      (not at the start)
 *
 * The phrase must open the utterance: "Hey Andrew", "hey, andrew", "Andrew",
 * "OK Andrew". Common mis-hearings of the name are tolerated; "android" only
 * with a leading "hey/ok", so talk about phones does not wake him.
 */
const PREFIX = '(?:hey|hi|ok|okay|yo|hello|hay)';
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function aliasesFor(name) {
  const n = String(name || 'Andrew').trim().toLowerCase();
  const list = [n, 'attn'];
  if (n === 'andrew') list.push('andrea', 'andre', 'andru', 'andrews', 'android');
  return [...new Set(list)];
}

export function wakePattern(name) {
  const alt = aliasesFor(name).map(escape).join('|');
  return new RegExp(`^\\s*(?:${PREFIX}[\\s,]+)?(?:${alt})\\b[\\s,.!?:;\\-–—]*`, 'i');
}

/** @returns {{ woke: boolean, command: string }} */
export function splitWake(text, name = 'Andrew') {
  const raw = String(text || '').trim();
  const m = wakePattern(name).exec(raw);
  if (!m) return { woke: false, command: raw };
  const heard = m[0];
  // "android" alone is too easy to say by accident; require the greeting prefix for that alias
  if (/android/i.test(heard) && !new RegExp(`^\\s*${PREFIX}`, 'i').test(heard)) return { woke: false, command: raw };
  return { woke: true, command: raw.slice(heard.length).trim() };
}

/** Server-side convenience: the command without any wake phrase (never empty when the input was not). */
export function stripWakePhrase(text, name = 'Andrew') {
  const { command } = splitWake(text, name);
  return command || String(text || '').trim();
}
