import { setRequestLocale } from 'next-intl/server';
import AdminLayout from '@/components/layout/AdminLayout';

export default async function AdminLayoutRoute({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AdminLayout>{children}</AdminLayout>;
}
