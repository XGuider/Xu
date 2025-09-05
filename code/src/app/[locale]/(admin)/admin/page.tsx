import type { Metadata } from 'next';
import DashboardPage from '@/components/pages/admin/DashboardPage';

export const metadata: Metadata = {
  title: '仪表盘 - AI导航管理系统',
  description: 'Xu AI导航平台数据概览和统计信息',
};

export default function AdminDashboardPage() {
  return <DashboardPage />;
}
