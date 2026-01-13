'use client';

import type { Category, Tool } from '@/types';
import Link from 'next/link';
import React, { useState } from 'react';
import ToolCard from '@/components/tools/ToolCard';
import { cn } from '@/utils/cn';

// 面包屑导航组件
const Breadcrumb = ({ category }: { category: Category }) => (
  <nav className="text-gray-dark mb-6 text-sm">
    <Link href="/" className="hover:text-primary transition-colors">
      首页
    </Link>
    <span className="mx-2">/</span>
    <span className="text-gray-900">{category.name}</span>
  </nav>
);

// 排序选择器组件
const SortSelector = ({
  currentSort,
  onSortChange,
}: {
  currentSort: string;
  onSortChange: (sort: string) => void;
}) => (
  <div className="flex items-center space-x-2">
    <span className="text-gray-dark text-sm">排序：</span>
    <select
      value={currentSort}
      onChange={e => onSortChange(e.target.value)}
      className="border-gray-medium focus:border-primary rounded border px-3 py-1.5 text-sm focus:outline-none"
    >
      <option value="recommended">推荐</option>
      <option value="newest">最新</option>
      <option value="rating">评分最高</option>
      <option value="popular">最热门</option>
    </select>
  </div>
);

// 分页组件
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="mt-8 flex justify-center">
      <div className="flex items-center space-x-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="border-gray-medium hover:border-primary flex h-8 w-8 items-center justify-center rounded border disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {pages.map(page => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={cn(
              'w-8 h-8 flex items-center justify-center rounded text-sm transition-colors',
              page === currentPage
                ? 'bg-primary text-white'
                : 'border border-gray-medium hover:border-primary',
            )}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="border-gray-medium hover:border-primary flex h-8 w-8 items-center justify-center rounded border disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

type CategoryPageProps = {
  category: Category;
  tools: Tool[];
};

const CategoryPage: React.FC<CategoryPageProps> = ({ category, tools }) => {
  const [currentSort, setCurrentSort] = useState('recommended');
  const [currentPage, setCurrentPage] = useState(1);
  const toolsPerPage = 12;

  // 排序工具
  const sortedTools = React.useMemo(() => {
    const sorted = [...tools];

    switch (currentSort) {
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        sorted.sort((a, b) => b.ratingCount - a.ratingCount);
        break;
      default: // recommended
        sorted.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.rating - a.rating);
        break;
    }

    return sorted;
  }, [tools, currentSort]);

  // 分页
  const totalPages = Math.ceil(sortedTools.length / toolsPerPage);
  const startIndex = (currentPage - 1) * toolsPerPage;
  const endIndex = startIndex + toolsPerPage;
  const currentTools = sortedTools.slice(startIndex, endIndex);

  const handleSortChange = (sort: string) => {
    setCurrentSort(sort);
    setCurrentPage(1); // 重置到第一页
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-light min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        {/* 面包屑导航 */}
        <Breadcrumb category={category} />

        {/* 分类头部 */}
        <div className="shadow-card mb-8 rounded-lg bg-white p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                {category.name}
              </h1>
              <p className="text-gray-dark mb-4 text-lg">
                {category.description}
              </p>
              <div className="text-gray-dark flex items-center space-x-4 text-sm">
                <span>
                  共
                  {tools.length}
                  {' '}
                  个工具
                </span>
                <span>•</span>
                <span>
                  排序:
                  {category.sort}
                </span>
              </div>
            </div>

            <div className="mt-4 md:mt-0">
              <SortSelector
                currentSort={currentSort}
                onSortChange={handleSortChange}
              />
            </div>
          </div>
        </div>

        {/* 工具列表 */}
        {currentTools.length > 0
          ? (
              <>
                <div className="mb-8 grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-5">
                  {currentTools.map(tool => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      variant="default"
                      className="h-full"
                    />
                  ))}
                </div>

                {/* 分页 */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )
          : (
              <div className="py-12 text-center">
                <div className="text-gray-dark mb-4">
                  <svg className="mx-auto mb-4 h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  暂无工具
                </h3>
                <p className="text-gray-dark">
                  该分类下暂时没有可用的AI工具
                </p>
              </div>
            )}
      </div>
    </div>
  );
};

export default CategoryPage;
