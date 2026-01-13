# Xu AI导航平台

一个现代化的AI工具导航平台，帮助用户发现和使用最好的AI工具。基于Next.js 15构建，使用本地文件存储数据，简单易用。

## 📋 项目概述

Xu AI导航平台是一个专业的AI工具聚合平台，旨在为用户提供最全面、最便捷的AI工具发现和使用体验。平台采用现代化的技术栈，支持多语言、响应式设计，使用本地JSON文件管理数据，简单高效。

### 🏗️ 架构特点
- **现代前端**: Next.js 15 App Router + React 19 + TypeScript 5.8+
- **数据存储**: 本地JSON文件存储，无需数据库配置
- **数据管理**: 直接编辑JSON文件即可管理数据，支持Git版本控制
- **国际化**: next-intl 支持中英文双语切换（默认中文）
- **开发体验**: 完整的 TypeScript 支持、ESLint + Prettier、自动化测试

### 🎯 核心价值
- **工具发现**: 帮助用户快速发现适合的AI工具
- **分类导航**: 按功能分类组织AI工具，便于浏览
- **智能搜索**: 提供强大的搜索和筛选功能
- **简单易用**: 无需数据库，直接编辑文件即可管理数据
- **版本控制**: 数据文件支持Git管理，便于协作和备份

## 🚀 功能特性

### 前端展示界面
- **首页**: 搜索功能、热搜榜、热门推荐、分类导航
- **分类页面**: 按分类展示AI工具，支持排序和分页
- **工具详情页**: 完整的工具信息展示，包括评分、标签、基本信息
- **搜索结果页**: 智能搜索和筛选功能
- **提交页面**: 用户可提交新的AI工具（数据需手动添加到JSON文件）

### 数据管理方式
- **文件管理**: 通过编辑 `data/categories.json` 和 `data/tools.json` 管理数据
- **版本控制**: 数据文件支持Git版本控制，便于协作和备份
- **简单高效**: 无需数据库配置，直接编辑JSON文件即可

## 🛠️ 技术栈

### 前端技术
- **框架**: Next.js 15 (App Router)
- **UI库**: React 19 + TypeScript 5.8+
- **样式**: Tailwind CSS 4 + 自定义组件
- **状态管理**: React Hooks + Context API
- **国际化**: next-intl (支持中英文)
- **图标**: Lucide React + 自定义SVG

### 后端技术
- **API**: Next.js API Routes + 中间件支持（仅读取操作）
- **数据存储**: 本地JSON文件 (`data/categories.json`, `data/tools.json`)
- **数据服务**: 文件读取服务，支持缓存和热重载
- **国际化**: next-intl (支持zh/en双语，默认中文)
- **数据验证**: Zod (运行时类型验证)

### 开发工具
- **代码质量**: ESLint + Prettier + TypeScript (严格模式)
- **测试**: Vitest + Playwright (E2E测试) + Storybook (组件测试)
- **构建**: Next.js 15 + Turbopack (极速构建)
- **部署**: Vercel (推荐) / Docker / 其他云平台
- **Git工作流**: Conventional Commits + 语义化版本发布
- **代码检查**: Knip (依赖检查) + i18n-check (国际化检查)

## 📁 项目结构

