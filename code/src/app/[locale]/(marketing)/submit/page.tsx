import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';
import SubmitPageWithSearchParams from '@/components/pages/SubmitPageWithSearchParams';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'SubmitPage' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function Page(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">加载中...</div>}>
      <SubmitPageWithSearchParams />
    </Suspense>
  );
}
