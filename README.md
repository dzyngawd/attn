# attn

**attn** is a personal assistant device. Phase 1 is the foundation, Phase 2 adds the voice assistant:

```
Control Centre (laptop)  →  shared state (one JSON object)  →  Device (phone)
                                       ↑
            Voice / typed command  →  Gemini  →  validated actions
```

Change something in the Control Centre and it appears on the phone within a second or two. Tap the face on the phone and talk: attn ("Andrew") turns natural language into the same state changes. No real integrations yet.

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

## Talk to attn (voice + AI)

Leave `/device` open and say **"Hey Andrew, …"**. attn:

1. keeps a foreground speech-recognition loop running (Web Speech API) and looks for the wake phrase locally; nothing is sent, spoken or changed until it hears "Hey Andrew" (also "Andrew", "OK Andrew"). A bare "Hey Andrew" makes him listen for about nine seconds; a command in the same sentence runs straight away,
2. POSTs the transcript to `/api/assistant/command` with the current time, timezone and locale,
3. asks Gemini which of the whitelisted **functions** to call (the action registry plus `clarify` and `respond`), never free-form parsing,
4. validates every action, runs the whitelisted ones through `public/js/actions.js` (the same functions the Control Centre uses), saves through the normal persistence path,
5. sends the real results back to Gemini for one short spoken sentence (with a deterministic fallback that never hides a failure), applies the new state on the device immediately, pulses the cards it touched, and speaks (SpeechSynthesis).

After a reply, corrections such as "Actually make that noon" or answers to a question ("Five") need no wake phrase. The microphone is off while Andrew speaks so he cannot hear himself, recognition restarts itself whenever Chrome ends it, and it pauses while the page is hidden. The first visit needs one tap on **Enable Andrew** (microphone permission and speech unlock); after that it is hands-free while the page stays open. `/device?debug=1` adds a typed command box that uses the exact same pipeline, plus `window.attnDebug.simulate("Hey Andrew, …")` in the console. `lib/assistant.js` holds the prompt, the reply schema, validation and a ten-minute conversation memory per device, enough for "What time today?" → "Five." and "Actually make that 3:30."

**What the assistant can do** (`ASSISTANT_ACTIONS` in `public/js/actions.js`): add an item to Pay attention to / Upcoming / Important email (with a resolved time), update or remove an item, show or hide a module, turn Focus mode on or off with a label and optional time block, write the Quick note, and answer questions about what is on the device.

**Intentionally unsupported** (Andrew says so instead of pretending): sending or reading email, real calendars, playing music or audio, alarms/notifications, calls, browsing, long-term memory.

### Configure

| Variable | Required | What |
| --- | --- | --- |
| `GEMINI_API_KEY` | yes | Server-side only. Never shipped to the browser, never committed. |
| `GEMINI_MODEL` | no | Default `gemini-3.8-flash`. `gemini-3.5-flash-lite` is the cheaper/faster option; `gemini-flash-latest` always points at the newest Flash. |
| `GEMINI_FALLBACK_MODEL` | no | Default `gemini-3.5-flash-lite`: tried once when the main model answers 429 (quota). `0` disables. |
| `GEMINI_FOLLOW_UP` | no | `0` skips the second wording request per command (halves quota use); attn then speaks a plain confirmation. |
| `GEMINI_THINKING_LEVEL` | no | `LOW` (default), `MEDIUM`, `HIGH` or `off`. Lower is faster. |
| `ASSISTANT_NAME` | no | Default `Andrew`. Used in speech, on screen and as an optional wake word. |
| `ATTN_ASSISTANT_MOCK` | no | `1` answers with a built-in stub instead of Gemini (dev/testing only). |

**Get a key:** open [Google AI Studio](https://aistudio.google.com/apikey), sign in with a Google account, click *Create API key* and copy it. The free tier costs nothing; on the free tier Google may use prompts and responses to improve its products, so keep demo content non-sensitive (paid-tier data is not used that way).

**Locally:** copy `.env.example` to `.env` and paste the key after `GEMINI_API_KEY=`.

**On Render:** Dashboard → the `attn` service → **Environment** → *Add Environment Variable* → key `GEMINI_API_KEY`, value = the key → *Save Changes*. Render restarts the service automatically. `GET /api/assistant/status` shows `configured: true` once it is picked up.

**Free-tier limits:** per-model requests-per-minute and per-day caps apply and change over time; see your live numbers at [aistudio.google.com/rate-limit](https://aistudio.google.com/rate-limit). When a cap is hit the API answers 429 and Andrew says he is getting too many requests. Preview models have lower limits than stable ones; stay on a stable Flash model for demos.

### Try saying

- "Hey Andrew, remind me to reply to Sarah's email at 11."
- "Get me to pay attention to my design review at 2:30 and add it to my calendar."
- "Actually make that 3:30."
- "Remind me to book my flight to Frankfurt later today." → Andrew asks for a time → "Five."
- "What should I pay attention to over the next three hours?"
- "Give me an hour of focus starting at ten." · "Play some deep focus music."
- "Show me my calendar stuff." · "Hide the email things."
- "Note that the Wi-Fi password is on the fridge."

### Browser notes

Speech recognition needs Chrome (Android or desktop) and a network connection; Firefox and some WebViews have none, so the typed box is the fallback. Voices for speech synthesis vary per phone; attn prefers a natural English voice and falls back to the default. Microphone permission is asked on the first tap.

## Where state lives

- **Runtime:** `data/state.json` (git-ignored). Written atomically on every save, loaded on boot.
- **Shape + defaults:** `public/js/state.js`. Imported by the server *and* both frontends, so validation happens in one place. `normalizeState()` turns any malformed or partial input into a valid state. Items carry an optional `at` timestamp (set by the assistant); `subtitle` stays the human label.
- **Mutations:** `public/js/actions.js` — every change, from the Control Centre or the assistant, goes through these functions.
- **Ephemeral hosts:** if the server ever restarts empty (fresh deploy on Replit Autoscale / Render free), the Control Centre restores its localStorage backup automatically. Set `ATTN_STATE_FILE=/some/volume/state.json` on hosts with a persistent disk.

## Project layout

```
server.js                  Express: static files + /api/state + /api/status + /api/assistant/* + JSON persistence
lib/assistant.js           AI command router: prompt, function declarations, validation, execution, conversation memory
lib/gemini.js              the only file that talks to Gemini (function calling, key from env)
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
  js/assistant.js          tap-to-talk, speech in/out, the command pipeline states
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
