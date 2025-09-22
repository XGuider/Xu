import { setRequestLocale } from 'next-intl/server';
import ClientLayout from '@/components/layout/ClientLayout';

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <ClientLayout>
      {props.children}
    </ClientLayout>
  );
}
