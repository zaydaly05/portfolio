/* ============================================
   SERVICE WORKER (PWA & OFFLINE ASSET CACHING)
   Caches core static assets, Cloudinary images, fonts, and layout JS.
   ============================================ */

const CACHE_NAME = "zayd-portfolio-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/projects",
  "/skills",
  "/experience",
  "/contact",
  "/styles.css?v=3",
  "/layout.js",
  "/modals.js",
  "/buttons.js",
  "/script.js?v=11",
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
            console.log("[ServiceWorker] Removing old cache:", cache);
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

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached asset and update cache in background
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        return networkResponse;
      });
    })
  );
});
