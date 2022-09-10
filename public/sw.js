self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('cache').then(cache => cache.addAll([
      './',
      './index.html',
      './index.js',
      './style.css',
      './loading.gif',
    ])),
  )
})

self.addEventListener('fetch', e => {
  console.log(e.request.url)
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request)),
  )
})
