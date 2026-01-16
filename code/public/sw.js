/* eslint-disable no-restricted-globals */
// 简单的Service Worker，避免404错误
// 如果不需要Service Worker功能，可以保持为空
self.addEventListener('install', () => {
  // 立即激活，不等待
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // 立即控制所有客户端
  event.waitUntil(self.clients.claim());
});

// 简单的fetch处理，直接通过网络获取资源
self.addEventListener('fetch', (event) => {
  // 不缓存，直接通过网络获取
  event.respondWith(fetch(event.request));
});
