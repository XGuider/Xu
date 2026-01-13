# GitHub Actions Workflows

本项目包含以下GitHub Actions工作流：

## 1. CI Workflow (`ci.yml`)

**触发条件：**
- 推送到 `main` 或 `develop` 分支
- 创建Pull Request到 `main` 或 `develop` 分支

**执行任务：**
- **Lint and Type Check**: 代码检查和类型检查
- **Test**: 运行单元测试
- **Build**: 构建应用
- **E2E Tests**: 运行端到端测试

## 2. Deploy Workflow (`deploy.yml`)

**触发条件：**
- 推送到 `main` 分支
- 手动触发（workflow_dispatch）

**执行任务：**
- 代码检查
- 类型检查
- 构建应用
- 部署到Vercel（生产环境）

**所需Secrets：**
- `VERCEL_TOKEN`: Vercel访问令牌
- `VERCEL_ORG_ID`: Vercel组织ID
- `VERCEL_PROJECT_ID`: Vercel项目ID

## 3. PR Check Workflow (`pr-check.yml`)

**触发条件：**
- 创建Pull Request到 `main` 或 `develop` 分支

**执行任务：**
- 代码检查
- 类型检查
- 国际化检查
- 运行测试
- 构建检查
- 如果失败，在PR中自动评论

## 4. CodeQL Analysis (`codeql.yml`)

**触发条件：**
- 推送到 `main` 分支
- 创建Pull Request到 `main` 分支
- 每周日自动运行

**执行任务：**
- 代码安全分析
- 检测潜在的安全漏洞

## 配置说明

### 环境要求
- Node.js >= 20
- 工作目录：`./code`

### 缓存配置
- 使用npm缓存加速依赖安装
- 缓存路径：`./code/package-lock.json`

### 构建配置
- 使用 `npm run build:next` 构建（不包含数据库）
- 生产环境变量：`NODE_ENV=production`

## 使用说明

### 本地测试Workflow
```bash
# 安装act工具（可选）
brew install act

# 运行CI workflow
act -W .github/workflows/ci.yml

# 运行特定job
act -j lint-and-type-check
```

### 查看Workflow状态
1. 访问GitHub仓库
2. 点击 "Actions" 标签
3. 查看workflow运行状态和日志

### 手动触发部署
1. 访问GitHub仓库
2. 点击 "Actions" 标签
3. 选择 "Deploy" workflow
4. 点击 "Run workflow" 按钮

## 故障排除

### Workflow失败
1. 查看workflow日志，找到失败的步骤
2. 检查错误信息
3. 修复问题后重新提交

### 部署失败
1. 检查Vercel secrets是否正确配置
2. 确认Vercel项目ID和组织ID正确
3. 查看部署日志获取详细错误信息

### 测试失败
1. 确保所有测试用例都能通过
2. 检查测试环境配置
3. 更新测试用例以适应代码变更

