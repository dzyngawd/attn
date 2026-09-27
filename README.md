# attn

**attn** is a personal assistant device. Phase 1 is the foundation, Phase 2 adds the voice assistant:

```
Control Centre (laptop)  →  shared state (one JSON object)  →  Device (phone)
                                       ↑
        Voice (OpenAI Realtime, WebRTC)  →  function calls  →  validated actions
```

Change something in the Control Centre and it appears on the phone within a second or two. Say "Hey Andrew, …" to the phone and Andrew (OpenAI Realtime, speech to speech) turns it into the same state changes and answers in his own voice. No real integrations yet.

## Run it locally

Needs Node 18+ (`node -v`).

```bash
npm install
npm start
```

Then open:

| What | URL |
| --- | --- |
| Control Centre (laptop) | http://localhost:3000/control |
| Device (phone) | http://localhost:3000/device |

The server prints a `http://<your-lan-ip>:3000/device` URL at startup — open that on a phone on the same Wi-Fi to test before deploying. `npm run dev` restarts the server when files change.

## How the two interfaces talk

- **`GET /api/state`** returns the shared state. The device polls it every 1.5 s and re-renders only when `revision` changes. The device adds `?client=device`, which is how the Control Centre knows a phone is connected.
- **`POST /api/state`** replaces the shared state. The Control Centre autosaves a few hundred milliseconds after each edit. The server validates/normalises the body, bumps `revision`, stamps `updatedAt`, and writes the file.
- **`GET /api/status`** is a tiny read for the "Device connected · Synced just now" pills.

No WebSockets, no database. Polling is plenty at this size.

## Talk to attn (voice)

Production voice is **OpenAI Realtime over WebRTC** (`VOICE_PROVIDER=openai`, the default):

1. On the first visit tap **Enable Andrew** once: the browser asks for the microphone, the page fetches a short-lived client secret from `POST /api/realtime/token` (the permanent `OPENAI_API_KEY` never leaves the server), and a WebRTC session opens with Andrew's instructions, voice and tools baked in.
2. The session stays connected while the page is visible. OpenAI's turn detection hears and transcribes every turn but never answers on its own (create_response is off): the device reads each transcript and only forwards turns that start with "Hey Andrew" (or "Andrew,", "OK Andrew"), so room talk changes nothing, not even the screen. A command in the same sentence runs straight away; a bare "Hey Andrew" opens a nine-second listening window. After Andrew answers, a nine-second follow-up window (twelve after a question) accepts "Actually make that noon" or "Five" without the wake phrase; then he goes passive again. Ignored turns are deleted from the session so they never colour his context.
3. When the model decides on an action it calls one of the tools built from the real registry (`public/js/actions.js`). The device posts the call to `POST /api/realtime/tool`, which validates it (times in your timezone), runs the shared mutation, saves the state, and returns the result (with item ids) as `function_call_output`. Only then does Andrew speak the confirmation, in OpenAI's voice.
4. The face states come from real events: speech start → listening, speech stop → processing, tool calls → processing, audio playback start → speaking, playback end → success with the changed cards highlighted. Interruptions are handled by the session (barge-in).
5. If the connection drops the device reconnects with backoff; if the page is hidden the session stops and resumes when it is visible again.

Tools exposed: `add_item`, `update_item`, `remove_item`, `set_module_visibility`, `set_focus`, `set_note`, plus read-only `query_attn_state` and `highlight_items`.

**Intentionally unsupported** (Andrew says so instead of pretending): sending or reading email, real calendars, playing music or audio, alarms/notifications, calls, browsing, long-term memory.

### Configure

| Variable | Required | What |
| --- | --- | --- |
| `OPENAI_API_KEY` | yes | Server-side only. Never shipped to the browser, never committed. |
| `VOICE_PROVIDER` | no | `openai` (default) or `legacy` (Chrome speech + Gemini, rollback only; never both). |
| `OPENAI_REALTIME_MODEL` | no | Default `gpt-realtime-2.1`. |
| `OPENAI_REALTIME_VOICE` | no | Default `cedar`; `marin` is the other natural option. |
| `OPENAI_REALTIME_VAD` | no | `semantic` (default, eagerness low) or `server` (700 ms silence) if the phone cuts you off. |
| `OPENAI_REALTIME_TRANSCRIBE` | no | Input transcription model (default `gpt-4o-mini-transcribe`); the wake gate reads it, so it is always on. |

**On Render:** Dashboard → the `attn` service → **Environment** → add `OPENAI_API_KEY` (value = your key) and `VOICE_PROVIDER` = `openai` → *Save Changes*. Render restarts the service. `GET /api/assistant/status` shows `realtime.configured: true` once it is picked up.

**Locally:** copy `.env.example` to `.env` and paste the key. `node scripts/realtime-smoke.mjs` runs the test sentences through a real Realtime session in text mode (no microphone) against a running server.

### Legacy voice stack (rollback)