```
code/
├── data/                  # 数据文件目录
│   ├── categories.json    # 分类数据文件
│   ├── tools.json         # 工具数据文件
│   └── README.md          # 数据文件说明
├── src/
│   ├── app/               # Next.js App Router 页面
│   │   ├── [locale]/      # 国际化路由
│   │   │   ├── (marketing)/ # 营销页面组
│   │   │   │   ├── page.tsx  # 首页
│   │   │   │   ├── category/ # 分类页面
│   │   │   │   ├── tool/     # 工具详情页
│   │   │   │   ├── search/   # 搜索结果页
│   │   │   │   └── submit/   # 工具提交页
│   │   │   ├── (auth)/       # 认证页面组
│   │   │   │   ├── dashboard/# 用户仪表盘
│   │   │   │   ├── sign-in/  # 登录页面
│   │   │   │   └── sign-up/  # 注册页面
│   │   │   └── api/          # API 路由
│   │   │       ├── tools/    # 工具数据API（只读）
│   │   │       └── categories/# 分类数据API（只读）
│   ├── components/         # React 组件
│   │   ├── ui/            # 基础UI组件 (Button, Input等)
│   │   ├── layout/        # 布局组件 (Header, Sidebar等)
│   │   ├── tools/         # 工具相关组件 (ToolCard等)
│   │   └── pages/         # 页面组件 (HomePage, SearchPage等)
│   ├── contexts/          # React Context状态管理
│   │   ├── CategoryContext.tsx # 分类状态管理
│   │   └── SidebarContext.tsx  # 侧边栏状态管理
│   ├── hooks/             # 自定义 Hooks
│   │   ├── useTools.ts    # 工具数据管理Hook
│   │   └── useCategories.ts # 分类数据管理Hook
│   ├── libs/              # 核心库文件
│   │   ├── I18n.ts        # 国际化配置
│   │   └── Logger.ts      # 日志记录
│   ├── services/          # 服务层
│   │   ├── fileDataService.ts # 文件数据服务
│   │   ├── categoryService.ts # 分类服务（已废弃，使用fileDataService）
│   │   └── toolService.ts     # 工具服务（已废弃，使用fileDataService）
│   ├── types/             # TypeScript 类型定义
│   │   └── index.ts       # 核心类型定义
│   ├── utils/             # 工具函数
│   │   ├── AppConfig.ts   # 应用配置
│   │   ├── cn.ts          # 样式工具函数
│   │   └── Helpers.ts     # 通用工具函数
│   └── locales/           # 国际化文件
│       ├── zh.json        # 中文语言包（默认）
│       └── en.json        # 英文语言包
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

### 数据管理

数据通过编辑本地JSON文件进行管理：

- **分类数据**: 编辑 `data/categories.json`
- **工具数据**: 编辑 `data/tools.json`
- **数据格式**: 参考 `data/README.md` 了解详细格式说明
- **更新方式**: 修改文件后重启开发服务器或等待缓存过期（5分钟）

### API接口

#### 工具数据API (`/api/tools`)
- **GET**: 获取工具列表（只读）
  - 参数: `page`, `limit`, `search`, `category`, `featured`
  - 响应: 工具列表和分页信息
  - 说明: 数据从 `data/tools.json` 读取

#### 分类数据API (`/api/categories`)
- **GET**: 获取活跃分类列表（只读）
  - 响应: 分类列表数据
  - 说明: 数据从 `data/categories.json` 读取

## 🏗️ 系统架构与数据流

### 整体架构设计
本项目采用 **Next.js App Router + 分层架构** 的设计模式：

- **前端层**: React 19 + Next.js 15 + Tailwind CSS 4 + TypeScript 5.8+
- **应用层**: App Router + 中间件 + 路由管理 + 状态管理 + 国际化
- **服务层**: API Routes + 业务逻辑 + 数据验证 + 错误处理
- **数据层**: 本地文件存储 + JSON数据格式 + 文件系统操作 + 数据缓存

### 数据流架构

#### 1. 前端数据流
```
用户交互 → React组件 → Context/Hooks → API调用 → 文件数据服务 → JSON文件
    ↓
状态更新 → 组件重渲染 → UI更新
```

#### 2. 状态管理架构
- **本地状态**: React Hooks (useState, useReducer)
- **组件间状态**: React Context (CategoryContext, SidebarContext)
- **服务端状态**: Next.js Server Components + API Routes
- **全局状态**: 通过Context Provider管理

#### 3. 数据文件结构
```
data/
├── categories.json    # 分类数据
└── tools.json         # 工具数据（包含categoryId关联分类）

