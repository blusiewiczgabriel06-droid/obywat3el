/* Simple cache-first service worker for offline-ish PWA behavior.
   Keep it tiny so it doesn't break iOS/Safari.
*/

const CACHE_NAME = 'xyzobywatel-v1';
const CORE_ASSETS = [
  './',
  './config.html',
  './home.html',
  './assets/manifest.json',
  './assets/main.css',
  './assets/home.css',
  './assets/bar.js',
  './shared.js',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then((cached) =>
      cached || fetch(req).then((res) => {
        // Cache same-origin successful responses.
        try {
          const url = new URL(req.url);
          if (url.origin === self.location.origin && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
        } catch (e) {}
        return res;
      }).catch(() => cached)
    )
  );
});
