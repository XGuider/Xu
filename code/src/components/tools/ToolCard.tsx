'use client';

import type { Tool } from '@/types';
import Image from 'next/image';
import React, { useState } from 'react';
import { useToolDetail } from '@/contexts/ToolDetailContext';
import { cn } from '@/utils/cn';

type ToolCardProps = {
  tool: Tool;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
};

const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  className,
}) => {
  const [logoLoadFailed, setLogoLoadFailed] = useState(false);
  const { openToolDetail } = useToolDetail();

  const logoSrc = tool.logo?.trim();
  const shouldShowLogo = Boolean(logoSrc) && !logoLoadFailed;
  const isRemoteLogo = Boolean(logoSrc) && /^https?:\/\//i.test(logoSrc!);

  // 长方形样式的工具卡片（长是宽的两倍）
  return (
    <div
      className={cn(
        'group relative aspect-[2/1] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer flex flex-col',
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
      {/* 顶部：Logo + 名称 */}
      <div className="flex items-center gap-2 p-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-600 text-xs font-bold text-white transition-transform duration-300 group-hover:scale-110">
          {shouldShowLogo && logoSrc
            ? (
                isRemoteLogo
                  ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={logoSrc}
                        alt={`${tool.name} logo`}
                        className="h-full w-full bg-white object-contain"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={() => setLogoLoadFailed(true)}
                      />
                    )
                  : (
                      <Image
                        src={logoSrc}
                        alt={`${tool.name} logo`}
                        width={40}
                        height={40}
                        className="h-full w-full bg-white object-contain"
                        onError={() => setLogoLoadFailed(true)}
                      />
                    )
              )
            : tool.name.charAt(0).toUpperCase()}
        </div>

        {/* eslint-disable-next-line tailwindcss/classnames-order */}
        <h3 className="min-w-0 flex-1 text-xs font-semibold text-gray-900 line-clamp-1 transition-colors group-hover:text-blue-600">
          {tool.name}
        </h3>
      </div>

      {/* 内容区域 */}
      <div className="flex flex-1 flex-col px-2 pb-2">
        {/* 描述：默认弱化显示，hover 更清晰（避免布局跳动） */}
        <p className="line-clamp-2 text-[10px] text-gray-500 transition-colors duration-200 group-hover:text-gray-700">
          {tool.description}
        </p>

        {/* 访问按钮 - 简化版 */}
        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="text-[10px] text-gray-400 transition-colors group-hover:text-blue-600">访问</span>
          <svg className="h-2.5 w-2.5 text-gray-400 transition-colors group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
