// Bump CACHE_VERSION whenever the precache list or caching strategy changes.
// This is used to derive a single, versioned cache name so old caches are
// purged on activation and offline behaviour stays consistent.
const CACHE_VERSION = 'v28';
const CACHE_NAME = `CAP-cache-${CACHE_VERSION}`;

const OFFLINE_FALLBACK_PAGE = '/offline.html';

// Assets pre-cached on install so core pages work offline. Only list files that
// actually exist — a single 404 in addAll() would otherwise reject the whole
// precache, so we add each entry individually and tolerate failures.
const PRECACHE_ASSETS = [
    OFFLINE_FALLBACK_PAGE,
    '/',
    '/index.html',
    '/manifest.webmanifest',
    '/app.js',
    // Shared styles
    '/css/homepage.css',
    '/css/main.css',
    '/css/content-new.css',
    '/css/manual.css',
    '/css/map.css',
    '/css/map-new.css',
    '/css/modal.css',
    // Shared scripts
    '/js/common-nonmap.js',
    '/js/databin.js',
    '/js/datasets-common.js',
    '/js/manual.js',
    '/js/parallax.js',
    '/js/settings-common.js',
    '/js/ui-common.js',
    '/js/postcode-search.js',
    '/js/tour.js',
    // Pure-JS brotli decoder, loaded on demand by databin.js in browsers whose
    // DecompressionStream has no brotli support (everything except Firefox).
    // Pre-cached so it isn't a 90KB download on the report-opening critical path.
    '/js/lib/brotli/brotli-decompress.js',
    // Content pages
    '/about/index.html',
    '/about/faq/index.html',
    '/about/feedback/index.html',
    '/data/index.html',
    '/manual/index.html',
    '/manual/index.md',
    '/privacy/index.html',
    '/reports/index.html',
    '/reports/lsoa.html',
    '/reports/la.html',
    '/reports/wards.html',
    '/reports/parishes.html',
    '/reports/constituencies.html',
    '/reports/la-report.js',
    '/reports/cards/pbcc-card.html',
    '/reports/cards/pbcc-card.js',
    '/reports/cards/transport-card.html',
    '/reports/cards/transport-card.js',
    '/reports/cards/retrofit-card.html',
    '/reports/cards/retrofit-card.js',
    '/reports/area-map.js',
    // Feature tools
    '/pbcc/index.html',
    '/pbcc/datasets.js',
    '/pbcc/settings.js',
    '/pbcc/ui.js',
    '/pbcc/style.css',
    '/transport/index.html',
    '/transport/datasets.js',
    '/transport/settings.js',
    '/transport/ui.js',
    '/transport/style.css',
    '/retrofit/index.html',
    '/retrofit/datasets.js',
    '/retrofit/settings.js',
    '/retrofit/ui.js',
    '/landownership/index.html',
    '/landownership/datasets.js',
    '/landownership/settings.js',
    '/landownership/ui.js',
    '/landuse/index.html',
    '/landuse/datasets.js',
    '/landuse/settings.js',
    '/landuse/ui.js',
    // Basemap styles
    '/tiles/partial-style_oszoom_names.json',
    '/tiles/style_dark_nobuild.json',
    '/tiles/style_google_nobuild.json',
    '/tiles/style_greyscale_nobuild.json',
    '/tiles/style_opencyclemap.json',
    '/tiles/style_satellite.json'
];

// Large binary assets (map tiles, terrain) should never be runtime-cached: they
// are huge, use range requests, and would quickly exhaust the storage quota.
function isUncacheableAsset(url) {
    return /\.pmtiles$/i.test(url.pathname) ||
           /\.(mbtiles|pbf)$/i.test(url.pathname);
}

// --- Install: pre-cache the app shell --------------------------------------
self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        // Add entries individually so one missing file doesn't fail the rest.
        await Promise.allSettled(
            PRECACHE_ASSETS.map(asset => cache.add(asset))
        );
        self.skipWaiting();
    })());
});

// --- Activate: take control and purge old caches ---------------------------
self.addEventListener('activate', event => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(
            keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        );
        if (self.registration.navigationPreload) {
            await self.registration.navigationPreload.enable();
        }
        await self.clients.claim();
    })());
});

// Allow the page to trigger an immediate update.
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// --- Fetch -----------------------------------------------------------------
self.addEventListener('fetch', event => {
    const request = event.request;

    // Only handle same-origin GET requests.
    if (request.method !== 'GET') return;
    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    // Never intercept large tile/terrain assets — go straight to the network.
    if (isUncacheableAsset(url)) return;

    // Navigations: network-first, falling back to the cached page then the
    // offline fallback so the user always sees something.
    if (request.mode === 'navigate') {
        event.respondWith((async () => {
            try {
                const preload = await event.preloadResponse;
                if (preload) return preload;
                const networkResp = await fetch(request);
                const cache = await caches.open(CACHE_NAME);
                cache.put(request, networkResp.clone());
                return networkResp;
            } catch (err) {
                const cache = await caches.open(CACHE_NAME);
                return (await cache.match(request)) ||
                       (await cache.match(OFFLINE_FALLBACK_PAGE));
            }
        })());
        return;
    }

    // Other assets: stale-while-revalidate.
    event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request);
        const network = fetch(request).then(resp => {
            if (resp && resp.ok) cache.put(request, resp.clone());
            return resp;
        }).catch(() => cached);
        return cached || network;
    })());
});
