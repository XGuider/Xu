import type { Metadata } from 'next';
import type { Category, Tool } from '@/types';
import { notFound } from 'next/navigation';
import ToolDetailPage from '@/components/pages/ToolDetailPage';

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
];

// 模拟工具数据
const tools: Tool[] = [
  {
    id: '1',
    name: 'WPS AI',
    description: 'WPS AI是一款集成在WPS办公套件中的人工智能助手，能够帮助用户更高效地处理文档、表格和演示文稿。其核心功能包括智能文档生成、内容摘要、多语言翻译、格式优化等，大幅提升办公效率。',
    url: 'https://ai.wps.cn',
    categoryId: '1',
    category: categories[0]!,
    rating: 4.8,
    ratingCount: 1256,
    isActive: true,
    isFeatured: true,
    tags: ['办公', '文档', 'AI助手', '翻译', '摘要'],
    developer: '金山办公',
    launchDate: new Date('2023-08-15'),
    price: '免费基础功能，高级功能付费',
    platforms: ['Web', 'Windows', 'Mac', '移动端'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'DeepSeek',
    description: '深度求索AI工具，强大的代码生成和编程助手，支持多种编程语言，能够理解代码上下文，提供智能代码补全、重构建议和bug修复方案。',
    url: 'https://www.deepseek.com',
    categoryId: '3',
    category: categories[2]!,
    rating: 4.9,
    ratingCount: 2156,
    isActive: true,
    isFeatured: true,
    tags: ['编程', '代码生成', 'AI助手', '代码补全'],
    developer: '深度求索',
    launchDate: new Date('2023-06-01'),
    price: '免费基础功能，高级功能付费',
    platforms: ['Web', 'Windows', 'Mac', 'Linux'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// 相关推荐工具
const relatedTools: Tool[] = [
  {
    id: '3',
    name: '石墨文档AI',
    description: '智能文档协作平台',
    url: 'https://shimo.im',
    categoryId: '1',
    category: categories[0]!,
    rating: 4.5,
    ratingCount: 789,
    isActive: true,
    isFeatured: false,
    tags: ['办公', '协作', '文档'],
    developer: '石墨文档',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: '豆包AI写作',
    description: '智能内容创作助手',
    url: 'https://write.doubao.com',
    categoryId: '5',
    category: {
      id: '5',
      name: 'AI写作工具',
      slug: 'ai-writing',
      sort: 5,
      isActive: true,
      toolCount: 28,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    rating: 4.7,
    ratingCount: 654,
    isActive: true,
    isFeatured: false,
    tags: ['写作', '内容创作', 'AI助手'],
    developer: '豆包',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

type ToolDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: ToolDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const tool = tools.find(t => t.id === id);

  if (!tool) {
    return {
      title: '工具不存在',
    };
  }

  return {
    title: `${tool.name} - ${tool.category.name} - Xu AI导航平台`,
    description: tool.description,
    keywords: `${tool.name},${tool.category.name},AI工具,${tool.tags.join(',')}`,
    openGraph: {
      title: `${tool.name} - ${tool.category.name}`,
      description: tool.description,
      type: 'website',
    },
  };
}

export default async function ToolDetailPageRoute({ params }: ToolDetailPageProps) {
  const { id } = await params;
  const tool = tools.find(t => t.id === id);

  if (!tool) {
    notFound();
  }

  return (
    <ToolDetailPage
      tool={tool}
      relatedTools={relatedTools}
    />
  );
}
