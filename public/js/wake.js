/**
 * attn — wake phrase + conversation-ending phrases, shared by the device (local
 * detection, no model involved) and the server (defensive stripping).
 *
 *   splitWake('Hey Andrew, remind me to reply to Sarah', 'Andrew')
 *   → { woke: true, command: 'remind me to reply to Sarah' }
 *   splitWake('Um, Andrew?', 'Andrew')          → { woke: true, command: '' }      (wake only)
 *   splitWake('I told Andrew about it', ..)     → { woke: false, command: '…' }    (not addressing him)
 *   endIntent('Thanks Andrew', 'Andrew')        → { kind: 'close', named: true }
 *   endIntent('Not you, Andrew', 'Andrew')      → { kind: 'dismiss', named: true }
 *
 * Wake = intent by position, not an exact string: the name must be the first
 * meaningful word, with only greetings/fillers ("hey", "okay", "um", "uh") before
 * it (at most three). Nothing else may precede it, so "Sarah said Andrew is
 * coming" and "I think Andrew might like this" stay ambient. Common mis-hearings
 * of the name are tolerated; "android" only after a greeting.
 */
const GREETINGS = ['hey', 'hi', 'hello', 'hay', 'ok', 'okay', 'alright', 'yo'];
const FILLERS = ['um', 'umm', 'uhm', 'uh', 'uhh', 'erm', 'hmm', 'mm', 'oh', 'ah', 'so', 'well', 'yeah', 'right', 'please', 'excuse', 'me'];
const LEAD = new Set([...GREETINGS, ...FILLERS]);
const MAX_LEAD = 3;
// a bare name followed straight by one of these is talk ABOUT him ("Andrew is coming", "Andrew said…")
const THIRD_PERSON = new Set(['is', "isn't", 'was', "wasn't", 'said', 'says', 'has', "hasn't", 'had', 'does', "doesn't", 'did', "didn't", 'will', "won't", 'would', 'might', 'went', 'called', 'likes', 'thinks', 'told', 'and', 'or', 'from', 'who']);
const WORD = /[\p{L}\p{N}'’]+/gu;
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function aliasesFor(name) {
  const n = String(name || 'Andrew').trim().toLowerCase();
  const list = [n, 'attn'];
  if (n === 'andrew') list.push('andrea', 'andre', 'andru', 'andrews', 'android');
  return [...new Set(list)];
}
const words = (raw) => [...raw.matchAll(WORD)].map((m) => ({ text: m[0], lower: m[0].toLowerCase().replace(/’/g, "'"), start: m.index, end: m.index + m[0].length }));

/** Regex form (legacy Chrome client, interim results): greetings/fillers, then the name at the start. */
export function wakePattern(name) {
  const alt = aliasesFor(name).map(escape).join('|');
  const lead = [...LEAD].map(escape).join('|');
  return new RegExp(`^\\s*(?:(?:${lead})[\\s,]+){0,${MAX_LEAD}}(?:${alt})\\b[\\s,.!?:;\\-–—]*`, 'i');
}

/**
 * @param {object} [opts]
 * @param {boolean} [opts.strict] kept for callers; the position rule is the same for punctuated
 *   (OpenAI) and unpunctuated (Chrome) transcripts.
 * @returns {{ woke: boolean, command: string, heard?: string }}
 */
export function splitWake(text, name = 'Andrew', { strict = false } = {}) { // eslint-disable-line no-unused-vars
  const raw = String(text || '').trim();
  const aliases = new Set(aliasesFor(name));
  const w = words(raw);
  let at = -1;
  for (let i = 0; i < w.length && i <= MAX_LEAD; i++) {
    if (aliases.has(w[i].lower)) { at = i; break; }
    if (!LEAD.has(w[i].lower)) break; // something other than a greeting/filler came first: not addressing him
  }
  if (at < 0) return { woke: false, command: raw };
  const lead = w.slice(0, at).map((x) => x.lower);
  const hit = w[at];
  if (hit.lower === 'android' && !lead.some((x) => GREETINGS.includes(x))) return { woke: false, command: raw }; // phones
  const rest = raw.slice(hit.end);
  const punctuated = /^\s*[,.!?:;\-–—]/.test(rest);
  const next = w[at + 1]?.lower;
  if (!lead.length && !punctuated && next && THIRD_PERSON.has(next)) return { woke: false, command: raw };
  const command = rest.replace(/^[\s,.!?:;\-–—]+/, '').trim();
  return { woke: true, command, heard: raw.slice(0, hit.end).trim() };
}

/** Server-side convenience: the command without any wake phrase (never empty when the input was not). */
export function stripWakePhrase(text, name = 'Andrew') {
  const { command } = splitWake(text, name);
  return command || String(text || '').trim();
}

// ---------------------------------------------------------------- ending the conversation (ACTIVE mode only)
const DROP_LEAD = new Set(['ok', 'okay', 'alright', 'oh', 'um', 'uh', 'well', 'yeah', 'cool', 'great', 'perfect', 'awesome', 'nice', 'good', 'hey', 'and', 'so']);
const DROP_TAIL = new Set(['now', 'for', 'then', 'please']);
const DISMISS = new Set(['not you', 'no not you', 'not talking to you', "i'm not talking to you", "wasn't talking to you", "i wasn't talking to you", 'stop listening', 'never mind', 'nevermind', 'go back to sleep', 'go to sleep']);
const CLOSE = new Set([
  'bye', 'bye bye', 'goodbye', 'good bye', 'see you', 'later',
  'thanks', 'thank you', 'thank you so much', 'thank you very much', 'thanks a lot', 'thanks so much', 'many thanks', 'cheers', 'ta',
  "that's all", 'that is all', "that's it", 'that is it', "that's everything", 'that is everything', "that'll be all", 'that will be all', "that's all i need", "that's all i needed",
  "we're good", 'we are good', "i'm good", 'im good', 'all good', "i'm done", 'im done', "we're done", 'we are done', 'done',
  'no thanks', 'no thank you',
]);
const joinable = (a, b) => CLOSE.has(a) && CLOSE.has(b); // "thanks, bye" / "okay thanks that's all"

/**
 * Is this whole utterance the user ending the conversation? Only meaningful while Andrew is ACTIVE.
 * @param {object} [opts]
 * @param {boolean} [opts.questionPending] Andrew just asked something: unnamed "thanks"/"no thanks" are answers, not goodbyes.
 * @returns {null | { kind: 'dismiss' | 'close', named: boolean }}
 */
export function endIntent(text, name = 'Andrew', { questionPending = false } = {}) {
  const aliases = new Set(aliasesFor(name));
  let toks = words(String(text || '')).map((x) => x.lower);
  const named = toks.some((t) => aliases.has(t));
  toks = toks.filter((t) => !aliases.has(t));
  if (!toks.length || toks.length > 8) return null;
  while (toks.length && DROP_LEAD.has(toks[0])) toks.shift();
  while (toks.length && DROP_TAIL.has(toks[toks.length - 1])) toks.pop();
  if (!toks.length) return null;
  const phrase = toks.join(' ');
  if (DISMISS.has(phrase)) return { kind: 'dismiss', named };
  if (questionPending && (!named || /^(no|yes|yeah|nope)\b/.test(phrase))) return null; // that's the answer to his question
  if (CLOSE.has(phrase)) return { kind: 'close', named };
  for (let i = 1; i < toks.length; i++) if (joinable(toks.slice(0, i).join(' '), toks.slice(i).join(' '))) return { kind: 'close', named };
  return null;
}
