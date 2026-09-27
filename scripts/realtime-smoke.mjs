#!/usr/bin/env node
/**
 * attn — Realtime smoke test in TEXT mode (no microphone, no browser).
 *
 *   node scripts/realtime-smoke.mjs [baseUrl] ["sentence" ...]
 *
 * Gets a client secret from the running server (which needs OPENAI_API_KEY),
 * opens a WebSocket to OpenAI Realtime with the SAME session (instructions,
 * tools, voice), sends each sentence as a user text message, executes the
 * model's function calls through POST /api/realtime/tool exactly like the
 * device does, returns the outputs, and prints what Andrew would say.
 * Audio is not exercised; everything else in the pipeline is.
 */
const base = process.argv[2] && process.argv[2].startsWith('http') ? process.argv[2] : (process.env.ATTN_BASE_URL || 'http://localhost:3000');
const sentences = process.argv.slice(process.argv[2]?.startsWith('http') ? 3 : 2);
const DEFAULT = [
  "Hey Andrew, remind me to reply to Sarah's email at 11.",
  'Actually make that noon.',
  'Hey Andrew, get me to pay attention to my design review at 2:30 and add it to my calendar.',
  'Hey Andrew, remind me to book my flight to Frankfurt later today.',
  'Five.',
  'Hey Andrew, what should I pay attention to over the next three hours?',
  'Hey Andrew, give me an hour of focus starting at ten.',
  'Hey Andrew, play some deep focus music.',
  'Hey Andrew, hide the email things.',
  'Hey Andrew, put my review on for half two.',
  "Hey Andrew, I'm done with the design review.",
  'Hey Andrew, put a note saying call Mum.',
];
const ctx = () => ({ currentTime: new Date().toISOString(), timezone: process.env.TZ_NAME || Intl.DateTimeFormat().resolvedOptions().timeZone, locale: 'en-US' });
const post = async (path, body) => { const r = await fetch(base + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); const j = await r.json(); if (!r.ok) throw new Error(`${path} → ${r.status} ${j.error || ''} ${j.message || ''}`); return j; };

const token = await post('/api/realtime/token', ctx());
console.log(`client secret ok · model ${token.model} · voice ${token.voice}`);
const ws = new WebSocket(`wss://api.openai.com/v1/realtime?model=${encodeURIComponent(token.model)}`, ['realtime', `openai-insecure-api-key.${token.value}`]);
const queue = [];
let waiter = null;
ws.onmessage = (m) => { const ev = JSON.parse(m.data); queue.push(ev); if (waiter) { waiter(); waiter = null; } };
const next = () => new Promise((r) => { if (queue.length) return r(queue.shift()); waiter = () => r(queue.shift()); });
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = (e) => rej(new Error('websocket error ' + (e.message || ''))); });
ws.send(JSON.stringify({ type: 'session.update', session: { type: 'realtime', output_modalities: ['text'] } }));

async function turn(text) {
  console.log(`\n▶ "${text}"`);
  ws.send(JSON.stringify({ type: 'conversation.item.create', item: { type: 'message', role: 'user', content: [{ type: 'input_text', text }] } }));
  ws.send(JSON.stringify({ type: 'response.create' }));
  for (;;) {
    const ev = await next();
    if (ev.type === 'error') { console.log('  error:', ev.error?.message); return; }
    if (ev.type !== 'response.done') continue;
    const out = ev.response?.output || [];
    const calls = out.filter((i) => i.type === 'function_call');
    const text = out.filter((i) => i.type === 'message').flatMap((i) => i.content || []).map((c) => c.text || c.transcript || '').join('').trim();
    if (text) console.log('  Andrew:', text);
    if (!calls.length) return;
    for (const c of calls) {
      const res = await post('/api/realtime/tool', { name: c.name, call_id: c.call_id, arguments: c.arguments, ...ctx() });
      console.log(`  tool ${c.name}(${c.arguments}) → ${JSON.stringify(res.output).slice(0, 160)}`);
      ws.send(JSON.stringify({ type: 'conversation.item.create', item: { type: 'function_call_output', call_id: c.call_id, output: JSON.stringify(res.output) } }));
    }
    ws.send(JSON.stringify({ type: 'response.create' }));
  }
}
for (const s of (sentences.length ? sentences : DEFAULT)) await turn(s);
ws.close();
console.log('\ndone');
