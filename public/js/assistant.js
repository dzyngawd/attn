/**
 * attn — voice + text assistant on the device page.
 *
 * The device is a state machine tied to the REAL assistant lifecycle:
 *
 *   idle ──tap──▶ listening ──transcript──▶ processing ──reply──▶ speaking ──▶ success ──▶ idle
 *                                                │                    │
 *                                                └─ clarify ─────────▶ clarifying ──▶ listening (voice) / keyboard (text)
 *                                                └─ failure ─────────▶ error ──▶ idle (or clarifying if a question is pending)
 *
 * Every state is rendered by render-device.js (setAssistantState). Idle and
 * success show the dashboard; the others bring the attn face forward.
 * Typed commands (keyboard button) go through the exact same send() path.
 * Every state has a way back to idle: nothing can leave the device stuck.
 *
 * Browser notes: SpeechRecognition exists in Chrome (Android + desktop) and
 * needs the network; Firefox has none (the type box covers it). Speech
 * synthesis voices load asynchronously and vary per phone, so a natural
 * English voice is preferred but never required.
 */
import { api } from './api.js';
import { normalizeState } from './state.js';

const LISTEN_TIMEOUT_MS = 12000;   // stop listening if nothing final arrives
const SUCCESS_LINGER_MS = 2400;    // how long the highlight pulse plays before idle
const ERROR_LINGER_MS = 5000;

