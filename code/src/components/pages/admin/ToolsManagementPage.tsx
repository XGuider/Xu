'use client';

import React, { useState } from 'react';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { cn } from '@/utils/cn';

// 模拟工具数据
const mockTools = [
  {
    id: '001',
    name: 'DeepSeek',
    category: 'AI编程工具',
    url: 'https://www.deepseek.com',
    status: '已上线',
  },
  {
    id: '002',
    name: '腾讯元宝',
    category: 'AI聊天助手',
    url: 'https://yuanbao.qq.com',
    status: '已上线',
  },
  {
    id: '003',
    name: 'Cursor',
    category: 'AI编程工具',
    url: 'https://www.cursor.so',
    status: '已上线',
  },
  {
    id: '004',
    name: '新AI工具',
    category: 'AI写作工具',
    url: 'https://newai.example.com',
    status: '审核中',
  },
];

const ToolsManagementPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [tools, setTools] = useState(mockTools);
  const [isAddingTool, setIsAddingTool] = useState(false);
  const [editingTool, setEditingTool] = useState<any>(null);
  const [newTool, setNewTool] = useState({
    name: '',
    category: '',
    url: '',
    status: '审核中',
  });

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase())
      || tool.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || tool.category === selectedCategory;
    const matchesStatus = !selectedStatus || tool.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // 添加工具
  const handleAddTool = () => {
    if (newTool.name.trim() && newTool.url.trim()) {
      const tool = {
        id: (tools.length + 1).toString().padStart(3, '0'),
        name: newTool.name,
        category: newTool.category,
        url: newTool.url,
        status: newTool.status,
      };
      setTools([...tools, tool]);
      setNewTool({ name: '', category: '', url: '', status: '审核中' });
      setIsAddingTool(false);
    }
  };

  // 编辑工具
  const handleEditTool = (tool: any) => {
    setEditingTool(tool);
  };

  // 保存编辑
  const handleSaveEdit = () => {
    if (editingTool) {
      setTools(tools.map(t =>
        t.id === editingTool.id
          ? { ...editingTool }
          : t,
      ));
      setEditingTool(null);
    }
  };

  // 删除工具
  const handleDeleteTool = (toolId: string) => {
    // eslint-disable-next-line no-alert
    if (confirm('确定要删除这个工具吗？')) {
      setTools(tools.filter(t => t.id !== toolId));
    }
  };

  // 切换状态
  const handleToggleStatus = (toolId: string) => {
    setTools(tools.map(t =>
      t.id === toolId
        ? { ...t, status: t.status === '已上线' ? '已下架' : '已上线' }
        : t,
    ));
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI工具管理</h1>
          <p className="text-gray-600">管理平台上的AI工具信息</p>
        </div>
        <Button onClick={() => setIsAddingTool(true)}>
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          添加工具
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
              placeholder="工具名称"
              value={newTool.name}
              onChange={e => setNewTool({ ...newTool, name: e.target.value })}
            />
            <select
              value={newTool.category}
              onChange={e => setNewTool({ ...newTool, category: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
            >
              <option value="">选择分类</option>
              <option value="AI办公工具">AI办公工具</option>
              <option value="AI视频工具">AI视频工具</option>
              <option value="AI编程工具">AI编程工具</option>
              <option value="AI聊天助手">AI聊天助手</option>
              <option value="AI写作工具">AI写作工具</option>
            </select>
            <div className="md:col-span-2">
              <Input
                type="url"
                placeholder="工具网址"
                value={newTool.url}
                onChange={e => setNewTool({ ...newTool, url: e.target.value })}
              />
            </div>
            <select
              value={newTool.status}
              onChange={e => setNewTool({ ...newTool, status: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
            >
              <option value="审核中">审核中</option>
              <option value="已上线">已上线</option>
              <option value="已下架">已下架</option>
            </select>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleAddTool}>保存</Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingTool(false);
                setNewTool({ name: '', category: '', url: '', status: '审核中' });
              }}
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
              {filteredTools.map(tool => (
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
                      {tool.url}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      tool.status === '已上线'
                        ? 'bg-green-100 text-green-800'
                        : tool.status === '审核中'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800',
                    )}
                    >
                      {tool.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleEditTool(tool)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        编辑
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(tool.id)}
                        className={cn(
                          'text-sm',
                          tool.status === '已上线' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900',
                        )}
                      >
                        {tool.status === '已上线' ? '下架' : '上线'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTool(tool.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 分页 */}
      <div className="rounded-lg border border-gray-200 bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            显示 1-
            {filteredTools.length}
            {' '}
            条，共
            {' '}
            {filteredTools.length}
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
          <div className="relative top-20 mx-auto w-96 rounded-md border bg-white p-5 shadow-lg">
            <div className="mt-3">
              <h3 className="mb-4 text-lg font-medium text-gray-900">编辑工具</h3>
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="工具名称"
                  value={editingTool.name}
                  onChange={e => setEditingTool({ ...editingTool, name: e.target.value })}
                />
                <select
                  value={editingTool.category}
                  onChange={e => setEditingTool({ ...editingTool, category: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                >
                  <option value="">选择分类</option>
                  <option value="AI办公工具">AI办公工具</option>
                  <option value="AI视频工具">AI视频工具</option>
                  <option value="AI编程工具">AI编程工具</option>
                  <option value="AI聊天助手">AI聊天助手</option>
                  <option value="AI写作工具">AI写作工具</option>
                </select>
                <Input
                  type="url"
                  placeholder="工具网址"
                  value={editingTool.url}
                  onChange={e => setEditingTool({ ...editingTool, url: e.target.value })}
                />
                <select
                  value={editingTool.status}
                  onChange={e => setEditingTool({ ...editingTool, status: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                >
                  <option value="审核中">审核中</option>
                  <option value="已上线">已上线</option>
                  <option value="已下架">已下架</option>
                </select>
              </div>
              <div className="mt-6 flex gap-2">
                <Button onClick={handleSaveEdit}>保存</Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingTool(null)}
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
