'use client';

import type { Category, Tool } from '@/types';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import ToolCard from '@/components/tools/ToolCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { cn } from '@/utils/cn';

const SearchIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const PAGE_LIMIT = 24;

type SearchPageProps = {
  query: string;
  category: string;
  page: number;
};

type PaginationState = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const SearchPage: React.FC<SearchPageProps> = ({ query: initialQuery, category: initialCategory, page: initialPage }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchResults, setSearchResults] = useState<Tool[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<{ slug: string; name: string }[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data: { success?: boolean; data?: Category[] } = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setCategoryOptions(
            data.data.map(c => ({ slug: c.slug, name: c.name })),
          );
        }
      } catch (error) {
        console.error('加载分类失败:', error);
      }
    };
    void loadCategories();
  }, []);

  const performSearch = useCallback(async (query: string, category: string, page: number) => {
    setIsSearching(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) {
        params.set('search', query.trim());
      }
      if (category.trim()) {
        params.set('category', category.trim());
      }
      params.set('page', String(page));
      params.set('limit', String(PAGE_LIMIT));

      const response = await fetch(`/api/tools?${params.toString()}`);
      const data = await response.json() as {
        success?: boolean;
        data?: { tools: Tool[]; pagination: PaginationState };
      };

      if (data.success && data.data) {
        setSearchResults(data.data.tools);
        setPagination(data.data.pagination);
      } else {
        setSearchResults([]);
        setPagination({ page: 1, limit: PAGE_LIMIT, total: 0, totalPages: 0 });
      }
    } catch (error) {
      console.error('搜索失败:', error);
      setSearchResults([]);
      setPagination({ page: 1, limit: PAGE_LIMIT, total: 0, totalPages: 0 });
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      return;
    }
    const params = new URLSearchParams();
    params.set('q', searchQuery.trim());
    if (selectedCategory) {
      params.set('category', selectedCategory);
    }
    router.push(`/search?${params.toString()}`);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);

    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }
    if (category) {
      params.set('category', category);
    }
    router.push(params.toString() ? `/search?${params.toString()}` : '/search');
    void performSearch(searchQuery.trim(), category, 1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSearchResults([]);
    setPagination({ page: 1, limit: PAGE_LIMIT, total: 0, totalPages: 0 });
    router.push('/search');
  };

  useEffect(() => {
    if (initialQuery.trim() || initialCategory.trim()) {
      void performSearch(initialQuery, initialCategory, initialPage);
    }
  }, [initialQuery, initialCategory, initialPage, performSearch]);

  const showResults = Boolean(searchQuery.trim() || selectedCategory);
  const categoryChips = [{ value: '', label: '全部类型' }, ...categoryOptions.map(c => ({ value: c.slug, label: c.name }))];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            搜索AI工具
          </h1>
          <p className="text-lg text-gray-700">
            发现最适合您需求的AI工具
          </p>
        </div>

        <form onSubmit={handleSearch} className="mx-auto mb-8 max-w-2xl">
          <div className="relative">
            <Input
              type="text"
              placeholder="请输入您要搜索的AI产品"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              className="w-full py-4 pr-20 pl-6 text-lg"
              leftIcon={<SearchIcon />}
            />
            <Button
              type="submit"
              size="lg"
              loading={isSearching}
              className="absolute top-1/2 right-2 -translate-y-1/2"
            >
              搜索
            </Button>
          </div>
        </form>

        {showResults && (
          <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-6 rounded-lg bg-gray-100 p-4">
              <div className="flex flex-wrap items-center gap-2">
                {searchQuery.trim()
                  ? (
                      <>
                        <span className="text-sm font-medium">搜索：</span>
                        <span className="text-sm font-medium text-blue-600">{searchQuery}</span>
                      </>
                    )
                  : (
                      <span className="text-sm font-medium text-gray-600">按分类浏览</span>
                    )}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="ml-auto text-sm text-blue-600 hover:underline"
                >
                  清除筛选
                </button>
              </div>

              <div className="mt-4">
                <span className="mb-2 block text-sm font-medium">分类筛选</span>
                <div className="flex flex-wrap gap-2">
                  {categoryChips.map((cat) => {
                    return (
                      <button
                        key={cat.value || 'all'}
                        type="button"
                        onClick={() => {
                          handleCategoryChange(cat.value);
                        }}
                        className={cn(
                          'rounded-full px-3 py-1 text-xs transition-colors',
                          selectedCategory === cat.value
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 bg-white text-gray-700 hover:border-blue-600 hover:text-blue-600',
                        )}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mb-6 text-sm text-gray-700">
              找到约
              <span className="font-medium text-blue-600">{pagination.total}</span>
              个结果
              {searchQuery.trim()
                ? (
                    <span>
                      ，搜索词：
                      <span className="font-medium">{searchQuery}</span>
                    </span>
                  )
                : null}
            </div>

            {searchResults.length > 0
              ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {searchResults.map(tool => (
                      <ToolCard
                        key={tool.id}
                        tool={tool}
                        variant="default"
                        className="h-full"
                      />
                    ))}
                  </div>
                )
              : (
                  <div className="py-12 text-center">
                    <div className="text-gray-dark mb-4">
                      <svg className="mx-auto mb-4 h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">
                      未找到相关结果
                    </h3>
                    <p className="text-gray-dark">
                      尝试使用其他关键词或调整筛选条件
                    </p>
                  </div>
                )}

            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={pagination.page <= 1 || isSearching}
                  onClick={() => {
                    const next = pagination.page - 1;
                    const params = new URLSearchParams();
                    if (searchQuery.trim()) {
                      params.set('q', searchQuery.trim());
                    }
                    if (selectedCategory) {
                      params.set('category', selectedCategory);
                    }
                    if (next > 1) {
                      params.set('page', String(next));
                    }
                    router.push(params.toString() ? `/search?${params.toString()}` : '/search');
                  }}
                >
                  上一页
                </Button>
                <span className="flex items-center px-2 text-sm text-gray-600">
                  {pagination.page}
                  {' '}
                  /
                  {' '}
                  {pagination.totalPages}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  disabled={pagination.page >= pagination.totalPages || isSearching}
                  onClick={() => {
                    const next = pagination.page + 1;
                    const params = new URLSearchParams();
                    if (searchQuery.trim()) {
                      params.set('q', searchQuery.trim());
                    }
                    if (selectedCategory) {
                      params.set('category', selectedCategory);
                    }
                    params.set('page', String(next));
                    router.push(`/search?${params.toString()}`);
                  }}
                >
                  下一页
                </Button>
              </div>
            )}
          </div>
        )}

        {!showResults && (
          <div className="py-12 text-center">
            <div className="text-gray-dark mb-4">
              <svg className="mx-auto mb-4 h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              开始搜索AI工具
            </h3>
            <p className="text-gray-dark mb-6">
              在搜索框中输入您需要的AI工具类型或功能
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {['AI写作', 'AI编程', 'AI办公', 'AI视频', 'AI聊天'].map(suggestion => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setSearchQuery(suggestion)}
                  className="bg-primary/10 text-primary hover:bg-primary rounded-full px-3 py-1 text-sm transition-colors hover:text-white"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
