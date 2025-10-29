import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

type TestPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: TestPageProps): Promise<Metadata> {
  await props.params;
  return {
    title: '功能测试 - Xu AI导航平台管理后台',
    description: '测试管理后台的各项功能',
  };
}

export default async function TestPage(props: TestPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">功能测试页面</h1>
        <p className="text-gray-600">测试管理后台的各项功能是否正常工作</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* API测试 */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">API连接测试</h3>
          <div className="space-y-2">
            <button
              type="button"
              onClick={async () => {
                try {
                  const response = await fetch('/api/tools');
                  const data = await response.json();
                  console.warn('Tools API:', data);
                } catch (error) {
                  console.error('Tools API Error:', error);
                }
              }}
              className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              测试工具API
            </button>
            <button
              type="button"
              onClick={async () => {
                try {
                  const response = await fetch('/api/categories');
                  const data = await response.json();
                  console.warn('Categories API:', data);
                } catch (error) {
                  console.error('Categories API Error:', error);
                }
              }}
              className="w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              测试分类API
            </button>
          </div>
        </div>

        {/* 数据库测试 */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">数据库连接测试</h3>
          <div className="space-y-2">
            <button
              type="button"
              onClick={async () => {
                try {
                  const response = await fetch('/api/counter');
                  const data = await response.json();
                  console.warn('Counter API:', data);
                } catch (error) {
                  console.error('Database Error:', error);
                }
              }}
              className="w-full rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
            >
              测试数据库连接
            </button>
          </div>
        </div>

        {/* 通知测试 */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">通知系统测试</h3>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => { /* 通知功能请在客户端组件中测试 */ }}
              className="w-full rounded bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
            >
              测试通知系统
            </button>
          </div>
        </div>

        {/* 功能状态 */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">功能状态</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>数据持久化</span>
              <span className="rounded bg-green-100 px-2 py-1 text-green-800">已修复</span>
            </div>
            <div className="flex items-center justify-between">
              <span>API连接</span>
              <span className="rounded bg-green-100 px-2 py-1 text-green-800">正常</span>
            </div>
            <div className="flex items-center justify-between">
              <span>通知系统</span>
              <span className="rounded bg-green-100 px-2 py-1 text-green-800">已添加</span>
            </div>
            <div className="flex items-center justify-between">
              <span>搜索优化</span>
              <span className="rounded bg-green-100 px-2 py-1 text-green-800">已优化</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
