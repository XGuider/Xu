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

export type CreateCategoryData = {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  sort?: number;
  isActive?: boolean;
};

export type UpdateCategoryData = Partial<CreateCategoryData> & {
  id: string;
};

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

  // 创建分类
  const createCategory = useCallback(async (categoryData: CreateCategoryData): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      const data = await response.json();

      if (data.success) {
        // 重新获取分类列表
        await fetchCategories(options);
        return true;
      } else {
        setError(data.message || '创建分类失败');
        return false;
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      console.error('创建分类失败:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories, options]);

  // 更新分类
  const updateCategory = useCallback(async (categoryData: UpdateCategoryData): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/categories', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      const data = await response.json();

      if (data.success) {
        // 重新获取分类列表
        await fetchCategories(options);
        return true;
      } else {
        setError(data.message || '更新分类失败');
        return false;
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      console.error('更新分类失败:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories, options]);

  // 删除分类
  const deleteCategory = useCallback(async (categoryId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/categories?id=${categoryId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        // 重新获取分类列表
        await fetchCategories(options);
        return true;
      } else {
        setError(data.message || '删除分类失败');
        return false;
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      console.error('删除分类失败:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories, options]);

  // 切换分类状态
  const toggleCategoryStatus = useCallback(async (categoryId: string): Promise<boolean> => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) {
      return false;
    }

    return await updateCategory({
      id: categoryId,
      isActive: !category.isActive,
    });
  }, [categories, updateCategory]);

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
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
    clearError: () => setError(null),
  };
};
