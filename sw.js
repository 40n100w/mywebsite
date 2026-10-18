const CACHE = 'art-compass-v8';
const CORE = [
  './', 'index.html', 'explore.html', 'about.html', 'sources.html', 'glossary.html',
  'corrections.html', 'review.html', 'css/fonts.css', 'css/styles.css', 'css/explore.css', 'css/info.css', 'css/architecture.css', 'css/mobile.css', 'css/motion.css', 'css/responsive-images.css',
  'js/main.js', 'js/mobile.js', 'js/motion.js', 'js/responsive-images.js', 'js/context.js', 'js/books-maps.js', 'js/story.js', 'js/learning.js',
  'js/study-data.js', 'js/experience-data.js', 'js/work-records.js', 'js/artwork-media.js',
  'js/art-direction.js', 'js/period-experience.js', 'js/world-map.js', 'js/explore.js',
  'js/glossary.js', 'js/sources.js', 'assets/favicon.svg', 'manifest.webmanifest',
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
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== location.origin) return;
  // Prefer current files while developing; preserve visited pages for offline reading.
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok) {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE).then(cache => cache.put(event.request, copy)));
    }
    return response;
  }).catch(async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;
    if (event.request.mode === 'navigate') return (await caches.match('index.html')) || Response.error();
    return Response.error();
  }));
});
