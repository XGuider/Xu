'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import { Env } from '@/libs/Env';
import packageJson from '../../../package.json';

/**
 * 全站页脚：版权与版本号（版本优先环境变量，否则取 package.json）
 */
const Footer: React.FC = () => {
  const t = useTranslations('Footer');
  const version = Env.NEXT_PUBLIC_APP_VERSION ?? packageJson.version;

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50/90 py-6 text-center text-xs text-zinc-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="font-medium text-zinc-700">{t('copyright')}</p>
        <p className="mt-1.5 text-zinc-500">
          {t('version_label', { version })}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
