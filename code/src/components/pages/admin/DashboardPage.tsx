'use client';

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';

import { cn } from '@/utils/cn';

// 注册Chart.js组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

// 数据卡片组件
const StatCard = ({
  title,
  value,
  growth,
  growthType = 'neutral',
}: {
  title: string;
  value: string | number;
  growth?: string;
  growthType?: 'positive' | 'negative' | 'neutral';
}) => (
  <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
    <div className="mb-2 text-sm text-gray-600">{title}</div>
    <div className="mb-2 text-3xl font-bold text-gray-900">{value}</div>
    {growth && (
      <div className={cn(
        'flex items-center text-sm',
        growthType === 'positive'
          ? 'text-green-600'
          : growthType === 'negative' ? 'text-red-600' : 'text-gray-500',
      )}
      >
        <span className="ml-1">{growth}</span>
      </div>
    )}
  </div>
);

const DashboardPage: React.FC = () => {
  // 模拟统计数据
  const stats = {
    totalTools: 256,
    totalCategories: 16,
    totalUsers: 1258,
    dailyVisitors: 12548,
    activeUsers: 8321,
    toolsGrowth: 5.2,
    visitorsGrowth: 12.8,
    usersGrowth: -2.1,
  };

  // 访问量趋势图表数据
  const chartData = {
    labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
    datasets: [
      {
        label: '访问量',
        data: [5400, 6800, 7500, 9200, 10500, 12500],
        borderColor: '#165DFF',
        backgroundColor: 'rgba(22, 93, 255, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // 模拟最近动态
  const recentActivities = [
    {
      id: '1',
      type: 'tool_added',
      message: '新工具 DeepSeek 已添加',
      time: '2023-06-15 09:32',
      status: 'success' as const,
    },
    {
      id: '2',
      type: 'tool_updated',
      message: '工具 Cursor 信息已更新',
      time: '2023-06-14 16:45',
      status: 'warning' as const,
    },
    {
      id: '3',
      type: 'user_banned',
      message: '用户 user123 被禁用',
      time: '2023-06-14 10:18',
      status: 'danger' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
        <p className="text-gray-600">欢迎回来！这里是您的Xu AI导航平台数据概览。</p>
      </div>

      {/* 数据概览卡片 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="总工具数"
          value={stats.totalTools}
          growth={`+${stats.toolsGrowth}% 较上月`}
          growthType="positive"
        />
        <StatCard
          title="日访问量"
          value={stats.dailyVisitors.toLocaleString()}
          growth={`+${stats.visitorsGrowth}% 较昨日`}
          growthType="positive"
        />
        <StatCard
          title="活跃用户"
          value={stats.activeUsers.toLocaleString()}
          growth={`${stats.usersGrowth}% 较昨日`}
          growthType="negative"
        />
        <StatCard
          title="总分类数"
          value={stats.totalCategories}
          growth="持平"
          growthType="neutral"
        />
      </div>

      {/* 图表和动态区域 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 访问量趋势图表 */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">访问量趋势</h3>
          <div className="h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
          <div className="mt-4 text-center text-sm text-gray-600">
            最近6个月访问量统计
          </div>
        </div>

        {/* 最近动态 */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">最近动态</h3>
            <button type="button" className="text-sm text-blue-600 hover:underline">查看全部</button>
          </div>
          <div className="space-y-4">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-start">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0',
                  activity.status === 'success'
                    ? 'bg-green-100 text-green-600'
                    : activity.status === 'warning'
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-red-100 text-red-600',
                )}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="mt-1 text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 快速操作 */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">快速操作</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <button type="button" className="flex items-center rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-600 hover:bg-blue-50">
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">添加工具</div>
              <div className="text-sm text-gray-500">新增AI工具到平台</div>
            </div>
          </button>

          <button type="button" className="flex items-center rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-600 hover:bg-blue-50">
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">管理分类</div>
              <div className="text-sm text-gray-500">编辑工具分类</div>
            </div>
          </button>

          <button type="button" className="flex items-center rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-600 hover:bg-blue-50">
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">查看报告</div>
              <div className="text-sm text-gray-500">生成数据报告</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
