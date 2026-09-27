/**
 * attn — small local intents the device handles itself, before anything goes to the model.
 *
 * These are the hackathon-critical flows that must be deterministic: entering Deep
 * Focus, answering the one "Frequency music?" question, stopping the music and
 * leaving Focus. Everything else still goes to OpenAI Realtime with the tools.
 *
 *   localIntent('put me in deep focus mode', {})                       → { type: 'focus_start' }
 *   localIntent('yeah', { pendingIntent: 'focus_music_confirmation' })  → { type: 'focus_yes' }
 *   localIntent('stop the music', { musicRequested: true })            → { type: 'music_stop' }
 *   localIntent("I'm done focusing", { focusOn: true })                 → { type: 'focus_end' }
 *   localIntent('remind me to call Mum', {})                           → null
 */
const norm = (text) => String(text || '').toLowerCase().replace(/[’‘]/g, "'").replace(/[^\p{L}\p{N}' ]+/gu, ' ').replace(/\s+/g, ' ').trim();
const LEAD = ['um', 'uh', 'oh', 'okay', 'ok', 'alright', 'well', 'so', 'yeah', 'yes', 'no', 'and', 'please', 'andrew'];

const YES_HEAD = new Set(['yes', 'yeah', 'yep', 'yup', 'ya', 'sure', 'okay', 'ok', 'please', 'absolutely', 'definitely', 'certainly', 'alright', 'fine']);
const NO_HEAD = new Set(['no', 'nope', 'nah', 'not', 'never', 'skip', 'without']);
const NEG = /\b(no|not|nope|nah|don't|dont|without|skip|quiet|silence|silent|later|never)\b/;
const YES = new Set(['yes', 'yeah', 'yep', 'yup', 'ya', 'sure', 'okay', 'ok', 'please', 'go ahead', 'play it', 'do it', 'why not', 'sounds good', 'yes please', "let's do it", 'lets do it', 'start it', 'absolutely', 'definitely', 'of course', 'go for it', 'put it on', 'play', 'yeah sure', 'okay sure', 'sure thing', 'that would be nice', "that'd be nice", 'i would', "i'd like that", 'yes play it', 'yeah play it', 'yes go ahead', 'yeah go ahead']);
const NO = new Set(['no', 'nope', 'nah', 'not now', 'no thanks', 'no thank you', "i'm good", 'im good', 'skip it', 'skip', 'later', 'maybe later', 'not right now', "don't", 'do not', 'leave it', 'no music', 'no need', "i'm fine", 'im fine', 'not today', 'no not now', 'no i am good', "no i'm good", 'no im good', 'silence', 'quiet', 'keep it quiet', 'no keep it quiet', "i'm okay", 'im okay', "i'm alright", 'im alright', "it's fine", 'its fine', 'without music', 'no music please', 'nothing', 'none', 'stay quiet']);

const FOCUS_END = [
  /\b(end|stop|exit|leave|finish|quit|cancel|close|turn off|switch off)\b[\w\s']*\b(deep )?focus\b/,
  /\b(deep )?focus( mode| session)?\b[\w\s']*\b(off|over|is done|is over|ended)\b/,
  /\b(i'm|im|i am|we're|we are)\s+(all\s+)?done\s+(focusing|with (deep )?focus|with (my )?focus (mode|session))\b/,
  /\b(done|finished)\s+focusing\b/,
  /\bno more focus( mode)?\b/,
];
const MUSIC_STOP_EXPLICIT = [ // names the music: always a music stop
  /\b(stop|turn off|switch off|pause|kill|cut|end|shut off|no more)\b[\w\s']*\b(music|audio|song|track|playlist|sound|tune|frequenc\w*|beats|noise)\b/,
  /\b(music|audio|song|track|playlist|sound)\b[\w\s']*\boff\b/,
  /\b(that's|thats|that is) enough( music| of that| of the music| audio)?\b/,
];
const MUSIC_STOP_CONTEXT = [ // only while a track is requested
  /\b(turn|shut|switch) (that|it) off\b/,
  /\bstop playing\b/,
  /\b(stop|pause|kill|cut) (that|it)\b/,
  /^(stop|pause|quiet|silence|enough)$/,
];
const FOCUS_START = [
  /\bdeep focus\b/,
  /\b(block|silence|mute|hold|pause)\b[\w\s']*\bnotifications?\b/,
  /\bnotifications?\b[\w\s']*\b(off|blocked|silenced|muted)\b/,
  /\b(start|enter|begin|go into|going into|put me in|put me into|turn on|switch on|activate|enable|let's do|lets do|time for|i need|i want|wanna|let me|help me|get me|set me up)\b[\w\s']*\bfocus( mode| session| time)?\b/,
  /^(focus|focus mode|focus time|focus session)$/,
];
const HAS_TIME = /\b(\d|at|until|till|hour|hours|minute|minutes|mins|starting|from|tomorrow|tonight|morning|afternoon|evening|noon|midnight|o'clock|half past|quarter)\b/;

/**
 * @param {string} text the command (wake phrase already removed) or the active-mode utterance
 * @param {object} ctx
 * @param {string|null} [ctx.pendingIntent] 'focus_music_confirmation' while Andrew waits for yes/no
 * @param {boolean} [ctx.musicRequested] a focus track is requested/playing on the device
 * @param {boolean} [ctx.focusOn] Focus mode is on
 * @returns {null | { type: 'focus_start' | 'focus_yes' | 'focus_no' | 'music_stop' | 'focus_end' }}
 */
export function localIntent(text, { pendingIntent = null, musicRequested = false, focusOn = false } = {}) {
  const t = norm(text);
  if (!t) return null;
  if (pendingIntent === 'focus_music_confirmation') {
    const toks = t.split(' ');
    const first = toks[0] === 'andrew' ? toks[1] : toks[0];
    if (toks.length <= 6 && NO_HEAD.has(first) && !/\b(yes|yeah|play)\b/.test(t)) return { type: 'focus_no' }; // "No music, thanks."
    while (toks.length > 1 && LEAD.includes(toks[0]) && !YES.has(toks.join(' ')) && !NO.has(toks.join(' '))) toks.shift();
    const phrase = toks.join(' ');
    if (toks.length <= 6) {
      if (YES.has(phrase) || YES.has(phrase.replace(/^(yes|yeah|yep|sure|okay|ok) /, ''))) return { type: 'focus_yes' };
      if (NO.has(phrase) || NO.has(phrase.replace(/^(no|nope|nah) /, ''))) return { type: 'focus_no' };
      // short answers that start with a clear yes/no word, or ask for music outright
      if (NO_HEAD.has(toks[0]) || /^(no|not) /.test(phrase)) return { type: 'focus_no' };
      if (YES_HEAD.has(toks[0]) && !NEG.test(phrase)) return { type: 'focus_yes' };
      if (/\b(play|put|start|turn on)\b/.test(phrase) && /\b(music|it|some|something|that|the track|a track|audio|on)\b/.test(phrase) && !NEG.test(phrase)) return { type: 'focus_yes' };
    }
  }
  if (MUSIC_STOP_EXPLICIT.some((re) => re.test(t))) return { type: 'music_stop' };
  if (FOCUS_END.some((re) => re.test(t))) return { type: 'focus_end' };
  if (musicRequested && MUSIC_STOP_CONTEXT.some((re) => re.test(t))) return { type: 'music_stop' };
  if (!HAS_TIME.test(t) && FOCUS_START.some((re) => re.test(t))) return { type: 'focus_start' };
  return null;
}
