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

/**
 * @param {object} [opts]
 * @param {boolean} [opts.strict] For punctuated transcripts (OpenAI): a bare name without "hey/ok"
 *   only wakes when it is the whole utterance or is followed by punctuation ("Andrew, remind me"),
 *   so "Andrew said he'll call" stays ambient. Chrome transcripts have no punctuation: keep it off there.
 * @returns {{ woke: boolean, command: string }}
 */
export function splitWake(text, name = 'Andrew', { strict = false } = {}) {
  const raw = String(text || '').trim();
  const m = wakePattern(name).exec(raw);
  if (!m) return { woke: false, command: raw };
  const heard = m[0];
  const hasPrefix = new RegExp(`^\\s*${PREFIX}`, 'i').test(heard);
  // "android" alone is too easy to say by accident; require the greeting prefix for that alias
  if (/android/i.test(heard) && !hasPrefix) return { woke: false, command: raw };
  const command = raw.slice(heard.length).trim();
  if (strict && !hasPrefix && command && !/[,.!?:;]/.test(heard)) return { woke: false, command: raw };
  return { woke: true, command };
}

/** Server-side convenience: the command without any wake phrase (never empty when the input was not). */
export function stripWakePhrase(text, name = 'Andrew') {
  const { command } = splitWake(text, name);
  return command || String(text || '').trim();
}
