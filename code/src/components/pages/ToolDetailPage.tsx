'use client';

import type { Tool } from '@/types';
import Link from 'next/link';
import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { cn } from '@/utils/cn';

// 星星图标组件
const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    className={cn('w-5 h-5', filled ? 'text-warning fill-current' : 'text-gray-300')}
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
    className={cn('w-4 h-4', filled ? 'text-danger fill-current' : 'text-gray-400')}
    viewBox="0 0 20 20"
  >
    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
  </svg>
);

// 面包屑导航组件
const Breadcrumb = ({ tool }: { tool: Tool }) => (
  <nav className="text-gray-dark mb-6 text-sm">
    <Link href="/" className="hover:text-primary transition-colors">
      首页
    </Link>
    <span className="mx-2">/</span>
    <Link href={`/category/${tool.category.slug}`} className="hover:text-primary transition-colors">
      {tool.category.name}
    </Link>
    <span className="mx-2">/</span>
    <span className="text-gray-900">{tool.name}</span>
  </nav>
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
      <span className="text-gray-dark ml-1 text-sm">
        (
        {ratingCount}
        评分)
      </span>
    </div>
  );
};

type ToolDetailPageProps = {
  tool: Tool;
  relatedTools: Tool[];
};

const ToolDetailPage: React.FC<ToolDetailPageProps> = ({ tool, relatedTools }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleVisitWebsite = () => {
    window.open(tool.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-gray-light min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        {/* 面包屑导航 */}
        <Breadcrumb tool={tool} />

        {/* 工具详情 */}
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* 左侧信息 */}
          <div className="lg:w-2/3">
            <div className="shadow-card rounded-lg bg-white p-6">
              <div className="mb-6 flex items-start">
                <div className="bg-primary/10 mr-4 flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg">
                  <svg className="text-primary h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h1 className="mb-2 text-3xl font-bold text-gray-900">{tool.name}</h1>
                  <div className="mb-3 flex items-center space-x-4">
                    <span className="bg-success/10 text-success rounded-full px-3 py-1 text-sm">
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
                <p className="text-gray-dark leading-relaxed">
                  {tool.description}
                </p>
              </div>

              {/* 核心功能 */}
              <div className="mb-6">
                <h3 className="mb-3 text-xl font-bold">核心功能</h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {tool.tags.map(tag => (
                    <div key={tag} className="flex items-start">
                      <svg className="text-success mt-1 mr-2 h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-dark">{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 右侧信息 */}
          <div className="lg:w-1/3">
            {/* 基本信息 */}
            <div className="border-gray-medium bg-neutral mb-6 rounded-lg border p-4">
              <h4 className="mb-3 font-bold">基本信息</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex">
                  <span className="text-gray-dark w-1/3">网址：</span>
                  <span className="flex-1 truncate">
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {tool.url}
                    </a>
                  </span>
                </li>
                {tool.developer && (
                  <li className="flex">
                    <span className="text-gray-dark w-1/3">开发商：</span>
                    <span>{tool.developer}</span>
                  </li>
                )}
                {tool.launchDate && (
                  <li className="flex">
                    <span className="text-gray-dark w-1/3">上线时间：</span>
                    <span>{tool.launchDate.toLocaleDateString('zh-CN')}</span>
                  </li>
                )}
                {tool.platforms && tool.platforms.length > 0 && (
                  <li className="flex">
                    <span className="text-gray-dark w-1/3">适用平台：</span>
                    <span>{tool.platforms.join('、')}</span>
                  </li>
                )}
                {tool.price && (
                  <li className="flex">
                    <span className="text-gray-dark w-1/3">价格：</span>
                    <span>{tool.price}</span>
                  </li>
                )}
              </ul>
            </div>

            {/* 相关推荐 */}
            <div>
              <h4 className="mb-3 font-bold">相关推荐</h4>
              <div className="space-y-2">
                {relatedTools.map(tool => (
                  <Link
                    key={tool.id}
                    href={`/tool/${tool.id}`}
                    className="border-gray-medium hover:border-primary flex cursor-pointer items-center rounded border p-2 transition-all duration-300"
                  >
                    <div className="bg-primary/10 mr-2 flex h-8 w-8 items-center justify-center rounded">
                      <svg className="text-primary h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="text-sm">{tool.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolDetailPage;