数据关系：
- tools.categoryId → categories.id (多对一关系)
- 通过文件编辑维护数据关系
```

#### 4. API设计模式
- **只读API**: 所有API仅提供读取操作，数据通过文件编辑管理
- **统一响应格式**: 标准化的JSON响应结构
- **数据缓存**: 5分钟缓存机制，减少文件I/O操作
- **错误处理**: 统一的错误处理机制
- **类型安全**: 完整的TypeScript类型定义

### 状态管理架构

#### 1. 全局状态管理
- **CategoryContext**: 管理分类数据和当前选中分类
- **SidebarContext**: 管理侧边栏开关状态
- **NotificationContext**: 管理全局通知消息

#### 2. 服务端状态管理
- **Next.js Server Components**: 默认使用服务端组件
- **API Routes**: 提供RESTful数据接口
- **数据获取**: 使用原生fetch，支持缓存和重新验证

#### 3. 客户端状态管理
- **React Hooks**: useState, useReducer 管理组件状态
- **自定义Hooks**: useTools, useCategories 封装业务逻辑
- **URL状态**: 搜索参数、分页等通过URL管理

### 核心组件说明

#### 1. 页面组件 (pages/)
- **HomePage**: 首页组件，包含搜索、分类导航、工具展示
- **SearchPage**: 搜索结果页面，支持筛选和排序
- **SubmitPage**: 工具提交页面，用户可提交新工具
- **CategoryPage**: 分类页面，按分类展示工具
- **ToolDetailPage**: 工具详情页面

#### 2. 布局组件 (layout/)
- **Header**: 顶部导航栏，包含搜索和用户菜单
- **Sidebar**: 侧边栏，包含分类导航
- **ClientLayout**: 客户端布局包装器

#### 3. 业务组件 (tools/)
- **ToolCard**: 工具卡片组件，展示工具基本信息
- **CategoryNav**: 分类导航组件

#### 4. 状态管理 (contexts/)
- **CategoryContext**: 管理分类数据和活动分类状态
- **SidebarContext**: 管理侧边栏开关状态

#### 5. 自定义Hooks (hooks/)
- **useTools**: 工具数据管理Hook，提供CRUD操作

### 数据文件设计

#### 数据文件结构
1. **categories.json**: 分类数据文件
   - 字段: id, name, slug, description, icon, sort, isActive, toolCount
   - 格式: JSON数组

2. **tools.json**: 工具数据文件
   - 字段: id, name, description, url, categoryId, rating, ratingCount, isActive, isFeatured, tags, developer, logo, pricing
   - 格式: JSON数组
   - 关联: categoryId 关联到 categories.json 中的分类

#### 数据管理方式
- **文件编辑**: 直接编辑JSON文件进行数据管理
- **版本控制**: 使用Git管理数据文件变更历史
- **数据验证**: 读取时进行数据格式验证
- **缓存机制**: 5分钟缓存，减少文件读取次数

## 🚀 快速开始

### 环境要求
- **Node.js**: >= 20.0.0
- **包管理器**: npm / yarn / pnpm
- **操作系统**: Windows / macOS / Linux

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd Xu/code
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
# 或
pnpm install
```

3. **数据文件准备**
```bash
# 数据文件已包含在项目中
# 如需修改数据，编辑以下文件：
# - data/categories.json (分类数据)
# - data/tools.json (工具数据)
```

4. **启动开发服务器**
```bash
npm run dev:next
# 或
npm run dev
```

访问 http://localhost:3000 查看应用。

### 生产部署

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

### 开发命令详解

