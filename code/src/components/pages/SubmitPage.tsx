'use client';

import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { cn } from '@/utils/cn';

const SubmitPage: React.FC = () => {
  const t = useTranslations('SubmitPage');
  const [formData, setFormData] = useState({
    toolName: '',
    toolUrl: '',
    description: '',
    category: '',
    developer: '',
    email: '',
    tags: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const categories = [
    { id: 'ai-office', name: 'AI办公' },
    { id: 'ai-coding', name: 'AI编程' },
    { id: 'ai-video', name: 'AI视频' },
    { id: 'ai-chat', name: 'AI聊天' },
    { id: 'ai-writing', name: 'AI写作' },
    { id: 'ai-learning', name: 'AI学习' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // 模拟提交到API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 这里应该调用实际的API
      // 提交数据到服务器

      setSubmitStatus('success');
      // 重置表单
      setFormData({
        toolName: '',
        toolUrl: '',
        description: '',
        category: '',
        developer: '',
        email: '',
        tags: '',
      });
    } catch (error) {
      console.error('提交失败:', error);
      setSubmitStatus('error');
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
            {t('page_title')}
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            {t('page_subtitle')}
          </p>
        </div>

        {/* 提交表单 */}
        <div className="rounded-2xl bg-white p-8 shadow-xl">
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
                className="w-full"
              />
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
                className="w-full"
              />
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
                className="w-full rounded-lg border border-gray-300 px-3 py-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
              />
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
                className="w-full rounded-lg border border-gray-300 px-3 py-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
              >
                <option value="">{t('form.category_placeholder')}</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 开发者信息 */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                  {t('form.email')}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t('form.email_placeholder')}
                  className="w-full"
                />
              </div>
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
                  <span className="font-medium text-green-800">{t('form.success_title')}</span>
                </div>
                <p className="mt-1 text-sm text-green-700">
                  {t('form.success_message')}
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
                  {t('form.error_message')}
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
                        {t('form.submitting')}
                      </div>
                    )
                  : (
                      t('form.submit_button')
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
                {t.raw('guidelines.welcome_items').map((item: string, index: number) => (
                  <li key={index}>
                    •
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">{t('guidelines.reject_title')}</h3>
              <ul className="space-y-2 text-gray-700">
                {t.raw('guidelines.reject_items').map((item: string, index: number) => (
                  <li key={index}>
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
