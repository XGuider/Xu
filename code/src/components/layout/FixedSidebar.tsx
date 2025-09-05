'use client';

import React, { useState } from 'react';
import { useCategoryContext } from '@/contexts/CategoryContext';
import { cn } from '@/utils/cn';

const FixedSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    activeCategory,
    setActiveCategory,
    categories,
    isLoading,
    scrollToCategory,
  } = useCategoryContext();

  // 处理分类点击
  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    scrollToCategory(categoryId);
    setIsOpen(false); // 关闭侧边栏
  };

  return (
    <>
      {/* 固定按钮 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-1/2 right-4 z-50 -translate-y-1/2 rounded-full bg-blue-600 p-3 text-white shadow-lg transition-all duration-300 hover:bg-blue-700 lg:hidden"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* 固定侧边栏 */}
      <div
        className={cn(
          'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-80 transform bg-white shadow-xl transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
          'lg:translate-x-0',
        )}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 lg:hidden">
          <h2 className="text-lg font-semibold text-gray-900">AI工具分类</h2>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

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
                        'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors',
                        activeCategory === category.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                      )}
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      <span className="font-medium">{category.name}</span>
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                        {category.toolCount}
                      </span>
                    </button>
                  ))}
                </nav>
              )}
        </div>
      </div>

      {/* 遮罩层 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsOpen(false);
            }
          }}
          role="button"
          tabIndex={0}
        />
      )}
    </>
  );
};

export default FixedSidebar;
