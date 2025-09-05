import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import UserManagementPage from '@/components/pages/admin/UserManagementPage';

type UsersPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: UsersPageProps): Promise<Metadata> {
  await props.params;
  return {
    title: '用户管理 - Xu AI导航平台管理后台',
    description: '管理平台用户，包括用户角色、状态管理和权限控制',
  };
}

export default async function UsersPage(props: UsersPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <UserManagementPage />;
}
