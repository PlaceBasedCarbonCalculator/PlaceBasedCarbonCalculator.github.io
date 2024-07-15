const CACHE_NAME = 'CAP-cache';

// Add whichever assets you want to pre-cache here:
const PRECACHE_ASSETS = [
    '/about/index.html',
    '/about/faq/index.html',
    '/data/index.html',
    '/css/homepage.css',
    '/css/main.css',
    '/css/manual.css',
    '/css/map.css',
    '/js/common-nonmap.js',
    '/js/datasets-common.js',
    '/js/manual.js',
    '/js/parallax.js',
    '/js/settings-common.js',
    '/js/ui-common.js',
    '/landownership/index.html',
    '/landownership/datsets.js',
    '/landownership/settings.js',
    '/landownership/ui.js',
    '/landuse/index.html',
    '/landuse/datsets.js',
    '/landuse/ui.js',
    '/legacy/index.html',
    '/manual/index.html',
    '/manual/index.md',
    '/privacy/index.html',
    '/tiles/partial-style_oszoom_names.json',
    '/tiles/style_dark_nobuild.json',
    '/tiles/style_google_nobuild.json',
    '/tiles/style_greyscale_nobuild.json',
    '/tiles/style_opencyclemap.json',
    '/tiles/style_satellite.json',
    '/transport/index.html',
    '/transport/datsets.js',
    '/transport/settings.js',
    '/transport/ui.js',
    '/transport/style.css'
]

// Listener for the install event - pre-caches our assets list on service worker install.
self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        cache.addAll(PRECACHE_ASSETS);
    })());
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// This is the service worker with the combined offline experience (Offline page + Offline copy of pages)
const CACHE = "pwabuilder-offline-page";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const offlineFallbackPage = "offline.html";

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.add(offlineFallbackPage))
  );
});

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

workbox.routing.registerRoute(
  new RegExp('/*'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE
  })
);

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preloadResp = await event.preloadResponse;

        if (preloadResp) {
          return preloadResp;
        }

        const networkResp = await fetch(event.request);
        return networkResp;
      } catch (error) {

        const cache = await caches.open(CACHE);
        const cachedResp = await cache.match(offlineFallbackPage);
        return cachedResp;
      }
    })());
  }
});

