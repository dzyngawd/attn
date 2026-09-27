/**
 * attn — Deep Focus audio through the official YouTube IFrame Player API.
 *
 * ONE reusable YT.Player, created early (during the Enable Andrew tap) inside the
 * persistent player slot of the device screen; never destroyed between tracks.
 * Playback is only believed when the player itself reports PLAYING: if nothing
 * plays within a few seconds of loadVideoById/playVideo (or the player fires
 * onAutoplayBlocked) the caller gets onBlocked and shows the one-tap fallback.
 * Nothing is downloaded or cached locally; no account, cookies or Premium involved.
 *
 *   const player = createFocusPlayer({ onBlocked, onState, log });
 *   player.prime()                  // load the IFrame API script (cheap, do it on the user's tap)
 *   player.mount(mountEl)           // create the player in its slot (no video yet)
 *   player.play(mountEl, videoId)   // load + play (reuses the player when the slot is unchanged)
 *   player.resume() / player.pause() / player.stop()
 */
const API_SRC = 'https://www.youtube.com/iframe_api';
const PLAY_TIMEOUT_MS = 6000; // no PLAYING state this long after asking → treat as blocked
export const STATE_NAMES = { '-1': 'unstarted', 0: 'ended', 1: 'playing', 2: 'paused', 3: 'buffering', 5: 'cued' };
let apiPromise = null;

function loadApi() {
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { previous?.(); resolve(window.YT); };
    const s = document.createElement('script');
    s.src = API_SRC;
    s.async = true;
    s.onerror = () => { apiPromise = null; reject(new Error('YouTube IFrame API failed to load')); };
    document.head.appendChild(s);
    setTimeout(() => reject(new Error('YouTube IFrame API timed out')), 20000);
  });
  return apiPromise;
}

export function createFocusPlayer({ onBlocked = () => {}, onState = () => {}, log = () => {} } = {}) {
  let player = null;
  let mount = null;
  let host = null;       // the div the API replaces with the iframe
  let currentId = null;  // the track attn wants (set as soon as play() is called)
  let loadedId = null;   // the track the player actually has
  let ready = null;      // pending/ready player for the current mount (repeated polls never rebuild it)
  let playing = false;   // what the player last reported
  let playTimer = null;

  function armPlayTimer(why) {
    clearTimeout(playTimer);
    playTimer = setTimeout(() => {
      if (playing || !currentId) return;
      log(`no playback ${PLAY_TIMEOUT_MS / 1000} s after ${why} — treating it as blocked`);
      onBlocked();
    }, PLAY_TIMEOUT_MS);
  }

  async function ensure(mountEl) {
    if (ready && mount === mountEl && mountEl.isConnected) return ready;
    destroy();
    mount = mountEl;
    ready = (async () => {
      const YT = await loadApi();
      host = document.createElement('div');
      mountEl.replaceChildren(host);
      log('creating the YouTube player');
      return new Promise((resolve) => {
        player = new YT.Player(host, {
          width: '100%',
          height: '100%',
          playerVars: { playsinline: 1, rel: 0, modestbranding: 1, origin: location.origin },
          events: {
            onReady: () => { log('YouTube player ready'); resolve(player); },
            onStateChange: (e) => {
              const code = e.data;
              log('player state:', STATE_NAMES[code] ?? code);
              playing = code === 1;
              if (playing) clearTimeout(playTimer);
              onState(code);
            },
            onAutoplayBlocked: () => { log('onAutoplayBlocked: the browser refused to start audio without a tap'); clearTimeout(playTimer); onBlocked(); },
            onError: (e) => { log('YouTube player error', e.data); clearTimeout(playTimer); onBlocked(); },
          },
        });
      });
    })();
    ready.catch((err) => { log('player could not be created:', err.message); ready = null; });
    return ready;
  }

  return {
    prime() { return loadApi().then(() => log('IFrame API loaded'), (err) => log(err.message)); },
    mount(mountEl) { return ensure(mountEl); },
    async play(mountEl, videoId) {
      currentId = videoId;
      const p = await ensure(mountEl);
      if (currentId !== videoId) return; // superseded while the API was loading
      if (loadedId !== videoId) { loadedId = videoId; playing = false; log('loadVideoById', videoId); p.loadVideoById(videoId); }
      else { log('playVideo', videoId); p.playVideo(); }
      armPlayTimer(loadedId === videoId ? 'loadVideoById' : 'playVideo');
    },
    resume() { try { log('playVideo (user tap)'); player?.playVideo(); armPlayTimer('the tap'); } catch { /* ignore */ } },
    pause() { try { player?.pauseVideo(); } catch { /* ignore */ } },
    stop() { clearTimeout(playTimer); try { player?.stopVideo(); } catch { /* ignore */ } currentId = null; loadedId = null; playing = false; },
    get videoId() { return currentId; },
    get playing() { return playing; },
    get mounted() { return Boolean(ready && mount && mount.isConnected); },
  };

  function destroy() {
    clearTimeout(playTimer);
    try { player?.destroy(); } catch { /* ignore */ }
    player = null;
    mount = null;
    host = null;
    currentId = null;
    loadedId = null;
    ready = null;
    playing = false;
  }
}
