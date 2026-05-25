'use client';

import type { MiniProgram, WechatCategoryStats, WechatKind, WechatListItem } from '@/types/wechat';
import { useFormatter, useLocale, useTranslations } from 'next-intl';
import React, { useCallback, useMemo, useState } from 'react';
import WechatCategoryCard from '@/components/wechat/WechatCategoryCard';
import WechatSearchBar from '@/components/wechat/WechatSearchBar';
import WechatAddEditModal from '@/components/wechat/WechatAddEditModal';
import { intlApiPath } from '@/utils/intlApiPath';

const CATEGORY_ORDER = ['科技', '教育', '工具', '电商', '生活', '财经', '其他'] as const;

function sortStatsEntries(stats: WechatCategoryStats): [string, number][] {
  const keys = Object.keys(stats);
  keys.sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a as (typeof CATEGORY_ORDER)[number]);
    const ib = CATEGORY_ORDER.indexOf(b as (typeof CATEGORY_ORDER)[number]);
    if (ia === -1 && ib === -1) {
      return a.localeCompare(b);
    }
    if (ia === -1) {
      return 1;
    }
    if (ib === -1) {
      return -1;
    }
    return ia - ib;
  });
  return keys.map(k => [k, stats[k] ?? 0]);
}

type ApiPayload = {
  success: boolean;
  data?: {
    list: WechatListItem[];
    stats: WechatCategoryStats;
    pagination: { page: number; limit: number; total: number; totalPages: number };
  };
  message?: string;
};

type CrawlResponse = {
  success: boolean;
  message?: string;
  data?: { output?: string };
};

type WechatManageViewProps = {
  kind: WechatKind;
  title: string;
  subtitle: string;
};

