'use client';

import type { Category } from '@/types';

import React, { useState } from 'react';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { cn } from '@/utils/cn';

// 模拟分类数据
const mockCategories: Category[] = [
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
];

const CategoryManagementPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    icon: '',
  });

  // 筛选分类
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
    || (category.description || '').toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // 添加分类
  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      const category: Category = {
        id: (categories.length + 1).toString(),
        name: newCategory.name,
        slug: newCategory.name.toLowerCase().replace(/\s+/g, '-'),
        description: newCategory.description,
        icon: newCategory.icon,
        sort: categories.length + 1,
        isActive: true,
        toolCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setCategories([...categories, category]);
      setNewCategory({ name: '', description: '', icon: '' });
      setIsAddingCategory(false);
    }
  };

  // 编辑分类
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
  };

  // 保存编辑
  const handleSaveEdit = () => {
    if (editingCategory) {
      setCategories(categories.map(cat =>
        cat.id === editingCategory.id
          ? { ...editingCategory, updatedAt: new Date() }
          : cat,
      ));
      setEditingCategory(null);
    }
  };

  // 切换状态
  const handleToggleStatus = (categoryId: string) => {
    setCategories(categories.map(cat =>
      cat.id === categoryId
        ? { ...cat, isActive: !cat.isActive, updatedAt: new Date() }
        : cat,
    ));
  };

  // 删除分类
  const handleDeleteCategory = (categoryId: string) => {
    // eslint-disable-next-line no-alert
    if (confirm('确定要删除这个分类吗？')) {
      setCategories(categories.filter(cat => cat.id !== categoryId));
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">分类管理</h1>
        <p className="text-gray-600">管理AI工具分类，包括添加、编辑、删除和排序功能</p>
      </div>

      {/* 操作栏 */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-1 flex-col gap-4 md:flex-row">
          <div className="relative">
            <Input
              type="text"
              placeholder="搜索分类名称或描述"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 md:w-80"
            />
            <svg className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <Button
          onClick={() => setIsAddingCategory(true)}
          className="flex items-center gap-2"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          添加分类
        </Button>
      </div>

      {/* 添加分类表单 */}
      {isAddingCategory && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">添加新分类</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              type="text"
              placeholder="分类名称"
              value={newCategory.name}
              onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
            />
            <Input
              type="text"
              placeholder="图标名称"
              value={newCategory.icon}
              onChange={e => setNewCategory({ ...newCategory, icon: e.target.value })}
            />
            <div className="md:col-span-2">
              <Input
                type="text"
                placeholder="分类描述"
                value={newCategory.description}
                onChange={e => setNewCategory({ ...newCategory, description: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleAddCategory}>保存</Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingCategory(false);
                setNewCategory({ name: '', description: '', icon: '' });
              }}
            >
              取消
            </Button>
          </div>
        </div>
      )}

      {/* 分类列表 */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  分类信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  工具数量
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  排序
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
              {filteredCategories.map(category => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                          <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        <div className="text-sm text-gray-500">{category.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                    {category.toolCount}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                    {category.sort}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      category.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800',
                    )}
                    >
                      {category.isActive ? '启用' : '禁用'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleEditCategory(category)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        编辑
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(category.id)}
                        className={cn(
                          'hover:text-gray-900',
                          category.isActive ? 'text-red-600' : 'text-green-600',
                        )}
                      >
                        {category.isActive ? '禁用' : '启用'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(category.id)}
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

      {/* 编辑分类模态框 */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 h-full w-full overflow-y-auto bg-gray-600/50">
          <div className="relative top-20 mx-auto w-96 rounded-md border bg-white p-5 shadow-lg">
            <div className="mt-3">
              <h3 className="mb-4 text-lg font-medium text-gray-900">编辑分类</h3>
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="分类名称"
                  value={editingCategory.name}
                  onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
                />
                <Input
                  type="text"
                  placeholder="分类描述"
                  value={editingCategory.description || ''}
                  onChange={e => setEditingCategory({ ...editingCategory, description: e.target.value })}
                />
                <Input
                  type="text"
                  placeholder="排序"
                  value={editingCategory.sort.toString()}
                  onChange={e => setEditingCategory({ ...editingCategory, sort: Number.parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="mt-6 flex gap-2">
                <Button onClick={handleSaveEdit}>保存</Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingCategory(null)}
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

export default CategoryManagementPage;
