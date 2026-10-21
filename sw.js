const CACHE_PREFIX = `art-compass:${self.registration.scope}:`;
const CACHE = `${CACHE_PREFIX}v12`;
const CORE = [
  './', 'index.html', 'explore.html', '404.html', 'about.html', 'sources.html', 'glossary.html',
  'corrections.html', 'review.html', 'css/fonts.css', 'css/styles.css', 'css/explore.css', 'css/info.css', 'css/architecture.css', 'css/mobile.css', 'css/motion.css', 'css/responsive-images.css',
  'css/reading.css', 'js/periods.js', 'js/chapter-guide.js', 'js/image-viewer.js',
  'js/main.js', 'js/mobile.js', 'js/motion.js', 'js/responsive-images.js', 'js/context.js', 'js/books-maps.js', 'js/story.js', 'js/learning.js',
  'js/study-data.js', 'js/experience-data.js', 'js/work-records.js', 'js/artwork-media.js',
  'js/art-direction.js', 'js/period-experience.js', 'js/world-map.js', 'js/explore.js',
  'assets/favicon.svg', 'manifest.webmanifest',
  'assets/fonts/dm-sans-latin-wght-normal.woff2',
  'assets/fonts/cormorant-garamond-latin-wght-normal.woff2',
  'assets/fonts/cormorant-garamond-latin-wght-italic.woff2',
  'assets/fonts/dm-mono-latin-400-normal.woff2',
  'assets/fonts/unifrakturmaguntia-latin-400-normal.woff2'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.registration.scope)) return;
  // Prefer current files while developing; preserve visited pages for offline reading.
  event.respondWith(fetch(event.request).then(async response => {
    if (response.status >= 500) return (await cachedResponse(event.request)) || response;
    if (response.ok) {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE).then(cache => cache.put(event.request, copy)).catch(() => {}));
    }
    return response;
  }).catch(async () => {
    const cached = await cachedResponse(event.request);
    if (cached) return cached;
    if (event.request.mode === 'navigate') {
      const missing = await (await caches.open(CACHE)).match(new URL('404.html', self.registration.scope));
      if (missing) return new Response(await missing.text(), {status:404, headers:missing.headers});
    }
    return Response.error();
  }));
});

async function cachedResponse(request) {
  const cache = await caches.open(CACHE);
  const exact = await cache.match(request);
  if (exact) return exact;
  // The chapter shell reads its query string locally; keep that URL when offline.
  if (request.mode === 'navigate') {
    const url = new URL(request.url);
    url.search = '';
    return cache.match(url.href);
  }
}
