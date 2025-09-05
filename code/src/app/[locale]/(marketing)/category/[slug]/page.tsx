import type { Metadata } from 'next';
import type { Category, Tool } from '@/types';
import { notFound } from 'next/navigation';
import CategoryPage from '@/components/pages/CategoryPage';

// 模拟分类数据
const categories: Category[] = [
  {
    id: '1',
    name: 'AI办公工具',
    slug: 'ai-office',
    description: '提升办公效率的AI工具',
    icon: 'ai-office',
    sort: 1,
    isActive: true,
    toolCount: 32,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'AI视频工具',
    slug: 'ai-video',
    description: 'AI驱动的视频创作工具',
    icon: 'ai-video',
    sort: 2,
    isActive: true,
    toolCount: 24,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'AI编程工具',
    slug: 'ai-coding',
    description: '智能代码助手和开发工具',
    icon: 'ai-coding',
    sort: 3,
    isActive: true,
    toolCount: 18,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'AI聊天助手',
    slug: 'ai-chat',
    description: '智能对话和问答工具',
    icon: 'ai-chat',
    sort: 4,
    isActive: true,
    toolCount: 45,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'AI写作工具',
    slug: 'ai-writing',
    description: '智能内容创作和写作助手',
    icon: 'ai-writing',
    sort: 5,
    isActive: true,
    toolCount: 28,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    name: 'AI学习网站',
    slug: 'ai-learning',
    description: 'AI教育和学习资源',
    icon: 'ai-learning',
    sort: 6,
    isActive: true,
    toolCount: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// 模拟工具数据
const tools: Tool[] = [
  {
    id: '1',
    name: 'WPS AI',
    description: '智能文档处理，支持自动生成、摘要和翻译',
    url: 'https://ai.wps.cn',
    categoryId: '1',
    category: categories[0]!,
    rating: 4.8,
    ratingCount: 1256,
    isActive: true,
    isFeatured: true,
    tags: ['办公', '文档', 'AI助手'],
    developer: '金山办公',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Excel AI助手',
    description: '智能数据分析与公式生成，提升表格处理效率',
    url: 'https://excel.ai',
    categoryId: '1',
    category: categories[0]!,
    rating: 4.6,
    ratingCount: 892,
    isActive: true,
    isFeatured: false,
    tags: ['办公', '表格', '数据分析'],
    developer: 'Microsoft',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: '智能日程助手',
    description: '自动安排会议，智能提醒，优化时间管理',
    url: 'https://calendar.ai',
    categoryId: '1',
    category: categories[0]!,
    rating: 4.5,
    ratingCount: 654,
    isActive: true,
    isFeatured: false,
    tags: ['办公', '日程', '时间管理'],
    developer: 'Google',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find(cat => cat.slug === slug);

  if (!category) {
    return {
      title: '分类不存在',
    };
  }

  return {
    title: `${category.name} - Xu AI导航平台`,
    description: category.description,
    keywords: `${category.name},AI工具,${category.description}`,
  };
}

export default async function CategoryPageRoute({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = categories.find(cat => cat.slug === slug);

  if (!category) {
    notFound();
  }

  const categoryTools = tools.filter(tool => tool.categoryId === category.id);

  return (
    <CategoryPage
      category={category}
      tools={categoryTools}
    />
  );
}
