'use client';

import type { Category, Tool } from '@/types';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import FixedSidebar from '@/components/layout/FixedSidebar';
import ToolCard from '@/components/tools/ToolCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useCategoryContext } from '@/contexts/CategoryContext';
import { cn } from '@/utils/cn';

// 默认分类数据（用于工具数据中的引用）
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
];

// 工具数据
const allTools: Tool[] = [
  // AI办公工具
  {
    id: '1',
    name: 'WPS AI',
    description: '智能文档处理，支持自动生成、摘要和翻译',
    url: 'https://ai.wps.cn',
    categoryId: '1',
    category: defaultCategories[0]!,
    rating: 4.8,
    ratingCount: 1256,
    isActive: true,
    isFeatured: true,
    tags: ['办公', '文档', 'AI助手'],
    developer: '金山办公',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Excel AI助手',
    description: '智能数据分析与公式生成，提升表格处理效率',
    url: 'https://excel.ai',
    categoryId: '1',
    category: defaultCategories[0]!,
    rating: 4.6,
    ratingCount: 892,
    isActive: true,
    isFeatured: false,
    tags: ['办公', '表格', '数据分析'],
    developer: 'Microsoft',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: '智能日程助手',
    description: '自动安排会议，智能提醒，优化时间管理',
    url: 'https://calendar.ai',
    categoryId: '1',
    category: defaultCategories[0]!,
    rating: 4.5,
    ratingCount: 654,
    isActive: true,
    isFeatured: false,
    tags: ['办公', '日程', '时间管理'],
    developer: 'Google',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // AI视频工具
  {
    id: '4',
    name: 'Runway ML',
    description: 'AI视频编辑和生成平台，支持文本转视频',
    url: 'https://runwayml.com',
    categoryId: '2',
    category: defaultCategories[1]!,
    rating: 4.7,
    ratingCount: 2341,
    isActive: true,
    isFeatured: true,
    tags: ['视频', 'AI生成', '编辑'],
    developer: 'Runway',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'Luma AI',
    description: '3D视频生成和编辑工具',
    url: 'https://lumalabs.ai',
    categoryId: '2',
    category: defaultCategories[1]!,
    rating: 4.4,
    ratingCount: 1234,
    isActive: true,
    isFeatured: false,
    tags: ['视频', '3D', '生成'],
    developer: 'Luma Labs',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // AI编程工具
  {
    id: '6',
    name: 'GitHub Copilot',
    description: 'AI代码助手，智能代码补全和建议',
    url: 'https://github.com/features/copilot',
    categoryId: '3',
    category: defaultCategories[2]!,
    rating: 4.9,
    ratingCount: 5678,
    isActive: true,
    isFeatured: true,
    tags: ['编程', '代码助手', 'AI'],
    developer: 'GitHub',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '7',
    name: 'Cursor',
    description: 'AI驱动的代码编辑器',
    url: 'https://cursor.sh',
    categoryId: '3',
    category: defaultCategories[2]!,
    rating: 4.6,
    ratingCount: 3456,
    isActive: true,
    isFeatured: false,
    tags: ['编程', '编辑器', 'AI'],
    developer: 'Cursor',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // AI聊天助手
  {
    id: '8',
    name: 'ChatGPT',
    description: 'OpenAI的智能对话助手',
    url: 'https://chat.openai.com',
    categoryId: '4',
    category: defaultCategories[3]!,
    rating: 4.8,
    ratingCount: 9876,
    isActive: true,
    isFeatured: true,
    tags: ['聊天', '对话', 'AI助手'],
    developer: 'OpenAI',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '9',
    name: 'Claude',
    description: 'Anthropic的AI助手，擅长分析和写作',
    url: 'https://claude.ai',
    categoryId: '4',
    category: defaultCategories[3]!,
    rating: 4.7,
    ratingCount: 5432,
    isActive: true,
    isFeatured: false,
    tags: ['聊天', '分析', '写作'],
    developer: 'Anthropic',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const {
    activeCategory,
    categories,
    isLoading,
  } = useCategoryContext();

  // 模拟轮播图数据
  const carouselSlides = [
    {
      id: '1',
      title: 'AI工具导航平台',
      subtitle: '发现最好的AI工具',
      image: '/assets/images/carousel-1.jpg',
      link: '/search?q=AI工具',
    },
    {
      id: '2',
      title: '最新AI工具推荐',
      subtitle: '探索前沿AI技术',
      image: '/assets/images/carousel-2.jpg',
      link: '/category/ai-office',
    },
    {
      id: '3',
      title: 'AI编程助手',
      subtitle: '提升开发效率',
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 固定侧边栏 */}
      <FixedSidebar />

      <main className="mx-auto max-w-7xl px-4 py-8 pt-20 pl-72 md:px-8">
        <div className="flex flex-col gap-8">
          {/* 英雄区域 */}
          <section className="mb-12 text-center">
            <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-6xl">
              千万用户信赖的
              <span className="block text-blue-600">AI工具导航平台</span>
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-700">
              发现最好的AI工具，包括AI办公、AI编程、AI视频、AI写作等各类智能工具，
              提升工作效率和创造力
            </p>

            {/* 搜索框 */}
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
                />
                <Button
                  type="submit"
                  size="lg"
                  className="absolute top-1/2 right-2 -translate-y-1/2"
                >
                  搜索
                </Button>
              </div>
            </form>

            {/* 热搜榜 */}
            <div className="flex flex-wrap justify-center gap-3">
              <span className="text-sm text-gray-700">热搜榜：</span>
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
                            立即探索
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
                热门推荐
              </h2>
              <p className="text-lg text-gray-700">
                精选最受欢迎的AI工具
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
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
                按分类浏览
              </h2>
              <p className="text-lg text-gray-700">
                探索不同类别的AI工具
              </p>
            </div>

            {isLoading
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
                    {categories.map((category) => {
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
                                  {' · 共 '}
                                  {categoryTools.length}
                                  {' 个工具'}
                                </p>
                              </div>
                            </div>
                            <Link
                              href={`/category/${category.slug}`}
                              className="flex items-center space-x-1 font-medium text-blue-600 hover:text-blue-700"
                            >
                              <span>查看全部</span>
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </div>

                          {/* 工具网格 */}
                          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
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
