'use client';

import type { Tool } from '@/types';
import { useTranslations } from 'next-intl';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import ToolCard from '@/components/tools/ToolCard';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';
import { useCategoryContext } from '@/contexts/CategoryContext';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { useTools } from '@/hooks/useTools';
import { Link, useRouter } from '@/libs/I18nNavigation';
import { cn } from '@/utils/cn';

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const t = useTranslations('HomePage');
  const {
    activeCategory,
    setActiveCategory,
    categories,
    isLoading,
    scrollToCategory,
  } = useCategoryContext();

  // 确保 categories 始终是数组，防止运行时错误
  const safeCategories = Array.isArray(categories) ? categories : [];
  const { isSidebarOpen } = useSidebarContext();

  // 获取工具数据
  const { tools: allTools, loading: toolsLoading } = useTools({
    status: 'active',
    limit: 100, // 获取更多工具用于展示
  });

  // 获取最新工具（最新4个）
  const [featuredTools, setFeaturedTools] = useState<Tool[]>([]);
  const [featuredToolsLoading, setFeaturedToolsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestTools = async () => {
      try {
        setFeaturedToolsLoading(true);
        const response = await fetch('/api/tools?latest=true&limit=4&status=active');
        const data = await response.json();
        if (data.success) {
          setFeaturedTools(data.data.tools);
        }
      } catch (error) {
        console.error('获取最新工具失败:', error);
      } finally {
        setFeaturedToolsLoading(false);
      }
    };

    fetchLatestTools();
  }, []);

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

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [heroMode, setHeroMode] = useState<'search' | 'browse'>('search');
  const [showFab, setShowFab] = useState(false);

  useEffect(() => {
    if (heroMode === 'browse') {
      document.getElementById('browse-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [heroMode]);

  useEffect(() => {
    const onScroll = () => setShowFab(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const marqueeText = t('marquee_text');

  return (
    <div className="min-h-screen bg-zinc-100">
      <Sidebar />
      <div
        className={cn(
          'transition-all duration-300',
          isSidebarOpen ? 'lg:ml-80' : 'lg:ml-0',
          'pt-16',
        )}
      >
        {/* 全宽深色英雄区：导航站主视觉 */}
        <section
          className="relative ml-[calc(50%-50vw)] w-screen max-w-[100vw] overflow-hidden bg-gradient-to-b from-slate-950 via-[#0c1222] to-slate-900 pt-8 pb-10 text-center shadow-inner"
          aria-label={t('hero_title')}
        >
          <div className="home-hero-stars pointer-events-none absolute inset-0 opacity-90" aria-hidden />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(244,63,94,0.12),transparent)]" aria-hidden />

          <div className="relative z-10 mx-auto max-w-3xl px-4">
            <p className="text-sm font-medium tracking-wide text-rose-300/90">
              {t('hero_tagline')}
            </p>
            <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              {t('hero_subtitle')}
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
              {t('hero_description')}
            </p>

            <div className="mt-8 flex justify-center gap-8 border-b border-white/10 pb-3 text-sm">
              <button
                type="button"
                className={cn(
                  'relative pb-3 font-medium transition-colors',
                  heroMode === 'search' ? 'text-white' : 'text-slate-500 hover:text-slate-300',
                )}
                onClick={() => setHeroMode('search')}
              >
                {t('tab_site_search')}
                {heroMode === 'search' && (
                  <span className="absolute right-0 bottom-0 left-0 mx-auto h-0.5 w-8 rounded-full bg-rose-500" />
                )}
              </button>
              <button
                type="button"
                className={cn(
                  'relative pb-3 font-medium transition-colors',
                  heroMode === 'browse' ? 'text-white' : 'text-slate-500 hover:text-slate-300',
                )}
                onClick={() => setHeroMode('browse')}
              >
                {t('tab_browse')}
                {heroMode === 'browse' && (
                  <span className="absolute right-0 bottom-0 left-0 mx-auto h-0.5 w-8 rounded-full bg-rose-500" />
                )}
              </button>
            </div>

            <form onSubmit={handleSearch} className="mx-auto mt-6 max-w-xl">
              <div className="relative">
                <label htmlFor="hero-search" className="sr-only">
                  {t('search_placeholder')}
                </label>
                <input
                  id="hero-search"
                  ref={searchInputRef}
                  type="search"
                  autoComplete="off"
                  placeholder={t('search_placeholder')}
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={() => {
                    if (searchQuery.trim()) {
                      setShowSuggestions(true);
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => setShowSuggestions(false), 200);
                  }}
                  className="w-full rounded-full border border-white/10 bg-slate-800/70 py-3.5 pr-28 pl-5 text-base text-slate-100 shadow-lg backdrop-blur-md placeholder:text-slate-500 focus:border-rose-400/40 focus:ring-2 focus:ring-rose-500/30 focus:outline-none"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="absolute top-1/2 right-1.5 h-10 -translate-y-1/2 rounded-full bg-rose-500 px-5 text-sm font-semibold hover:bg-rose-600"
                  disabled={isSearching}
                >
                  {isSearching ? <Loading size="sm" text="" /> : t('search_button')}
                </Button>

                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full right-0 left-0 z-20 mt-2 max-h-60 overflow-auto rounded-xl border border-slate-600/80 bg-slate-900/95 py-1 shadow-xl backdrop-blur-md">
                    {searchSuggestions.map(suggestion => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => handleQuickSearch(suggestion)}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-slate-800"
                      >
                        <svg className="h-4 w-4 shrink-0 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </form>

            <div className="mx-auto mt-6 flex max-w-xl flex-wrap justify-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => searchInputRef.current?.focus()}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-200 backdrop-blur-sm transition-colors hover:border-rose-400/30 hover:bg-white/10 hover:text-white sm:text-sm"
              >
                <span className="text-rose-400" aria-hidden>⌕</span>
                {t('quick_search')}
              </button>
              <button
                type="button"
                onClick={() => document.getElementById('featured-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-200 backdrop-blur-sm transition-colors hover:border-rose-400/30 hover:bg-white/10 hover:text-white sm:text-sm"
              >
                <span className="text-amber-300" aria-hidden>★</span>
                {t('quick_featured')}
              </button>
              <button
                type="button"
                onClick={() => document.getElementById('browse-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-200 backdrop-blur-sm transition-colors hover:border-rose-400/30 hover:bg-white/10 hover:text-white sm:text-sm"
              >
                <span className="text-sky-300" aria-hidden>≡</span>
                {t('quick_categories')}
              </button>
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-200 backdrop-blur-sm transition-colors hover:border-rose-400/30 hover:bg-white/10 hover:text-white sm:text-sm"
              >
                <span className="text-emerald-300" aria-hidden>＋</span>
                {t('quick_submit')}
              </Link>
            </div>
          </div>

          <div
            className="relative z-10 mt-8 border-t border-white/5 bg-black/20 py-2 text-left text-xs text-slate-400"
            role="status"
            aria-live="polite"
          >
            <div className="overflow-hidden">
              <div className="home-marquee-track flex gap-16 pr-16">
                <span className="shrink-0 whitespace-nowrap">
                  {marqueeText}
                </span>
                <span className="shrink-0 whitespace-nowrap" aria-hidden>
                  {marqueeText}
                </span>
              </div>
            </div>
          </div>

          <svg
            className="relative z-[1] mt-2 w-full text-slate-800/90"
            viewBox="0 0 1200 80"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              fill="currentColor"
              d="M0 80 L0 55 L120 40 L200 52 L280 35 L400 48 L520 28 L640 45 L760 32 L880 50 L1000 38 L1120 48 L1200 42 L1200 80 Z"
            />
          </svg>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-10">
            {/* 最新工具推荐 */}
            <section className="scroll-mt-24 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200/80 sm:p-8" id="featured-section">
              <div className="mb-6 text-center sm:mb-8">
                <h2 className="mb-2 text-2xl font-bold text-zinc-900 sm:text-3xl">
                  {t('featured_tools')}
                </h2>
                <p className="text-sm text-zinc-600 sm:text-base">
                  {t('featured_tools_subtitle')}
                </p>
              </div>

              {featuredToolsLoading
                ? (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-20 animate-pulse rounded-xl bg-zinc-100" />
                      ))}
                    </div>
                  )
                : (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {featuredTools.map(tool => (
                        <ToolCard
                          key={tool.id}
                          tool={tool}
                          layout="directory"
                          className="h-full"
                        />
                      ))}
                    </div>
                  )}
            </section>

            {/* 分类工具展示 */}
            <section className="scroll-mt-24 pb-8" id="browse-section">
              <div className="mb-6 text-center sm:mb-8">
                <h2 className="mb-2 text-2xl font-bold text-zinc-900 sm:text-3xl">
                  {t('browse_by_category')}
                </h2>
                <p className="text-sm text-zinc-600 sm:text-base">
                  {t('browse_by_category_subtitle')}
                </p>
              </div>

              {!isLoading && !toolsLoading && safeCategories.length > 0 && (
                <div className="-mx-1 mb-8 overflow-x-auto px-1 pb-2 sm:mx-0 sm:overflow-visible sm:px-0">
                  <div className="flex min-w-min snap-x snap-mandatory gap-2 sm:flex-wrap sm:justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCategory(null);
                        document.getElementById('browse-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className={cn(
                        'snap-start shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all',
                        activeCategory === null
                          ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                          : 'bg-white text-zinc-700 ring-1 ring-zinc-200 hover:ring-rose-200',
                      )}
                    >
                      {t('filter_all')}
                    </button>
                    {safeCategories.map(category => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => {
                          setActiveCategory(category.id);
                          scrollToCategory(category.id);
                        }}
                        className={cn(
                          'snap-start shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all',
                          activeCategory === category.id
                            ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                            : 'bg-white text-zinc-700 ring-1 ring-zinc-200 hover:ring-rose-200',
                        )}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isLoading || toolsLoading
                ? (
                    <div className="space-y-12">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="animate-pulse rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200/80">
                          <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="h-12 w-12 rounded-xl bg-zinc-100"></div>
                              <div>
                                <div className="mb-2 h-6 w-32 rounded bg-zinc-100"></div>
                                <div className="h-4 w-48 rounded bg-zinc-100"></div>
                              </div>
                            </div>
                            <div className="h-6 w-20 rounded bg-zinc-100"></div>
                          </div>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {[1, 2, 3, 4].map(j => (
                              <div key={j} className="h-20 rounded-xl bg-zinc-100"></div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                : (
                    <div className="space-y-12">
                      {safeCategories.map((category) => {
                        const categoryTools = allTools.filter(
                          tool => String(tool.categoryId) === String(category.id),
                        );
                        const displayTools = categoryTools;

                        return (
                          <div
                            key={category.id}
                            id={`category-${category.id}`}
                            className={cn(
                              'scroll-mt-28 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/80 transition-all duration-500 sm:p-6',
                              activeCategory === category.id && 'ring-2 ring-rose-400 shadow-lg shadow-rose-500/10',
                            )}
                          >
                            <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-400 text-white shadow-sm sm:h-12 sm:w-12">
                                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                  </svg>
                                </div>
                                <div className="min-w-0 text-left">
                                  <h3 className="text-xl font-bold text-zinc-900 sm:text-2xl">
                                    {category.name}
                                  </h3>
                                  <p className="text-sm text-zinc-600">
                                    {category.description}
                                    {' · '}
                                    {t('tools_count', { count: categoryTools.length })}
                                  </p>
                                </div>
                              </div>
                              <Link
                                href={`/category/${category.slug}`}
                                className="inline-flex shrink-0 items-center gap-1 self-start text-sm font-medium text-rose-600 hover:text-rose-700 sm:self-center"
                              >
                                <span>{t('view_more')}</span>
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </Link>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                              {displayTools.map(tool => (
                                <ToolCard
                                  key={tool.id}
                                  tool={tool}
                                  layout="directory"
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
        </div>

        {showFab && (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed right-4 bottom-6 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-lg transition-colors hover:border-rose-200 hover:text-rose-600 sm:right-8"
            aria-label={t('back_to_top')}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default HomePage;
