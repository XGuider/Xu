'use client';

import type { Tool } from '@/types';
import Image from 'next/image';
import React, { useState } from 'react';
import { useToolDetail } from '@/contexts/ToolDetailContext';
import { cn } from '@/utils/cn';

type ToolCardProps = {
  tool: Tool;
  /** grid：原有宫格卡片；directory：横向图标+标题+描述，适合导航站列表 */
  layout?: 'grid' | 'directory';
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
};

const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  layout = 'grid',
  className,
}) => {
  const [logoLoadFailed, setLogoLoadFailed] = useState(false);
  const { openToolDetail } = useToolDetail();

  const logoSrc = tool.logo?.trim();
  const shouldShowLogo = Boolean(logoSrc) && !logoLoadFailed;
  const isRemoteLogo = Boolean(logoSrc) && /^https?:\/\//i.test(logoSrc!);

  const logoCircle = (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-bold text-white transition-transform duration-300 group-hover:scale-105',
        layout === 'directory'
          ? 'h-11 w-11 bg-gradient-to-br from-rose-500 to-orange-400 sm:h-12 sm:w-12'
          : 'h-10 w-10 bg-blue-600 group-hover:scale-110',
      )}
    >
      {shouldShowLogo && logoSrc
        ? (
            isRemoteLogo
              ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={logoSrc}
                    alt=""
                    className="h-full w-full bg-white object-contain"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={() => setLogoLoadFailed(true)}
                  />
                )
              : (
                  <Image
                    src={logoSrc}
                    alt=""
                    width={48}
                    height={48}
                    className="h-full w-full bg-white object-contain"
                    onError={() => setLogoLoadFailed(true)}
                  />
                )
          )
        : tool.name.charAt(0).toUpperCase()}
    </div>
  );

  if (layout === 'directory') {
    return (
      <div
        className={cn(
          'group relative flex min-h-[4.25rem] cursor-pointer flex-row items-center gap-3 overflow-hidden rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm transition-all duration-200 hover:border-rose-200 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500',
          className,
        )}
        onClick={() => {
          openToolDetail(tool);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openToolDetail(tool);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={tool.name}
      >
        {logoCircle}
        <div className="min-w-0 flex-1 text-left">
          <h3 className="text-sm font-semibold text-zinc-900 transition-colors group-hover:text-rose-600">
            {tool.name}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500 transition-colors group-hover:text-zinc-600">
            {tool.description}
          </p>
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-50 text-zinc-400 transition-colors group-hover:bg-rose-50 group-hover:text-rose-500">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    );
  }

  // 长方形宫格卡片（长宽比约 2:1）
  return (
    <div
      className={cn(
        'group relative flex aspect-[2/1] cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg',
        className,
      )}
      onClick={() => {
        openToolDetail(tool);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openToolDetail(tool);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-center gap-2 p-2">
        {logoCircle}
        <h3 className="line-clamp-1 min-w-0 flex-1 text-xs font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
          {tool.name}
        </h3>
      </div>

      <div className="flex flex-1 flex-col px-2 pb-2">
        <p className="line-clamp-2 text-[10px] text-gray-500 transition-colors duration-200 group-hover:text-gray-700">
          {tool.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="text-[10px] text-gray-400 transition-colors group-hover:text-blue-600">访问</span>
          <svg className="h-2.5 w-2.5 text-gray-400 transition-colors group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
