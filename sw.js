const CACHE = 'getcute-v7';
const ASSETS = [
  './',
  'index.html',
  'style.css?v=7',
  'app.js?v=7',
  'manifest.json?v=7',
  'assets/icon-192.png',
  'assets/icon-512.png',
  'assets/avatar_parts.svg?v=7'
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});

self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
  );
});

self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request).then(res=> res || fetch(e.request))
  );
});
