import type { Category } from '@/types';

import { eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { categoriesSchema as categories } from '@/models/Schema';

/**
 * 获取所有活跃的分类
 */
export async function getActiveCategories(): Promise<Category[]> {
  try {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(categories.sort);

    return result.map(category => ({
      ...category,
      id: category.id.toString(),
      description: category.description || undefined,
      icon: category.icon || undefined,
      createdAt: new Date(category.createdAt),
      updatedAt: new Date(category.updatedAt),
    }));
  } catch (error) {
    console.error('获取分类数据失败:', error);
    // 返回默认分类数据作为后备
    return getDefaultCategories();
  }
}

/**
 * 根据ID获取分类
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.id, Number.parseInt(id)))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const category = result[0]!;
    return {
      ...category,
      id: category.id.toString(),
      description: category.description || undefined,
      icon: category.icon || undefined,
      createdAt: new Date(category.createdAt),
      updatedAt: new Date(category.updatedAt),
    };
  } catch (error) {
    console.error('获取分类数据失败:', error);
    return null;
  }
}

/**
 * 根据slug获取分类
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const category = result[0]!;
    return {
      ...category,
      id: category.id.toString(),
      description: category.description || undefined,
      icon: category.icon || undefined,
      createdAt: new Date(category.createdAt),
      updatedAt: new Date(category.updatedAt),
    };
  } catch (error) {
    console.error('获取分类数据失败:', error);
    return null;
  }
}

/**
 * 默认分类数据（作为后备）
 */
function getDefaultCategories(): Category[] {
  return [
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
  ];
}