```bash
# 开发环境
npm run dev:next         # 启动Next.js开发服务器（推荐）
npm run dev              # 启动开发服务器（包含数据库，已废弃）
npm run dev:spotlight    # 启动Spotlight调试工具

# 数据管理
# 直接编辑 data/categories.json 和 data/tools.json 文件
# 修改后重启开发服务器或等待缓存过期（5分钟）

# 代码质量检查
npm run lint             # 运行ESLint代码检查
npm run lint:fix         # 自动修复ESLint问题
npm run check:types      # TypeScript类型检查
npm run check:deps       # 检查未使用的依赖
npm run check:i18n       # 国际化完整性检查

# 测试
npm run test             # 运行单元测试 (Vitest)
npm run test:e2e         # 运行端到端测试 (Playwright)
npm run storybook        # 启动Storybook组件测试
npm run storybook:test   # 运行Storybook测试

# 构建和部署
npm run build:next       # 构建Next.js应用（推荐）
npm run build            # 构建生产版本（包含数据库，已废弃）
npm run build-stats      # 构建并生成包分析报告
npm start                # 启动生产服务器
npm run clean            # 清理构建文件
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

### 代码规范
- 使用 TypeScript 进行类型检查
- 遵循 React 最佳实践
- 组件化开发
- 响应式设计优先
- 使用 ESLint 进行代码检查
- 遵循 Conventional Commits 提交规范

### 组件开发指南

#### 1. 创建新组件
```text
// 组件文件结构
src/components/
├── ui/           # 基础UI组件
├── layout/       # 布局组件
├── tools/        # 业务组件
└── pages/        # 页面组件
```

#### 2. 状态管理
- 使用 React Context 管理全局状态
- 使用自定义 Hooks 封装业务逻辑
- 避免 prop drilling，合理使用 Context

#### 3. 样式规范
- 使用 Tailwind CSS 进行样式开发
- 遵循移动端优先的响应式设计
- 使用 `cn()` 工具函数合并样式类

#### 4. 类型定义
- 在 `src/types/index.ts` 中定义核心类型
- 为每个组件定义 Props 类型
- 使用 Zod 进行运行时类型验证

### 二次开发指南

#### 1. 添加新功能页面
1. 在 `src/app/[locale]/(marketing)/` 下创建新页面
2. 在 `src/components/pages/` 下创建页面组件
3. 在 `src/types/index.ts` 中定义相关类型
4. 更新路由配置和导航菜单

#### 2. 添加新的API接口
1. 在 `src/app/[locale]/api/` 下创建新的API路由
2. 在 `src/services/` 下创建对应的服务函数
3. 在 `src/hooks/` 下创建对应的自定义Hook
4. 更新类型定义

#### 3. 添加新的数据
1. 编辑 `data/categories.json` 添加新分类
2. 编辑 `data/tools.json` 添加新工具
3. 确保数据格式正确（参考 `data/README.md`）
4. 重启开发服务器或等待缓存过期

#### 4. 添加新的国际化内容
1. 在 `src/locales/` 下更新语言包文件
2. 使用 `useTranslations` Hook 在组件中使用翻译
3. 运行 `npm run check:i18n` 检查国际化完整性

#### 5. 自定义主题和样式
1. 修改 `tailwind.config.ts` 配置文件
2. 在 `src/styles/global.css` 中添加全局样式
3. 使用 CSS 变量定义主题色彩

### 调试和测试

#### 1. 开发工具
- 使用 React DevTools 调试组件状态
- 使用 Next.js 开发服务器进行热重载
- 直接编辑JSON文件管理数据

#### 2. 测试命令
```bash
# 运行单元测试
npm run test

# 运行端到端测试
npm run test:e2e

# 检查代码质量
npm run lint

# 检查类型错误
npm run check:types
```

#### 3. 数据管理
```bash
# 编辑分类数据
nano data/categories.json

# 编辑工具数据
nano data/tools.json

# 查看数据文件说明
cat data/README.md

# 注意：修改数据后需要重启开发服务器或等待缓存过期（5分钟）
```

## 📈 性能优化

- Next.js 15 的 App Router
- 服务器端渲染 (SSR)
- 静态站点生成 (SSG)
- 图片优化和懒加载

## 🌐 国际化支持

- 支持中文（默认）和英文
- 基于 next-intl 的国际化
- 动态语言切换
- 默认显示中文界面

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

### 环境变量配置

本项目使用本地文件存储数据，无需数据库配置。如需使用Clerk认证等功能，可创建 `.env.local` 文件：

#### 可选环境变量
```bash
# Clerk 认证配置（可选）
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"

