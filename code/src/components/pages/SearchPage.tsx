'use client';

import type { Tool } from '@/types';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ToolCard from '@/components/tools/ToolCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { cn } from '@/utils/cn';

// 模拟搜索结果数据
const mockSearchResults: Tool[] = [
  {
    id: '1',
    name: '豆包AI写作',
    description: '豆包AI写作是一款智能内容生成工具，支持多种文体创作，包括文章、邮件、文案等，可根据用户需求快速生成高质量内容，并提供编辑和优化建议。',
    url: 'https://write.doubao.com',
    categoryId: '5',
    category: {
      id: '5',
      name: 'AI写作工具',
      slug: 'ai-writing',
      sort: 5,
      isActive: true,
      toolCount: 28,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    rating: 4.9,
    ratingCount: 1256,
    isActive: true,
    isFeatured: true,
    tags: ['写作', '内容生成', 'AI助手'],
    developer: '豆包',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'WPS AI写作助手',
    description: '集成在WPS中的AI写作工具，支持文档续写、改写、翻译等功能，与文档编辑无缝衔接，提升写作效率和质量。',
    url: 'https://ai.wps.cn/write',
    categoryId: '1',
    category: {
      id: '1',
      name: 'AI办公工具',
      slug: 'ai-office',
      sort: 1,
      isActive: true,
      toolCount: 32,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    rating: 4.7,
    ratingCount: 892,
    isActive: true,
    isFeatured: false,
    tags: ['办公', '写作', '文档'],
    developer: '金山办公',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: '智谱AI写作',
    description: '基于大语言模型的专业写作工具，支持学术论文、商业报告、创意写作等场景，提供智能大纲、内容生成和润色服务。',
    url: 'https://write.zhipuai.com',
    categoryId: '5',
    category: {
      id: '5',
      name: 'AI写作工具',
      slug: 'ai-writing',
      sort: 5,
      isActive: true,
      toolCount: 28,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    rating: 4.6,
    ratingCount: 654,
    isActive: true,
    isFeatured: false,
    tags: ['写作', '学术', '专业'],
    developer: '智谱AI',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// 搜索图标
const SearchIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

type SearchPageProps = {
  query: string;
  category: string;
  page: number;
};

const SearchPage: React.FC<SearchPageProps> = ({ query: initialQuery, category: initialCategory, page: initialPage }) => {
  const router = useRouter();
  // 读取URL参数（当前仅用于初始化，由父级传入）
  // const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchResults, setSearchResults] = useState<Tool[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 模拟搜索功能
  const performSearch = async (query: string, category: string, _page: number) => {
    setIsSearching(true);

    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    // 简单的搜索逻辑
    let results = mockSearchResults;

    if (query) {
      results = results.filter(tool =>
        tool.name.toLowerCase().includes(query.toLowerCase())
        || tool.description.toLowerCase().includes(query.toLowerCase())
        || tool.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())),
      );
    }

    if (category) {
      results = results.filter(tool => tool.category.slug === category);
    }

    setSearchResults(results);
    setIsSearching(false);
  };

  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set('q', searchQuery.trim());
      if (selectedCategory) {
        params.set('category', selectedCategory);
      }
      if (currentPage > 1) {
        params.set('page', currentPage.toString());
      }

      router.push(`/search?${params.toString()}`);
      performSearch(searchQuery.trim(), selectedCategory, currentPage);
    }
  };

  // 处理分类筛选
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);

    const params = new URLSearchParams();
    if (searchQuery) {
      params.set('q', searchQuery);
    }
    if (category) {
      params.set('category', category);
    }

    router.push(`/search?${params.toString()}`);
    performSearch(searchQuery, category, 1);
  };

  // 清除筛选
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setCurrentPage(1);
    setSearchResults([]);
    router.push('/search');
  };

  // 初始搜索
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery, initialCategory, initialPage);
    }
  }, [initialQuery, initialCategory, initialPage]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        {/* 搜索头部 */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            搜索AI工具
          </h1>
          <p className="text-lg text-gray-700">
            发现最适合您需求的AI工具
          </p>
        </div>

        {/* 搜索表单 */}
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

        {/* 搜索条件和结果 */}
        {searchQuery && (
          <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
            {/* 搜索条件 */}
            <div className="mb-6 rounded-lg bg-gray-100 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">搜索：</span>
                <span className="text-sm font-medium text-blue-600">{searchQuery}</span>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="ml-auto text-sm text-blue-600 hover:underline"
                >
                  清除筛选
                </button>
              </div>

              {/* 分类筛选 */}
              <div className="mt-4">
                <span className="mb-2 block text-sm font-medium">分类筛选</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: '', label: '全部类型' },
                    { value: 'ai-office', label: 'AI办公工具' },
                    { value: 'ai-writing', label: 'AI写作工具' },
                    { value: 'ai-coding', label: 'AI编程工具' },
                    { value: 'ai-video', label: 'AI视频工具' },
                  ].map((cat) => {
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => {
                          handleCategoryChange(cat.value);
                        }}
                        className={cn(
                          'text-xs px-3 py-1 rounded-full transition-colors',
                          selectedCategory === cat.value
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600 hover:text-blue-600',
                        )}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 搜索结果统计 */}
            <div className="mb-6 text-sm text-gray-700">
              找到约
              <span className="font-medium text-blue-600">{searchResults.length}</span>
              个结果
              {searchQuery && (
                <span>
                  ，搜索词：
                  <span className="font-medium">{searchQuery}</span>
                </span>
              )}
            </div>

            {/* 搜索结果列表 */}
            {searchResults.length > 0
              ? (
                  <div className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-5">
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
          </div>
        )}

        {/* 默认搜索建议 */}
        {!searchQuery && (
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
