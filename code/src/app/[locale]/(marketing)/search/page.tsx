import type { Metadata } from 'next';
import SearchPage from '@/components/pages/SearchPage';

export const metadata: Metadata = {
  title: '搜索结果 - Xu AI导航平台',
  description: '搜索AI工具，发现最适合的智能工具',
};

type SearchPageProps = {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
};

export default async function SearchPageRoute({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';
  const category = params.category || '';
  const page = Number.parseInt(params.page || '1');

  return (
    <SearchPage
      query={query}
      category={category}
      page={page}
    />
  );
}
