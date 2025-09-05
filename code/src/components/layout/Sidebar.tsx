'use client';

import type { Category } from '@/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { cn } from '@/utils/cn';

// 分类图标映射
const categoryIcons: Record<string, React.ReactNode> = {
  'ai-office': (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  'ai-video': (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  'ai-coding': (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  'ai-chat': (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  'ai-writing': (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  'ai-learning': (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  ),
};

type SidebarProps = {
  categories?: Category[];
  className?: string;
};

const defaultCategories: Category[] = [
  {
    id: '1',
    name: 'AI办公工具',
    slug: 'ai-office',
    description: '提升办公效率的AI工具',
    icon: 'ai-office',
    sort: 1,
    isActive: true,
    toolCount: 32,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'AI视频工具',
    slug: 'ai-video',
    description: 'AI驱动的视频创作工具',
    icon: 'ai-video',
    sort: 2,
    isActive: true,
    toolCount: 24,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'AI编程工具',
    slug: 'ai-coding',
    description: '智能代码助手和开发工具',
    icon: 'ai-coding',
    sort: 3,
    isActive: true,
    toolCount: 18,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'AI聊天助手',
    slug: 'ai-chat',
    description: '智能对话和问答工具',
    icon: 'ai-chat',
    sort: 4,
    isActive: true,
    toolCount: 45,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'AI写作工具',
    slug: 'ai-writing',
    description: '智能内容创作和写作助手',
    icon: 'ai-writing',
    sort: 5,
    isActive: true,
    toolCount: 28,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    name: 'AI学习网站',
    slug: 'ai-learning',
    description: 'AI教育和学习资源',
    icon: 'ai-learning',
    sort: 6,
    isActive: true,
    toolCount: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const Sidebar: React.FC<SidebarProps> = ({ categories = defaultCategories, className }) => {
  const pathname = usePathname();

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <aside className={cn('bg-neutral p-4 rounded-lg', className)}>
      <div className="mb-4">
        <h3 className="mb-2 text-lg font-semibold text-gray-900">热门推荐</h3>
        <div className="rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white">
          精选AI工具
        </div>
      </div>

      <nav className="space-y-1">
        {displayCategories.map((category) => {
          const isActive = pathname === `/category/${category.slug}`;
          const icon = categoryIcons[category.icon || category.slug] || (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          );

          return (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className={cn(
                'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer',
                isActive
                  ? 'bg-white text-blue-600 border-l-4 border-blue-600'
                  : 'text-gray-700 hover:bg-white hover:text-blue-600',
              )}
            >
              <span className={cn('mr-3', isActive ? 'text-blue-600' : 'text-blue-600')}>
                {icon}
              </span>
              <span className="flex-1">{category.name}</span>
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                {category.toolCount}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
