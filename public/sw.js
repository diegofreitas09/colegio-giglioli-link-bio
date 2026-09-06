const CACHE = "giglioli-space-v4";
const CORE = [
  "/manifest.webmanifest",
  "/assets/logo-giglioli.webp",
  "/assets/gigi-astronauta.webp"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // Páginas sempre vêm da rede. Assim, ao clicar em links internos,
  // o visitante não recebe uma versão antiga salva pelo PWA.
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request, { cache: "no-store" }));
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const sameOrigin = new URL(event.request.url).origin === self.location.origin;
        if (response.ok && sameOrigin) {
          const clone = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
