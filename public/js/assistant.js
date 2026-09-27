/**
 * attn — voice + text assistant on the device page.
 *
 *   tap  →  LISTENING (Web Speech API)  →  transcript  →  THINKING (POST /api/assistant/command)
 *        →  device state applied at once  →  SPEAKING (SpeechSynthesis) + reply card + card pulses
 *        →  back to the normal screen. Clarifications ask one question, then listen once more.
 *
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
const REPLY_LINGER_MS = 1800;      // keep the reply card after speech ends
const ERROR_LINGER_MS = 5000;

export function createAssistant({ device, name = 'attn', onState = () => {} }) {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  const synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
  let status = 'idle';       // idle | listening | thinking | speaking | clarify | error
  let recognition = null;
  let listenTimer = null;
  let idleTimer = null;
  let request = null;        // AbortController for the in-flight command
  let lastQuestion = null;   // clarification we are waiting to answer
  let lastInput = 'voice';   // how the current command arrived: 'voice' | 'text'
  let voice = null;
  const conversationId = conversationKey();

  function conversationKey() {
    try {
      let id = sessionStorage.getItem('attn.conversation');
      if (!id) { id = (crypto.randomUUID?.() || `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`); sessionStorage.setItem('attn.conversation', id); }
      return id;
    } catch { return `c${Date.now().toString(36)}`; }
  }

  const set = (next) => { status = next; onState(next); };
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

  // ------------------------------------------------------------- states
  function toIdle() {
    clearTimers();
    lastQuestion = null;
    set('idle');
    device.setVoice({ status: 'idle' });
    device.setReply(null);
    device.setExpression('auto');
  }

  function showError(message, { openTypeBox = false } = {}) {
    clearTimers();
    recognition = null;
    set('error');
    device.setVoice({ status: 'idle' });
    device.setExpression('surprised');
    device.setReply({ text: message, action: lastQuestion ? 'Tap to answer' : 'Tap to retry', tone: 'error' });
    if (openTypeBox) device.setTypeBox(true);
    idleTimer = setTimeout(() => (lastQuestion ? waitForAnswer() : toIdle()), ERROR_LINGER_MS);
  }

  /** Clarification asked, nobody answered yet: keep the question on screen. */
  function waitForAnswer() {
    clearTimers();
    set('clarify');
    device.setVoice({ status: 'idle' });
    device.setExpression('puzzled');
    device.setReply({ text: lastQuestion, action: 'Tap to answer' });
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
    set('listening');
    lastInput = 'voice';
    device.setTypeBox(false);
    device.setReply(null);
    device.setExpression('listening');
    device.setVoice({ status: 'listening', label: 'Listening', transcript: '' });

    const settle = (fn) => { if (settled) return; settled = true; clearTimeout(listenTimer); fn(); };
    recognition.onresult = (e) => {
      interim = '';
      for (let i = e.resultIndex; i < e.results.length; i += 1) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript; else interim += r[0].transcript;
      }
      device.setVoice({ status: 'listening', label: 'Listening', transcript: (finalText || interim).trim() });
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
    try { synth?.cancel(); } catch { /* ignore */ }
    if (lastQuestion) waitForAnswer(); else toIdle();
  }

  async function send(text) {
    clearTimers();
    recognition = null;
    set('thinking');
    device.setExpression('neutral');
    device.setVoice({ status: 'thinking', label: 'Thinking', transcript: text });
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
    if (status !== 'thinking') return;
    if (!res || res.ok === false) { showError(res?.spokenResponse || "I didn't get that. Try again."); return; }

    if (res.state) { try { device.update(normalizeState(res.state)); } catch { /* keep going */ } }
    const isClarify = res.type === 'clarify';
    const anyFailed = (res.results || []).some((r) => !r.ok);
    lastQuestion = isClarify ? (res.clarificationQuestion || res.spokenResponse) : null;

    device.setVoice({ status: 'idle' });
    device.setHighlights({
      itemIds: res.highlightItemIds || [],
      modules: (res.results || []).filter((r) => r.ok && !r.itemId && r.module).map((r) => r.module),
    });
    set('speaking');
    device.setExpression(isClarify ? 'puzzled' : 'speaking');
    device.setReply({ text: res.spokenResponse, action: isClarify ? 'Tap to answer' : null });
    await speak(res.spokenResponse);
    if (status !== 'speaking') return;

    if (isClarify) { if (lastInput === 'voice') listen(); else waitForAnswer(); return; } // one more turn for the answer
    device.setExpression(anyFailed ? 'neutral' : 'happy');
    idleTimer = setTimeout(toIdle, REPLY_LINGER_MS);
  }

  // ------------------------------------------------------------- public API
  function toggle() {
    if (status === 'listening') { cancel(); return; }
    if (status === 'thinking') return;
    if (status === 'speaking') { try { synth?.cancel(); } catch { /* ignore */ } }
    listen();
  }
  function submitText(text) {
    const t = (text || '').trim();
    if (!t || status === 'thinking') return;
    if (recognition) { try { recognition.abort(); } catch { /* ignore */ } recognition = null; }
    lastInput = 'text';
    send(t);
  }

  device.on('talk', toggle);
  device.on('cancel', () => { if (status === 'listening' || status === 'thinking') cancel(); });
  device.on('submitText', submitText);
  device.on('replyAction', () => listen());
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && status === 'listening') cancel(); });
  device.setAssistantName(name);

  return { toggle, listen, submitText, cancel, get status() { return status; }, get supportsVoice() { return Boolean(Recognition); } };
}
