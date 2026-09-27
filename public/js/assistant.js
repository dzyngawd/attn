/**
 * attn — Andrew's voice loop on the device page (foreground, wake-phrase driven).
 *
 *   passive ──"Hey Andrew …command"──▶ processing ──▶ speaking ──▶ success ──▶ passive (+ short follow-up window)
 *   passive ──"Hey Andrew"───────────▶ listening (active, ~9 s) ──command──▶ processing …
 *   processing ──clarify──▶ speaking ──▶ listening (active) ──answer──▶ processing …
 *   anything ──failure────▶ error ──▶ passive (or listening again if a question is pending)
 *
 * PASSIVE: continuous SpeechRecognition runs locally; transcripts are only
 * inspected for the wake phrase (public/js/wake.js). Nothing is sent, nothing
 * is spoken, nothing changes. ACTIVE: the next utterance is the command, no
 * wake phrase needed. The recognition manager restarts recognition whenever
 * Chrome ends it, never runs two recognizers, and keeps the microphone OFF
 * while Andrew is speaking so he cannot hear himself.
 *
 * Every state is rendered by render-device.js (setAssistantState) from the
 * real lifecycle: recognition events, the backend reply, speech synthesis.
 * Typed commands (debug mode only) go through the exact same send() path.
 */
import { api } from './api.js';
import { normalizeState } from './state.js';
import { splitWake, wakePattern } from './wake.js';

const ACTIVE_WINDOW_MS = 9000;       // after a bare "Hey Andrew": how long we wait for the command
const CLARIFY_WINDOW_MS = 12000;     // waiting for the answer to a question
const FOLLOW_UP_WINDOW_MS = 8000;    // after Andrew finishes: corrections without the wake phrase
const SPEECH_GAP_MS = 500;           // mic stays off this long after Andrew stops talking
const RESTART_DELAY_MS = 350;        // recognition restart after Chrome ends it
const RESTART_BACKOFF_MAX_MS = 4000;
const PROCESSING_WATCHDOG_MS = 27000;
const SUCCESS_LINGER_MS = 2400;
const ERROR_LINGER_MS = 4000;

const log = (...args) => console.log('[Andrew]', ...args);

