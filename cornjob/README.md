# Cornjob 数据爬取模块

这是一个使用 AI 提供者来生成和整合 AI 工具信息的定时任务模块。

## 功能特性

- ✅ 支持多个 AI 提供者（DeepSeek、SiliconFlow、Kimi、Doubao）
- ✅ 通过 PROMPT_TEMPLATE 直接调用 AI 生成工具数据
- ✅ 自动加载已有数据（`../data/categories.json`）
- ✅ 使用 AI 进行智能整合去重
- ✅ 自动保存到 `../data/categories.json`
- ✅ 支持定时任务执行
- ✅ 支持手动触发
- ✅ 详细的日志记录

## 工作流程

1. **加载已有数据**：从 `code/data/categories.json` 加载已有数据
2. **AI 提取**：使用多个 AI 提供者通过 PROMPT_TEMPLATE 生成新的工具数据
3. **AI 整合去重**：使用 AI 提供者将新数据与已有数据进行智能整合和去重
4. **保存数据**：将整合后的数据写回 `code/data/categories.json`

## 安装依赖

```bash
pip install -r requirements.txt
```

## 配置管理

所有配置变量统一在 `config.yaml` 文件中管理，支持通过环境变量覆盖。

### 配置文件结构

- **爬虫配置** (`crawler`): 最大内容长度、日志级别、请求超时等
- **AI提供者配置** (`providers`): 每个提供者的默认模型、基础URL、温度参数等
- **数据文件配置** (`data`): 数据目录和文件路径

### 环境变量覆盖

以下配置可以通过环境变量覆盖 `config.yaml` 中的默认值：

- `MAX_CONTENT_LENGTH` - 最大内容长度
- `LOG_LEVEL` - 日志级别 (DEBUG, INFO, WARNING, ERROR, CRITICAL)
- `CRAWL_CONTENT` - 爬虫内容参数
- `CRAWL_PROVIDERS` - 要使用的AI提供者（多个用逗号分隔）

## 使用方法

### 1. 配置环境变量

在 GitHub Secrets 中配置以下环境变量（至少配置一个）：

- `DEEPSEEK_API_KEY` - DeepSeek API 密钥
- `SILICONFLOW_API_KEY` - SiliconFlow API 密钥
- `KIMI_API_KEY` - Kimi API 密钥
- `DOUBAO_API_KEY` - Doubao API 密钥

**注意**: API密钥通过环境变量配置，其他配置（如模型、URL等）在 `config.yaml` 中统一管理。

### 2. 本地运行

```bash
# 使用默认配置（所有可用提供者）
python crawel.py

# 指定内容参数
CRAWL_CONTENT="生成最新的AI编程工具" python crawel.py

# 指定使用的 AI 提供者
CRAWL_PROVIDERS=doubao,kimi python crawel.py

# 设置日志级别
LOG_LEVEL=DEBUG python crawel.py
```

### 3. GitHub Actions 定时任务

定时任务已配置在 `.github/workflows/crawl-schedule.yml`：

- **定时执行**：每天 UTC 时间 2:00（北京时间 10:00）
- **手动触发**：在 GitHub Actions 页面可以手动触发，并可以指定：
  - Content：可选的内容参数（留空则使用默认提示词）
  - Providers：要使用的 AI 提供者（多个用逗号分隔）

## 数据文件

- **输入/输出文件**：`code/data/categories.json`
- **日志文件**：`cornjob/crawl_YYYYMMDD_HHMMSS.log`

## 数据格式

工具数据格式：

```json
[
  {
    "name": "工具名称",
    "description": "工具描述",
    "url": "工具URL",
    "category": "工具分类",
    "tags": ["标签1", "标签2", "标签3"]
  }
]
```

## 去重策略

### AI 整合去重
- 使用 AI 提供者进行智能整合
- 优先使用 URL 作为唯一标识
- 如果 URL 为空，使用工具名称（转小写）作为唯一标识
- 合并时保留信息最完整的记录
- 自动合并标签列表并去重

### 简单去重（备用）
- 当 AI 整合失败时，使用简单去重策略
- 基于 URL 或名称进行去重
- 保留描述更长的记录

## 注意事项

1. 确保至少配置一个 AI 提供者的 API 密钥
2. 数据文件路径：`code/data/categories.json`（相对于 cornjob 目录）
3. 定时任务执行超时时间为 30 分钟
4. 日志文件会在 GitHub Actions 中保存 7 天
5. 如果 AI 整合失败，会自动降级到简单去重策略

## 代码结构

- `crawel.py` - 主程序文件
- `factory.py` - AI 提供者工厂
- `base.py` - AI 提供者基类
- `config.py` - 配置管理（从 config.yaml 读取配置）
- `config.yaml` - 统一配置文件（所有配置变量在此管理）
- `providers/` - 各个 AI 提供者实现
