import { z } from 'zod';

/**
 * URL验证正则表达式
 */
const urlRegex = /^https?:\/\/.+/;

/**
 * 创建工具的验证Schema
 */
export const createToolSchema = z.object({
  name: z.string().min(1, '工具名称不能为空').max(100, '工具名称不能超过100个字符'),
  description: z.string().min(1, '描述不能为空').max(500, '描述不能超过500个字符'),
  url: z.string()
    .min(1, 'URL不能为空')
    .regex(urlRegex, 'URL格式不正确，必须以http://或https://开头'),
  categoryId: z.union([z.string(), z.number()]).transform(val => val.toString()),
  rating: z.number().min(0, '评分不能小于0').max(5, '评分不能大于5').optional(),
  ratingCount: z.number().int().min(0, '评分数量不能小于0').optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  tags: z.array(z.string()).max(10, '标签数量不能超过10个').optional(),
  developer: z.string().max(100, '开发者名称不能超过100个字符').optional(),
  logo: z.string().max(200, 'logo路径不能超过200个字符').optional(),
  pricing: z.string().max(50, '价格信息不能超过50个字符').optional(),
});

/**
 * 更新工具的验证Schema
 */
export const updateToolSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(val => val.toString()),
  name: z.string().min(1, '工具名称不能为空').max(100, '工具名称不能超过100个字符').optional(),
  description: z.string().min(1, '描述不能为空').max(500, '描述不能超过500个字符').optional(),
  url: z.string()
    .regex(urlRegex, 'URL格式不正确，必须以http://或https://开头')
    .optional(),
  categoryId: z.union([z.string(), z.number()]).transform(val => val.toString()).optional(),
  rating: z.number().min(0, '评分不能小于0').max(5, '评分不能大于5').optional(),
  ratingCount: z.number().int().min(0, '评分数量不能小于0').optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  tags: z.array(z.string()).max(10, '标签数量不能超过10个').optional(),
  developer: z.string().max(100, '开发者名称不能超过100个字符').optional(),
  logo: z.string().max(200, 'logo路径不能超过200个字符').optional(),
  pricing: z.string().max(50, '价格信息不能超过50个字符').optional(),
});

export type CreateToolInput = z.infer<typeof createToolSchema>;
export type UpdateToolInput = z.infer<typeof updateToolSchema>;
