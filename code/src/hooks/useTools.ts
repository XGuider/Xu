import { useCallback, useEffect, useState } from 'react';

export type Tool = {
  id: string;
  name: string;
  description: string;
  url: string;
  categoryId: string;
  category: string;
  rating: number;
  ratingCount: number;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  developer?: string;
  createdAt: string;
  updatedAt: string;
};

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

export type CreateToolData = {
  name: string;
  description: string;
  url: string;
  categoryId: string;
  tags?: string[];
  developer?: string;
  price?: string;
  platforms?: string[];
};

export type UpdateToolData = Partial<CreateToolData> & {
  id: string;
  isActive?: boolean;
};

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

  // 创建工具
  const createTool = useCallback(async (toolData: CreateToolData): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(toolData),
      });

      const data = await response.json();

      if (data.success) {
        // 重新获取工具列表
        await fetchTools(options);
        return true;
      } else {
        setError(data.message || '创建工具失败');
        return false;
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      console.error('创建工具失败:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchTools, options]);

  // 更新工具
  const updateTool = useCallback(async (toolData: UpdateToolData): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/tools', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(toolData),
      });

      const data = await response.json();

      if (data.success) {
        // 重新获取工具列表
        await fetchTools(options);
        return true;
      } else {
        setError(data.message || '更新工具失败');
        return false;
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      console.error('更新工具失败:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchTools, options]);

  // 删除工具
  const deleteTool = useCallback(async (toolId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/tools?id=${toolId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        // 重新获取工具列表
        await fetchTools(options);
        return true;
      } else {
        setError(data.message || '删除工具失败');
        return false;
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      console.error('删除工具失败:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchTools, options]);

  // 切换工具状态
  const toggleToolStatus = useCallback(async (toolId: string): Promise<boolean> => {
    const tool = tools.find(t => t.id === toolId);
    if (!tool) {
      return false;
    }

    return await updateTool({
      id: toolId,
      isActive: !tool.isActive,
    });
  }, [tools, updateTool]);

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
    createTool,
    updateTool,
    deleteTool,
    toggleToolStatus,
    clearError: () => setError(null),
  };
};
