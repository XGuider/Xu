// Xu AI导航平台核心类型定义

// 工具分类类型
export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  sort: number;
  isActive: boolean;
  toolCount: number;
  createdAt: Date;
  updatedAt: Date;
};

// AI工具类型
export type Tool = {
  id: string;
  name: string;
  description: string;
  url: string;
  categoryId: string;
  category: Category;
  icon?: string;
  logo?: string;
  rating: number;
  ratingCount: number;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  developer?: string;
  launchDate?: Date;
  price?: string;
  platforms?: string[];
  createdAt: Date;
  updatedAt: Date;
};

// 用户类型
export type User = {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'contributor';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// 搜索参数类型
export type SearchParams = {
  query: string;
  category?: string;
  tags?: string[];
  sortBy?: 'rating' | 'newest' | 'popular';
  page: number;
  limit: number;
};

// 搜索结果类型
export type SearchResult = {
  tools: Tool[];
  total: number;
  page: number;
  totalPages: number;
  searchTime: number;
};

// 统计数据类型
export type DashboardStats = {
  totalTools: number;
  totalCategories: number;
  totalUsers: number;
  dailyVisitors: number;
  activeUsers: number;
  toolsGrowth: number;
  visitorsGrowth: number;
  usersGrowth: number;
};

// 导航菜单项类型
export type NavItem = {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
};

// 热搜词类型
export type HotSearch = {
  id: string;
  keyword: string;
  searchCount: number;
  isTrending: boolean;
};

// 用户反馈类型
export type Feedback = {
  id: string;
  userId: string;
  toolId: string;
  type: 'bug' | 'feature' | 'general';
  content: string;
  status: 'pending' | 'in_progress' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
};

// API输入类型
export type CreateCategoryInput = {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  sort?: number;
  isActive?: boolean;
};

export type UpdateCategoryInput = {
  id: string | number;
  name?: string;
  slug?: string;
  description?: string;
  icon?: string;
  sort?: number;
  isActive?: boolean;
};

export type CreateToolInput = {
  name: string;
  description: string;
  url: string;
  categoryId: string | number;
  rating?: number;
  ratingCount?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  developer?: string;
  logo?: string;
  pricing?: string;
};

export type UpdateToolInput = {
  id: string | number;
  name?: string;
  description?: string;
  url?: string;
  categoryId?: string | number;
  rating?: number;
  ratingCount?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  developer?: string;
  logo?: string;
  pricing?: string;
};
