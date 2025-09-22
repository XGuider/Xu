'use client';

import type { Category } from '@/types';
import React, { createContext, use, useEffect, useMemo, useState } from 'react';

type CategoryContextType = {
  activeCategory: string | null;
  setActiveCategory: (categoryId: string | null) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  scrollToCategory: (categoryId: string) => void;
};

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const useCategoryContext = () => {
  const context = use(CategoryContext);
  if (!context) {
    throw new Error('useCategoryContext must be used within a CategoryProvider');
  }
  return context;
};

type CategoryProviderProps = {
  children: React.ReactNode;
};

export const CategoryProvider: React.FC<CategoryProviderProps> = ({ children }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 滚动到指定分类的函数
  const scrollToCategory = useCallback((categoryId: string) => {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }, []);

  // 从API加载分类数据
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/categories');
        if (response.ok) {
          const categoriesData = await response.json();
          setCategories(categoriesData);
        } else {
          throw new Error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('加载分类数据失败:', error);
        // 使用默认分类数据作为后备
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
          {
            id: '5',
            name: 'AI写作工具',
            slug: 'ai-writing',
            description: '智能内容创作和写作助手',
            icon: 'ai-writing',
            sort: 5,
            isActive: true,
            toolCount: 28,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '6',
            name: 'AI学习网站',
            slug: 'ai-learning',
            description: 'AI教育和学习资源',
            icon: 'ai-learning',
            sort: 6,
            isActive: true,
            toolCount: 15,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];
        setCategories(defaultCategories);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  // 滚动监听器，自动更新活动分类
  useEffect(() => {
    const handleScroll = () => {
      const categoryElements = categories.map(cat => ({
        id: cat.id,
        element: document.getElementById(`category-${cat.id}`),
      })).filter(item => item.element);

      const scrollPosition = window.scrollY + 100; // 偏移量

      for (let i = categoryElements.length - 1; i >= 0; i--) {
        const categoryElement = categoryElements[i];
        if (categoryElement && categoryElement.element && categoryElement.element.offsetTop <= scrollPosition) {
          setActiveCategory(categoryElement.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories]);

  const value: CategoryContextType = useMemo(() => ({
    activeCategory,
    setActiveCategory,
    categories,
    setCategories,
    isLoading,
    setIsLoading,
    scrollToCategory,
  }), [activeCategory, categories, isLoading, scrollToCategory]);

  return (
    <CategoryContext value={value}>
      {children}
    </CategoryContext>
  );
};
