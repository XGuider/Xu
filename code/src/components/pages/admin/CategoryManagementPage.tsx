'use client';

import type { Category } from '@/hooks/useCategories';

import React, { useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Loading from '@/components/ui/Loading';
import { useNotification } from '@/contexts/NotificationContext';
import { useCategories } from '@/hooks/useCategories';
import { cn } from '@/utils/cn';

const CategoryManagementPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
  });
  const [showInactive, setShowInactive] = useState(false);

  // 使用通知系统
  const { addNotification } = useNotification();

  // 使用真实的API Hook
  const {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
  } = useCategories({
    includeInactive: showInactive,
  });

  // 筛选分类
  const filteredCategories = useMemo(() => {
    return categories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
      || (category.description || '').toLowerCase().includes(searchQuery.toLowerCase())
      || category.slug.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [categories, searchQuery]);

  // 生成slug
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // 移除特殊字符
      .replace(/\s+/g, '-') // 空格替换为连字符
      .replace(/-+/g, '-') // 多个连字符合并为一个
      .trim();
  };

  // 添加分类
  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      addNotification({ type: 'error', message: '请填写分类名称' });
      return;
    }

    const categoryData = {
      name: newCategory.name.trim(),
      slug: newCategory.slug.trim() || generateSlug(newCategory.name),
      description: newCategory.description.trim() || undefined,
      icon: newCategory.icon.trim() || undefined,
    };

    const success = await createCategory(categoryData);
    if (success) {
      addNotification({ type: 'success', message: '分类添加成功' });
      setNewCategory({ name: '', slug: '', description: '', icon: '' });
      setIsAddingCategory(false);
    } else {
      addNotification({ type: 'error', message: '分类添加失败' });
    }
  };

  // 编辑分类
  const handleEditCategory = (category: Category) => {
    setEditingCategory({
      ...category,
      slug: category.slug || generateSlug(category.name),
    });
  };

  // 保存编辑
  const handleSaveEdit = async () => {
    if (!editingCategory) {
      return;
    }

    const categoryData = {
      id: editingCategory.id,
      name: editingCategory.name.trim(),
      slug: editingCategory.slug.trim() || generateSlug(editingCategory.name),
      description: editingCategory.description?.trim() || undefined,
      icon: editingCategory.icon?.trim() || undefined,
      sort: editingCategory.sort,
    };

    const success = await updateCategory(categoryData);
    if (success) {
      addNotification({ type: 'success', message: '分类更新成功' });
      setEditingCategory(null);
    } else {
      addNotification({ type: 'error', message: '分类更新失败' });
    }
  };

  // 切换状态
  const handleToggleStatus = async (categoryId: string) => {
    const success = await toggleCategoryStatus(categoryId);
    if (success) {
      addNotification({ type: 'success', message: '状态更新成功' });
    } else {
      addNotification({ type: 'error', message: '状态更新失败' });
    }
  };

  // 删除分类
  const handleDeleteCategory = async (categoryId: string) => {
    // 直接执行删除，由上层UI负责二次确认
    const success = await deleteCategory(categoryId);
    if (success) {
      addNotification({ type: 'success', message: '分类删除成功' });
    } else {
      addNotification({ type: 'error', message: '分类删除失败' });
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
              placeholder="搜索分类名称、描述或标识"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 md:w-80"
            />
            <svg className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={e => setShowInactive(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              显示已禁用分类
            </label>
          </div>
        </div>
        <Button
          onClick={() => setIsAddingCategory(true)}
          className="flex items-center gap-2"
          disabled={loading}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {loading ? '加载中...' : '添加分类'}
        </Button>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">加载失败</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* 添加分类表单 */}
      {isAddingCategory && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">添加新分类</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="newCategoryName" className="mb-2 block text-sm font-medium text-gray-700">分类名称 *</label>
              <Input
                type="text"
                placeholder="输入分类名称"
                value={newCategory.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setNewCategory({
                    ...newCategory,
                    name,
                    slug: newCategory.slug || generateSlug(name),
                  });
                }}
                id="newCategoryName"
                required
              />
            </div>
            <div>
              <label htmlFor="newCategorySlug" className="mb-2 block text-sm font-medium text-gray-700">分类标识</label>
              <Input
                type="text"
                placeholder="自动生成或手动输入"
                value={newCategory.slug}
                onChange={e => setNewCategory({ ...newCategory, slug: e.target.value })}
                id="newCategorySlug"
              />
              <p className="mt-1 text-xs text-gray-500">用于URL路径，如：ai-office</p>
            </div>
            <div>
              <label htmlFor="newCategoryIcon" className="mb-2 block text-sm font-medium text-gray-700">图标</label>
              <Input
                type="text"
                placeholder="输入图标名称"
                value={newCategory.icon}
                onChange={e => setNewCategory({ ...newCategory, icon: e.target.value })}
                id="newCategoryIcon"
              />
            </div>
            <div>
              <label htmlFor="newCategorySort" className="mb-2 block text-sm font-medium text-gray-700">排序</label>
              <Input
                type="number"
                value={categories.length + 1}
                disabled
                className="bg-gray-50"
                id="newCategorySort"
              />
              <p className="mt-1 text-xs text-gray-500">自动设置为下一个排序值</p>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="newCategoryDesc" className="mb-2 block text-sm font-medium text-gray-700">描述</label>
              <textarea
                placeholder="输入分类描述"
                value={newCategory.description}
                onChange={e => setNewCategory({ ...newCategory, description: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                rows={3}
                id="newCategoryDesc"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              onClick={handleAddCategory}
              disabled={loading || !newCategory.name.trim()}
            >
              {loading ? <Loading size="sm" /> : '保存'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingCategory(false);
                setNewCategory({ name: '', slug: '', description: '', icon: '' });
              }}
              disabled={loading}
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
                  标识
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  排序
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  工具数量
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
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <Loading text="加载分类数据..." />
                      </td>
                    </tr>
                  )
                : filteredCategories.length === 0
                  ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          {searchQuery ? '没有找到匹配的分类' : '暂无分类数据'}
                        </td>
                      </tr>
                    )
                  : (
                      filteredCategories.map(category => (
                        <tr key={category.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            {editingCategory?.id === category.id
                              ? (
                                  <div className="space-y-2">
                                    <Input
                                      type="text"
                                      value={editingCategory.name}
                                      onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                      className="text-sm"
                                    />
                                    <textarea
                                      value={editingCategory.description || ''}
                                      onChange={e => setEditingCategory({ ...editingCategory, description: e.target.value })}
                                      placeholder="分类描述"
                                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                      rows={2}
                                    />
                                  </div>
                                )
                              : (
                                  <div>
                                    <div className="flex items-center gap-2">
                                      {category.icon && (
                                        <span className="text-lg">{category.icon}</span>
                                      )}
                                      <span className="font-medium text-gray-900">{category.name}</span>
                                    </div>
                                    {category.description && (
                                      <p className="mt-1 text-sm text-gray-500">{category.description}</p>
                                    )}
                                  </div>
                                )}
                          </td>
                          <td className="px-6 py-4">
                            {editingCategory?.id === category.id
                              ? (
                                  <Input
                                    type="text"
                                    value={editingCategory.slug}
                                    onChange={e => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                                    className="text-sm"
                                  />
                                )
                              : (
                                  <span className="text-sm text-gray-600">{category.slug}</span>
                                )}
                          </td>
                          <td className="px-6 py-4">
                            {editingCategory?.id === category.id
                              ? (
                                  <Input
                                    type="number"
                                    value={editingCategory.sort}
                                    onChange={e => setEditingCategory({ ...editingCategory, sort: Number.parseInt(e.target.value) || 0 })}
                                    className="w-20 text-sm"
                                  />
                                )
                              : (
                                  <span className="text-sm text-gray-600">{category.sort}</span>
                                )}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{category.toolCount}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={cn(
                                'inline-flex rounded-full px-2 py-1 text-xs font-medium',
                                category.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800',
                              )}
                            >
                              {category.isActive ? '活跃' : '禁用'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {editingCategory?.id === category.id
                                ? (
                                    <>
                                      <Button
                                        size="sm"
                                        onClick={handleSaveEdit}
                                        disabled={loading}
                                      >
                                        {loading ? <Loading size="sm" /> : '保存'}
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setEditingCategory(null)}
                                        disabled={loading}
                                      >
                                        取消
                                      </Button>
                                    </>
                                  )
                                : (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEditCategory(category)}
                                        disabled={loading}
                                      >
                                        编辑
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleToggleStatus(category.id)}
                                        disabled={loading}
                                      >
                                        {category.isActive ? '禁用' : '启用'}
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDeleteCategory(category.id)}
                                        disabled={loading}
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        删除
                                      </Button>
                                    </>
                                  )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">总分类数</p>
              <p className="text-2xl font-semibold text-gray-900">{categories.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">活跃分类</p>
              <p className="text-2xl font-semibold text-gray-900">
                {categories.filter(cat => cat.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">总工具数</p>
              <p className="text-2xl font-semibold text-gray-900">
                {categories.reduce((sum, cat) => sum + cat.toolCount, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagementPage;
