const staticCacheName = 'site-static-v3';
const assets = [
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
];

// install event
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== staticCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

// fetch event
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request);
    })
  );
});


const dynamicCacheName = 'site-dynamic-v1';

// activate event
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key =>  key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

// fetch event
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request).then(fetchRes => {
        return caches.open(dynamicCacheName).then(cache => {
          cache.put(evt.request.url, fetchRes.clone());
          return fetchRes;
        });
      });
    })
  );
});
