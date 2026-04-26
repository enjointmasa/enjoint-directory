const CACHE = 'enjoint-directory-v6';
// These large library files are stable — cache-first is fine
const LIB_CACHE = ['/enjoint-directory/msal.js', '/enjoint-directory/jszip.min.js'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      Promise.allSettled(LIB_CACHE.map(url => c.add(url)))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Network-only: auth and API
  if (
    url.includes('login.microsoftonline.com') ||
    url.includes('graph.microsoft.com') ||
    url.includes('microsoftonline.com')
  ) {
    e.respondWith(fetch(e.request));
    return;
  }

  // Network-first for HTML (index.html / root) — always get the latest code
  if (e.request.mode === 'navigate' || url.endsWith('.html') || url.endsWith('/')) {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  // Cache-first for library files (msal.js, jszip.min.js, icons, manifest)
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      if (res.ok && e.request.method === 'GET') {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }))
  );
});
