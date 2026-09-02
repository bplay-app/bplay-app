const CACHE_NAME = 'bplay-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // نتدخل فقط بملفات موقعنا نفسه (نفس النطاق)، ونسيب أي ملف خارجي
  // (خطوط، أعلام، مكتبات CDN) يشتغل طبيعي بدون أي تدخل من عامل الخدمة
  const isSameOrigin = event.request.url.startsWith(self.location.origin);

  if (isSameOrigin) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});
