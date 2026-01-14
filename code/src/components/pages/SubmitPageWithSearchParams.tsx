'use client';

import { useSearchParams } from 'next/navigation';
import SubmitPage from './SubmitPage';

/**
 * 包装组件：处理 useSearchParams() 的调用
 * 这个组件需要在 Suspense 边界内使用
 */
const SubmitPageWithSearchParams: React.FC = () => {
  const searchParams = useSearchParams();
  const toolId = searchParams.get('id');

  return <SubmitPage toolId={toolId} />;
};

export default SubmitPageWithSearchParams;
