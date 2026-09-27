/**
 * attn — Deep Focus audio through the official YouTube IFrame Player API.
 *
 * One reusable YT.Player, mounted inside the Focus card (visible, never hidden
 * offscreen, controls never covered). The API script is loaded once, only when
 * focus music is first needed. Nothing is downloaded or cached locally.
 *
 *   const player = createFocusPlayer({ onBlocked, onState, log });
 *   player.play(mountEl, videoId)   // load + play (recreates the player if the mount changed)
 *   player.pause() / player.stop()
 */
const API_SRC = 'https://www.youtube.com/iframe_api';
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
    s.onerror = () => reject(new Error('YouTube IFrame API failed to load'));
    document.head.appendChild(s);
    setTimeout(() => reject(new Error('YouTube IFrame API timed out')), 15000);
  });
  return apiPromise;
}

export function createFocusPlayer({ onBlocked = () => {}, onState = () => {}, log = () => {} } = {}) {
  let player = null;
  let mount = null;
  let host = null;       // the div the API replaces with the iframe
  let currentId = null;  // the track attn wants (set as soon as play() is called)
  let loadedId = null;   // the track the player actually has
  let ready = null;      // pending/ready player for the current mount (so repeated polls never rebuild it)

  async function ensure(mountEl) {
    if (ready && mount === mountEl && mountEl.isConnected) return ready;
    destroy();
    mount = mountEl;
    ready = (async () => {
      const YT = await loadApi();
      host = document.createElement('div');
      mountEl.replaceChildren(host);
      return new Promise((resolve) => {
      player = new YT.Player(host, {
        width: '100%',
        height: '100%',
        playerVars: { playsinline: 1, rel: 0, modestbranding: 1, origin: location.origin },
        events: {
          onReady: () => { log('YouTube player ready'); resolve(player); },
          onStateChange: (e) => onState(e.data),
          onAutoplayBlocked: () => { log('autoplay blocked by the browser'); onBlocked(); },
          onError: (e) => log('YouTube player error', e.data),
        },
      });
      });
    })();
    return ready;
  }

  return {
    async play(mountEl, videoId) {
      currentId = videoId;
      const p = await ensure(mountEl);
      if (currentId !== videoId) return; // superseded while the API was loading
      if (loadedId !== videoId) { loadedId = videoId; log('loading track', videoId); p.loadVideoById(videoId); }
      else p.playVideo();
    },
    resume() { try { player?.playVideo(); } catch { /* ignore */ } },
    pause() { try { player?.pauseVideo(); } catch { /* ignore */ } },
    stop() { try { player?.stopVideo(); } catch { /* ignore */ } currentId = null; loadedId = null; },
    get videoId() { return currentId; },
    get mounted() { return Boolean(ready && mount && mount.isConnected); },
  };

  function destroy() {
    try { player?.destroy(); } catch { /* ignore */ }
    player = null;
    mount = null;
    host = null;
    currentId = null;
    loadedId = null;
    ready = null;
  }
}
