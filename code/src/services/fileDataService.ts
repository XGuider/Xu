import type { Category, CreateCategoryInput, CreateToolInput, Tool, UpdateCategoryInput, UpdateToolInput } from '@/types';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// 数据文件路径
const DATA_DIR = join(process.cwd(), 'data');

// JSON文件中的原始数据类型
type CategoryRaw = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  sort: number;
  isActive: boolean;
  toolCount?: number;
};

type ToolRaw = {
  id?: number; // id字段可能缺失（爬虫生成的数据可能没有id）
  name: string;
  description: string;
  url: string;
  categoryId: number;
  rating?: number;
  ratingCount?: number;
  isActive: boolean;
  isFeatured: boolean;
  tags?: string[];
  developer?: string;
  logo?: string;
  pricing?: string;
};

// 缓存数据
let categoriesCache: Category[] | null = null;
let toolsCache: Tool[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5分钟缓存

/**
 * 读取JSON文件
 */
async function readJsonFile<T>(filename: string): Promise<T> {
  const filePath = join(DATA_DIR, filename);
  try {
    const content = await readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`Error reading file ${filename}:`, error);
    throw new Error(`Failed to read data file: ${filename}`);
  }
}

/**
 * 写入JSON文件
 */
async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  const filePath = join(DATA_DIR, filename);
  try {
    const content = JSON.stringify(data, null, 2);
    await writeFile(filePath, content, 'utf-8');
  } catch (error) {
    console.error(`Error writing file ${filename}:`, error);
    throw new Error(`Failed to write data file: ${filename}`);
  }
}

/**
 * 转换分类数据格式
 */
