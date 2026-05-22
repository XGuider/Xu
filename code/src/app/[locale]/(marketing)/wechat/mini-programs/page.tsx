import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import WechatManageView from '@/components/wechat/WechatManageView';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'WechatMiniPage' });
  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function MiniProgramsPage(props: PageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'WechatMiniPage' });

  return <WechatManageView kind="mini" title={t('title')} subtitle={t('subtitle')} />;
}