export function createAssistant({ device, name = 'attn', onState = () => {} }) {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  const synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
  let status = 'idle';       // idle | listening | processing | speaking | clarifying | success | error
  let recognition = null;
  let listenTimer = null;
  let idleTimer = null;
  let request = null;        // AbortController for the in-flight command
  let lastQuestion = null;   // clarification we are waiting to answer
  let lastInput = 'voice';   // how the current command arrived: 'voice' | 'text'
  let pendingResult = null;  // { state, highlights } to apply when the face steps back
  let voice = null;
  const conversationId = conversationKey();

  function conversationKey() {
    try {
      let id = sessionStorage.getItem('attn.conversation');
      if (!id) { id = (crypto.randomUUID?.() || `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`); sessionStorage.setItem('attn.conversation', id); }
      return id;
    } catch { return `c${Date.now().toString(36)}`; }
  }

  const set = (next, detail) => { status = next; device.setAssistantState(next, detail); onState(next); };
  const clearTimers = () => { clearTimeout(listenTimer); clearTimeout(idleTimer); };

  // ------------------------------------------------------------- speech out
  function pickVoice() {
    if (!synth) return null;
    const voices = synth.getVoices();
    if (!voices.length) return null;
    const lang = navigator.language || 'en-US';
    const base = lang.split('-')[0];
    const score = (v) => (v.lang === lang ? 4 : v.lang?.startsWith(base) ? 2 : 0) + (/google|natural|premium|enhanced|neural/i.test(v.name) ? 1 : 0) + (v.default ? 0.5 : 0);
    return [...voices].filter((v) => v.lang?.startsWith(base)).sort((a, b) => score(b) - score(a))[0] || voices.find((v) => v.default) || voices[0];
  }
  if (synth) {
    voice = pickVoice();
    synth.addEventListener?.('voiceschanged', () => { voice = pickVoice(); });
  }

  /** Speak `text`, resolving when done (or when a safety timer says it should be). */
  function speak(text) {
    return new Promise((resolve) => {
      if (!text) return resolve();
      const guardMs = Math.min(20000, 1500 + 70 * text.length);
      if (!synth) return setTimeout(resolve, Math.min(4000, 45 * text.length));
      try { synth.cancel(); } catch { /* ignore */ }
      const u = new SpeechSynthesisUtterance(text);
      voice = voice || pickVoice();
      if (voice) u.voice = voice;
      u.lang = voice?.lang || navigator.language || 'en-US';
      u.rate = 1;
      u.pitch = 1;
      let done = false;
      const finish = () => { if (!done) { done = true; clearTimeout(guard); resolve(); } };
      const guard = setTimeout(finish, guardMs);
      u.onend = finish;
      u.onerror = finish;
      try { synth.speak(u); } catch { finish(); }
    });
  }
  const stopSpeaking = () => { try { synth?.cancel(); } catch { /* ignore */ } };

  // ------------------------------------------------------------- states
  function toIdle() {
    clearTimers();
    lastQuestion = null;
    set('idle');
  }

  /** The face steps back, the dashboard shows what changed, then idle. */
  function toSuccess() {
    clearTimers();
    lastQuestion = null;
    const result = pendingResult;
    pendingResult = null;
    set('success');
    if (result?.state) { try { device.update(result.state); } catch { /* keep going */ } }
    setTimeout(() => device.setHighlights(result?.highlights || { itemIds: [], modules: [] }), 380); // once the face has faded
    idleTimer = setTimeout(toIdle, SUCCESS_LINGER_MS);
  }

  function showError(message, { openTypeBox = false } = {}) {
    clearTimers();
    recognition = null;
    set('error', { text: message, action: lastQuestion ? 'Tap to answer' : 'Tap to try again' });
    if (openTypeBox) device.setTypeBox(true);
    idleTimer = setTimeout(() => (lastQuestion ? waitForAnswer() : toIdle()), ERROR_LINGER_MS);
  }

  /** Clarification asked, nobody answered yet: keep the question on the face. */
  function waitForAnswer() {
    clearTimers();
    set('clarifying', { text: lastQuestion, action: lastInput === 'text' ? 'Type your answer' : 'Tap to answer' });
    if (lastInput === 'text') device.setTypeBox(true); // answer the same way the question was asked
  }

  function listen() {
    if (!Recognition) { showError("Voice isn't available in this browser. You can type instead.", { openTypeBox: true }); return; }
    clearTimers();
    let finalText = '';
    let interim = '';
    let settled = false;
    recognition = new Recognition();
    recognition.lang = navigator.language || 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;
    lastInput = 'voice';
    device.setTypeBox(false);
    set('listening', { text: lastQuestion || '' });

    const settle = (fn) => { if (settled) return; settled = true; clearTimeout(listenTimer); fn(); };
    recognition.onresult = (e) => {
      interim = '';
      for (let i = e.resultIndex; i < e.results.length; i += 1) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript; else interim += r[0].transcript;
      }
      device.setAssistantState('listening', { text: lastQuestion || '', transcript: (finalText || interim).trim() });
      if (finalText.trim()) settle(() => { try { recognition.stop(); } catch { /* ignore */ } send(finalText.trim()); });
    };
    recognition.onerror = (e) => settle(() => {
      const code = e.error;
      if (code === 'aborted') return; // cancelled by us
      if (code === 'not-allowed' || code === 'service-not-allowed') showError('No microphone access. You can type instead.', { openTypeBox: true });
      else if (code === 'audio-capture') showError('No microphone found. You can type instead.', { openTypeBox: true });
      else if (code === 'network') showError("I couldn't reach speech recognition. Try again, or type.");
      else showError("I didn't catch that. Try again.");
    });
    recognition.onend = () => settle(() => {
      const text = (finalText || interim).trim();
      if (text) send(text); else showError("I didn't catch that. Try again.");
    });
    listenTimer = setTimeout(() => { try { recognition.stop(); } catch { /* ignore */ } }, LISTEN_TIMEOUT_MS);
    try { recognition.start(); } catch { settle(() => showError("I couldn't start listening. Try again.")); }
  }

  function cancel() {
    if (recognition) { try { recognition.abort(); } catch { /* ignore */ } recognition = null; }
    if (request) { request.abort(); request = null; }
    stopSpeaking();
    if (lastQuestion) waitForAnswer(); else toIdle();
  }

  async function send(text) {
    clearTimers();
    recognition = null;
    set('processing', { transcript: text });
    const controller = new AbortController();
    request = controller;
    let res;
    try {
      res = await api.command({
        text,
        currentTime: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        locale: navigator.language,
        conversationId,
      }, controller.signal);
    } catch {
      if (controller.signal.aborted) return;
      showError("I couldn't connect. Try again.");
      return;
    } finally {
      if (request === controller) request = null;
    }
    if (status !== 'processing') return; // cancelled meanwhile
    if (!res || res.ok === false) { showError(res?.spokenResponse || "I didn't get that. Try again."); return; }

    const isClarify = res.type === 'clarify';
    lastQuestion = isClarify ? (res.clarificationQuestion || res.spokenResponse) : null;
    pendingResult = isClarify ? null : {
      state: res.state ? normalizeState(res.state) : null,
      highlights: { itemIds: res.highlightItemIds || [], modules: (res.results || []).filter((r) => r.ok && !r.itemId && r.module).map((r) => r.module) },
    };

    set('speaking', { text: res.spokenResponse });
    await speak(res.spokenResponse);
    if (status !== 'speaking') return;

    if (isClarify) { if (lastInput === 'voice') listen(); else waitForAnswer(); return; } // one more turn for the answer
    toSuccess();
  }

  // ------------------------------------------------------------- public API
  function toggle() {
    if (status === 'listening') { cancel(); return; }
    if (status === 'processing') return;
    if (status === 'speaking') { stopSpeaking(); return; } // speak() resolves → success/clarify continue
    listen();
  }
  function submitText(text) {
    const t = (text || '').trim();
    if (!t || status === 'processing') return;
    if (recognition) { try { recognition.abort(); } catch { /* ignore */ } recognition = null; }
    lastInput = 'text';
    send(t);
  }
  /** A tap on the face view: what it means depends on the state. */
  function faceTap(state, viaButton) {
    if (state === 'listening' || state === 'processing') cancel();
    else if (state === 'speaking') stopSpeaking();
    else if (state === 'clarifying') { if (viaButton && lastInput === 'text') device.setTypeBox(true); else listen(); }
    else if (state === 'error') { if (lastQuestion && lastInput === 'text') waitForAnswer(); else listen(); }
  }

  device.on('talk', toggle);
  device.on('faceTap', faceTap);
  device.on('submitText', submitText);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && status === 'listening') cancel(); });
  device.setAssistantName(name);

  return { toggle, listen, submitText, cancel, get status() { return status; }, get supportsVoice() { return Boolean(Recognition); } };
}
