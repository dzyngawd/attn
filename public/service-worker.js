/**
 * attn — service worker (Phase 1: installability, not offline mode).
 *
 * Strategy:
 *   - /api/*  → never touched: live data always goes to the network
 *   - everything else → network first, falling back to the cached app shell,
 *     so a deploy shows up on the next open and a dropped connection still
 *     opens the device (which then shows "Reconnecting…").
 * Bump VERSION when you want every installed device to drop its old shell.
 */
const VERSION = 'attn-shell-v2';
const SHELL = [
  '/', '/control', '/device',
  '/css/tokens.css', '/css/shared.css', '/css/device.css', '/css/control.css',
  '/js/api.js', '/js/state.js', '/js/actions.js', '/js/icons.js', '/js/brand.js', '/js/render-device.js', '/js/device.js', '/js/assistant.js', '/js/control.js',
  '/assets/attn-logo.svg', '/manifest.json',
  '/icons/icon-192.png', '/icons/icon-512.png', '/icons/icon-maskable-512.png', '/icons/icon-180.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) caches.open(VERSION).then((cache) => cache.put(request, response.clone()));
        return response;
      })
      .catch(() => caches.match(request, { ignoreSearch: true })
        .then((hit) => hit || (request.mode === 'navigate' ? caches.match('/device') : Response.error()))),
  );
});
