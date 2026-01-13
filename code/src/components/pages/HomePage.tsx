'use client';

import type { Tool } from '@/types';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import ToolCard from '@/components/tools/ToolCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Loading from '@/components/ui/Loading';
import { useCategoryContext } from '@/contexts/CategoryContext';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { useTools } from '@/hooks/useTools';
import { cn } from '@/utils/cn';

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const t = useTranslations('HomePage');
  const {
    activeCategory,
    categories,
    isLoading,
  } = useCategoryContext();

  // 确保 categories 始终是数组，防止运行时错误
  const safeCategories = Array.isArray(categories) ? categories : [];
  const { isSidebarOpen } = useSidebarContext();

  // 获取工具数据
  const { tools: allTools, loading: toolsLoading } = useTools({
    status: 'active',
    limit: 100, // 获取更多工具用于展示
  });

  // 模拟轮播图数据
  const carouselSlides = [
    {
      id: '1',
      title: t('carousel.slide1_title'),
      subtitle: t('carousel.slide1_subtitle'),
      image: '/assets/images/carousel-1.jpg',
      link: '/search?q=AI工具',
    },
    {
      id: '2',
      title: t('carousel.slide2_title'),
      subtitle: t('carousel.slide2_subtitle'),
      image: '/assets/images/carousel-2.jpg',
      link: '/category/ai-office',
    },
    {
      id: '3',
      title: t('carousel.slide3_title'),
      subtitle: t('carousel.slide3_subtitle'),
      image: '/assets/images/carousel-3.jpg',
      link: '/category/ai-coding',
    },
  ];

  // 自动轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        return (prev + 1) % carouselSlides.length;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  // 模拟热搜数据
  const hotSearches = [
    { id: '1', keyword: 'Liblibai', searchCount: 1250, isTrending: true },
    { id: '2', keyword: 'Coze扣子', searchCount: 980, isTrending: true },
    { id: '3', keyword: '剪映', searchCount: 856, isTrending: false },
    { id: '4', keyword: 'Trac国内版', searchCount: 743, isTrending: false },
  ];

  // 模拟热门工具数据
  const featuredTools: Tool[] = [
    {
      id: '1',
      name: 'DeepSeek',
      description: '深度求索AI工具，强大的代码生成和编程助手',
      url: 'https://www.deepseek.com',
      categoryId: '3',
      category: {
        id: '3',
        name: 'AI编程工具',
        slug: 'ai-coding',
        sort: 3,
        isActive: true,
        toolCount: 18,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      rating: 4.8,
      ratingCount: 1256,
      isActive: true,
      isFeatured: true,
      tags: ['编程', '代码生成', 'AI助手'],
      developer: '深度求索',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: '腾讯元宝',
      description: '腾讯AI助手，智能对话和内容创作',
      url: 'https://yuanbao.qq.com',
      categoryId: '4',
      category: {
        id: '4',
        name: 'AI聊天助手',
        slug: 'ai-chat',
        sort: 4,
        isActive: true,
        toolCount: 45,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      rating: 4.6,
      ratingCount: 892,
      isActive: true,
      isFeatured: true,
      tags: ['聊天', 'AI助手', '腾讯'],
      developer: '腾讯',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      name: 'Cursor',
      description: 'AI代码助手，提升编程效率',
      url: 'https://www.cursor.so',
      categoryId: '3',
      category: {
        id: '3',
        name: 'AI编程工具',
        slug: 'ai-coding',
        sort: 3,
        isActive: true,
        toolCount: 18,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      rating: 4.7,
      ratingCount: 654,
      isActive: true,
      isFeatured: true,
      tags: ['编程', '代码助手', '开发工具'],
      developer: 'Cursor',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);

  // 实时搜索建议
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 搜索建议数据
  const suggestionKeywords = useMemo(() => [
    'AI写作',
    '代码生成',
    '图像生成',
    '视频编辑',
    '语音识别',
    '翻译工具',
    '数据分析',
    '聊天机器人',
    '办公助手',
    '学习工具',
  ], []);

  // 实时搜索建议
  const updateSearchSuggestions = useCallback((query: string) => {
    if (query.trim().length > 0) {
      const filtered = suggestionKeywords.filter(keyword =>
        keyword.toLowerCase().includes(query.toLowerCase()),
      );
      setSearchSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [suggestionKeywords]);

  // 搜索处理
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      try {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      } finally {
        setIsSearching(false);
      }
    }
  };

  // 快速搜索
  const handleQuickSearch = (keyword: string) => {
    setSearchQuery(keyword);
    setShowSuggestions(false);
    router.push(`/search?q=${encodeURIComponent(keyword)}`);
  };

  // 搜索输入变化处理
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    updateSearchSuggestions(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 侧边栏 */}
      <Sidebar />
      {/* 主内容区域 */}
      <main className={cn(
        'mx-auto max-w-7xl px-4 py-8 pt-20 transition-all duration-300',
        isSidebarOpen ? 'lg:ml-80' : 'lg:ml-0', // 根据侧边栏状态调整边距
        'pl-4', // 移动端正常边距
      )}
      >
        <div className="flex flex-col gap-8">
          {/* 英雄区域 */}
          <section className="mb-12 text-center">
            <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-6xl">
              {t('hero_subtitle')}
              <span className="block text-blue-600">{t('hero_title')}</span>
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-700">
              {t('hero_description')}
            </p>

            {/* 搜索框 */}
            <form onSubmit={handleSearch} className="mx-auto mb-8 max-w-2xl">
              <div className="relative">
                <Input
                  type="text"
                  placeholder={t('search_placeholder')}
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={() => {
                    if (searchQuery.trim()) {
                      setShowSuggestions(true);
                    }
                  }}
                  onBlur={() => {
                    // 延迟隐藏建议，让用户能点击建议项
                    setTimeout(() => setShowSuggestions(false), 200);
                  }}
                  className="w-full py-4 pr-20 pl-6 text-lg"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="absolute top-1/2 right-2 -translate-y-1/2"
                  disabled={isSearching}
                >
                  {isSearching
                    ? (
                        <Loading size="sm" text="" />
                      )
                    : (
                        t('search_button')
                      )}
                </Button>

                {/* 搜索建议下拉框 */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full right-0 left-0 z-10 mt-2 rounded-lg border border-gray-200 bg-white shadow-lg">
                    {searchSuggestions.map(suggestion => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => handleQuickSearch(suggestion)}
                        className="w-full px-4 py-3 text-left text-gray-700 first:rounded-t-lg last:rounded-b-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          {suggestion}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </form>

            {/* 热搜榜 */}
            <div className="flex flex-wrap justify-center gap-3">
              <span className="text-sm text-gray-700">
                {t('hot_searches')}
                ：
              </span>
              {hotSearches.map((item) => {
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSearchQuery(item.keyword);
                    }}
                    className={cn(
                      'text-sm px-3 py-1 rounded-full transition-all duration-200',
                      item.isTrending
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white',
                    )}
                  >
                    {item.keyword}
                  </button>
                );
              })}
            </div>
          </section>

          {/* 轮播图 */}
          <section className="mb-12">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="relative h-64 md:h-80">
                {carouselSlides.map((slide, index) => {
                  return (
                    <div
                      key={slide.id}
                      className={cn(
                        'absolute inset-0 transition-opacity duration-500',
                        index === currentSlide ? 'opacity-100' : 'opacity-0',
                      )}
                    >
                      <div className="flex h-full items-center justify-center p-8 text-center text-white">
                        <div>
                          <h3 className="mb-4 text-3xl font-bold md:text-4xl">
                            {slide.title}
                          </h3>
                          <p className="mb-6 text-lg opacity-90 md:text-xl">
                            {slide.subtitle}
                          </p>
                          <Button
                            variant="outline"
                            className="border-white bg-white/20 text-white hover:bg-white hover:text-blue-600"
                            onClick={() => {
                              window.location.href = slide.link;
                            }}
                          >
                            {t('explore_now')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 轮播图指示器 */}
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
                {carouselSlides.map((slide, index) => {
                  return (
                    <button
                      key={`indicator-${slide.id || index}`}
                      type="button"
                      onClick={() => {
                        setCurrentSlide(index);
                      }}
                      className={cn(
                        'w-3 h-3 rounded-full transition-all duration-200',
                        index === currentSlide ? 'bg-white' : 'bg-white/50',
                      )}
                    />
                  );
                })}
              </div>
            </div>
          </section>

          {/* 热门推荐工具 */}
          <section className="mb-12">
            <div className="mb-8 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                {t('featured_tools')}
              </h2>
              <p className="text-lg text-gray-700">
                {t('featured_tools_subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-5">
              {featuredTools.map((tool) => {
                return (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    className="h-full"
                  />
                );
              })}
            </div>
          </section>

          {/* 分类工具展示 */}
          <section className="mb-12">
            <div className="mb-8 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                {t('browse_by_category')}
              </h2>
              <p className="text-lg text-gray-700">
                {t('browse_by_category_subtitle')}
              </p>
            </div>

            {isLoading || toolsLoading
              ? (
                  <div className="space-y-12">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="animate-pulse rounded-lg bg-white p-6 shadow-lg">
                        <div className="mb-6 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="h-12 w-12 rounded-lg bg-gray-200"></div>
                            <div>
                              <div className="mb-2 h-6 w-32 rounded bg-gray-200"></div>
                              <div className="h-4 w-48 rounded bg-gray-200"></div>
                            </div>
                          </div>
                          <div className="h-6 w-20 rounded bg-gray-200"></div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                          {[1, 2, 3, 4].map(j => (
                            <div key={j} className="h-32 rounded-lg bg-gray-200"></div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              : (
                  <div className="space-y-12">
                    {safeCategories.map((category) => {
                      const categoryTools = allTools.filter(tool => tool.categoryId === category.id);
                      const displayTools = categoryTools.slice(0, 4);

                      return (
                        <div
                          key={category.id}
                          id={`category-${category.id}`}
                          className={cn(
                            'bg-white rounded-lg p-6 shadow-lg transition-all duration-500',
                            activeCategory === category.id && 'ring-2 ring-blue-500 ring-opacity-50 shadow-xl',
                          )}
                        >
                          {/* 分类标题 */}
                          <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                  {category.name}
                                </h3>
                                <p className="text-gray-600">
                                  {category.description}
                                  {' · '}
                                  {t('tools_count', { count: categoryTools.length })}
                                </p>
                              </div>
                            </div>
                            <Link
                              href={`/category/${category.slug}`}
                              className="flex items-center space-x-1 font-medium text-blue-600 hover:text-blue-700"
                            >
                              <span>{t('view_more')}</span>
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </div>

                          {/* 工具网格 */}
                          <div className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-5">
                            {displayTools.map(tool => (
                              <ToolCard
                                key={tool.id}
                                tool={tool}
                                className="h-full"
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
