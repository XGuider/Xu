'use client';

import type { Tool } from '@/types';
import Image from 'next/image';

import React, { useState } from 'react';
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
  const [isHovered, setIsHovered] = useState(false);

  // 图片样式的工具卡片，一行4个
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg cursor-pointer',
        className,
      )}
      onClick={() => {
        window.location.href = `/tool/${tool.id}`;
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.location.href = `/tool/${tool.id}`;
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
    >
      {/* 图标区域 - 类似图片 */}
      <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        {tool.icon
          ? (
              <Image
                src={tool.icon}
                alt={tool.name}
                width={64}
                height={64}
                className="h-16 w-16 object-contain transition-transform duration-300 group-hover:scale-110"
              />
            )
          : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            )}
      </div>

      {/* 内容区域 */}
      <div className="p-3">
        {/* 工具名称 */}
        <h3 className="mb-1 line-clamp-1 text-sm font-medium text-gray-900 transition-colors group-hover:text-blue-600">
          {tool.name}
        </h3>

        {/* 分类 */}
        <p className="mb-2 text-xs text-gray-500">{tool.category.name}</p>

        {/* 描述 - 只在hover时显示 */}
        {isHovered && (
          <p className="mb-2 line-clamp-2 text-xs text-gray-600">
            {tool.description}
          </p>
        )}

        {/* 访问按钮 - 简化版 */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">点击访问</span>
          <svg className="h-3 w-3 text-gray-400 transition-colors group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
