// Service Worker for VIA Forum - Updated for Vercel
const CACHE_NAME = 'via-forum-v2-vercel';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install event - force update
self.addEventListener('install', event => {
  self.skipWaiting(); // Force immediate activation
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Activate event - clear old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Take control immediately
});

// Fetch event - bypass cache for API requests
self.addEventListener('fetch', event => {
  // Never cache API requests
  if (event.request.url.includes('/api/') || event.request.url.includes('fly.dev')) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // Cache other requests
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// Push notification event
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Ny aktivitet på VIA Forum!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Åbn forum',
        icon: '/icon-192.png'
      },
      {
        action: 'close',
        title: 'Luk',
        icon: '/icon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('VIA Forum', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'explore') {
    clients.openWindow('/');
  }
});