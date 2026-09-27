/**
 * attn — Deep Focus audio: a small hardcoded set of public PureGritStudio
 * playlists (https://www.youtube.com/@PureGritStudio), played through the
 * official YouTube IFrame Player inside the Focus card. No search, no API,
 * no downloads: one is picked at random when focus music starts.
 * Titles are the videos' own titles (verified via YouTube oEmbed).
 */
export const FOCUS_TRACKS = [
  { title: 'playlist to unlock hyper focus.', videoId: 'A-R177XUPfw' },
  { title: 'playlist to focus for 2 hours straight.', videoId: 'BxCEWjmVKjI' },
  { title: 'music to activate 100% of your brain.', videoId: 'q3VSFDKYOWg' },
  { title: '3 hour playlist for a deepwork session.', videoId: 'HNuta8F3qkM' },
  { title: 'the playlist to actually enter flowstate.', videoId: 'wdDhTr_M7kA' },
  { title: '4 hour playlist to peak.', videoId: 'FQpuSV9AHQ4' },
  { title: 'playlist to enter flowstate.', videoId: 'TxUoUKYult4' },
  { title: 'listen to this if you actually want to unlock flow state.', videoId: 'gPgwk6bZeh4' },
];

export const pickFocusTrack = (excludeId) => {
  const pool = FOCUS_TRACKS.filter((t) => t.videoId !== excludeId);
  return pool[Math.floor(Math.random() * pool.length)] || FOCUS_TRACKS[0];
};

export const findFocusTrack = (videoId) => FOCUS_TRACKS.find((t) => t.videoId === videoId) || null;
