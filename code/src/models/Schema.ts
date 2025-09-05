import {
  boolean,
  decimal,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

// 用户角色枚举
export const userRoleEnum = pgEnum('user_role', ['admin', 'user', 'contributor']);

// 用户表
export const usersSchema = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: userRoleEnum('role').default('user').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  avatar: varchar('avatar', { length: 255 }),
  bio: text('bio'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}, table => ({
  emailIdx: index('email_idx').on(table.email),
  usernameIdx: index('username_idx').on(table.username),
}));

// 分类表
export const categoriesSchema = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  icon: varchar('icon', { length: 50 }),
  sort: integer('sort_order').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  toolCount: integer('tool_count').default(0).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}, table => ({
  slugIdx: index('slug_idx').on(table.slug),
  sortIdx: index('sort_idx').on(table.sort),
}));

// 工具表
export const toolsSchema = pgTable('tools', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description').notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  categoryId: integer('category_id').references(() => categoriesSchema.id).notNull(),
  rating: decimal('rating', { precision: 3, scale: 1 }).default('0.0').notNull(),
  ratingCount: integer('rating_count').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  tags: text('tags').array(),
  developer: varchar('developer', { length: 100 }),
  logo: varchar('logo', { length: 255 }),
  screenshots: text('screenshots').array(),
  pricing: varchar('pricing', { length: 100 }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}, table => ({
  categoryIdx: index('category_idx').on(table.categoryId),
  featuredIdx: index('featured_idx').on(table.isFeatured),
  ratingIdx: index('rating_idx').on(table.rating),
}));

// 搜索记录表
export const searchLogsSchema = pgTable('search_logs', {
  id: serial('id').primaryKey(),
  query: varchar('query', { length: 200 }).notNull(),
  userId: integer('user_id').references(() => usersSchema.id),
  categoryId: integer('category_id').references(() => categoriesSchema.id),
  resultCount: integer('result_count').default(0).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, table => ({
  queryIdx: index('query_idx').on(table.query),
  createdAtIdx: index('created_at_idx').on(table.createdAt),
}));

// 访问统计表
export const visitStatsSchema = pgTable('visit_stats', {
  id: serial('id').primaryKey(),
  date: timestamp('date', { mode: 'date' }).notNull(),
  pageViews: integer('page_views').default(0).notNull(),
  uniqueVisitors: integer('unique_visitors').default(0).notNull(),
  toolViews: integer('tool_views').default(0).notNull(),
  searchCount: integer('search_count').default(0).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, table => ({
  dateIdx: index('date_idx').on(table.date),
}));

// 保留原有的counter表
export const counterSchema = pgTable('counter', {
  id: serial('id').primaryKey(),
  count: integer('count').default(0),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});
