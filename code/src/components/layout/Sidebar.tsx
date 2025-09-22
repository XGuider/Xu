'use client';

import React from 'react';
import { useCategoryContext } from '@/contexts/CategoryContext';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { cn } from '@/utils/cn';

// 分类图标映射
const categoryIcons: Record<string, React.ReactNode> = {
  'ai-office': (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
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
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  ),
  'ai-learning': (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
};

const Sidebar: React.FC = () => {
  const {
    activeCategory,
    setActiveCategory,
    categories,
    isLoading,
    scrollToCategory,
  } = useCategoryContext();
  const { isSidebarOpen } = useSidebarContext();

  // 处理分类点击
  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    scrollToCategory(categoryId);
  };

  return (
    <>
      {/* 侧边栏 */}
      <div
        className={cn(
          'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-80 transform bg-white shadow-xl transition-transform duration-300 ease-in-out',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >

        {/* 分类列表 */}
        <div className="p-4">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">AI工具分类</h3>
          {isLoading
            ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex w-full animate-pulse items-center justify-between rounded-lg bg-gray-100 p-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                        <div className="h-4 w-20 rounded bg-gray-300"></div>
                      </div>
                      <div className="h-4 w-8 rounded bg-gray-300"></div>
                    </div>
                  ))}
                </div>
              )
            : (
                <nav className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      type="button"
                      className={cn(
                        'flex w-full items-center rounded-lg px-3 py-3 text-sm transition-all duration-200',
                        activeCategory === category.id
                          ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                      )}
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      {/* 图标 */}
                      <div
                        className={cn(
                          'mr-3 flex h-8 w-8 items-center justify-center rounded-lg',
                          activeCategory === category.id
                            ? 'bg-blue-100'
                            : 'bg-gray-100',
                        )}
                      >
                        {categoryIcons[category.slug] || (
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        )}
                      </div>

                      {/* 文字和数量 */}
                      <div className="flex flex-1 items-center justify-between">
                        <span className="font-medium">{category.name}</span>
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                          {category.toolCount}
                        </span>
                      </div>
                    </button>
                  ))}
                </nav>
              )}
        </div>
      </div>

    </>
  );
};

export default Sidebar;
