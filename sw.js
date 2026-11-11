// Eigenes Präfix: Auf GitHub Pages teilt sich die App die Adresse mit Iron Ledger,
// und Caches gehören zur Adresse. Beim Aufräumen werden nur eigene alte Caches gelöscht.
const PREFIX = 'caelifts-coach-';
const CACHE = PREFIX + 'v1';
// Relativ zur SW-Position — funktioniert in jedem Unterpfad und lokal
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.svg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fetched = fetch(e.request).then((res) => {
        if (res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then((cache) => cache.put(e.request, clone));
        }
        return res;
      });
      return cached || fetched;
    })
  );
});