# 应用基础配置
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

**注意**: 如果不使用Clerk认证，可以完全省略环境变量配置。

### 部署到 Vercel

1. **连接 GitHub 仓库**
   - 在 Vercel 控制台导入 GitHub 仓库
   - 选择 `code` 目录作为根目录

2. **配置环境变量**（可选）
   - 如需使用Clerk认证等功能，在 Vercel 项目设置中添加环境变量
   - 数据文件会随代码一起部署

3. **数据文件**
   - `data/` 目录下的JSON文件会随代码一起部署
   - 更新数据后重新部署即可

4. **自动部署**
   - 推送到主分支自动触发部署
   - 支持预览部署和回滚

### 部署到其他平台

#### Netlify
```bash
# 构建命令
npm run build

# 发布目录
.next
```

#### Docker 部署
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### 生产环境优化

#### 1. 性能优化
- 启用 Next.js 图片优化
- 配置 CDN 加速
- 启用 Gzip 压缩
- 使用 Redis 缓存

#### 2. 安全配置
- 配置 HTTPS
- 设置安全头
- 启用 CSRF 保护
- 配置防火墙规则

#### 3. 监控和日志
- 配置 Sentry 错误监控
- 设置 PostHog 用户分析
- 配置日志聚合服务
- 设置性能监控

### 数据管理

#### 添加新分类
编辑 `data/categories.json`，添加新的分类对象：
```json
{
  "id": 7,
  "name": "新分类名称",
  "slug": "new-category",
  "description": "分类描述",
  "icon": "icon-name.svg",
  "sort": 7,
  "isActive": true,
  "toolCount": 0
}
```

#### 添加新工具
编辑 `data/tools.json`，添加新的工具对象：
```json
{
  "id": 4,
  "name": "工具名称",
  "description": "工具描述",
  "url": "https://example.com",
  "categoryId": 1,
  "rating": 4.5,
  "ratingCount": 10,
  "isActive": true,
  "isFeatured": false,
  "tags": ["标签1", "标签2"],
  "developer": "开发者名称",
  "logo": "/assets/images/logo.png",
  "pricing": "免费"
}
```

#### 更新数据
1. 编辑对应的JSON文件
2. 确保JSON格式正确
3. 重启开发服务器或等待缓存过期（5分钟）

## 🔧 故障排除

### 常见问题解决

#### 1. 数据文件问题
```bash
# 问题：数据文件读取失败
# 解决：检查data目录下的JSON文件格式是否正确
cat data/categories.json | jq .  # 验证JSON格式

# 问题：数据更新后未生效
# 解决：重启开发服务器或等待缓存过期（5分钟）
npm run dev:next
```

#### 2. JSON格式错误
```bash
# 问题：JSON格式错误导致读取失败
# 解决：使用JSON验证工具检查格式
# 在线工具：https://jsonlint.com/
# 或使用命令行：cat data/tools.json | python -m json.tool
```

#### 3. 构建和部署问题
```bash
# 问题：构建失败
# 解决：清理缓存并重新构建
npm run clean
npm run build

# 问题：类型检查失败
# 解决：运行类型检查并修复错误
npm run check:types
```

#### 4. 国际化问题
```bash
# 问题：翻译缺失
# 解决：检查国际化文件完整性
npm run check:i18n

# 问题：语言切换不生效
# 解决：检查next-intl配置和中间件设置
```

#### 5. 性能优化建议
```bash
# 问题：开发服务器响应慢
# 解决：使用Turbopack加速
npm run dev:next

# 问题：构建产物过大
# 解决：分析包大小并优化
npm run build-stats
```

### 开发环境调试

#### 1. Spotlight调试工具
```bash
# 启动Spotlight调试工具
npm run dev:spotlight

# 在浏览器中访问 http://localhost:3000
# Spotlight会自动捕获和分析应用数据
```

#### 2. 数据文件调试
```bash
# 查看分类数据
cat data/categories.json

# 查看工具数据
cat data/tools.json

# 验证JSON格式
cat data/categories.json | python -m json.tool
```

