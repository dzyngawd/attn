/**
 * attn — Andrew on OpenAI Realtime (WebRTC), the production voice path.
 *
 *   mic ──WebRTC──▶ OpenAI Realtime (VAD, understanding, voice) ──function call──▶ POST /api/realtime/tool
 *                                                                                   └─▶ actions.js + shared state
 *   OpenAI audio ◀── function_call_output + response.create ◀──────────────────────────┘
 *
 * One tap on "Enable Andrew" (microphone permission) starts a persistent session
 * that stays connected while the page is visible. No Chrome SpeechRecognition,
 * no SpeechSynthesis, no Gemini on this path. The UI states come from REAL
 * events: speech_started → listening, speech_stopped → processing, function
 * call → processing, output_audio_buffer.started → speaking (actual playback),
 * output_audio_buffer.stopped → success/idle, error → error → idle.
 *
 * The browser only ever holds a short-lived client secret from our server.
 */
import { api } from './api.js';
import { normalizeState } from './state.js';

const OPENAI_CALLS_URL = 'https://api.openai.com/v1/realtime/calls';
const MIC_TIMEOUT_MS = 20000;
const PROCESSING_WATCHDOG_MS = 25000;
const AUDIO_WATCHDOG_MS = 30000;
const SUCCESS_LINGER_MS = 2400;
const ERROR_LINGER_MS = 4000;
const INSTRUCTIONS_REFRESH_MS = 5 * 60 * 1000;
const RECONNECT_DELAYS_MS = [1000, 2000, 4000, 8000, 15000, 15000, 15000, 15000];

const log = (...args) => console.log('[Realtime]', ...args);
const timeContext = () => ({ currentTime: new Date().toISOString(), timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, locale: navigator.language });

