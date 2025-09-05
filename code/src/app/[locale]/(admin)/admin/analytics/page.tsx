import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import AnalyticsPage from '@/components/pages/admin/AnalyticsPage';

type AnalyticsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: AnalyticsPageProps): Promise<Metadata> {
  await props.params;
  return {
    title: '数据分析 - Xu AI导航平台管理后台',
    description: '查看平台数据分析和统计报告',
  };
}

export default async function AnalyticsPageRoute(props: AnalyticsPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <AnalyticsPage />;
}
