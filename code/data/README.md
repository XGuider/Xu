# 数据文件说明

本目录包含AI工具导航平台的所有数据文件。

## 文件结构

- `categories.json` - 分类数据文件
- `tools.json` - 工具数据文件

## 数据格式

### categories.json

分类数据数组，每个分类包含以下字段：

```json
{
  "id": 1, // 分类ID（唯一）
  "name": "AI办公工具", // 分类名称
  "slug": "ai-office", // URL友好的标识符
  "description": "描述", // 分类描述
  "icon": "ai-office.svg", // 图标文件名
  "sort": 1, // 排序顺序
  "isActive": true, // 是否启用
  "toolCount": 0 // 工具数量（可选）
}
```

### tools.json

工具数据数组，每个工具包含以下字段：

```json
{
  "id": 1, // 工具ID（唯一）
  "name": "工具名称", // 工具名称
  "description": "描述", // 工具描述
  "url": "https://...", // 工具网址
  "categoryId": 1, // 所属分类ID
  "rating": 4.5, // 评分（0-5）
  "ratingCount": 100, // 评分人数
  "isActive": true, // 是否启用
  "isFeatured": true, // 是否推荐
  "tags": ["标签1", "标签2"], // 标签数组
  "developer": "开发者", // 开发者/公司名称
  "logo": "/assets/...", // Logo路径
  "pricing": "免费" // 价格信息
}
```

## 数据管理

1. **添加新工具**：编辑 `tools.json`，添加新的工具对象
2. **添加新分类**：编辑 `categories.json`，添加新的分类对象
3. **修改数据**：直接编辑对应的JSON文件
4. **删除数据**：从数组中删除对应的对象

## 注意事项

- 确保JSON格式正确，可以使用JSON验证工具检查
- ID必须唯一
- categoryId必须对应categories.json中存在的分类ID
- 修改数据后需要重启开发服务器或等待缓存过期（5分钟）
- 建议使用代码编辑器编辑，避免格式错误
