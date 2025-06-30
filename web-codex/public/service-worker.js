// Basic placeholder service worker

const CACHE_NAME = 'sl-codex-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Add other important assets here like main JS/CSS bundles once known
  // '/assets/main.js',
  // '/assets/main.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
  // Note: Vite generates hashed assets, so actual JS/CSS filenames will vary.
  // A more robust service worker would use a build tool plugin (like vite-plugin-pwa)
  // to automatically generate the list of assets to cache.
];

// Install event: Cache core assets
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching app shell');
        // Using addAll. If any of these fail, the SW installation fails.
        return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' })));
      })
      .then(() => {
        console.log('[ServiceWorker] App shell cached, skipping waiting.');
        return self.skipWaiting(); // Activate worker immediately
      })
      .catch(error => {
        console.error('[ServiceWorker] Caching failed during install:', error);
      })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[ServiceWorker] Old caches removed, claiming clients.');
      return self.clients.claim(); // Take control of all open clients
    })
  );
});

// Fetch event: Serve cached content when offline (Cache First strategy for app shell)
self.addEventListener('fetch', event => {
  // We only want to handle GET requests for caching
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // console.log('[ServiceWorker] Returning from cache:', event.request.url);
          return cachedResponse; // Serve from cache
        }

        // console.log('[ServiceWorker] Fetching from network:', event.request.url);
        return fetch(event.request).then(networkResponse => {
          // Optionally, cache newly fetched resources dynamically if they are part of the app shell
          // or if specific caching strategies are defined for them.
          // For a simple cache-first for app shell, we don't dynamically cache everything here.
          return networkResponse;
        });
      })
      .catch(error => {
        console.error('[ServiceWorker] Fetch error:', error);
        // Optionally, return a fallback offline page if appropriate and cached:
        // return caches.match('/offline.html');
      })
  );
});
