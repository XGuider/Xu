import type { Tool } from '@/types';

import { and, desc, eq, ilike, or } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { toolsSchema as tools, categoriesSchema as categories } from '@/models/Schema';

export type CreateToolData = {
  name: string;
  description: string;
  url: string;
  categoryId: string;
  tags?: string[];
  developer?: string;
  price?: string;
  platforms?: string[];
};

export type UpdateToolData = Partial<CreateToolData> & {
  id: string;
  isActive?: boolean;
  isFeatured?: boolean;
};

export type GetToolsOptions = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  featured?: boolean;
};

/**
 * 获取工具列表
 */
export async function getTools(options: GetToolsOptions = {}): Promise<{
  tools: Tool[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> {
  try {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const offset = (page - 1) * limit;

    // 构建查询条件
    const conditions = [];
    
    if (options.search) {
      conditions.push(
        or(
          ilike(tools.name, `%${options.search}%`),
          ilike(tools.description, `%${options.search}%`),
          ilike(tools.developer, `%${options.search}%`)
        )
      );
    }

    if (options.category) {
      conditions.push(eq(tools.categoryId, Number.parseInt(options.category)));
    }

    if (options.status === 'active') {
      conditions.push(eq(tools.isActive, true));
    } else if (options.status === 'inactive') {
      conditions.push(eq(tools.isActive, false));
    }

    if (options.featured) {
      conditions.push(eq(tools.isFeatured, true));
    }

    // 查询工具数据
    const toolsQuery = db
      .select({
        id: tools.id,
        name: tools.name,
        description: tools.description,
        url: tools.url,
        categoryId: tools.categoryId,
        categoryName: categories.name,
        rating: tools.rating,
        ratingCount: tools.ratingCount,
        isActive: tools.isActive,
        isFeatured: tools.isFeatured,
        tags: tools.tags,
        developer: tools.developer,
        price: tools.price,
        platforms: tools.platforms,
        createdAt: tools.createdAt,
        updatedAt: tools.updatedAt,
      })
      .from(tools)
      .leftJoin(categories, eq(tools.categoryId, categories.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(tools.isFeatured), desc(tools.rating), desc(tools.createdAt));

    // 获取总数
    const countQuery = db
      .select({ count: tools.id })
      .from(tools)
      .leftJoin(categories, eq(tools.categoryId, categories.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const [toolsResult, countResult] = await Promise.all([
      toolsQuery.limit(limit).offset(offset),
      countQuery,
    ]);

    const total = countResult.length;
    const totalPages = Math.ceil(total / limit);

    const toolsList: Tool[] = toolsResult.map(tool => ({
      id: tool.id.toString(),
      name: tool.name,
      description: tool.description,
      url: tool.url,
      categoryId: tool.categoryId.toString(),
      category: {
        id: tool.categoryId.toString(),
        name: tool.categoryName || '未知分类',
        slug: '',
        description: '',
        icon: '',
        sort: 0,
        isActive: true,
        toolCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      rating: tool.rating || 0,
      ratingCount: tool.ratingCount || 0,
      isActive: tool.isActive,
      isFeatured: tool.isFeatured,
      tags: tool.tags || [],
      developer: tool.developer || '',
      price: tool.price || '',
      platforms: tool.platforms || [],
      createdAt: new Date(tool.createdAt).toISOString(),
      updatedAt: new Date(tool.updatedAt).toISOString(),
    }));

    return {
      tools: toolsList,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  } catch (error) {
    console.error('获取工具列表失败:', error);
    throw error;
  }
}

/**
 * 根据ID获取工具
 */
export async function getToolById(id: string): Promise<Tool | null> {
  try {
    const result = await db
      .select({
        id: tools.id,
        name: tools.name,
        description: tools.description,
        url: tools.url,
        categoryId: tools.categoryId,
        categoryName: categories.name,
        rating: tools.rating,
        ratingCount: tools.ratingCount,
        isActive: tools.isActive,
        isFeatured: tools.isFeatured,
        tags: tools.tags,
        developer: tools.developer,
        price: tools.price,
        platforms: tools.platforms,
        createdAt: tools.createdAt,
        updatedAt: tools.updatedAt,
      })
      .from(tools)
      .leftJoin(categories, eq(tools.categoryId, categories.id))
      .where(eq(tools.id, Number.parseInt(id)))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const tool = result[0]!;
    return {
      id: tool.id.toString(),
      name: tool.name,
      description: tool.description,
      url: tool.url,
      categoryId: tool.categoryId.toString(),
      category: {
        id: tool.categoryId.toString(),
        name: tool.categoryName || '未知分类',
        slug: '',
        description: '',
        icon: '',
        sort: 0,
        isActive: true,
        toolCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      rating: tool.rating || 0,
      ratingCount: tool.ratingCount || 0,
      isActive: tool.isActive,
      isFeatured: tool.isFeatured,
      tags: tool.tags || [],
      developer: tool.developer || '',
      price: tool.price || '',
      platforms: tool.platforms || [],
      createdAt: new Date(tool.createdAt).toISOString(),
      updatedAt: new Date(tool.updatedAt).toISOString(),
    };
  } catch (error) {
    console.error('获取工具详情失败:', error);
    return null;
  }
}

/**
 * 创建工具
 */
export async function createTool(toolData: CreateToolData): Promise<Tool> {
  try {
    const result = await db
      .insert(tools)
      .values({
        name: toolData.name,
        description: toolData.description,
        url: toolData.url,
        categoryId: Number.parseInt(toolData.categoryId),
        rating: 0,
        ratingCount: 0,
        isActive: true,
        isFeatured: false,
        tags: toolData.tags || [],
        developer: toolData.developer || '',
        price: toolData.price || '',
        platforms: toolData.platforms || [],
      })
      .returning();

    const newTool = result[0]!;
    
    // 获取分类信息
    const categoryResult = await db
      .select()
      .from(categories)
      .where(eq(categories.id, newTool.categoryId))
      .limit(1);

    const category = categoryResult[0];

    return {
      id: newTool.id.toString(),
      name: newTool.name,
      description: newTool.description,
      url: newTool.url,
      categoryId: newTool.categoryId.toString(),
      category: {
        id: newTool.categoryId.toString(),
        name: category?.name || '未知分类',
        slug: category?.slug || '',
        description: category?.description || '',
        icon: category?.icon || '',
        sort: category?.sort || 0,
        isActive: category?.isActive || true,
        toolCount: 0,
        createdAt: category?.createdAt || new Date(),
        updatedAt: category?.updatedAt || new Date(),
      },
      rating: newTool.rating || 0,
      ratingCount: newTool.ratingCount || 0,
      isActive: newTool.isActive,
      isFeatured: newTool.isFeatured,
      tags: newTool.tags || [],
      developer: newTool.developer || '',
      price: newTool.price || '',
      platforms: newTool.platforms || [],
      createdAt: new Date(newTool.createdAt).toISOString(),
      updatedAt: new Date(newTool.updatedAt).toISOString(),
    };
  } catch (error) {
    console.error('创建工具失败:', error);
    throw error;
  }
}

/**
 * 更新工具
 */
export async function updateTool(
  id: string,
  updateData: Partial<CreateToolData> & { isActive?: boolean; isFeatured?: boolean }
): Promise<Tool | null> {
  try {
    const result = await db
      .update(tools)
      .set({
        ...updateData,
        categoryId: updateData.categoryId ? Number.parseInt(updateData.categoryId) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(tools.id, Number.parseInt(id)))
      .returning();

    if (result.length === 0) {
      return null;
    }

    const updatedTool = result[0]!;
    
    // 获取分类信息
    const categoryResult = await db
      .select()
      .from(categories)
      .where(eq(categories.id, updatedTool.categoryId))
      .limit(1);

    const category = categoryResult[0];

    return {
      id: updatedTool.id.toString(),
      name: updatedTool.name,
      description: updatedTool.description,
      url: updatedTool.url,
      categoryId: updatedTool.categoryId.toString(),
      category: {
        id: updatedTool.categoryId.toString(),
        name: category?.name || '未知分类',
        slug: category?.slug || '',
        description: category?.description || '',
        icon: category?.icon || '',
        sort: category?.sort || 0,
        isActive: category?.isActive || true,
        toolCount: 0,
        createdAt: category?.createdAt || new Date(),
        updatedAt: category?.updatedAt || new Date(),
      },
      rating: updatedTool.rating || 0,
      ratingCount: updatedTool.ratingCount || 0,
      isActive: updatedTool.isActive,
      isFeatured: updatedTool.isFeatured,
      tags: updatedTool.tags || [],
      developer: updatedTool.developer || '',
      price: updatedTool.price || '',
      platforms: updatedTool.platforms || [],
      createdAt: new Date(updatedTool.createdAt).toISOString(),
      updatedAt: new Date(updatedTool.updatedAt).toISOString(),
    };
  } catch (error) {
    console.error('更新工具失败:', error);
    throw error;
  }
}

/**
 * 删除工具（软删除）
 */
export async function deleteTool(id: string): Promise<boolean> {
  try {
    const result = await db
      .update(tools)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(tools.id, Number.parseInt(id)))
      .returning();

    return result.length > 0;
  } catch (error) {
    console.error('删除工具失败:', error);
    throw error;
  }
}

/**
 * 获取推荐工具
 */
export async function getFeaturedTools(limit: number = 8): Promise<Tool[]> {
  try {
    const result = await getTools({
      featured: true,
      limit,
      status: 'active',
    });

    return result.tools;
  } catch (error) {
    console.error('获取推荐工具失败:', error);
    return [];
  }
}

/**
 * 根据分类获取工具
 */
export async function getToolsByCategory(categoryId: string, limit: number = 12): Promise<Tool[]> {
  try {
    const result = await getTools({
      category: categoryId,
      limit,
      status: 'active',
    });

    return result.tools;
  } catch (error) {
    console.error('根据分类获取工具失败:', error);
    return [];
  }
}
