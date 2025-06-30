// Skyline Shapers PWA - Basic Service Worker

const CACHE_NAME = 'skyline-shapers-cache-v1';
// Define core assets that make up the "app shell"
// These should be updated if file names/paths change, or if using a build tool that hashes names.
const urlsToCache = [
  '/', // Or '/index.html' if that's explicitly your start_url
  'index.html',
  'manifest.json',
  // Main game script(s)
  'main.js', // Assuming this is where your Phaser game config and initial scene loading happens
  // Phaser library (if self-hosted). If using a CDN, it won't be cached by this SW.
  // 'libs/phaser.min.js',
  // Scene files (if loaded as separate scripts and not bundled into main.js)
  'scenes/PreloaderScene.js',
  'scenes/LevelSelectScene.js',
  'scenes/GameScene.js',
  'scenes/UIScene.js',
  'scenes/LevelCompleteScene.js',
  // Core PWA Icons (ensure paths match manifest and actual location)
  'assets/icons/icon-192x192.png',
  'assets/icons/icon-512x512.png',
  // A few critical game assets for initial offline experience (examples)
  // 'assets/images/background_menu.png',
  // 'assets/images/block_standard_1x1.png',
  // 'assets/audio/ui_click.mp3',
  // 'data/levels.json' // If your levels data is a single JSON fetched at start
];

// Install event: Cache core assets
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Skyline Shapers: Install Event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching core assets for Skyline Shapers App Shell');
        // Use 'reload' cache mode to bypass browser's HTTP cache for these critical files during install
        const requests = urlsToCache.map(url => new Request(url, { cache: 'reload' }));
        return cache.addAll(requests);
      })
      .then(() => {
        console.log('[ServiceWorker] App Shell assets cached successfully. Skipping waiting.');
        return self.skipWaiting(); // Activate the new service worker immediately
      })
      .catch(error => {
        console.error('[ServiceWorker] Caching failed during install:', error);
        // If addAll fails, the SW installation might fail.
      })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Skyline Shapers: Activate Event');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete caches that aren't this specific version
          if (cacheName.startsWith('skyline-shapers-cache-') && cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[ServiceWorker] Old caches removed. Claiming clients.');
      return self.clients.claim(); // Ensure new SW takes control of open pages
    })
  );
});

// Fetch event: Serve cached content when offline (Cache First strategy for app shell)
self.addEventListener('fetch', event => {
  // We only want to handle GET requests for caching
  if (event.request.method !== 'GET') {
    // console.log('[ServiceWorker] Ignoring non-GET request:', event.request.method, event.request.url);
    return;
  }

  event.respondWith(
    caches.match(event.request) // Check if the request matches anything in the cache
      .then(cachedResponse => {
        if (cachedResponse) {
          // console.log('[ServiceWorker] Returning from cache:', event.request.url);
          return cachedResponse; // Serve the cached response
        }

        // If not in cache, fetch from the network
        // console.log('[ServiceWorker] Fetching from network:', event.request.url);
        return fetch(event.request).then(networkResponse => {
          // OPTIONAL: Dynamically cache new successful GET requests from your origin
          // This can be useful for assets loaded after the initial app shell,
          // but be mindful of cache size and update strategy.
          // if (networkResponse && networkResponse.status === 200 &&
          //     event.request.url.startsWith(self.location.origin)) {
          //   const responseToCache = networkResponse.clone();
          //   caches.open(CACHE_NAME)
          //     .then(cache => {
          //       // console.log('[ServiceWorker] Caching new resource:', event.request.url);
          //       cache.put(event.request, responseToCache);
          //     });
          // }
          return networkResponse;
        });
      })
      .catch(error => {
        console.error('[ServiceWorker] Fetch error:', error);
        // OPTIONAL: Return a fallback offline page if appropriate and cached
        // This is more common for document requests (HTML pages)
        // if (event.request.mode === 'navigate') {
        //   return caches.match('/offline.html'); // You'd need to cache an 'offline.html'
        // }
      })
  );
});
