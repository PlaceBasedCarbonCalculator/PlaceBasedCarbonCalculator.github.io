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