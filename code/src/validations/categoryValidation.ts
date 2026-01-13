import { z } from 'zod';

/**
 * 创建分类的验证Schema
 */
export const createCategorySchema = z.object({
  name: z.string().min(1, '分类名称不能为空').max(50, '分类名称不能超过50个字符'),
  slug: z.string()
    .min(1, 'slug不能为空')
    .max(50, 'slug不能超过50个字符')
    .regex(/^[a-z0-9-]+$/, 'slug只能包含小写字母、数字和连字符'),
  description: z.string().max(200, '描述不能超过200个字符').optional(),
  icon: z.string().max(100, '图标路径不能超过100个字符').optional(),
  sort: z.number().int().min(0, '排序值不能小于0').optional(),
  isActive: z.boolean().optional(),
});

/**
 * 更新分类的验证Schema
 */
export const updateCategorySchema = z.object({
  id: z.union([z.string(), z.number()]).transform(val => val.toString()),
  name: z.string().min(1, '分类名称不能为空').max(50, '分类名称不能超过50个字符').optional(),
  slug: z.string()
    .min(1, 'slug不能为空')
    .max(50, 'slug不能超过50个字符')
    .regex(/^[a-z0-9-]+$/, 'slug只能包含小写字母、数字和连字符')
    .optional(),
  description: z.string().max(200, '描述不能超过200个字符').optional(),
  icon: z.string().max(100, '图标路径不能超过100个字符').optional(),
  sort: z.number().int().min(0, '排序值不能小于0').optional(),
  isActive: z.boolean().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
