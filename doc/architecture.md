 
## 1. 整体架构概览

### 1.1 架构模式
本项目采用 **Next.js App Router + 分层架构** 的设计模式，专门为Xu-AI工具导航平台构建：

- **前端层**: React 19.1+ + Next.js 15+ + Tailwind CSS 4 + TypeScript 5.8+
- **应用层**: App Router + 中间件 + 路由管理 + 状态管理 + 国际化 + AI工具导航
- **服务层**: API Routes + 业务逻辑 + 数据验证 + 错误处理 + 工具管理
- **数据层**: 本地文件存储 + JSON数据格式 + 文件系统操作 + 数据同步


## 2. 前端架构设计

### 2.1 组件架构
采用 **原子设计模式** 的组件架构：
- **atoms**: 原子组件 (Button, Input, Icon)
- **molecules**: 分子组件 (SearchBar, ToolCard, CategoryNav)
- **organisms**: 有机体组件 (Header, Sidebar, ToolGrid)
- **templates**: 模板组件 (BaseTemplate, DashboardLayout)
- **pages**: 页面组件 (HomePage, DashboardPage)

### 2.2 状态管理架构
- **本地状态**: React Hooks (useState, useReducer)
- **组件间状态**: React Context + useReducer
- **表单状态**: React Hook Form + Zod 验证
- **服务端状态**: Next.js Server Components

### 2.3 路由架构
基于 Next.js App Router 的嵌套路由结构：
```
app/
├── [locale]/                    # 国际化路由
│   ├── (marketing)/            # 营销页面组
│   ├── (auth)/                 # 认证页面组
│   └── api/                    # API 路由
└── global-error.tsx            # 全局错误处理
```

## 3. 后端架构设计

### 3.1 API 设计原则
- **RESTful 设计**: 遵循 REST 架构风格
- **统一响应格式**: 使用标准化的响应结构
- **参数验证**: 使用 Zod 进行输入验证
- **错误处理**: 统一的错误处理机制
- **日志记录**: 结构化日志记录

### 3.2 API 路由结构
```
src/app/[locale]/api/
├── tools/                     # 工具数据 API（读取本地文件）
└── categories/                # 分类数据 API（读取本地文件）
```

## 4. 数据层架构设计

### 4.1 本地文件存储设计原则
- **文件格式**: 使用 JSON 格式存储数据，便于阅读和编辑
- **数据目录**: 数据文件存储在 `data/` 目录下
- **类型安全**: 使用 TypeScript 类型定义确保数据结构一致性
- **文件管理**: 支持直接编辑 JSON 文件进行数据管理
- **数据同步**: 服务端读取文件数据，支持热重载

### 4.2 数据文件结构
```
data/
├── categories.json           # 分类数据文件
├── tools.json               # 工具数据文件
└── config.json              # 配置文件（可选）
```

### 4.3 数据模型结构
```typescript
// categories.json 结构
[
  {
    "id": 1,
    "name": "AI办公工具",
    "slug": "ai-office",
    "description": "提升办公效率的AI工具",
    "icon": "ai-office.svg",
    "sort": 1,
    "isActive": true
  }
]

// tools.json 结构
[
  {
    "id": 1,
    "name": "WPS AI",
    "description": "智能办公助手",
    "url": "https://www.wps.cn",
    "categoryId": 1,
    "rating": 4.5,
    "ratingCount": 100,
    "isActive": true,
    "isFeatured": true,
    "tags": ["办公", "AI"],
    "developer": "金山办公",
    "logo": "/assets/images/wps.png",
    "pricing": "免费"
  }
]
```

## 5. 安全架构设计

### 5.1 数据安全
- **输入验证**: Zod 模式验证防止注入攻击
- **XSS 防护**: Next.js 内置安全特性
- **文件安全**: 只读访问本地数据文件，防止意外修改
- **数据验证**: 读取文件时进行数据格式验证

## 6. 性能架构设计

### 6.1 前端性能优化
- **代码分割**: Next.js 自动代码分割
- **图片优化**: 自动图片格式转换和懒加载
- **缓存策略**: 静态资源缓存和 API 响应缓存
- **并发渲染**: React 19 并发特性支持

### 6.2 后端性能优化
- **文件缓存**: 读取文件后缓存数据，减少文件 I/O 操作
- **异步处理**: 异步文件读取，非阻塞 I/O 操作
- **数据预加载**: 启动时预加载数据文件

## 7. 部署架构设计

### 7.1 部署策略
- **静态部署**: 支持静态站点生成（SSG），数据文件随代码一起部署
- **文件管理**: 通过 Git 版本控制管理数据文件，支持协作编辑
- **数据更新**: 更新数据文件后重新构建部署

## 9. 国际化架构设计

### 9.1 多语言支持
- **语言检测**: 自动检测用户语言偏好
- **路由本地化**: URL 中包含语言标识
- **内容翻译**: 使用 next-intl 进行内容管理
- **日期格式化**: 本地化的日期和时间显示

### 9.2 国际化文件结构
```
src/locales/
├── zh.json                    # 中文语言包（默认）
└── en.json                    # 英文语言包
```

## 10. 错误处理和监控

### 10.1 错误处理策略
- **错误边界**: React 错误边界组件
- **全局错误**: Next.js 全局错误处理
- **API 错误**: 统一的 API 错误响应格式
- **文件错误**: 文件读取失败时的优雅降级处理
- **数据验证**: 数据格式错误时的友好提示

### 10.2 数据管理
- **文件编辑**: 直接编辑 JSON 文件进行数据管理
- **版本控制**: 使用 Git 管理数据文件变更历史
- **数据备份**: 定期备份数据文件
- **格式验证**: 编辑数据文件时进行格式验证
