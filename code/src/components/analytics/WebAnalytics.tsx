'use client';

import Script from 'next/script';
import React, { useEffect, useRef } from 'react';
import { Env } from '@/libs/Env';
import { usePathname } from '@/libs/I18nNavigation';

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  _hmt?: unknown[][];
};

function getFullPath(): string {
  if (typeof window === 'undefined') {
    return '';
  }
  return `${window.location.pathname}${window.location.search}`;
}

function getWin(): AnalyticsWindow | undefined {
  return typeof window !== 'undefined' ? window as AnalyticsWindow : undefined;
}

/**
 * Google Analytics 4（gtag）与百度统计；未配置对应环境变量时不加载。
 * GA：send_page_view 关闭后由本组件在路径变化时发送。
 * 百度：首屏由 hm.js 统计；后续 SPA 切换再 push _trackPageview。
 */
const WebAnalytics: React.FC = () => {
  const pathname = usePathname();
  const gaId = Env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const baiduId = Env.NEXT_PUBLIC_BAIDU_TONGJI_ID;
  const lastPathSentRef = useRef<string>('');
  const baiduSpaReadyRef = useRef(false);
  const pollTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const path = getFullPath();
    if (!path) {
      return;
    }

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 40;

    const tick = () => {
      if (cancelled) {
        return;
      }
      attempts += 1;

      const win = getWin();
      const gaReady = !gaId || (win && typeof win.gtag === 'function');
      if (!gaReady && attempts < maxAttempts) {
        pollTimerRef.current = window.setTimeout(tick, 50);
        return;
      }

      if (lastPathSentRef.current === path) {
        return;
      }
      lastPathSentRef.current = path;

      if (gaId && win && typeof win.gtag === 'function') {
        win.gtag('config', gaId, { page_path: path });
      }

      if (baiduId && win) {
        win._hmt = win._hmt || [];
        if (baiduSpaReadyRef.current) {
          win._hmt.push(['_trackPageview', path]);
        } else {
          baiduSpaReadyRef.current = true;
        }
      }
    };

    tick();
    return () => {
      cancelled = true;
      if (pollTimerRef.current !== undefined) {
        window.clearTimeout(pollTimerRef.current);
        pollTimerRef.current = undefined;
      }
    };
  }, [pathname, gaId, baiduId]);

  if (!gaId && !baiduId) {
    return null;
  }

  return (
    <>
      {gaId && (
        <>
          <Script id="ga-data-layer" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
            `}
          </Script>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-config-base" strategy="afterInteractive">
            {`
              gtag('js', new Date());
              gtag('config', '${gaId}', { send_page_view: false });
            `}
          </Script>
        </>
      )}
      {baiduId && (
        <Script id="baidu-hm-init" strategy="afterInteractive">
          window._hmt = window._hmt || [];
        </Script>
      )}
      {baiduId && (
        <Script
          id="baidu-hm-js"
          src={`https://hm.baidu.com/hm.js?${baiduId}`}
          strategy="afterInteractive"
        />
      )}
    </>
  );
};

export default WebAnalytics;
