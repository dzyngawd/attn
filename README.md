# attn — Phase 1

**attn** is a personal assistant device. This phase proves the foundation:

```
Control Centre (laptop)  →  shared state (one JSON object)  →  Device (phone)
```

Change something in the Control Centre and it appears on the phone within a second or two. No voice, no real integrations yet — those are later phases.

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

## Where state lives

- **Runtime:** `data/state.json` (git-ignored). Written atomically on every save, loaded on boot.
- **Shape + defaults:** `public/js/state.js`. Imported by the server *and* both frontends, so validation happens in one place. `normalizeState()` turns any malformed or partial input into a valid state.
- **Ephemeral hosts:** if the server ever restarts empty (fresh deploy on Replit Autoscale / Render free), the Control Centre restores its localStorage backup automatically. Set `ATTN_STATE_FILE=/some/volume/state.json` on hosts with a persistent disk.

## Project layout

```
server.js                  Express: static files + /api/state + /api/status + JSON persistence
public/
  control.html / device.html / index.html
  css/tokens.css           design tokens curated from design-system/ (colours, type, radii, motion)
  css/shared.css           reset, buttons, switch, chips, orb, toast (Control Centre + landing)
  css/control.css          Control Centre layout
  css/device.css           the device: ambient gradient, face, cards, transitions
  js/state.js              shared state model + normalizeState()   ← single source of truth
  js/api.js                fetch wrapper with timeouts
  js/render-device.js      the device renderer (used by /device AND the live preview)
  js/device.js             device boot: polling, clock, PWA install, service worker
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

## Where voice goes next

```
User speaks → speech-to-text → AI interprets → predefined function → attn displays → attn speaks
```

- **Capture** starts in `public/js/device.js` (microphone / speech-to-text).
- **Interpretation** is a new server route next to `/api/state` in `server.js`; predefined functions mutate the shared state through `applyState()`.
- **Display** already works: the device shows whatever lands in the state. Listening / thinking / speaking states are an overlay layer in `public/js/render-device.js` (see the note at the top of that file), driven by a new state field.
- The design system's `components/device/AttnOrb.jsx` and `AttnFace.jsx` describe the intended voice visuals.
