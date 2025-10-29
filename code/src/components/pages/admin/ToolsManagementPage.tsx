'use client';

import React, { useState } from 'react';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useNotification } from '@/contexts/NotificationContext';
import { useTools } from '@/hooks/useTools';
import { cn } from '@/utils/cn';

const ToolsManagementPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isAddingTool, setIsAddingTool] = useState(false);
  const [editingTool, setEditingTool] = useState<any>(null);
  const [newTool, setNewTool] = useState({
    name: '',
    description: '',
    url: '',
    categoryId: '',
    tags: [] as string[],
    developer: '',
  });
  // 使用通知系统
  const { addNotification } = useNotification();

  // 使用真实的API Hook
  const {
    tools,
    loading,
    error,
    pagination,
    createTool,
    updateTool,
    deleteTool,
    toggleToolStatus,
    fetchTools: _fetchTools,
  } = useTools({
    page: 1,
    limit: 50,
    search: searchQuery,
    category: selectedCategory,
    status: selectedStatus,
  });

  // 添加工具
  const handleAddTool = async () => {
    if (!newTool.name.trim() || !newTool.url.trim() || !newTool.categoryId) {
      addNotification({ type: 'error', message: '请填写所有必填字段' });
      return;
    }

    const success = await createTool({
      name: newTool.name,
      description: newTool.description,
      url: newTool.url,
      categoryId: newTool.categoryId,
      tags: newTool.tags,
      developer: newTool.developer,
    });

    if (success) {
      addNotification({ type: 'success', message: '工具添加成功' });
      setNewTool({ name: '', description: '', url: '', categoryId: '', tags: [], developer: '' });
      setIsAddingTool(false);
    } else {
      addNotification({ type: 'error', message: '工具添加失败' });
    }
  };

  // 编辑工具
  const handleEditTool = (tool: any) => {
    setEditingTool({
      ...tool,
      categoryId: tool.categoryId || '',
    });
  };

  // 保存编辑
  const handleSaveEdit = async () => {
    if (!editingTool) {
      return;
    }

    const success = await updateTool({
      id: editingTool.id,
      name: editingTool.name,
      description: editingTool.description,
      url: editingTool.url,
      categoryId: editingTool.categoryId,
      tags: editingTool.tags || [],
      developer: editingTool.developer || '',
    });

    if (success) {
      addNotification({ type: 'success', message: '工具更新成功' });
      setEditingTool(null);
    } else {
      addNotification({ type: 'error', message: '工具更新失败' });
    }
  };

  // 删除工具
  const handleDeleteTool = async (toolId: string) => {
    // 直接执行删除，由上层UI负责二次确认
    const success = await deleteTool(toolId);
    if (success) {
      addNotification({ type: 'success', message: '工具删除成功' });
    } else {
      addNotification({ type: 'error', message: '工具删除失败' });
    }
  };

  // 切换状态
  const handleToggleStatus = async (toolId: string) => {
    const success = await toggleToolStatus(toolId);
    if (success) {
      addNotification({ type: 'success', message: '状态更新成功' });
    } else {
      addNotification({ type: 'error', message: '状态更新失败' });
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI工具管理</h1>
          <p className="text-gray-600">管理平台上的AI工具信息</p>
        </div>
        <Button onClick={() => setIsAddingTool(true)} disabled={loading}>
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {loading ? '加载中...' : '添加工具'}
        </Button>
      </div>

      {/* 搜索与筛选 */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <Input
              placeholder="搜索工具名称或网址"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              leftIcon={(
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            />
          </div>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
          >
            <option value="">全部分类</option>
            <option value="AI办公工具">AI办公工具</option>
            <option value="AI视频工具">AI视频工具</option>
            <option value="AI编程工具">AI编程工具</option>
            <option value="AI聊天助手">AI聊天助手</option>
            <option value="AI写作工具">AI写作工具</option>
          </select>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
          >
            <option value="">全部状态</option>
            <option value="已上线">已上线</option>
            <option value="审核中">审核中</option>
            <option value="已下架">已下架</option>
          </select>
        </div>
      </div>

      {/* 添加工具表单 */}
      {isAddingTool && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">添加新工具</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              type="text"
              placeholder="工具名称 *"
              value={newTool.name}
              onChange={e => setNewTool({ ...newTool, name: e.target.value })}
            />
            <select
              value={newTool.categoryId}
              onChange={e => setNewTool({ ...newTool, categoryId: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
            >
              <option value="">选择分类 *</option>
              <option value="1">AI办公工具</option>
              <option value="2">AI视频工具</option>
              <option value="3">AI编程工具</option>
              <option value="4">AI聊天助手</option>
              <option value="5">AI写作工具</option>
              <option value="6">AI学习网站</option>
            </select>
            <div className="md:col-span-2">
              <Input
                type="url"
                placeholder="工具网址 *"
                value={newTool.url}
                onChange={e => setNewTool({ ...newTool, url: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <textarea
                placeholder="工具描述"
                value={newTool.description}
                onChange={e => setNewTool({ ...newTool, description: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                rows={3}
              />
            </div>
            <Input
              type="text"
              placeholder="开发者"
              value={newTool.developer}
              onChange={e => setNewTool({ ...newTool, developer: e.target.value })}
            />
            <Input
              type="text"
              placeholder="标签 (用逗号分隔)"
              value={newTool.tags.join(', ')}
              onChange={e => setNewTool({
                ...newTool,
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag),
              })}
            />
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleAddTool} disabled={loading}>
              {loading ? '保存中...' : '保存'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingTool(false);
                setNewTool({ name: '', description: '', url: '', categoryId: '', tags: [], developer: '' });
              }}
              disabled={loading}
            >
              取消
            </Button>
          </div>
        </div>
      )}

      {/* 工具列表 */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  工具名称
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  分类
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  网址
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading
                ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        <div className="flex items-center justify-center">
                          <svg className="mr-2 h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          加载中...
                        </div>
                      </td>
                    </tr>
                  )
                : error
                  ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-red-500">
                          加载失败:
                          {' '}
                          {error}
                        </td>
                      </tr>
                    )
                  : tools.length === 0
                    ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                            暂无工具数据
                          </td>
                        </tr>
                      )
                    : (
                        tools.map(tool => (
                          <tr key={tool.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                              {tool.id}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                              {tool.name}
                            </td>
                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                              {tool.category}
                            </td>
                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                              <div className="max-w-xs truncate" title={tool.url}>
                                <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                  {tool.url}
                                </a>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={cn(
                                'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                                tool.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800',
                              )}
                              >
                                {tool.isActive ? '已上线' : '已下架'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                              <div className="flex space-x-2">
                                <button
                                  type="button"
                                  onClick={() => handleEditTool(tool)}
                                  className="text-blue-600 hover:text-blue-900"
                                  disabled={loading}
                                >
                                  编辑
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(tool.id)}
                                  className={cn(
                                    'text-sm',
                                    tool.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900',
                                  )}
                                  disabled={loading}
                                >
                                  {tool.isActive ? '下架' : '上线'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTool(tool.id)}
                                  className="text-red-600 hover:text-red-900"
                                  disabled={loading}
                                >
                                  删除
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 分页 */}
      <div className="rounded-lg border border-gray-200 bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            显示 1-
            {tools.length}
            {' '}
            条，共
            {' '}
            {pagination?.total || tools.length}
            {' '}
            条
          </div>
          <div className="flex items-center space-x-2">
            <button type="button" className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50" disabled>
              上一页
            </button>
            <button type="button" className="rounded bg-blue-600 px-3 py-1 text-sm text-white">1</button>
            <button type="button" className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">下一页</button>
          </div>
        </div>
      </div>

      {/* 编辑工具模态框 */}
      {editingTool && (
        <div className="fixed inset-0 z-50 h-full w-full overflow-y-auto bg-gray-600/50">
          <div className="relative top-10 mx-auto w-full max-w-2xl rounded-md border bg-white p-6 shadow-lg">
            <div className="mt-3">
              <h3 className="mb-4 text-lg font-medium text-gray-900">编辑工具</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  type="text"
                  placeholder="工具名称 *"
                  value={editingTool.name}
                  onChange={e => setEditingTool({ ...editingTool, name: e.target.value })}
                />
                <select
                  value={editingTool.categoryId}
                  onChange={e => setEditingTool({ ...editingTool, categoryId: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                >
                  <option value="">选择分类 *</option>
                  <option value="1">AI办公工具</option>
                  <option value="2">AI视频工具</option>
                  <option value="3">AI编程工具</option>
                  <option value="4">AI聊天助手</option>
                  <option value="5">AI写作工具</option>
                  <option value="6">AI学习网站</option>
                </select>
                <div className="md:col-span-2">
                  <Input
                    type="url"
                    placeholder="工具网址 *"
                    value={editingTool.url}
                    onChange={e => setEditingTool({ ...editingTool, url: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <textarea
                    placeholder="工具描述"
                    value={editingTool.description || ''}
                    onChange={e => setEditingTool({ ...editingTool, description: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                    rows={3}
                  />
                </div>
                <Input
                  type="text"
                  placeholder="开发者"
                  value={editingTool.developer || ''}
                  onChange={e => setEditingTool({ ...editingTool, developer: e.target.value })}
                />
                <Input
                  type="text"
                  placeholder="标签 (用逗号分隔)"
                  value={(editingTool.tags || []).join(', ')}
                  onChange={e => setEditingTool({
                    ...editingTool,
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag),
                  })}
                />
              </div>
              <div className="mt-6 flex gap-2">
                <Button onClick={handleSaveEdit} disabled={loading}>
                  {loading ? '保存中...' : '保存'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingTool(null)}
                  disabled={loading}
                >
                  取消
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolsManagementPage;
