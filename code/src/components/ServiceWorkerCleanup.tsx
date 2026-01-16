'use client';

import { useEffect } from 'react';

/**
 * Service Worker清理组件
 * 用于清理旧的Service Worker注册，避免404错误
 */
export function ServiceWorkerCleanup() {
  useEffect(() => {
    // 只在客户端执行
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    const cleanup = async () => {
      try {
        // 获取所有已注册的Service Worker
        const registrations = await navigator.serviceWorker.getRegistrations();

        // 取消注册所有旧的Service Worker
        for (const registration of registrations) {
          // 检查是否是旧的Service Worker（尝试加载不存在的资源）
          const scope = registration.scope;

          // 取消注册旧的Service Worker
          await registration.unregister();
          // eslint-disable-next-line no-console
          console.warn('已清理旧的Service Worker:', scope);
        }

        // 清理Service Worker缓存
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(
            cacheNames.map((cacheName) => {
              // 只清理可能包含旧资源的缓存
              if (
                cacheName.includes('bootstrap')
                || cacheName.includes('hux-blog')
                || cacheName.includes('jquery')
                || cacheName.includes('XGuider')
              ) {
                return caches.delete(cacheName);
              }
              return Promise.resolve();
            }),
          );
        }
      } catch (error) {
        // 静默处理错误，不影响页面加载
        console.warn('清理Service Worker时出错:', error);
      }
    };

    cleanup();
  }, []);

  // 这个组件不渲染任何内容
  return null;
}
