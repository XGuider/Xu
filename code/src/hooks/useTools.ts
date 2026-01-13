import type { Tool } from '@/types';
import { useCallback, useEffect, useState } from 'react';

export type ToolsResponse = {
  success: boolean;
  data: {
    tools: Tool[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

// 注意：数据通过编辑 data/tools.json 文件进行管理，不再需要这些类型

export type UseToolsOptions = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
};

export const useTools = (options: UseToolsOptions = {}) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // 获取工具列表
  const fetchTools = useCallback(async (fetchOptions: UseToolsOptions = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (fetchOptions.page) {
        params.append('page', fetchOptions.page.toString());
      }
      if (fetchOptions.limit) {
        params.append('limit', fetchOptions.limit.toString());
      }
      if (fetchOptions.search) {
        params.append('search', fetchOptions.search);
      }
      if (fetchOptions.category) {
        params.append('category', fetchOptions.category);
      }
      if (fetchOptions.status) {
        params.append('status', fetchOptions.status);
      }

      const response = await fetch(`/api/tools?${params.toString()}`);
      const data: ToolsResponse = await response.json();

      if (data.success) {
        setTools(data.data.tools);
        setPagination(data.data.pagination);
      } else {
        setError('获取工具列表失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      console.error('获取工具列表失败:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 注意：数据通过编辑 data/tools.json 文件进行管理，API只提供读取功能

  // 初始加载
  useEffect(() => {
    fetchTools(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchTools, options.page, options.limit, options.search, options.category, options.status]);

  return {
    tools,
    loading,
    error,
    pagination,
    fetchTools,
    clearError: () => setError(null),
  };
};