export default function WechatManageView({ kind, title, subtitle }: WechatManageViewProps) {
  const t = useTranslations('WechatManage');
  const locale = useLocale();
  const format = useFormatter();

  const [keywordInput, setKeywordInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [list, setList] = useState<WechatListItem[]>([]);
  const [stats, setStats] = useState<WechatCategoryStats>({});
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [crawling, setCrawling] = useState(false);
  const [banner, setBanner] = useState<{ type: 'err' | 'success'; text: string } | null>(null);

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WechatListItem | null>(null);

  const apiBase = kind === 'official' ? '/api/wechat/official' : '/api/wechat/mini';

  const fetchList = useCallback(async () => {
    setLoading(true);
    setBanner(null);
    try {
      const params = new URLSearchParams({
        category,
        keyword,
        page: String(page),
        limit: '12',
      });
      const url = `${intlApiPath(locale, apiBase)}?${params.toString()}`;
      const res = await fetch(url, { cache: 'no-store' });
      const body = (await res.json()) as ApiPayload;
      if (!body.success || !body.data) {
        setBanner({ type: 'err', text: body.message || t('load_error') });
        return;
      }
      setList(body.data.list);
      setStats(body.data.stats);
      setPagination(body.data.pagination);
    } catch {
      setBanner({ type: 'err', text: t('load_error') });
    } finally {
      setLoading(false);
    }
  }, [apiBase, category, keyword, locale, page, t]);

  const handleCrawl = useCallback(async () => {
    setCrawling(true);
    setBanner(null);
    try {
      const url = intlApiPath(locale, apiBase);
      const res = await fetch(url, { method: 'POST', cache: 'no-store' });
      const body = (await res.json()) as CrawlResponse;
      if (body.success) {
        setBanner({ type: 'success', text: body.message || '抓取完成' });
        await fetchList();
      } else {
        setBanner({ type: 'err', text: body.message || '抓取失败' });
      }
    } catch (err) {
      setBanner({ type: 'err', text: err instanceof Error ? err.message : '抓取失败' });
    } finally {
      setCrawling(false);
    }
  }, [apiBase, locale, fetchList]);

  const handleSave = useCallback(async (item: Partial<WechatListItem>) => {
    const url = intlApiPath(locale, apiBase);
    const method = editingItem ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    const body = (await res.json()) as CrawlResponse;
    if (!body.success) {
      throw new Error(body.message || '保存失败');
    }
    await fetchList();
  }, [apiBase, locale, editingItem, fetchList]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('确定要删除这条数据吗？')) return;
    try {
      const url = `${intlApiPath(locale, apiBase)}?id=${encodeURIComponent(id)}`;
      const res = await fetch(url, { method: 'DELETE', cache: 'no-store' });
      const body = (await res.json()) as CrawlResponse;
      if (body.success) {
        setBanner({ type: 'success', text: '删除成功' });
        await fetchList();
      } else {
        setBanner({ type: 'err', text: body.message || '删除失败' });
      }
    } catch (err) {
      setBanner({ type: 'err', text: err instanceof Error ? err.message : '删除失败' });
    }
  }, [apiBase, locale, fetchList]);

  React.useEffect(() => {
    fetchList();
  }, [fetchList]);

  const statEntries = useMemo(() => sortStatsEntries(stats), [stats]);

  const formatTime = (iso: string) => {
    try {
      return format.dateTime(new Date(iso), {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return iso;
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEdit = (item: WechatListItem) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
              <p className="mt-2 max-w-3xl text-gray-600">{subtitle}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCrawl}
                disabled={crawling}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                {crawling ? '抓取中...' : '一键抓取'}
              </button>
              <button
                type="button"
                onClick={handleAdd}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                新增
              </button>
            </div>
          </div>
          <p className="mt-3 max-w-3xl rounded-lg border border-blue-100 bg-blue-50/80 px-4 py-3 text-sm text-blue-900">
            {t('data_source_hint')}
          </p>
        </header>

        {banner
          ? (
              <div className={`mb-6 rounded-lg px-4 py-3 text-sm ${
                banner.type === 'success' 
                  ? 'border border-green-200 bg-green-50 text-green-900'
                  : 'border border-red-200 bg-red-50 text-red-900'
              }`}>
                {banner.text}
              </div>
            )
          : null}

        <div className="mb-6">
          <WechatSearchBar
            value={keywordInput}
            onChange={setKeywordInput}
            onSubmit={() => {
              setKeyword(keywordInput.trim());
              setPage(1);
            }}
            placeholder={t('search_placeholder')}
            searchLabel={t('search_btn')}
          />
        </div>

        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase">{t('stats_heading')}</h2>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setCategory('all');
                setPage(1);
              }}
              className={
                category === 'all'
                  ? 'rounded-full bg-blue-600 px-3 py-1.5 text-sm font-medium text-white'
                  : 'rounded-full bg-white px-3 py-1.5 text-sm font-medium text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50'
              }
            >
              {t('all_categories')}
            </button>
            {statEntries.map(([name, count]) => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  setCategory(name);
                  setPage(1);
                }}
                className={
                  category === name
                    ? 'rounded-full bg-blue-600 px-3 py-1.5 text-sm font-medium text-white'
                    : 'rounded-full bg-white px-3 py-1.5 text-sm font-medium text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50'
                }
              >
                {name}
                <span className="ml-1 tabular-nums opacity-80">{count}</span>
              </button>
            ))}
          </div>
        </section>

        <p className="mb-4 text-sm text-gray-600">{t('total_hint', { total: pagination.total })}</p>

        {loading
          ? (
              <p className="py-16 text-center text-gray-500">{t('loading')}</p>
            )
          : list.length === 0
            ? (
                <p className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center text-gray-500">
                  {t('empty')}
                </p>
              )
            : (
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((item) => {
                    const appId
                      = kind === 'mini' && 'appId' in item ? (item as MiniProgram).appId : undefined;
                    return (
                      <li key={item.id}>
                        <WechatCategoryCard
                          title={item.name}
                          description={item.desc}
                          category={item.category}
                          crawlTime={formatTime(item.crawlTime)}
                          appId={appId}
                          crawlTimeLabel={t('crawl_time')}
                          appIdLabel={t('app_id')}
                          onEdit={() => handleEdit(item)}
                          onDelete={() => handleDelete(item.id)}
                        />
                      </li>
                    );
                  })}
                </ul>
              )}

        {pagination.totalPages > 1
          ? (
              <nav className="mt-10 flex items-center justify-center gap-4">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium disabled:opacity-40"
                >
                  {t('prev')}
                </button>
                <span className="text-sm text-gray-600">
                  {pagination.page}
                  {' / '}
                  {pagination.totalPages}
                </span>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium disabled:opacity-40"
                >
                  {t('next')}
                </button>
              </nav>
            )
          : null}

        <WechatAddEditModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          kind={kind}
          editItem={editingItem ?? undefined}
        />
      </div>
    </div>
  );
}
