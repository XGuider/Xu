import { getTranslations, setRequestLocale } from 'next-intl/server';
import SubmitPage from '@/components/pages/SubmitPage';

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

  return <SubmitPage />;
}