`VOICE_PROVIDER=legacy` switches the device back to the previous pipeline: Chrome SpeechRecognition with a local wake phrase → `POST /api/assistant/command` (Gemini function calling) → browser speech synthesis. It needs `GEMINI_API_KEY`. It exists only until the Realtime path is verified on the phone.

### Try saying

- "Hey Andrew, remind me to reply to Sarah's email at 11." then "Actually make that noon."
- "Hey Andrew, get me to pay attention to my design review at 2:30 and add it to my calendar."
- "Hey Andrew, remind me to book my flight to Frankfurt later today." → "What time today?" → "Five."
- "Hey Andrew, what should I pay attention to over the next three hours?"
- "Hey Andrew, give me an hour of focus starting at ten." · "Hey Andrew, play some deep focus music."
- "Hey Andrew, hide the email things." · "Hey Andrew, put a note saying call Mum." · "Hey Andrew, I'm done with the design review."

### Browser notes

Needs a browser with WebRTC and microphone access (Chrome on Android is the target). The first tap also unlocks audio playback. Recognition and speech both run on OpenAI, so nothing depends on the phone's speech engines. `/device?debug=1` adds a typed box that sends text into the same Realtime conversation plus `window.attnDebug` (recent events, `say("…")`, `simulateEvent`).

## Where state lives

- **Runtime:** `data/state.json` (git-ignored). Written atomically on every save, loaded on boot.
- **Shape + defaults:** `public/js/state.js`. Imported by the server *and* both frontends, so validation happens in one place. `normalizeState()` turns any malformed or partial input into a valid state. Items carry an optional `at` timestamp (set by the assistant); `subtitle` stays the human label.
- **Mutations:** `public/js/actions.js` — every change, from the Control Centre or the assistant, goes through these functions.
- **Ephemeral hosts:** if the server ever restarts empty (fresh deploy on Replit Autoscale / Render free), the Control Centre restores its localStorage backup automatically. Set `ATTN_STATE_FILE=/some/volume/state.json` on hosts with a persistent disk.

## Project layout

```
server.js                  Express: static files + /api/state + /api/status + /api/assistant/* + JSON persistence
lib/assistant.js           AI command router: prompt, function declarations, validation, execution, conversation memory
lib/realtime.js            OpenAI Realtime bridge: client secrets, session config (instructions, voice, VAD, tools), tool execution
lib/gemini.js              legacy provider (VOICE_PROVIDER=legacy only)
lib/time.js                local wall time ↔ instants, short labels ("2:30 PM", "Tomorrow, 9:00 AM")
public/
  control.html / device.html / index.html
  css/tokens.css           design tokens curated from design-system/ (colours, type, radii, motion)
  css/shared.css           reset, buttons, switch, chips, orb, toast (Control Centre + landing)
  css/control.css          Control Centre layout
  css/device.css           the device: ambient gradient, face, cards, transitions
  js/state.js              shared state model + normalizeState()   ← single source of truth
  js/actions.js            shared mutations + the assistant action whitelist
  js/api.js                fetch wrapper with timeouts
  js/render-device.js      the device renderer (used by /device AND the live preview)
  js/device.js             device boot: polling, clock, PWA install, service worker, assistant
  js/realtime.js           the production voice client: WebRTC session, real events → UI states, tool bridge
  js/assistant.js          legacy voice client (Chrome speech + Gemini), rollback only
  js/control.js            Control Centre: sources, modules, autosave, status, preview
  js/icons.js  js/brand.js tile glyphs, wordmark
  manifest.json / service-worker.js / icons/
design-system/             the attn design-system export (source of truth, not served)
```

## Deploy

Pick one. Both give you an HTTPS URL and redeploy on every push.

**Replit (preferred)**
1. replit.com → *Create Repl* → *Import from GitHub* → paste the repo URL. `.replit` already sets the run command.
2. Press *Run* to try it, then *Deploy* (Autoscale is fine) to get a permanent `https://…replit.app` URL.

**Render (free tier)**
1. dashboard.render.com → *New* → *Blueprint* → pick the repo. `render.yaml` does the rest.
2. Free instances sleep after 15 min idle and take ~30 s to wake; open both pages a minute before a demo.

Your two links are then `https://<app>/control` and `https://<app>/device`.

### Update workflow

```
edit code  →  git commit && git push  →  host redeploys  →  refresh / reopen attn
```

## Install attn on Android

1. Open `https://<app>/device` in Chrome on the phone.
2. Tap **Install attn** at the bottom of the screen (or Chrome menu ⋮ → *Add to Home screen* / *Install app*).
3. Launch it from the home screen: it opens full-screen, portrait, straight into the device, and reconnects to the same backend.

## What comes next

Real sources. Connect Google Calendar / Gmail on the server, fill `modules.calendar.items` and `modules.mail.items` from them instead of manual input, and expose the new abilities to the assistant by adding entries to `ASSISTANT_ACTIONS`; nothing else changes.
