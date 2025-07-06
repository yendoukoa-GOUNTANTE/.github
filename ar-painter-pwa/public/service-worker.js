// Basic service worker for caching app shell and static assets

const CACHE_NAME = 'ar-painter-pwa-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  // Add paths to your main JS/CSS bundles as output by Vite.
  // These will typically have hashed names. For a PoC, you might list specific known assets
  // or use a more dynamic approach if you know the vite build output structure.
  // Example: '/assets/index.HASH.js', '/assets/index.HASH.css'
  // For simplicity in PoC, we'll cache the main entry points and some public assets.
  '/manifest.json',
  '/vite.svg', // Default Vite icon, replace with your actual app icons
  '/icons/app-icon-192x192.png',
  '/icons/app-icon-512x512.png'
  // Add other critical assets like fonts, main images etc.
];

// Install event: Cache core assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch(error => {
        console.error('[ServiceWorker] Failed to cache app shell:', error);
      })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Take control of uncontrolled clients
});

// Fetch event: Serve cached assets if available, otherwise fetch from network
self.addEventListener('fetch', (event) => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          // console.log('[ServiceWorker] Returning from cache:', event.request.url);
          return response; // Serve from cache
        }
        // console.log('[ServiceWorker] Fetching from network:', event.request.url);
        return fetch(event.request).then(
            (networkResponse) => {
                // Optionally, cache new requests dynamically here if needed
                // Be careful with caching everything, especially API requests or large assets
                // if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                //   return networkResponse;
                // }
                // const responseToCache = networkResponse.clone();
                // caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
                return networkResponse;
            }
        ).catch(error => {
            console.error('[ServiceWorker] Fetch failed; returning offline page if available, or error:', error);
            // Optionally return a custom offline fallback page:
            // return caches.match('/offline.html');
        });
      })
  );
});
