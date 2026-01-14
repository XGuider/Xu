'use client';

import type { Category } from '@/types';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { cn } from '@/utils/cn';

type SubmitPageProps = {
  toolId?: string | null;
};

const SubmitPage: React.FC<SubmitPageProps> = ({ toolId: initialToolId = null }) => {
  const t = useTranslations('SubmitPage');
  const toolId = initialToolId; // 从 props 获取 toolId
  const isEditMode = !!toolId; // 是否为编辑模式

  const [formData, setFormData] = useState({
    toolName: '',
    toolUrl: '',
    description: '',
    category: '',
    developer: '',
    tags: '',
    logo: '',
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingTool, setLoadingTool] = useState(false);

  // 从API获取分类列表
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await fetch('/api/categories');
        const data = await response.json();

        if (data.success) {
          setCategories(data.data);
        } else {
          console.error('获取分类列表失败:', data.message);
        }
      } catch (error) {
        console.error('获取分类列表失败:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // 如果是编辑模式，加载工具数据
  useEffect(() => {
    const fetchTool = async () => {
      if (!toolId) {
        return;
      }

      try {
        setLoadingTool(true);
        const response = await fetch(`/api/tools?id=${toolId}`);
        const data = await response.json();

        if (data.success && data.data?.tools?.length > 0) {
          const tool = data.data.tools[0] as any;
          // 填充表单数据
          setFormData({
            toolName: tool.name || '',
            toolUrl: tool.url || '',
            description: tool.description || '',
            category: tool.categoryId || '',
            developer: tool.developer || '',
            tags: tool.tags?.join(', ') || '',
            logo: tool.logo || '',
            isActive: tool.isActive !== undefined ? tool.isActive : true,
          });
        } else {
          console.error('获取工具数据失败:', data.message);
          setErrorMessage('无法加载工具数据，请检查工具ID是否正确');
        }
      } catch (error) {
        console.error('获取工具数据失败:', error);
        setErrorMessage('加载工具数据失败，请稍后重试');
      } finally {
        setLoadingTool(false);
      }
    };

    fetchTool();
  }, [toolId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    setValidationErrors({});

    try {
      // 处理标签：将逗号分隔的字符串转换为数组
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];

      // 准备提交数据
      const submitData: any = {
        name: formData.toolName.trim(),
        description: formData.description.trim(),
        url: formData.toolUrl.trim(),
        categoryId: formData.category, // API会自动转换为字符串
        developer: formData.developer.trim() || undefined,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
        logo: formData.logo.trim() || undefined,
        isActive: formData.isActive,
      };

      // 如果是编辑模式，添加 id 并使用 PUT 方法
      if (isEditMode && toolId) {
        submitData.id = toolId;
      } else {
        // 创建模式：设置默认值
        submitData.isFeatured = false;
        submitData.rating = 0;
        submitData.ratingCount = 0;
      }

      // 调用API提交/更新工具
      const response = await fetch('/api/tools', {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        // 如果是创建模式，重置表单；如果是编辑模式，保持数据
        if (!isEditMode) {
          setFormData({
            toolName: '',
            toolUrl: '',
            description: '',
            category: '',
            developer: '',
            tags: '',
            logo: '',
            isActive: true,
          });
        }
      } else {
        setSubmitStatus('error');

        // 处理验证错误
        if (result.details && Array.isArray(result.details)) {
          const errors: Record<string, string> = {};
          result.details.forEach((detail: { field: string; message: string }) => {
            errors[detail.field] = detail.message;
          });
          setValidationErrors(errors);
        }

        setErrorMessage(result.message || result.error || '提交失败，请稍后重试');
      }
    } catch (error) {
      console.error('提交失败:', error);
      setSubmitStatus('error');
      setErrorMessage('网络错误，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            {isEditMode ? '编辑AI工具' : t('page_title')}
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            {isEditMode ? '更新工具信息，让用户获得更准确的信息' : t('page_subtitle')}
          </p>
        </div>

        {/* 提交表单 */}
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          {(loadingTool || loadingCategories) && (
            <div className="mb-6 text-center text-gray-500">
              {loadingTool ? '加载工具数据中...' : '加载分类列表中...'}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 工具名称 */}
            <div>
              <label htmlFor="toolName" className="mb-2 block text-sm font-medium text-gray-700">
                {t('form.tool_name')}
                {' '}
                <span className="text-red-500">*</span>
              </label>
              <Input
                id="toolName"
                name="toolName"
                type="text"
                value={formData.toolName}
                onChange={handleInputChange}
                placeholder={t('form.tool_name_placeholder')}
                required
                className={cn(
                  'w-full',
                  validationErrors.name && 'border-red-500 focus:border-red-500 focus:ring-red-500',
                )}
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
              )}
            </div>

            {/* 工具网址 */}
            <div>
              <label htmlFor="toolUrl" className="mb-2 block text-sm font-medium text-gray-700">
                {t('form.tool_url')}
                {' '}
                <span className="text-red-500">*</span>
              </label>
              <Input
                id="toolUrl"
                name="toolUrl"
                type="url"
                value={formData.toolUrl}
                onChange={handleInputChange}
                placeholder={t('form.tool_url_placeholder')}
                required
                className={cn(
                  'w-full',
                  validationErrors.url && 'border-red-500 focus:border-red-500 focus:ring-red-500',
                )}
              />
              {validationErrors.url && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.url}</p>
              )}
            </div>

            {/* 工具描述 */}
            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700">
                {t('form.description')}
                {' '}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder={t('form.description_placeholder')}
                required
                rows={4}
                className={cn(
                  'w-full rounded-lg border border-gray-300 px-3 py-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none',
                  validationErrors.description && 'border-red-500 focus:border-red-500 focus:ring-red-500',
                )}
              />
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
              )}
            </div>

            {/* 分类选择 */}
            <div>
              <label htmlFor="category" className="mb-2 block text-sm font-medium text-gray-700">
                {t('form.category')}
                {' '}
                <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                disabled={loadingCategories}
                className={cn(
                  'w-full rounded-lg border border-gray-300 px-3 py-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none',
                  validationErrors.categoryId && 'border-red-500 focus:border-red-500 focus:ring-red-500',
                  loadingCategories && 'cursor-not-allowed opacity-50',
                )}
              >
                <option value="">{loadingCategories ? '加载中...' : t('form.category_placeholder')}</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {validationErrors.categoryId && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.categoryId}</p>
              )}
            </div>

            {/* 开发者信息 */}
            <div>
              <label htmlFor="developer" className="mb-2 block text-sm font-medium text-gray-700">
                {t('form.developer')}
              </label>
              <Input
                id="developer"
                name="developer"
                type="text"
                value={formData.developer}
                onChange={handleInputChange}
                placeholder={t('form.developer_placeholder')}
                className="w-full"
              />
            </div>

            {/* Logo */}
            <div>
              <label htmlFor="logo" className="mb-2 block text-sm font-medium text-gray-700">
                {t('form.logo')}
              </label>
              <Input
                id="logo"
                name="logo"
                type="text"
                value={formData.logo}
                onChange={handleInputChange}
                placeholder={t('form.logo_placeholder')}
                className={cn(
                  'w-full',
                  validationErrors.logo && 'border-red-500 focus:border-red-500 focus:ring-red-500',
                )}
              />
              {validationErrors.logo && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.logo}</p>
              )}
            </div>

            {/* 是否激活 */}
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  工具是否激活（激活后将在平台上显示）
                </span>
              </label>
              {validationErrors.isActive && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.isActive}</p>
              )}
            </div>

            {/* 标签 */}
            <div>
              <label htmlFor="tags" className="mb-2 block text-sm font-medium text-gray-700">
                {t('form.tags')}
              </label>
              <Input
                id="tags"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder={t('form.tags_placeholder')}
                className="w-full"
              />
              <p className="mt-1 text-sm text-gray-500">
                {t('form.tags_help')}
              </p>
            </div>

            {/* 提交状态提示 */}
            {submitStatus === 'success' && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="flex items-center">
                  <svg className="mr-2 h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium text-green-800">
                    {isEditMode ? t('form.update_success_title') : t('form.success_title')}
                  </span>
                </div>
                <p className="mt-1 text-sm text-green-700">
                  {isEditMode ? t('form.update_success_message') : t('form.success_message')}
                </p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex items-center">
                  <svg className="mr-2 h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="font-medium text-red-800">{t('form.error_title')}</span>
                </div>
                <p className="mt-1 text-sm text-red-700">
                  {errorMessage || t('form.error_message')}
                </p>
              </div>
            )}

            {/* 提交按钮 */}
            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'px-8 py-3 text-lg font-medium',
                  isSubmitting && 'opacity-50 cursor-not-allowed',
                )}
              >
                {isSubmitting
                  ? (
                      <div className="flex items-center">
                        <svg className="mr-3 -ml-1 h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isEditMode ? t('form.updating') : t('form.submitting')}
                      </div>
                    )
                  : (
                      isEditMode ? t('form.update_button') : t('form.submit_button')
                    )}
              </Button>
            </div>
          </form>
        </div>

        {/* 提交指南 */}
        <div className="mt-12 rounded-2xl bg-blue-50 p-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('guidelines.title')}</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">{t('guidelines.welcome_title')}</h3>
              <ul className="space-y-2 text-gray-700">
                {t.raw('guidelines.welcome_items').map((item: string) => (
                  <li key={item}>
                    •
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">{t('guidelines.reject_title')}</h3>
              <ul className="space-y-2 text-gray-700">
                {t.raw('guidelines.reject_items').map((item: string) => (
                  <li key={item}>
                    •
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitPage;
