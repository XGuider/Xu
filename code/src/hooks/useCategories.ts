import { useCallback, useEffect, useState } from 'react';

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  sort: number;
  isActive: boolean;
  toolCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CategoriesResponse = {
  success: boolean;
  data: Category[];
  message?: string;
  error?: string;
};

// 注意：数据通过编辑 data/categories.json 文件进行管理，不再需要这些类型

export type UseCategoriesOptions = {
  includeInactive?: boolean;
};

export const useCategories = (options: UseCategoriesOptions = {}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取分类列表
  const fetchCategories = useCallback(async (fetchOptions: UseCategoriesOptions = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (fetchOptions.includeInactive) {
        params.append('includeInactive', 'true');
      }

      const response = await fetch(`/api/categories?${params.toString()}`);
      const data: CategoriesResponse = await response.json();

      if (data.success) {
        setCategories(data.data);
      } else {
        setError(data.message || '获取分类列表失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      console.error('获取分类列表失败:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 注意：数据通过编辑 data/categories.json 文件进行管理，API只提供读取功能

  // 初始加载
  useEffect(() => {
    fetchCategories(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchCategories, options.includeInactive]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    clearError: () => setError(null),
  };
};
