'use client';

import React, { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { useToolDetail } from '@/contexts/ToolDetailContext';
import { cn } from '@/utils/cn';

// 关闭图标
const CloseIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// 星星图标组件
const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    className={cn('w-5 h-5', filled ? 'text-yellow-400 fill-current' : 'text-gray-300')}
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

// 外部链接图标
const ExternalLinkIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

// 心形图标
const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    className={cn('w-4 h-4', filled ? 'text-red-500 fill-current' : 'text-gray-400')}
    viewBox="0 0 20 20"
  >
    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
  </svg>
);

// 评分组件
const Rating = ({ rating, ratingCount }: { rating: number; ratingCount: number }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<StarIcon key={i} filled={true} />);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<StarIcon key={i} filled={false} />);
    } else {
      stars.push(<StarIcon key={i} filled={false} />);
    }
  }

  return (
    <div className="flex items-center space-x-1">
      {stars}
      <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
      <span className="ml-1 text-sm text-gray-500">
        (
        {ratingCount}
        {' '}
        评分)
      </span>
    </div>
  );
};

const ToolDetailModal: React.FC = () => {
  const { isOpen, tool, closeToolDetail } = useToolDetail();
  const [isFavorite, setIsFavorite] = useState(false);

  // 处理ESC键关闭
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeToolDetail();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeToolDetail]);

  if (!isOpen || !tool) {
    return null;
  }

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleVisitWebsite = () => {
    window.open(tool.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-end transition-opacity duration-300',
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tool-detail-title"
    >
      {/* 背景遮罩 */}
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="关闭弹窗"
        onClick={closeToolDetail}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            closeToolDetail();
          }
        }}
      />

      {/* 弹窗内容 - 从右侧滑入 */}
      <div
        className={cn(
          'relative h-full w-full max-w-2xl bg-white shadow-xl transition-transform duration-300 ease-out overflow-y-auto',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* 头部 */}
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 id="tool-detail-title" className="text-xl font-bold text-gray-900">工具详情</h2>
            <button
              type="button"
              onClick={closeToolDetail}
              className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              aria-label="关闭"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="px-6 py-6">
          {/* 工具头部信息 */}
          <div className="mb-6 flex items-start">
            <div className="mr-4 flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                {tool.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="flex-1">
              <h1 className="mb-2 text-3xl font-bold text-gray-900">{tool.name}</h1>
              <div className="mb-3 flex items-center space-x-4">
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                  {tool.category.name}
                </span>
                <Rating rating={tool.rating} ratingCount={tool.ratingCount} />
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  onClick={handleVisitWebsite}
                  leftIcon={<ExternalLinkIcon />}
                  className="flex items-center"
                >
                  访问官网
                </Button>
                <Button
                  variant="outline"
                  onClick={handleFavorite}
                  leftIcon={<HeartIcon filled={isFavorite} />}
                  className="flex items-center"
                >
                  {isFavorite ? '已收藏' : '收藏'}
                </Button>
              </div>
            </div>
          </div>

          {/* 工具介绍 */}
          <div className="mb-6">
            <h3 className="mb-3 text-xl font-bold">工具介绍</h3>
            <p className="leading-relaxed text-gray-700">
              {tool.description}
            </p>
          </div>

          {/* 核心功能 */}
          <div className="mb-6">
            <h3 className="mb-3 text-xl font-bold">核心功能</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {tool.tags && tool.tags.map(tag => (
                <div key={tag} className="flex items-start">
                  <svg className="mt-1 mr-2 h-5 w-5 flex-shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{tag}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 基本信息 */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h4 className="mb-3 font-bold">基本信息</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex">
                <span className="w-1/3 text-gray-600">网址：</span>
                <span className="flex-1 truncate">
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {tool.url}
                  </a>
                </span>
              </li>
              {tool.developer && (
                <li className="flex">
                  <span className="w-1/3 text-gray-600">开发商：</span>
                  <span>{tool.developer}</span>
                </li>
              )}
              {tool.launchDate && (
                <li className="flex">
                  <span className="w-1/3 text-gray-600">上线时间：</span>
                  <span>{new Date(tool.launchDate).toLocaleDateString('zh-CN')}</span>
                </li>
              )}
              {tool.platforms && tool.platforms.length > 0 && (
                <li className="flex">
                  <span className="w-1/3 text-gray-600">适用平台：</span>
                  <span>{tool.platforms.join('、')}</span>
                </li>
              )}
              {tool.price && (
                <li className="flex">
                  <span className="w-1/3 text-gray-600">价格：</span>
                  <span>{tool.price}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolDetailModal;
