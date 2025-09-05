import type { Metadata } from 'next';
import ToolsManagementPage from '@/components/pages/admin/ToolsManagementPage';

export const metadata: Metadata = {
  title: '工具管理 - AI导航管理系统',
  description: '管理AI工具信息，包括添加、编辑、删除工具',
};

export default function ToolsManagementPageRoute() {
  return <ToolsManagementPage />;
}
