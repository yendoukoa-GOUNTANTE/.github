// GlamFilter AR Companion PWA - Basic Service Worker

const CACHE_NAME = 'glamfilter-companion-cache-v1';
const urlsToCache = [
  '/', // Home page (Showcase)
  '/index.html', // Main HTML entry point
  '/manifest.json', // PWA Manifest
  // Placeholder for main JS and CSS bundles (actual names will be hashed by Vite)
  // It's better to use a Vite PWA plugin to get these hashed names automatically.
  // For manual SW, you'd need to know the exact output names or cache them dynamically.
  // '/assets/main.[hash].js',
  // '/assets/main.[hash].css',

  // Icons (as defined in manifest.json)
  '/icons/app-icon-192x192.png',
  '/icons/app-icon-512x512.png',

  // Key static assets for core features (add more as identified)
  // e.g., '/images/app-store-badge.png', '/images/google-play-badge.png'
  // e.g., '/data/makeup-items.json' (if fetched client-side and cacheable)
  // e.g., '/tips/' (if tips list page is important offline)
];

// Install event: Cache core assets (App Shell)
self.addEventListener('install', event => {
  console.log('[ServiceWorker] GlamFilter Companion: Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching core assets for GlamFilter Companion');
        // Use 'reload' cache mode to bypass HTTP cache for these critical files during install
        const requests = urlsToCache.map(url => new Request(url, { cache: 'reload' }));
        return cache.addAll(requests);
      })
      .then(() => {
        console.log('[ServiceWorker] Core assets cached, skipping waiting.');
        return self.skipWaiting(); // Activate worker immediately
      })
      .catch(error => {
        console.error('[ServiceWorker] Caching failed during install:', error);
        // If addAll fails, the SW installation will fail.
      })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] GlamFilter Companion: Activate');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName.startsWith('glamfilter-companion-cache-') && cacheName !== CACHE_NAME) {
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

// Fetch event: Serve cached content when offline (Cache First for app shell, then network)
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return; // Only handle GET requests
  }

  // For navigation requests, try network first, then cache, then offline fallback (optional)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Network failed, try to serve from cache
          return caches.match(event.request)
            .then(cachedResponse => {
              return cachedResponse; // || caches.match('/offline.html'); // Optional offline page
            });
        })
    );
    return;
  }

  // For other assets (CSS, JS, images), use Cache First strategy
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then(networkResponse => {
          // Optionally, cache new assets dynamically if they meet certain criteria
          // if (networkResponse && networkResponse.status === 200 && event.request.url.startsWith(self.location.origin)) {
          //   const responseToCache = networkResponse.clone();
          //   caches.open(CACHE_NAME).then(cache => {
          //     cache.put(event.request, responseToCache);
          //   });
          // }
          return networkResponse;
        });
      })
  );
});
