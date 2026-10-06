/* ============================================
   SERVICE WORKER (PWA & FAST NETWORK-FIRST CACHING)
   Caches core static assets with Network-First strategy for code/HTML to prevent stale caching.
   ============================================ */

const CACHE_NAME = "zayd-portfolio-v12";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/projects",
  "/skills",
  "/experience",
  "/contact",
  "/styles.css?v=20261013",
  "/layout.js",
  "/modals.js?v=20261013",
  "/buttons.js",
  "/ui-effects.js?v=20261013",
  "/script.js?v=20261013",
  "https://res.cloudinary.com/delnnzcph/image/upload/v1791135580/logo.jpg",
  "https://res.cloudinary.com/delnnzcph/image/upload/v1791135534/main-photo.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[ServiceWorker] Caching core portfolio assets");
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn("[ServiceWorker] Caching pre-fetch warning:", err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[ServiceWorker] Purging old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Network-first for HTML, JS, CSS so code updates apply immediately without stale cache
  if (url.origin === location.origin) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for Cloudinary images & external fonts
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) return networkResponse;
        const clone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return networkResponse;
      });
    })
  );
});
