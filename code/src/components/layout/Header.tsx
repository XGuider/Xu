'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import Input from '@/components/ui/Input';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { cn } from '@/utils/cn';

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

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-gray-300 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo 和侧边栏切换按钮 */}
          <div className="flex items-center">
            {/* 侧边栏切换按钮 */}
            <button
              type="button"
              onClick={toggleSidebar}
              className="mr-3 rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600"
            >
              <MenuIcon />
            </button>

            <Link href="/" className="flex items-center space-x-3 transition-opacity hover:opacity-80">
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
              <div className="text-2xl font-bold text-blue-600">Xu</div>
            </Link>
          </div>

          {/* 桌面端导航 */}
          <nav className="hidden items-center space-x-8 md:flex">
            {navigation.map((item) => {
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium',
                    pathname === item.href ? 'text-blue-600' : '',
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* 搜索框和用户操作 */}
          <div className="hidden items-center space-x-4 md:flex">
            {/* 搜索框 */}
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="搜索AI工具..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                className="w-64 pr-10"
                leftIcon={<SearchIcon />}
              />
              <button
                type="submit"
                className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-700 transition-colors hover:text-blue-600"
              >
                <SearchIcon />
              </button>
            </form>

            {/* 用户操作区域 */}
            <div className="flex items-center space-x-4">
              {/* 语言切换器 */}
              <LocaleSwitcher />
            </div>
          </div>

          {/* 移动端菜单按钮 */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="text-gray-700 transition-colors hover:text-blue-600"
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* 移动端菜单 */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-300 md:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {/* 移动端搜索框 */}
              <form onSubmit={handleSearch} className="mb-4">
                <Input
                  type="text"
                  placeholder="搜索AI工具..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                  className="w-full"
                  leftIcon={<SearchIcon />}
                />
              </form>

              {/* 移动端导航 */}
              {navigation.map((item) => {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200',
                      pathname === item.href
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50',
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}

              {/* 移动端用户操作 */}
              <div className="border-t border-gray-300 pt-4">
                <div className="flex flex-col space-y-3">
                  {/* 移动端语言切换器 */}
                  <div className="flex justify-center">
                    <LocaleSwitcher />
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
