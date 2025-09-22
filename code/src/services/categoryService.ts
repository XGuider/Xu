import type { Category } from '@/types';

import { and, desc, eq } from 'drizzle-orm';
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
 * 获取所有分类（包括非活跃的）
 */
export async function getAllCategories(): Promise<Category[]> {
  try {
    const result = await db
      .select()
      .from(categories)
      .orderBy(categories.sort, desc(categories.createdAt));

    return result.map(category => ({
      ...category,
      id: category.id.toString(),
      description: category.description || undefined,
      icon: category.icon || undefined,
      createdAt: new Date(category.createdAt),
      updatedAt: new Date(category.updatedAt),
    }));
  } catch (error) {
    console.error('获取所有分类数据失败:', error);
    // 返回默认分类数据作为后备
    return getDefaultCategories();
  }
}

/**
 * 创建新分类
 */
export async function createCategory(categoryData: {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  sort?: number;
  isActive?: boolean;
}): Promise<Category> {
  try {
    // 检查slug是否已存在
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, categoryData.slug))
      .limit(1);

    if (existingCategory.length > 0) {
      throw new Error('分类标识已存在');
    }

    // 获取最大排序值
    const maxSortResult = await db
      .select({ maxSort: categories.sort })
      .from(categories)
      .orderBy(desc(categories.sort))
      .limit(1);

    const nextSort = (maxSortResult[0]?.maxSort || 0) + 1;

    const result = await db
      .insert(categories)
      .values({
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description || null,
        icon: categoryData.icon || null,
        sort: categoryData.sort ?? nextSort,
        isActive: categoryData.isActive ?? true,
        toolCount: 0,
      })
      .returning();

    const newCategory = result[0]!;
    return {
      ...newCategory,
      id: newCategory.id.toString(),
      description: newCategory.description || undefined,
      icon: newCategory.icon || undefined,
      createdAt: new Date(newCategory.createdAt),
      updatedAt: new Date(newCategory.updatedAt),
    };
  } catch (error) {
    console.error('创建分类失败:', error);
    throw error;
  }
}

/**
 * 更新分类
 */
export async function updateCategory(
  id: string,
  updateData: Partial<{
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    sort?: number;
    isActive?: boolean;
  }>,
): Promise<Category | null> {
  try {
    // 如果更新slug，检查是否与其他分类冲突
    if (updateData.slug) {
      const existingCategory = await db
        .select()
        .from(categories)
        .where(
          and(
            eq(categories.slug, updateData.slug),
            eq(categories.id, Number.parseInt(id)),
          ),
        )
        .limit(1);

      if (existingCategory.length > 0) {
        throw new Error('分类标识已存在');
      }
    }

    const result = await db
      .update(categories)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, Number.parseInt(id)))
      .returning();

    if (result.length === 0) {
      return null;
    }

    const updatedCategory = result[0]!;
    return {
      ...updatedCategory,
      id: updatedCategory.id.toString(),
      description: updatedCategory.description || undefined,
      icon: updatedCategory.icon || undefined,
      createdAt: new Date(updatedCategory.createdAt),
      updatedAt: new Date(updatedCategory.updatedAt),
    };
  } catch (error) {
    console.error('更新分类失败:', error);
    throw error;
  }
}

/**
 * 删除分类（软删除 - 设置为非活跃状态）
 */
export async function deleteCategory(id: string): Promise<boolean> {
  try {
    const result = await db
      .update(categories)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, Number.parseInt(id)))
      .returning();

    return result.length > 0;
  } catch (error) {
    console.error('删除分类失败:', error);
    throw error;
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