export function createAssistant({ device, name = 'Andrew', debug = false, onState = () => {} }) {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  const synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
  const wake = wakePattern(name);

  // ---- lifecycle (what the UI shows)
  let status = 'idle';          // idle (passive) | listening (active) | processing | speaking | clarifying | success | error
  // ---- recognition manager
  let recognition = null;
  let recognitionRunning = false;
  let shouldListen = false;     // voice enabled + page visible
  let isSpeaking = false;
  let listeningMode = 'passive'; // passive | active
  let restartTimer = null;
  let restartDelay = RESTART_DELAY_MS;
  let activeTimer = null;
  let idleTimer = null;
  let watchdog = null;
  let request = null;
  let followUpUntil = 0;
  let lastQuestion = null;
  let lastInput = 'voice';
  let pendingResult = null;
  let voice = null;
  let ttsUnlocked = false;
  const conversationId = conversationKey();

  function conversationKey() {
    try {
      let id = sessionStorage.getItem('attn.conversation');
      if (!id) { id = (crypto.randomUUID?.() || `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`); sessionStorage.setItem('attn.conversation', id); }
      return id;
    } catch { return `c${Date.now().toString(36)}`; }
  }

  const set = (next, detail) => { status = next; device.setAssistantState(next, detail); onState(next); };
  const busy = () => status === 'processing' || status === 'speaking';

  // ================================================================ recognition manager
  function startRecognition(mode) {
    if (mode) listeningMode = mode;
    if (!Recognition || !shouldListen || isSpeaking || recognitionRunning || document.visibilityState === 'hidden') return;
    clearTimeout(restartTimer);
    const rec = new Recognition();
    rec.lang = navigator.language || 'en-US';
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    recognition = rec;
    rec.onstart = () => { recognitionRunning = true; restartDelay = RESTART_DELAY_MS; log('recognition started:', listeningMode); };
    rec.onresult = (e) => { if (rec !== recognition || isSpeaking) return; handleResults(e); };
    rec.onerror = (e) => { if (rec !== recognition) return; handleRecognitionError(e.error); };
    rec.onend = () => {
      if (rec !== recognition) return; // an old recognizer we already replaced
      recognitionRunning = false;
      recognition = null;
      if (shouldListen && !isSpeaking) scheduleRestart(); // Chrome ends after silence: normal, keep going
    };
    try {
      rec.start();
    } catch (err) {
      recognitionRunning = false;
      recognition = null;
      log('recognition start failed:', err.message);
      scheduleRestart(true);
    }
  }

  function scheduleRestart(backoff = false) {
    clearTimeout(restartTimer);
    if (backoff) restartDelay = Math.min(RESTART_BACKOFF_MAX_MS, restartDelay * 2);
    restartTimer = setTimeout(() => startRecognition(), restartDelay);
  }

  /** Stop immediately and forget the instance (its late events are ignored). */
  function stopRecognition() {
    clearTimeout(restartTimer);
    const rec = recognition;
    recognition = null;
    recognitionRunning = false;
    if (rec) { rec.onend = null; rec.onresult = null; rec.onerror = null; try { rec.abort(); } catch { /* ignore */ } }
  }

  function handleRecognitionError(code) {
    log('recognition error:', code);
    if (code === 'not-allowed' || code === 'service-not-allowed') {
      shouldListen = false;
      device.setSetup({ text: 'Microphone blocked. Allow it in the browser’s site settings, then tap here.', action: 'Enable Andrew' });
      return;
    }
    if (code === 'audio-capture') { shouldListen = false; device.setSetup({ text: 'No microphone found.', action: 'Try again' }); return; }
    if (code === 'network') restartDelay = Math.min(RESTART_BACKOFF_MAX_MS, restartDelay * 2);
    // no-speech / aborted / network: onend follows and the manager restarts
  }

  function handleResults(e) {
    const finals = [];
    let interim = '';
    for (let i = e.resultIndex; i < e.results.length; i += 1) {
      const r = e.results[i];
      const t = r[0]?.transcript || '';
      if (r.isFinal) finals.push(t.trim()); else interim += t;
    }
    interim = interim.trim();
    if (interim && !busy()) onInterim(interim);
    for (const f of finals) if (f) handleUtterance(f);
  }

  /** Interim text: wake up visually as soon as the phrase is heard; show what we hear while active. */
  function onInterim(text) {
    if (listeningMode === 'passive') {
      if (status === 'idle' && wake.test(text)) { log('wake detected (interim)'); enterActive({ quiet: true }); }
      return;
    }
    if (status === 'listening') device.setAssistantState('listening', { text: lastQuestion || '', transcript: text });
  }

  function handleUtterance(text) {
    if (busy()) return;
    log('raw transcript:', text);
    const { woke, command } = splitWake(text, name);
    const active = listeningMode === 'active' || Date.now() < followUpUntil;
    if (!woke && !active) return;               // passive: not for Andrew
    if (woke) log('wake detected');
    if (!command) { if (woke) enterActive(); return; } // "Hey Andrew" alone → wait for the command
    log('extracted command:', command);
    if (lastQuestion) log('clarification answer:', command);
    submitCommand(command, 'voice');
  }

  /** ACTIVE listening: the next utterance is the command. Visual acknowledgement only, no speech. */
  function enterActive({ quiet = false } = {}) {
    listeningMode = 'active';
    if (!quiet || status !== 'listening') set('listening', { text: lastQuestion || '' });
    log('listening: active');
    clearTimeout(activeTimer);
    activeTimer = setTimeout(() => {
      if (status === 'listening') { log('active window expired'); toPassive(); }
    }, lastQuestion ? CLARIFY_WINDOW_MS : ACTIVE_WINDOW_MS);
    if (!recognitionRunning) startRecognition('active');
  }

  function toPassive() {
    clearTimeout(activeTimer);
    clearTimeout(idleTimer);
    listeningMode = 'passive';
    lastQuestion = null;
    if (status !== 'idle') set('idle');
    log('returning to passive listening');
    if (!recognitionRunning) startRecognition('passive');
  }

  // ================================================================ speech out
  function pickVoice() {
    if (!synth) return null;
    const voices = synth.getVoices();
    if (!voices.length) return null;
    const lang = navigator.language || 'en-US';
    const base = lang.split('-')[0];
    const score = (v) => (v.lang === lang ? 4 : v.lang?.startsWith(base) ? 2 : 0) + (/google|natural|premium|enhanced|neural/i.test(v.name) ? 1 : 0) + (v.default ? 0.5 : 0);
    return [...voices].filter((v) => v.lang?.startsWith(base)).sort((a, b) => score(b) - score(a))[0] || voices.find((v) => v.default) || voices[0];
  }
  if (synth) { voice = pickVoice(); synth.addEventListener?.('voiceschanged', () => { voice = pickVoice(); }); }

  /** Speak with the microphone OFF; resolves when speech ends (or a guard timer says it must have). */
  function speak(text) {
    return new Promise((resolve) => {
      isSpeaking = true;
      stopRecognition();
      const done = () => { if (!isSpeaking) return; isSpeaking = false; resolve(); };
      if (!text) return done();
      const guardMs = Math.min(20000, 1500 + 70 * text.length);
      if (!synth) return setTimeout(done, Math.min(4000, 45 * text.length));
      try { synth.cancel(); } catch { /* ignore */ }
      const u = new SpeechSynthesisUtterance(text);
      voice = voice || pickVoice();
      if (voice) u.voice = voice;
      u.lang = voice?.lang || navigator.language || 'en-US';
      u.rate = 1;
      u.pitch = 1;
      const guard = setTimeout(done, guardMs);
      u.onend = () => { clearTimeout(guard); done(); };
      u.onerror = (e) => {
        clearTimeout(guard);
        if (e.error === 'not-allowed') { log('speech blocked until the page is tapped once'); device.setSetup({ text: 'Tap once to hear Andrew', action: 'Enable voice', subtle: true }); }
        else log('speech error:', e.error);
        done();
      };
      try { synth.speak(u); } catch { clearTimeout(guard); done(); }
    });
  }
  const stopSpeaking = () => { try { synth?.cancel(); } catch { /* ignore */ } };
  const gap = (ms) => new Promise((r) => setTimeout(r, ms));

  // ================================================================ the command round trip
  async function submitCommand(text, source) {
    clearTimeout(activeTimer);
    clearTimeout(idleTimer);
    lastInput = source;
    stopRecognition(); // mic off while we think and talk: no self-hearing, no double commands
    set('processing', { transcript: text });
    log('sending command');
    const controller = new AbortController();
    request = controller;
    clearTimeout(watchdog);
    watchdog = setTimeout(() => { if (status === 'processing') { log('watchdog: processing took too long'); controller.abort(); showError('That took too long. Try again.'); } }, PROCESSING_WATCHDOG_MS);
    let res;
    try {
      res = await api.command({ text, currentTime: new Date().toISOString(), timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, locale: navigator.language, conversationId }, controller.signal);
    } catch {
      clearTimeout(watchdog);
      if (controller.signal.aborted) return;
      showError("I couldn't connect. Try again.");
      return;
    } finally {
      clearTimeout(watchdog);
      if (request === controller) request = null;
    }
    if (status !== 'processing') return; // cancelled meanwhile
    if (!res || res.ok === false) { log('assistant error:', res?.error, res?.detail || ''); showError(res?.spokenResponse || "I didn't get that. Try again."); return; }

    log('assistant response type:', res.type);
    if (res.results?.length) {
      log('actions:', res.results.map((r) => r.type));
      for (const r of res.results) log('action result:', r.type, r.ok ? 'ok' : 'FAILED', '—', r.message);
    }
    const isClarify = res.type === 'clarify';
    lastQuestion = isClarify ? (res.clarificationQuestion || res.spokenResponse) : null;
    if (isClarify) log('clarification pending');
    pendingResult = isClarify ? null : {
      state: res.state ? normalizeState(res.state) : null,
      highlights: { itemIds: res.highlightItemIds || [], modules: (res.results || []).filter((r) => r.ok && !r.itemId && r.module).map((r) => r.module) },
    };

    set('speaking', { text: res.spokenResponse });
    log('speaking:', res.spokenResponse);
    await speak(res.spokenResponse);
    log('speech ended');
    if (status !== 'speaking') return;

    await gap(SPEECH_GAP_MS);
    if (isClarify) {
      if (lastInput === 'text') { set('clarifying', { text: lastQuestion, action: 'Type your answer' }); device.setTypeBox(true); }
      else enterActive();
      return;
    }
    toSuccess();
  }

  /** The face steps back, the dashboard shows what changed, then passive (with a short follow-up window). */
  function toSuccess() {
    clearTimeout(idleTimer);
    lastQuestion = null;
    listeningMode = 'passive';
    const result = pendingResult;
    pendingResult = null;
    set('success');
    if (result?.state) { try { device.update(result.state); } catch { /* keep going */ } }
    setTimeout(() => device.setHighlights(result?.highlights || { itemIds: [], modules: [] }), 380);
    followUpUntil = Date.now() + FOLLOW_UP_WINDOW_MS; // "actually make that noon" needs no wake phrase now
    startRecognition('passive');
    log(`returning to passive listening (follow-up window ${FOLLOW_UP_WINDOW_MS / 1000} s)`);
    idleTimer = setTimeout(() => { if (status === 'success') set('idle'); }, SUCCESS_LINGER_MS);
  }

  function showError(message) {
    clearTimeout(activeTimer);
    clearTimeout(idleTimer);
    stopRecognition();
    set('error', { text: message, action: lastQuestion ? 'Tap to answer' : null });
    idleTimer = setTimeout(() => (lastQuestion ? enterActive() : toPassive()), ERROR_LINGER_MS);
  }

  function cancel() {
    if (request) { request.abort(); request = null; }
    clearTimeout(watchdog);
    stopSpeaking();
    if (lastQuestion) enterActive(); else toPassive();
  }

  // ================================================================ enabling (one-time browser requirements)
  function enable({ fromGesture = false } = {}) {
    if (!Recognition) { device.setSetup({ text: 'Voice needs Chrome on Android or desktop.' }); return; }
    shouldListen = document.visibilityState !== 'hidden';
    try { localStorage.setItem('attn.voice.enabled', '1'); } catch { /* ignore */ }
    if (fromGesture && synth && !ttsUnlocked) { try { synth.speak(new SpeechSynthesisUtterance('')); ttsUnlocked = true; } catch { /* ignore */ } }
    device.setSetup(null);
    startRecognition('passive');
  }

  async function boot() {
    if (!Recognition) { device.setSetup({ text: 'Voice needs Chrome on Android or desktop.' }); return; }
    let permission = 'prompt';
    try { permission = (await navigator.permissions.query({ name: 'microphone' })).state; } catch { /* Safari/Firefox: no query */ }
    const activated = navigator.userActivation ? navigator.userActivation.hasBeenActive : true;
    let remembered = false;
    try { remembered = localStorage.getItem('attn.voice.enabled') === '1'; } catch { /* ignore */ }
    if (permission === 'granted' && (remembered || activated)) {
      enable();
      if (!activated) device.setSetup({ text: 'Tap once to hear Andrew', action: 'Enable voice', subtle: true });
    } else if (permission === 'denied') {
      device.setSetup({ text: 'Microphone blocked. Allow it in the browser’s site settings, then tap here.', action: 'Enable Andrew' });
    } else {
      device.setSetup({ text: 'Andrew needs the microphone once.', action: 'Enable Andrew' });
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      shouldListen = false;
      stopRecognition();
      if (status === 'listening') toPassive();
      log('page hidden — recognition stopped');
    } else {
      let remembered = false;
      try { remembered = localStorage.getItem('attn.voice.enabled') === '1'; } catch { /* ignore */ }
      if (remembered) { shouldListen = true; startRecognition('passive'); log('page visible — passive listening resumed'); }
    }
  });
  // the first real tap anywhere also unlocks speech synthesis
  document.addEventListener('pointerdown', () => { if (!ttsUnlocked && synth) { try { synth.speak(new SpeechSynthesisUtterance('')); ttsUnlocked = true; } catch { /* ignore */ } } }, { once: true, capture: true });

  // ================================================================ wiring
  device.on('enable', () => enable({ fromGesture: true }));
  device.on('talk', () => { if (status === 'idle' && shouldListen) enterActive(); else if (status === 'listening') toPassive(); }); // tapping the small face = manual wake
  device.on('faceTap', (state, viaButton) => {
    if (state === 'listening') { if (lastQuestion && viaButton) return; toPassive(); }
    else if (state === 'processing') cancel();
    else if (state === 'speaking') stopSpeaking();
    else if (state === 'clarifying') { if (lastInput === 'text') device.setTypeBox(true); else enterActive(); }
    else if (state === 'error') { if (lastQuestion) enterActive(); else toPassive(); }
  });
  device.on('submitText', (text) => { const t = (text || '').trim(); if (!t || busy()) return; submitCommand(t, 'text'); });
  device.setAssistantName(name);
  boot();

  return {
    enable, cancel,
    submitText: (t) => submitCommand(t, 'text'),
    /** Debug only: feed a transcript as if recognition had heard it. */
    simulateTranscript: (text) => { if (!debug) return; handleUtterance(String(text || '')); },
    get status() { return status; },
    get listeningMode() { return listeningMode; },
    get recognitionRunning() { return recognitionRunning; },
  };
}
