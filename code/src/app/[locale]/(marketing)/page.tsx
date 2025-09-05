import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import HomePage from '@/components/pages/HomePage';

type IIndexProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IIndexProps): Promise<Metadata> {
  await props.params;

  return {
    title: 'Xu AI导航平台 - 千万用户信赖的AI工具导航',
    description: '发现最好的AI工具，包括AI办公、AI编程、AI视频、AI写作等各类智能工具，提升工作效率和创造力。',
    keywords: 'AI工具,AI导航,人工智能,AI办公,AI编程,AI视频,AI写作',
    openGraph: {
      title: 'Xu AI导航平台 - 千万用户信赖的AI工具导航',
      description: '发现最好的AI工具，包括AI办公、AI编程、AI视频、AI写作等各类智能工具，提升工作效率和创造力。',
      type: 'website',
    },
  };
}

export default async function Index(props: IIndexProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <HomePage />;
}