function transformCategory(raw: CategoryRaw): Category {
  return {
    id: raw.id.toString(),
    name: raw.name,
    slug: raw.slug,
    description: raw.description,
    icon: raw.icon,
    sort: raw.sort,
    isActive: raw.isActive,
    toolCount: raw.toolCount || 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * 转换工具数据格式
 */
function transformTool(raw: ToolRaw, categories: Category[]): Tool {
  const category = categories.find(cat => cat.id === raw.categoryId.toString()) || {
    id: raw.categoryId.toString(),
    name: '未知分类',
    slug: '',
    description: '',
    icon: '',
    sort: 0,
    isActive: true,
    toolCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // 处理缺失的id字段：如果没有id，使用临时id（基于索引或hash）
  // 这应该不会发生，因为爬虫会在保存时自动分配id，但作为防御性编程
  let toolId: string;
  if (raw.id !== undefined && raw.id !== null) {
    toolId = raw.id.toString();
  } else {
    // 生成临时id（基于名称和URL的hash）
    const hash = raw.name + raw.url;
    toolId = `temp_${hash.split('').reduce((acc, char) => {
      const hash = ((acc << 5) - acc) + char.charCodeAt(0);
      return hash & hash;
    }, 0)}`;
    console.warn(`工具 "${raw.name}" 缺少id字段，使用临时id: ${toolId}`);
  }

  return {
    id: toolId,
    name: raw.name,
    description: raw.description,
    url: raw.url,
    categoryId: raw.categoryId.toString(),
    category,
    logo: raw.logo,
    rating: raw.rating || 0,
    ratingCount: raw.ratingCount || 0,
    isActive: raw.isActive,
    isFeatured: raw.isFeatured,
    tags: raw.tags || [],
    developer: raw.developer,
    price: raw.pricing,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * 获取分类数据
 */
export async function getCategories(): Promise<Category[]> {
  // 检查缓存
  const now = Date.now();
  if (categoriesCache && (now - cacheTimestamp) < CACHE_TTL) {
    return categoriesCache;
  }

  try {
    const rawCategories = await readJsonFile<CategoryRaw[]>('categories.json');
    categoriesCache = rawCategories.map(transformCategory);
    cacheTimestamp = now;
    return categoriesCache;
  } catch (error) {
    console.error('Error loading categories:', error);
    // 返回空数组作为降级处理
    return [];
  }
}

/**
 * 获取工具数据
 */
export async function getTools(): Promise<Tool[]> {
  // 检查缓存
  const now = Date.now();
  if (toolsCache && (now - cacheTimestamp) < CACHE_TTL) {
    return toolsCache;
  }

  try {
    const rawTools = await readJsonFile<ToolRaw[]>('tools.json');
    const categories = await getCategories();
    toolsCache = rawTools.map(raw => transformTool(raw, categories));
    cacheTimestamp = now;
    return toolsCache;
  } catch (error) {
    console.error('Error loading tools:', error);
    // 返回空数组作为降级处理
    return [];
  }
}

/**
 * 根据ID获取单个分类
 */
export async function getCategoryById(id: string | number): Promise<Category | null> {
  const categories = await getCategories();
  const idStr = id.toString();
  return categories.find(cat => cat.id === idStr) || null;
}

/**
 * 根据slug获取分类
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find(cat => cat.slug === slug && cat.isActive) || null;
}

/**
 * 根据ID获取单个工具
 */
export async function getToolById(id: string | number): Promise<Tool | null> {
  const tools = await getTools();
  const idStr = id.toString();
  return tools.find(tool => tool.id === idStr) || null;
}

/**
 * 根据分类ID获取工具列表
 */
export async function getToolsByCategoryId(categoryId: number | string): Promise<Tool[]> {
  const tools = await getTools();
  const categoryIdStr = categoryId.toString();
  return tools.filter(tool => tool.categoryId === categoryIdStr && tool.isActive);
}

/**
 * 搜索工具
 */
export async function searchTools(query: string): Promise<Tool[]> {
  const tools = await getTools();
  const lowerQuery = query.toLowerCase();

  return tools.filter(tool =>
    tool.isActive && (
      tool.name.toLowerCase().includes(lowerQuery)
      || tool.description.toLowerCase().includes(lowerQuery)
      || tool.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    ),
  );
}

/**
 * 获取热门工具
 */
export async function getFeaturedTools(limit = 10): Promise<Tool[]> {
  const tools = await getTools();
  return tools
    .filter(tool => tool.isActive && tool.isFeatured)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, limit);
}

/**
 * 获取最新工具（按id降序，最新的在前）
 */
export async function getLatestTools(limit = 4): Promise<Tool[]> {
  const tools = await getTools();
  return tools
    .filter(tool => tool.isActive)
    .sort((a, b) => {
      // 按id降序排列（id越大表示越新）
      const aId = Number.parseInt(a.id) || 0;
      const bId = Number.parseInt(b.id) || 0;
      return bId - aId;
    })
    .slice(0, limit);
}

/**
 * 清除缓存（用于开发环境热重载）
 */
export function clearCache(): void {
  categoriesCache = null;
  toolsCache = null;
  cacheTimestamp = 0;
}

/**
 * 重新计算所有分类的toolCount
 */
export async function recalculateToolCounts(): Promise<void> {
  try {
    const rawCategories = await readJsonFile<CategoryRaw[]>('categories.json');
    const rawTools = await readJsonFile<ToolRaw[]>('tools.json');

    // 计算每个分类的工具数量（只计算活跃的工具）
    const toolCounts = new Map<number, number>();
    rawTools.forEach((tool) => {
      if (tool.isActive) {
        const count = toolCounts.get(tool.categoryId) || 0;
        toolCounts.set(tool.categoryId, count + 1);
      }
    });

    // 更新分类的toolCount
    rawCategories.forEach((category) => {
      category.toolCount = toolCounts.get(category.id) || 0;
    });

    // 写回文件
    await writeJsonFile('categories.json', rawCategories);
    clearCache();
  } catch (error) {
    console.error('Error recalculating tool counts:', error);
    throw new Error('Failed to recalculate tool counts');
  }
}

/**
 * 创建新分类
 */
export async function createCategory(input: CreateCategoryInput): Promise<Category> {
  try {
    const rawCategories = await readJsonFile<CategoryRaw[]>('categories.json');

    // 验证slug唯一性
    const slugExists = rawCategories.some(cat => cat.slug === input.slug);
    if (slugExists) {
      throw new Error(`分类slug "${input.slug}" 已存在`);
    }

    // 生成新ID
    const maxId = rawCategories.length > 0
      ? Math.max(...rawCategories.map(cat => cat.id))
      : 0;
    const newId = maxId + 1;

    // 创建新分类
    const newCategory: CategoryRaw = {
      id: newId,
      name: input.name,
      slug: input.slug,
      description: input.description,
      icon: input.icon,
      sort: input.sort ?? rawCategories.length + 1,
      isActive: input.isActive ?? true,
      toolCount: 0,
    };

    // 添加到数组并写回文件
    rawCategories.push(newCategory);
    await writeJsonFile('categories.json', rawCategories);
    clearCache();

    // 返回转换后的分类
    return transformCategory(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    throw error instanceof Error ? error : new Error('Failed to create category');
  }
}

/**
 * 更新分类
 */
export async function updateCategory(input: UpdateCategoryInput): Promise<Category> {
  try {
    const rawCategories = await readJsonFile<CategoryRaw[]>('categories.json');
    const categoryId = Number.parseInt(input.id.toString());

    // 查找分类
    const categoryIndex = rawCategories.findIndex(cat => cat.id === categoryId);
    if (categoryIndex === -1) {
      throw new Error(`分类ID "${input.id}" 不存在`);
    }

    const existingCategory = rawCategories[categoryIndex]!;

    // 验证slug唯一性（排除当前分类）
    if (input.slug && input.slug !== existingCategory.slug) {
      const slugExists = rawCategories.some(cat => cat.slug === input.slug && cat.id !== categoryId);
      if (slugExists) {
        throw new Error(`分类slug "${input.slug}" 已存在`);
      }
    }

    // 更新分类字段
    if (input.name !== undefined) {
      existingCategory.name = input.name;
    }
    if (input.slug !== undefined) {
      existingCategory.slug = input.slug;
    }
    if (input.description !== undefined) {
      existingCategory.description = input.description;
    }
    if (input.icon !== undefined) {
      existingCategory.icon = input.icon;
    }
    if (input.sort !== undefined) {
      existingCategory.sort = input.sort;
    }
    if (input.isActive !== undefined) {
      existingCategory.isActive = input.isActive;
    }

    // 写回文件
    await writeJsonFile('categories.json', rawCategories);
    clearCache();

    // 返回转换后的分类
    return transformCategory(existingCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    throw error instanceof Error ? error : new Error('Failed to update category');
  }
}

/**
 * 创建新工具
 */
export async function createTool(input: CreateToolInput): Promise<Tool> {
  try {
    const rawTools = await readJsonFile<ToolRaw[]>('tools.json');
    const rawCategories = await readJsonFile<CategoryRaw[]>('categories.json');
    const categoryId = Number.parseInt(input.categoryId.toString());

    // 验证分类存在
    const category = rawCategories.find(cat => cat.id === categoryId);
    if (!category) {
      throw new Error(`分类ID "${input.categoryId}" 不存在`);
    }

    // 生成新ID（过滤掉没有id的工具，避免undefined导致的问题）
    const existingIds = rawTools
      .map(tool => tool.id)
      .filter((id): id is number => id !== undefined && id !== null)
      .map(id => Number(id));

    const maxId = existingIds.length > 0
      ? Math.max(...existingIds)
      : 0;
    const newId = maxId + 1;

    // 创建新工具
    const newTool: ToolRaw = {
      id: newId,
      name: input.name,
      description: input.description,
      url: input.url,
      categoryId,
      rating: input.rating ?? 0,
      ratingCount: input.ratingCount ?? 0,
      isActive: input.isActive ?? true,
      isFeatured: input.isFeatured ?? false,
      tags: input.tags ?? [],
      developer: input.developer,
      logo: input.logo,
      pricing: input.pricing,
    };

    // 添加到数组并写回文件
    rawTools.push(newTool);
    await writeJsonFile('tools.json', rawTools);

    // 更新分类的toolCount（如果工具是活跃的）
    if (newTool.isActive) {
      category.toolCount = (category.toolCount || 0) + 1;
      await writeJsonFile('categories.json', rawCategories);
    }

    clearCache();

    // 返回转换后的工具
    const categories = await getCategories();
    return transformTool(newTool, categories);
  } catch (error) {
    console.error('Error creating tool:', error);
    throw error instanceof Error ? error : new Error('Failed to create tool');
  }
}

/**
 * 更新工具
 */
export async function updateTool(input: UpdateToolInput): Promise<Tool> {
  try {
    const rawTools = await readJsonFile<ToolRaw[]>('tools.json');
    const rawCategories = await readJsonFile<CategoryRaw[]>('categories.json');
    const toolId = Number.parseInt(input.id.toString());

    // 查找工具
    const toolIndex = rawTools.findIndex(tool => tool.id === toolId);
    if (toolIndex === -1) {
      throw new Error(`工具ID "${input.id}" 不存在`);
    }

    const existingTool = rawTools[toolIndex]!;
    const oldCategoryId = existingTool.categoryId;
    const oldIsActive = existingTool.isActive;

    // 如果修改了categoryId，验证新分类存在
    if (input.categoryId !== undefined) {
      const newCategoryId = Number.parseInt(input.categoryId.toString());
      const newCategory = rawCategories.find(cat => cat.id === newCategoryId);
      if (!newCategory) {
        throw new Error(`分类ID "${input.categoryId}" 不存在`);
      }
    }

    // 更新工具字段
    if (input.name !== undefined) {
      existingTool.name = input.name;
    }
    if (input.description !== undefined) {
      existingTool.description = input.description;
    }
    if (input.url !== undefined) {
      existingTool.url = input.url;
    }
    if (input.rating !== undefined) {
      existingTool.rating = input.rating;
    }
    if (input.ratingCount !== undefined) {
      existingTool.ratingCount = input.ratingCount;
    }
    if (input.isActive !== undefined) {
      existingTool.isActive = input.isActive;
    }
    if (input.isFeatured !== undefined) {
      existingTool.isFeatured = input.isFeatured;
    }
    if (input.tags !== undefined) {
      existingTool.tags = input.tags;
    }
    if (input.developer !== undefined) {
      existingTool.developer = input.developer;
    }
    if (input.logo !== undefined) {
      existingTool.logo = input.logo;
    }
    if (input.pricing !== undefined) {
      existingTool.pricing = input.pricing;
    }

    // 处理categoryId变更
    if (input.categoryId !== undefined) {
      const newCategoryId = Number.parseInt(input.categoryId.toString());
      const categoryChanged = newCategoryId !== oldCategoryId;

      if (categoryChanged) {
        // 更新旧分类的toolCount
        const oldCategory = rawCategories.find(cat => cat.id === oldCategoryId);
        if (oldCategory && oldIsActive) {
          oldCategory.toolCount = Math.max(0, (oldCategory.toolCount || 0) - 1);
        }

        // 更新新分类的toolCount
        const newCategory = rawCategories.find(cat => cat.id === newCategoryId);
        if (newCategory && existingTool.isActive) {
          newCategory.toolCount = (newCategory.toolCount || 0) + 1;
        }

        existingTool.categoryId = newCategoryId;
      }
    } else {
      // 如果只修改了isActive状态，需要更新分类的toolCount
      if (input.isActive !== undefined && input.isActive !== oldIsActive) {
        const category = rawCategories.find(cat => cat.id === oldCategoryId);
        if (category) {
          if (input.isActive) {
            category.toolCount = (category.toolCount || 0) + 1;
          } else {
            category.toolCount = Math.max(0, (category.toolCount || 0) - 1);
          }
        }
      }
    }

    // 写回文件
    await writeJsonFile('tools.json', rawTools);
    await writeJsonFile('categories.json', rawCategories);
    clearCache();

    // 返回转换后的工具
    const categories = await getCategories();
    return transformTool(existingTool, categories);
  } catch (error) {
    console.error('Error updating tool:', error);
    throw error instanceof Error ? error : new Error('Failed to update tool');
  }
}
