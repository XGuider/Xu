import { setRequestLocale } from 'next-intl/server';
import ClientLayout from '@/components/layout/ClientLayout';
import Header from '@/components/layout/Header';

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <ClientLayout>
      <Header />
      <main>{props.children}</main>
    </ClientLayout>
  );
}