#### 3. 清除缓存
```bash
# 如果数据更新后未生效，重启开发服务器
# 或等待5分钟缓存过期
npm run dev:next
```

## 📊 代码质量报告

### 当前状态
- ✅ **TypeScript**: 严格类型检查，无类型错误
- ✅ **ESLint**: 代码规范检查，遵循Antfu配置
- ✅ **Prettier**: 代码格式化，保持一致的代码风格
- ✅ **组件结构**: 模块化设计，组件职责清晰
- ✅ **API设计**: RESTful风格，统一的响应格式
- ✅ **国际化**: 支持zh/en双语，默认中文，完整的本地化
- ✅ **数据存储**: 本地JSON文件，简单高效
- ✅ **测试**: Vitest + Playwright + Storybook，全面的测试覆盖

### 代码统计
- **总文件数**: 70+ 个源文件
- **TypeScript覆盖率**: 100%
- **组件复用率**: 高 (UI组件库化)
- **测试覆盖率**: 基础测试框架已配置
- **国际化覆盖率**: 双语完整支持 (zh/en，默认中文)
- **数据文件**: 2个JSON文件（categories.json, tools.json）
- **API端点**: 2个只读API接口（tools, categories）

### 性能优化
- **Next.js 15**: 使用最新的App Router和Turbopack
- **代码分割**: 自动代码分割和懒加载
- **图片优化**: Next.js Image组件优化
- **缓存策略**: 合理的缓存配置

## 🔧 开发规范

### 代码规范
- 使用 TypeScript 进行类型检查
- 遵循 React 最佳实践和Hooks规范
- 组件化开发，单一职责原则
- 使用 ESLint + Prettier 保持代码风格一致
- 遵循 Conventional Commits 提交规范

### 文件命名规范
```
src/
├── components/          # 组件目录
│   ├── ui/             # 基础UI组件
│   ├── layout/         # 布局组件
│   ├── pages/          # 页面组件
│   └── tools/          # 业务组件
├── contexts/           # React Context
├── hooks/              # 自定义Hooks
├── services/           # 服务层
├── types/              # 类型定义
├── utils/              # 工具函数
└── locales/            # 国际化文件
```

### Git提交规范
```bash
# 功能开发
git commit -m "feat: 添加用户登录功能"

# 问题修复
git commit -m "fix: 修复搜索功能bug"

# 文档更新
git commit -m "docs: 更新API文档"

# 样式调整
git commit -m "style: 调整按钮样式"

# 重构代码
git commit -m "refactor: 重构用户管理模块"
```

## 🚀 部署指南

### Vercel部署 (推荐)
1. 连接GitHub仓库到Vercel
2. 配置环境变量
3. 设置构建命令: `npm run build`
4. 设置输出目录: `.next`
5. 自动部署完成

### Docker部署
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### 环境变量配置
```bash
# 本项目使用本地文件存储，无需数据库配置
# 如需使用Clerk认证等功能，可配置以下变量（可选）

# Clerk认证配置（可选）
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"

# 应用配置
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

## 🤝 贡献指南

### 如何贡献
1. Fork 本仓库
2. 创建功能分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'Add some amazing feature'`
4. 推送分支: `git push origin feature/amazing-feature`
5. 提交 Pull Request

### 开发流程
1. 阅读项目文档和代码规范
2. 创建Issue描述问题或功能需求
3. 分配任务并开始开发
4. 编写测试用例
5. 提交代码并创建PR
6. 代码审查和合并

### 问题报告
- 使用GitHub Issues报告bug
- 提供详细的复现步骤
- 包含环境信息和错误日志
- 使用标签分类问题类型

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢以下开源项目的支持：
- [Next.js](https://nextjs.org/) - React框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [next-intl](https://next-intl-docs.vercel.app/) - 国际化解决方案
- [Vercel](https://vercel.com/) - 部署平台

---

**Xu AI导航平台** - 让AI工具发现更简单 🚀
