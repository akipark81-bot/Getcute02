const CACHE = 'getcute-v10';
const ASSETS = [
  './','index.html','style.css?v=10','app.js?v=10','manifest.json',
  'assets/icon-192.png','assets/icon-512.png','assets/avatar_parts.svg?v=10'
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE&&caches.delete(k)))));
});
self.addEventListener('fetch', e=>{
  e.respondWith(caches.match(e.request).then(res=>res || fetch(e.request)));
});
