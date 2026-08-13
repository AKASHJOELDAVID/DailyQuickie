// DailyQuickie service worker
//
// Deliberately minimal. This app shows live/realtime notes, so we never want
// someone to open the "app" and see yesterday's cached feed. This worker exists
// mainly to satisfy Android's "installable PWA" requirement (having an active
// service worker with a fetch handler) — it is NOT trying to make the app
// work fully offline.
//
// Strategy: network-first, always. Only fall back to a cached copy of the
// page shell if the network request fails outright (i.e. actually offline).

const CACHE_NAME = 'dailyquickie-shell-v1';
const APP_SHELL = ['./', './index.html'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
