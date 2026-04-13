'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import Input from '@/components/ui/Input';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { usePathname } from '@/libs/I18nNavigation';
import { cn } from '@/utils/cn';

/** next-intl 的 pathname 不含语言前缀，首页为 `/` */
function isMarketingHomePath(pathname: string | null): boolean {
  if (!pathname) {
    return false;
  }
  const p = pathname.replace(/\/$/, '') || '/';
  return p === '/';
}

// 搜索图标组件
const SearchIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

// 菜单图标组件
const MenuIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

// 关闭图标组件
const CloseIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const { toggleSidebar } = useSidebarContext();
  const isHome = isMarketingHomePath(pathname);

  const navigation = [
    { name: '首页', href: '/' },
    // { name: '提交网址', href: '/submit' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 跳转到搜索结果页
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const headerBar = isHome
    ? 'border-b border-slate-700/80 bg-slate-900/95 shadow-lg shadow-slate-950/20 backdrop-blur-md'
    : 'border-b border-gray-300 bg-white shadow-sm';
  const iconBtn = isHome
    ? 'text-slate-200 hover:bg-slate-800 hover:text-white'
    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600';
  const brandText = isHome ? 'text-white' : 'text-blue-600';
  const navLink = (active: boolean) =>
    cn(
      'font-medium transition-colors duration-200',
      isHome
        ? active
          ? 'text-rose-400'
          : 'text-slate-200 hover:text-white'
        : active
          ? 'text-blue-600'
          : 'text-gray-700 hover:text-blue-600',
    );
  const inputSearchClass = isHome
    ? 'w-64 border-slate-600 bg-slate-800/80 pr-10 text-slate-100 placeholder:text-slate-400 focus:border-rose-400 focus:ring-rose-500/40'
    : 'w-64 pr-10';
  const submitBtn = isHome
    ? 'text-slate-300 hover:text-rose-400'
    : 'text-gray-700 hover:text-blue-600';
  const mobilePanel = isHome ? 'border-slate-700' : 'border-gray-300';
  const mobileLink = (active: boolean) =>
    cn(
      'block rounded-md px-3 py-2 text-base font-medium transition-colors duration-200',
      isHome
        ? active
          ? 'bg-slate-800 text-rose-400'
          : 'text-slate-200 hover:bg-slate-800 hover:text-white'
        : active
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600',
    );

  return (
    <header className={cn('fixed top-0 right-0 left-0 z-50', headerBar)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo 和侧边栏切换按钮 */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={toggleSidebar}
              className={cn('mr-3 rounded-md p-2', iconBtn)}
              aria-label="打开分类导航"
            >
              <MenuIcon />
            </button>

            <Link href="/" className="flex items-center space-x-3 transition-opacity hover:opacity-90">
              <Image
                src="/assets/images/logo.png"
                alt="Xu Logo"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  console.error('Logo failed to load:', e);
                }}
              />
              <div className={cn('text-2xl font-bold', brandText)}>Xu</div>
            </Link>
          </div>

          <nav className="hidden items-center space-x-8 md:flex" aria-label="主导航">
            {navigation.map((item) => {
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={navLink(pathname === item.href)}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center space-x-4 md:flex">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="搜索AI工具..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                className={inputSearchClass}
                leftIcon={(
                  <span className={isHome ? 'text-slate-400' : undefined}>
                    <SearchIcon />
                  </span>
                )}
              />
              <button
                type="submit"
                className={cn('absolute top-1/2 right-2 -translate-y-1/2 transition-colors', submitBtn)}
                aria-label="搜索"
              >
                <SearchIcon />
              </button>
            </form>

            <div className="flex items-center space-x-4">
              <LocaleSwitcher variant={isHome ? 'dark' : 'light'} />
            </div>
          </div>

          <div className="md:hidden">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className={cn('transition-colors', isHome ? 'text-slate-200 hover:text-white' : 'text-gray-700 hover:text-blue-600')}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? '关闭菜单' : '打开菜单'}
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className={cn('border-t md:hidden', mobilePanel)}>
            <div className="space-y-1 px-2 pt-2 pb-3">
              <form onSubmit={handleSearch} className="mb-4">
                <Input
                  type="text"
                  placeholder="搜索AI工具..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                  className={cn(
                    'w-full',
                    isHome
                    && 'border-slate-600 bg-slate-800/80 text-slate-100 placeholder:text-slate-400 focus:border-rose-400 focus:ring-rose-500/40',
                  )}
                  leftIcon={(
                    <span className={isHome ? 'text-slate-400' : undefined}>
                      <SearchIcon />
                    </span>
                  )}
                />
              </form>

              {navigation.map((item) => {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={mobileLink(pathname === item.href)}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}

              <div className={cn('border-t pt-4', mobilePanel)}>
                <div className="flex flex-col space-y-3">
                  <div className="flex justify-center">
                    <LocaleSwitcher variant={isHome ? 'dark' : 'light'} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
