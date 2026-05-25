'use client';

import type { MiniProgram, OfficialAccount, WechatKind } from '@/types/wechat';
import React, { useState } from 'react';

export type WechatListItem = OfficialAccount | MiniProgram;

export type WechatAddEditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<WechatListItem>) => Promise<void>;
  kind: WechatKind;
  editItem?: WechatListItem;
};

const CATEGORIES = ['科技', '教育', '工具', '电商', '生活', '财经', '其他'] as const;

export default function WechatAddEditModal({
  isOpen,
  onClose,
  onSave,
  kind,
  editItem,
}: WechatAddEditModalProps) {
  const [name, setName] = useState(editItem?.name || '');
  const [desc, setDesc] = useState(editItem?.desc || '');
  const [category, setCategory] = useState(editItem?.category || '其他');
  const [appId, setAppId] = useState(kind === 'mini' && 'appId' in (editItem || {}) ? (editItem as MiniProgram).appId : '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!editItem;

  React.useEffect(() => {
    if (editItem) {
      setName(editItem.name);
      setDesc(editItem.desc);
      setCategory(editItem.category);
      if (kind === 'mini' && 'appId' in editItem) {
        setAppId(editItem.appId);
      }
    } else {
      setName('');
      setDesc('');
      setCategory('其他');
      setAppId('');
    }
    setError('');
  }, [editItem, isOpen, kind]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !desc.trim()) {
      setError('名称和描述不能为空');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const item: Partial<WechatListItem> = {
        id: editItem?.id || `${kind}-${Date.now()}`,
        name: name.trim(),
        desc: desc.trim(),
        category,
        crawlTime: new Date().toISOString(),
      };

      if (kind === 'mini') {
        (item as MiniProgram).appId = appId.trim();
      }

      await onSave(item);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = () => {
    onClose();
  };

  const handleBackdropKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
      onKeyDown={handleBackdropKeyDown}
      tabIndex={-1}
    >
      <div className="fixed inset-0 bg-black/50" />
      <div className="relative z-10 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          {isEdit ? '编辑' : '新增'}
          {kind === 'official' ? '公众号' : '小程序'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="wechat-name" className="mb-1 block text-sm font-medium text-gray-700">
              名称 <span className="text-red-500">*</span>
            </label>
            <input
              id="wechat-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="请输入名称"
              required
            />
          </div>

          <div>
            <label htmlFor="wechat-desc" className="mb-1 block text-sm font-medium text-gray-700">
              描述 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="wechat-desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="请输入描述"
              required
            />
          </div>

          <div>
            <label htmlFor="wechat-category" className="mb-1 block text-sm font-medium text-gray-700">分类</label>
            <select
              id="wechat-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {kind === 'mini' && (
            <div>
              <label htmlFor="wechat-appid" className="mb-1 block text-sm font-medium text-gray-700">AppID</label>
              <input
                id="wechat-appid"
                type="text"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="请输入小程序 AppID"
              />
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}