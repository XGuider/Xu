import React from 'react';
import { cn } from '@/utils/cn';

export type WechatCategoryCardProps = {
  title: string;
  description: string;
  category: string;
  crawlTime: string;
  /** 小程序展示 AppID；公众号可省略 */
  appId?: string;
  crawlTimeLabel: string;
  appIdLabel: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function WechatCategoryCard({
  title,
  description,
  category,
  crawlTime,
  appId,
  crawlTimeLabel,
  appIdLabel,
  onEdit,
  onDelete,
}: WechatCategoryCardProps) {
  return (
    <article
      className={cn(
        'flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow',
        'hover:border-blue-200 hover:shadow-md',
      )}
    >
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
          {category}
        </span>
      </div>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600">{description}</p>
      <dl className="space-y-1 border-t border-gray-100 pt-3 text-xs text-gray-500">
        {appId
          ? (
              <div className="flex justify-between gap-2">
                <dt className="shrink-0 text-gray-400">{appIdLabel}</dt>
                <dd className="text-right font-mono break-all text-gray-700">{appId}</dd>
              </div>
            )
          : null}
        <div className="flex justify-between gap-2">
          <dt className="shrink-0 text-gray-400">{crawlTimeLabel}</dt>
          <dd className="text-right text-gray-700">{crawlTime}</dd>
        </div>
      </dl>
      {(onEdit || onDelete) && (
        <div className="mt-3 flex justify-end gap-2 border-t border-gray-100 pt-3">
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
            >
              编辑
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              删除
            </button>
          )}
        </div>
      )}
    </article>
  );
}
