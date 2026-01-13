import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { PostHogProvider } from '@/components/analytics/PostHogProvider';
import { StagewiseToolbar } from '@/components/StagewiseToolbar';
import ToolDetailModal from '@/components/tools/ToolDetailModal';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { ToolDetailProvider } from '@/contexts/ToolDetailContext';
import { routing } from '@/libs/I18nRouting';
import '@/styles/global.css';

export const metadata: Metadata = {
  title: {
    default: 'Xu AI导航平台',
    template: '%s | Xu AI导航平台',
  },
  description: '千万用户信赖的AI工具导航平台，发现最好的AI工具',
  keywords: ['AI工具', '人工智能', '导航平台', 'AI导航', 'Xu'],
  authors: [{ name: 'Xu AI导航平台' }],
  creator: 'Xu AI导航平台',
  publisher: 'Xu AI导航平台',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      'index': true,
      'follow': true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://xu-ai-navigation.com',
    title: 'Xu AI导航平台',
    description: '千万用户信赖的AI工具导航平台，发现最好的AI工具',
    siteName: 'Xu AI导航平台',
    images: [
      {
        url: '/assets/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Xu AI导航平台',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Xu AI导航平台',
    description: '千万用户信赖的AI工具导航平台，发现最好的AI工具',
    images: ['/assets/images/logo.png'],
  },
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/assets/images/logo.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/assets/images/logo.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/assets/images/logo.png',
    },
    {
      rel: 'icon',
      url: '/assets/images/logo.png',
    },
  ],
};

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <NotificationProvider>
            <ToolDetailProvider>
              <PostHogProvider>
                {props.children}
              </PostHogProvider>
              <ToolDetailModal />
              <StagewiseToolbar />
            </ToolDetailProvider>
          </NotificationProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