export function createRealtimeAssistant({ device, name = 'Andrew', debug = false }) {
  let status = 'idle';
  let pc = null;
  let dc = null;
  let mic = null;
  let connected = false;
  let connecting = false;
  let enabled = false;
  let reconnectAttempt = 0;
  let reconnectTimer = null;
  let watchdog = null;
  let idleTimer = null;
  let refreshTimer = null;
  let toolChanged = false;
  let pendingHighlights = { itemIds: [], modules: [] };
  let replyText = '';
  let userText = '';
  let speaking = false;
  const events = []; // debug ring buffer
  const audioEl = document.createElement('audio');
  audioEl.autoplay = true;
  audioEl.setAttribute('playsinline', '');
  audioEl.style.display = 'none';
  document.body.appendChild(audioEl);

  const set = (next, detail) => { status = next; device.setAssistantState(next, detail); };
  const send = (event) => { if (dc && dc.readyState === 'open') { dc.send(JSON.stringify(event)); return true; } log('cannot send, channel not open:', event.type); return false; };
  const remember = (flag) => { try { localStorage.setItem('attn.voice.enabled', flag ? '1' : '0'); } catch { /* ignore */ } };
  const remembered = () => { try { return localStorage.getItem('attn.voice.enabled') === '1'; } catch { return false; } };

  // ================================================================ connection
  async function getMicrophone() {
    if (mic && mic.getTracks().some((t) => t.readyState === 'live')) return mic;
    // a permission prompt left unanswered would otherwise keep us in "Connecting…" forever
    const timeout = new Promise((_, reject) => setTimeout(() => reject(Object.assign(new Error('Microphone permission was not granted in time'), { name: 'TimeoutError' })), MIC_TIMEOUT_MS));
    mic = await Promise.race([navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } }), timeout]);
    return mic;
  }

  async function connect() {
    if (connecting || connected) return;
    if (document.visibilityState === 'hidden') return;
    connecting = true;
    device.setSetup({ text: reconnectAttempt ? 'Reconnecting…' : 'Connecting to Andrew…', subtle: true });
    try {
      try { await getMicrophone(); }
      catch (err) {
        if (!debug) throw Object.assign(new Error(err.message), { code: 'mic', name: err.name });
        log('microphone unavailable, debug mode continues without it:', err.name);
        mic = null;
      }
      log('requesting client secret');
      const token = await api.realtimeToken(timeContext());
      log('connecting WebRTC');
      pc = new RTCPeerConnection();
      pc.ontrack = (e) => { audioEl.srcObject = e.streams[0]; audioEl.play?.().catch(() => { /* autoplay unlocked by the enable tap */ }); };
      if (mic) mic.getTracks().forEach((t) => pc.addTrack(t, mic));
      else pc.addTransceiver('audio', { direction: 'recvonly' });
      pc.onconnectionstatechange = () => {
        log('connection state:', pc?.connectionState);
        if (pc && ['failed', 'disconnected', 'closed'].includes(pc.connectionState)) onDisconnected(pc.connectionState);
      };
      dc = pc.createDataChannel('oai-events');
      dc.onmessage = (e) => { try { handleEvent(JSON.parse(e.data)); } catch (err) { log('bad event payload', err.message); } };
      dc.onclose = () => onDisconnected('data channel closed');
      const opened = new Promise((resolve, reject) => { dc.onopen = resolve; setTimeout(() => reject(new Error('data channel did not open')), 15000); });
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      const res = await fetch(OPENAI_CALLS_URL, { method: 'POST', headers: { Authorization: `Bearer ${token.value}`, 'Content-Type': 'application/sdp' }, body: offer.sdp });
      if (!res.ok) throw Object.assign(new Error(`OpenAI call setup failed (HTTP ${res.status})`), { code: res.status === 401 ? 'expired' : 'sdp' });
      await pc.setRemoteDescription({ type: 'answer', sdp: await res.text() });
      await opened;
      connected = true;
      connecting = false;
      reconnectAttempt = 0;
      device.setSetup(null);
      set('idle');
      log(`session ready (${token.model}, voice ${token.voice})`);
      scheduleInstructionRefresh();
    } catch (err) {
      connecting = false;
      teardown();
      onConnectError(err);
    }
  }

  function teardown() {
    clearTimeout(refreshTimer);
    if (dc) { dc.onmessage = dc.onclose = dc.onopen = null; try { dc.close(); } catch { /* ignore */ } }
    if (pc) { pc.onconnectionstatechange = null; pc.ontrack = null; try { pc.close(); } catch { /* ignore */ } }
    dc = null;
    pc = null;
    connected = false;
    speaking = false;
    audioEl.srcObject = null;
  }

  function releaseMicrophone() {
    if (mic) { mic.getTracks().forEach((t) => t.stop()); mic = null; }
  }

  function onConnectError(err) {
    log('connect failed:', err.code || err.name || 'error', err.message);
    if (err.code === 'mic' || err.name === 'NotAllowedError' || err.name === 'NotFoundError' || err.name === 'TimeoutError') {
      enabled = false;
      const text = err.name === 'NotFoundError' ? 'No microphone found.' : err.name === 'TimeoutError' ? 'Microphone permission was not granted. Tap to try again.' : 'Microphone blocked. Allow it in the browser’s site settings, then tap here.';
      device.setSetup({ text, action: `Enable ${name}` });
      return;
    }
    if (['not_configured', 'auth', 'provider_disabled', 'bad_request'].includes(err.code)) {
      // a configuration problem: retrying will not help, wait for a tap
      enabled = false;
      device.setSetup({ text: err.code === 'auth' ? `${name}'s OpenAI key was rejected. Check OPENAI_API_KEY on the server.` : err.code === 'provider_disabled' ? 'Voice is set to the legacy provider on the server.' : `${name} isn’t set up: add OPENAI_API_KEY on the server.`, action: 'Retry' });
      return;
    }
    scheduleReconnect();
  }

  function onDisconnected(reason) {
    if (!connected && !connecting) return;
    log('disconnected:', reason);
    teardown();
    if (status !== 'idle') set('idle');
    scheduleReconnect();
  }

  function scheduleReconnect() {
    if (!enabled || document.visibilityState === 'hidden') return;
    clearTimeout(reconnectTimer);
    if (reconnectAttempt >= RECONNECT_DELAYS_MS.length) {
      log('giving up reconnecting; waiting for a tap');
      device.setSetup({ text: `${name} lost the connection.`, action: 'Reconnect' });
      return;
    }
    const delay = RECONNECT_DELAYS_MS[reconnectAttempt];
    reconnectAttempt += 1;
    log(`reconnecting in ${delay} ms (attempt ${reconnectAttempt})`);
    device.setSetup({ text: 'Reconnecting…', subtle: true });
    reconnectTimer = setTimeout(connect, delay);
  }

  function scheduleInstructionRefresh() {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(async () => {
      if (!connected) return;
      if (status === 'idle') {
        try { const r = await api.realtimeInstructions(timeContext()); if (r?.instructions) { send({ type: 'session.update', session: { type: 'realtime', instructions: r.instructions } }); log('instructions refreshed (clock)'); } }
        catch { /* next time */ }
      }
      scheduleInstructionRefresh();
    }, INSTRUCTIONS_REFRESH_MS);
  }

  // ================================================================ events → UI + tools
  function handleEvent(ev) {
    if (debug) { events.push({ t: Date.now(), type: ev.type, ev }); if (events.length > 200) events.shift(); }
    switch (ev.type) {
      case 'session.created':
      case 'session.updated':
        break;
      case 'input_audio_buffer.speech_started':
        log('speech started');
        clearTimeout(idleTimer);
        userText = '';
        set('listening');
        break;
      case 'input_audio_buffer.speech_stopped':
        log('speech stopped');
        set('processing', { transcript: userText });
        armWatchdog(PROCESSING_WATCHDOG_MS);
        break;
      case 'conversation.item.input_audio_transcription.delta':
        userText += ev.delta || '';
        if (status === 'listening') device.setAssistantState('listening', { transcript: userText });
        break;
      case 'conversation.item.input_audio_transcription.completed':
        userText = (ev.transcript || userText).trim();
        log('heard:', userText);
        if (status === 'processing') device.setAssistantState('processing', { transcript: userText });
        break;
      case 'response.created':
        replyText = '';
        if (status !== 'speaking' && status !== 'listening') set('processing', { transcript: userText });
        armWatchdog(PROCESSING_WATCHDOG_MS);
        break;
      case 'response.output_audio_transcript.delta':
        replyText += ev.delta || '';
        if (status === 'speaking') device.setAssistantState('speaking', { text: replyText });
        break;
      case 'response.output_audio_transcript.done':
        replyText = ev.transcript || replyText;
        break;
      case 'output_audio_buffer.started':
        log('response audio started');
        speaking = true;
        clearWatchdog();
        set('speaking', { text: replyText });
        armWatchdog(AUDIO_WATCHDOG_MS);
        break;
      case 'output_audio_buffer.stopped':
        log('response audio ended');
        speaking = false;
        clearWatchdog();
        afterResponse();
        break;
      case 'output_audio_buffer.cleared':
        log('response audio interrupted');
        speaking = false;
        break;
      case 'response.done':
        onResponseDone(ev.response || {});
        break;
      case 'error':
        log('error event:', ev.error?.type || '', ev.error?.code || '', ev.error?.message || '');
        if (status === 'processing' || status === 'listening') showError("I couldn't process that. Try again.");
        break;
      default:
        break;
    }
  }

  async function onResponseDone(response) {
    const calls = (response.output || []).filter((item) => item.type === 'function_call');
    if (calls.length) { await runToolCalls(calls); return; }
    if (response.status === 'failed') { log('response failed:', JSON.stringify(response.status_details || {}).slice(0, 200)); showError("I couldn't process that. Try again."); return; }
    if (response.status === 'cancelled') { if (status === 'processing') set('idle'); return; }
    const hasAudio = (response.output || []).some((item) => item.type === 'message' && (item.content || []).some((c) => c.type === 'output_audio' || c.type === 'audio'));
    if (!hasAudio && !speaking && status === 'processing') { clearWatchdog(); afterResponse(); } // text-only or silent turn
  }

  /** Execute every function call from a response in order, return the outputs, then let Andrew speak. */
  async function runToolCalls(calls) {
    set('processing', { transcript: userText });
    armWatchdog(PROCESSING_WATCHDOG_MS);
    for (const call of calls) {
      log('function call:', call.name);
      log('arguments:', call.arguments);
      let output;
      if (call.name === 'highlight_items') {
        let ids = [];
        try { ids = JSON.parse(call.arguments || '{}').itemIds || []; } catch { /* ignore */ }
        pendingHighlights = { itemIds: ids, modules: [] };
        device.setHighlights(pendingHighlights);
        output = { success: true };
      } else {
        try {
          const res = await api.realtimeTool({ name: call.name, call_id: call.call_id, arguments: call.arguments || '{}', ...timeContext() });
          output = res.output || { success: false, error: 'No result.' };
          log('action result:', output.success ? 'success' : 'failed', output.message || output.error || '');
          if (res.changed && res.state) {
            toolChanged = true;
            try { device.update(normalizeState(res.state)); } catch { /* keep going */ }
            pendingHighlights = { itemIds: [...pendingHighlights.itemIds, ...(res.highlightItemIds || [])], modules: [...pendingHighlights.modules, ...(call.name === 'set_focus' || call.name === 'set_note' ? [call.name === 'set_focus' ? 'focus' : 'note'] : [])] };
          }
        } catch (err) {
          log('action result: error', err.message);
          output = { success: false, error: 'attn could not reach its own server to run that action.' };
        }
      }
      send({ type: 'conversation.item.create', item: { type: 'function_call_output', call_id: call.call_id, output: JSON.stringify(output) } });
    }
    send({ type: 'response.create' }); // now Andrew can confirm what actually happened
  }

  /** Audio finished (or a silent turn ended): step back to the dashboard, show what changed. */
  function afterResponse() {
    clearTimeout(idleTimer);
    if (toolChanged) {
      toolChanged = false;
      const highlights = pendingHighlights;
      pendingHighlights = { itemIds: [], modules: [] };
      set('success');
      setTimeout(() => device.setHighlights(highlights), 380);
      idleTimer = setTimeout(() => { if (status === 'success') set('idle'); }, SUCCESS_LINGER_MS);
    } else {
      pendingHighlights = { itemIds: [], modules: [] };
      set('idle');
    }
  }

  function armWatchdog(ms) {
    clearTimeout(watchdog);
    watchdog = setTimeout(() => {
      log('watchdog:', status, 'for too long');
      if (status === 'processing') { send({ type: 'response.cancel' }); showError('That took too long. Try again.'); }
      else if (status === 'speaking') { speaking = false; afterResponse(); }
    }, ms);
  }
  const clearWatchdog = () => clearTimeout(watchdog);

  function showError(message) {
    clearWatchdog();
    clearTimeout(idleTimer);
    toolChanged = false;
    set('error', { text: message });
    idleTimer = setTimeout(() => { if (status === 'error') set('idle'); }, ERROR_LINGER_MS);
  }

  // ================================================================ enable / visibility / debug
  async function enable() {
    enabled = true;
    remember(true);
    reconnectAttempt = 0;
    await connect();
  }

  function stopSession(reason) {
    clearTimeout(reconnectTimer);
    teardown();
    releaseMicrophone();
    if (status !== 'idle') set('idle');
    log('session stopped:', reason);
  }

  async function boot() {
    if (!('RTCPeerConnection' in window) || !navigator.mediaDevices?.getUserMedia) { device.setSetup({ text: 'This browser cannot run Andrew (no WebRTC).' }); return; }
    let permission = 'prompt';
    try { permission = (await navigator.permissions.query({ name: 'microphone' })).state; } catch { /* no query support */ }
    if (permission === 'granted' && remembered()) { enable(); return; }
    if (permission === 'denied') { device.setSetup({ text: 'Microphone blocked. Allow it in the browser’s site settings, then tap here.', action: 'Enable Andrew' }); return; }
    device.setSetup({ text: `${name} needs the microphone once.`, action: `Enable ${name}` });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') { if (connected || connecting) stopSession('page hidden'); }
    else if (enabled && !connected) { reconnectAttempt = 0; connect(); }
  });

  device.on('enable', () => enable());
  device.on('talk', () => { if (!connected && !connecting) enable(); });
  device.on('faceTap', (state) => {
    if (state === 'speaking') { send({ type: 'response.cancel' }); send({ type: 'output_audio_buffer.clear' }); }
    else if (state === 'processing' || state === 'listening') { send({ type: 'response.cancel' }); clearWatchdog(); set('idle'); }
    else if (state === 'error') set('idle');
  });
  /** Debug only: a typed message enters the same Realtime conversation (same tools, same session). */
  function submitText(text) {
    const t = (text || '').trim();
    if (!t) return;
    if (!connected) { device.setSetup({ text: 'Not connected. Tap to connect.', action: `Enable ${name}` }); return; }
    log('typed (debug):', t);
    userText = t;
    set('processing', { transcript: t });
    armWatchdog(PROCESSING_WATCHDOG_MS);
    send({ type: 'conversation.item.create', item: { type: 'message', role: 'user', content: [{ type: 'input_text', text: t }] } });
    send({ type: 'response.create' });
  }
  device.on('submitText', submitText);
  device.setAssistantName(name);
  boot();

  return {
    enable,
    disconnect: () => { enabled = false; remember(false); stopSession('disabled'); },
    submitText,
    get status() { return status; },
    get connected() { return connected; },
    get events() { return events; },
    /** Debug only: feed a server event as if it came over the data channel. */
    simulateEvent: (ev) => { if (debug) handleEvent(ev); },
  };
}
