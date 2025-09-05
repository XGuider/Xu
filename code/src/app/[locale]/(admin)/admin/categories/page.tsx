import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import CategoryManagementPage from '@/components/pages/admin/CategoryManagementPage';

type CategoriesPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: CategoriesPageProps): Promise<Metadata> {
  await props.params;
  return {
    title: '分类管理 - Xu AI导航平台管理后台',
    description: '管理AI工具分类，包括添加、编辑、删除和排序功能',
  };
}

export default async function CategoriesPage(props: CategoriesPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <CategoryManagementPage />;
}
