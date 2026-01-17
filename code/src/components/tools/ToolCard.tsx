'use client';

import type { Tool } from '@/types';
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
  const [isHovered, setIsHovered] = useState(false);
  const { openToolDetail } = useToolDetail();

  // 长方形样式的工具卡片（长是宽的两倍）
  return (
    <div
      className={cn(
        'group relative aspect-[2/1] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg cursor-pointer flex flex-col',
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
    >
      {/* Logo区域 - 显示工具名称首字母 */}
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white transition-transform duration-300 group-hover:scale-110">
        {tool.name.charAt(0).toUpperCase()}
      </div>

      {/* 内容区域 */}
      <div className="p-2">
        {/* 工具名称 */}
        <h3 className="mb-0.5 line-clamp-1 text-xs font-medium text-gray-900 transition-colors group-hover:text-blue-600">
          {tool.name}
        </h3>

        {/* 分类 */}
        {/* <p className="mb-1 line-clamp-1 text-[10px] text-gray-500">{tool.category.name}</p> */}

        {/* 描述 - 只在hover时显示 */}
        {isHovered && (
          <p className="mb-1 line-clamp-2 text-[10px] text-gray-600">
            {tool.description}
          </p>
        )}

        {/* 访问按钮 - 简化版 */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-gray-400">访问</span>
          <svg className="h-2.5 w-2.5 text-gray-400 transition-colors group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
