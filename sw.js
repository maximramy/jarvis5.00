// Jarvis service worker: lets Android install Jarvis as an app.
// It always tries the internet first (so you get the newest version),
// and only falls back to a saved copy when you're offline.
const CACHE = 'jarvis-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Only handle Jarvis's own files. Voice (Azure) and brain (Claude) requests go straight through.
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req))
  );
});
