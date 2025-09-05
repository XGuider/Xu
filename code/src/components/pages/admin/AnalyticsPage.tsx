'use client';

import React from 'react';
import { cn } from '@/utils/cn';

const AnalyticsPage: React.FC = () => {
  // 模拟数据
  const analyticsData = {
    totalVisitors: 12548,
    totalPageViews: 45632,
    averageSessionDuration: '3:24',
    bounceRate: '42.5%',
    topPages: [
      { name: '首页', views: 12345, percentage: 27.1 },
      { name: 'AI办公工具', views: 8765, percentage: 19.2 },
      { name: 'AI编程工具', views: 6543, percentage: 14.3 },
      { name: 'AI视频工具', views: 4321, percentage: 9.5 },
      { name: '搜索页面', views: 3456, percentage: 7.6 },
    ],
    topTools: [
      { name: 'DeepSeek', views: 2345, category: 'AI编程工具' },
      { name: '腾讯元宝', views: 1987, category: 'AI聊天助手' },
      { name: 'Cursor', views: 1765, category: 'AI编程工具' },
      { name: 'WPS AI', views: 1543, category: 'AI办公工具' },
      { name: '剪映', views: 1321, category: 'AI视频工具' },
    ],
    trafficSources: [
      { source: '直接访问', percentage: 45.2, visitors: 5674 },
      { source: '搜索引擎', percentage: 32.8, visitors: 4116 },
      { source: '社交媒体', percentage: 12.5, visitors: 1569 },
      { source: '其他', percentage: 9.5, visitors: 1189 },
    ],
    deviceTypes: [
      { type: '桌面端', percentage: 58.3, visitors: 7315 },
      { type: '移动端', percentage: 35.7, visitors: 4480 },
      { type: '平板', percentage: 6.0, visitors: 753 },
    ],
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">数据分析</h1>
        <p className="text-gray-600">查看平台数据分析和统计报告</p>
      </div>

      {/* 关键指标 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">总访问量</div>
              <div className="text-2xl font-bold text-gray-900">{analyticsData.totalVisitors.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">页面浏览量</div>
              <div className="text-2xl font-bold text-gray-900">{analyticsData.totalPageViews.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100">
                <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">平均停留时间</div>
              <div className="text-2xl font-bold text-gray-900">{analyticsData.averageSessionDuration}</div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
                <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">跳出率</div>
              <div className="text-2xl font-bold text-gray-900">{analyticsData.bounceRate}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 热门页面 */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">热门页面</h3>
          <div className="space-y-4">
            {analyticsData.topPages.map((page, index) => (
              <div key={page.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                    <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{page.name}</div>
                    <div className="text-xs text-gray-500">
                      {page.views.toLocaleString()}
                      {' '}
                      次浏览
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {page.percentage}
                  %
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 热门工具 */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">热门工具</h3>
          <div className="space-y-4">
            {analyticsData.topTools.map((tool, index) => (
              <div key={tool.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                    <span className="text-sm font-medium text-green-600">{index + 1}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{tool.name}</div>
                    <div className="text-xs text-gray-500">{tool.category}</div>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900">{tool.views.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 流量来源和设备类型 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 流量来源 */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">流量来源</h3>
          <div className="space-y-4">
            {analyticsData.trafficSources.map((source, index) => (
              <div key={source.source}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{source.source}</span>
                  <span className="text-sm text-gray-500">
                    {source.percentage}
                    %
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className={cn(
                      'h-2 rounded-full',
                      index === 0
                        ? 'bg-blue-500'
                        : index === 1
                          ? 'bg-green-500'
                          : index === 2 ? 'bg-yellow-500' : 'bg-gray-500',
                    )}
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {source.visitors.toLocaleString()}
                  {' '}
                  访问者
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 设备类型 */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">设备类型</h3>
          <div className="space-y-4">
            {analyticsData.deviceTypes.map((device, index) => (
              <div key={device.type}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{device.type}</span>
                  <span className="text-sm text-gray-500">
                    {device.percentage}
                    %
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className={cn(
                      'h-2 rounded-full',
                      index === 0
                        ? 'bg-purple-500'
                        : index === 1 ? 'bg-pink-500' : 'bg-indigo-500',
                    )}
                    style={{ width: `${device.percentage}%` }}
                  />
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {device.visitors.toLocaleString()}
                  {' '}
                  访问者
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 访问趋势图表 */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">访问趋势</h3>
        <div className="flex h-64 items-end justify-between space-x-2">
          {[
            { month: '1月', visitors: 5400 },
            { month: '2月', visitors: 6800 },
            { month: '3月', visitors: 7500 },
            { month: '4月', visitors: 9200 },
            { month: '5月', visitors: 10500 },
            { month: '6月', visitors: 12500 },
          ].map(data => (
            <div key={data.month} className="flex flex-1 flex-col items-center">
              <div className="w-full rounded-t bg-blue-100">
                <div
                  className="rounded-t bg-blue-500 transition-all duration-500"
                  style={{ height: `${(data.visitors / 12500) * 200}px` }}
                />
              </div>
              <span className="mt-2 text-xs text-gray-500">{data.month}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center text-sm text-gray-600">
          最近6个月访问量统计
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
