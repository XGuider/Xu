# Xu AI导航平台

一个现代化的AI工具导航平台，帮助用户发现和使用最好的AI工具。

## 🚀 功能特性

### 前端展示界面
- **首页**: 搜索功能、热搜榜、热门推荐、分类导航
- **分类页面**: 按分类展示AI工具，支持排序和分页
- **工具详情页**: 完整的工具信息展示，包括评分、标签、基本信息
- **搜索结果页**: 智能搜索和筛选功能

### 管理后台界面
- **仪表盘**: 平台数据概览、访问趋势分析
- **工具管理**: AI工具的增删改查、状态管理
- **分类管理**: 分类的增删改查、排序管理
- **用户管理**: 用户角色管理、状态控制

## 🛠️ 技术栈

- **前端框架**: Next.js 15 + React 19
- **样式**: Tailwind CSS 4
- **类型检查**: TypeScript 5.8+
- **状态管理**: React Hooks + Context
- **路由**: Next.js App Router
- **国际化**: next-intl
- **数据库**: DrizzleORM + PostgreSQL
- **认证**: Clerk
- **部署**: Vercel

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── [locale]/          # 国际化路由
│   │   ├── (marketing)/   # 营销页面组
│   │   │   ├── page.tsx   # 首页
│   │   │   ├── category/  # 分类页面
│   │   │   └── tool/      # 工具详情页
│   │   └── (auth)/        # 认证页面组
│   └── api/               # API 路由
├── components/             # React 组件
│   ├── ui/                # 基础UI组件
│   ├── layout/            # 布局组件
│   ├── tools/             # 工具相关组件
│   └── pages/             # 页面组件
├── types/                  # TypeScript 类型定义
├── utils/                  # 工具函数
├── hooks/                  # 自定义 Hooks
└── services/               # 服务层
```

## 🌐 页面访问地址

### 前端展示页面
- **首页**: http://localhost:3000
- **分类页面**: http://localhost:3000/category/[slug]
  - AI办公工具: http://localhost:3000/category/ai-office
  - AI视频工具: http://localhost:3000/category/ai-video
  - AI编程工具: http://localhost:3000/category/ai-coding
  - AI聊天助手: http://localhost:3000/category/ai-chat
  - AI写作工具: http://localhost:3000/category/ai-writing
  - AI学习网站: http://localhost:3000/category/ai-learning
- **工具详情页**: http://localhost:3000/tool/[id]
  - WPS AI: http://localhost:3000/tool/1
  - DeepSeek: http://localhost:3000/tool/2
  - 腾讯元宝: http://localhost:3000/tool/3
- **搜索结果页**: http://localhost:3000/search?q=[关键词]

### 管理后台页面
- **管理后台首页**: http://localhost:3000/admin
- **工具管理**: http://localhost:3000/admin/tools
- **分类管理**: http://localhost:3000/admin/categories
- **用户管理**: http://localhost:3000/admin/users
- **数据分析**: http://localhost:3000/admin/analytics

### API接口
- **工具管理API**: http://localhost:3000/api/tools
- **分类管理API**: http://localhost:3000/api/categories
- **用户管理API**: http://localhost:3000/api/users
- **计数器API**: http://localhost:3000/api/counter

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 开发环境运行
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
npm start
```

## 📱 响应式设计

- 支持桌面端、平板和移动端
- 使用 Tailwind CSS 的响应式类
- 移动端友好的导航和交互

## 🎨 设计特色

- 现代化的UI设计
- 一致的设计语言
- 优秀的用户体验
- 清晰的视觉层次

## 🔧 开发规范

- 使用 TypeScript 进行类型检查
- 遵循 React 最佳实践
- 组件化开发
- 响应式设计优先

## 📈 性能优化

- Next.js 15 的 App Router
- 服务器端渲染 (SSR)
- 静态站点生成 (SSG)
- 图片优化和懒加载

## 🌐 国际化支持

- 支持中文和英文
- 基于 next-intl 的国际化
- 动态语言切换

## 🔒 安全特性

- 输入验证和清理
- XSS 防护
- CSRF 保护
- 安全的认证机制

## 📊 监控和分析

- 错误监控 (Sentry)
- 用户行为分析 (PostHog)
- 性能监控
- 日志记录

## 🚀 部署

项目可以部署到 Vercel、Netlify 等平台，支持自动部署和持续集成。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进项目。

## 📄 许可证

MIT License
