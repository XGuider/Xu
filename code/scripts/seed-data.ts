import {
  categoriesSchema,
  searchLogsSchema,
  toolsSchema,
  usersSchema,
  visitStatsSchema,
} from '../src/models/Schema';

// 根据环境变量选择数据库连接
let db: any;
let sql: any;

if (process.env.NODE_ENV === 'production' || process.env.USE_POSTGRES === 'true') {
  // 生产环境使用 postgres
  const { drizzle } = require('drizzle-orm/postgres-js');
  const postgres = require('postgres');
  const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/xu_ai_navigation';
  sql = postgres(connectionString);
  db = drizzle(sql);
} else {
  const { PGlite } = require('@electric-sql/pglite');
  // 开发环境使用 pglite
  const { drizzle } = require('drizzle-orm/pglite');
  sql = new PGlite('./local.db');
  db = drizzle(sql);
}

// 测试数据
const seedData = async () => {
  console.log('🌱 开始生成测试数据...');

  try {
    // 1. 创建分类数据
    console.log('📁 创建分类数据...');
    const categories = await db.insert(categoriesSchema).values([
      {
        name: 'AI办公工具',
        slug: 'ai-office',
        description: '提升办公效率的AI工具，包括文档处理、表格分析、演示制作等',
        icon: 'ai-office',
        sort: 1,
        isActive: true,
        toolCount: 32,
      },
      {
        name: 'AI视频工具',
        slug: 'ai-video',
        description: 'AI驱动的视频创作工具，包括视频生成、编辑、特效等',
        icon: 'ai-video',
        sort: 2,
        isActive: true,
        toolCount: 24,
      },
      {
        name: 'AI编程工具',
        slug: 'ai-coding',
        description: '智能代码助手和开发工具，提升编程效率',
        icon: 'ai-coding',
        sort: 3,
        isActive: true,
        toolCount: 18,
      },
      {
        name: 'AI聊天助手',
        slug: 'ai-chat',
        description: '智能对话和问答工具，提供各种AI助手服务',
        icon: 'ai-chat',
        sort: 4,
        isActive: true,
        toolCount: 45,
      },
      {
        name: 'AI写作工具',
        slug: 'ai-writing',
        description: '智能内容创作和写作助手，支持多种文体创作',
        icon: 'ai-writing',
        sort: 5,
        isActive: true,
        toolCount: 28,
      },
      {
        name: 'AI学习网站',
        slug: 'ai-learning',
        description: 'AI教育和学习资源，帮助用户学习AI相关知识',
        icon: 'ai-learning',
        sort: 6,
        isActive: true,
        toolCount: 15,
      },
    ]).returning();

    console.log(`✅ 创建了 ${categories.length} 个分类`);

    // 2. 创建用户数据
    console.log('👥 创建用户数据...');
    const users = await db.insert(usersSchema).values([
      {
        username: 'admin',
        email: 'admin@xu-ai.com',
        passwordHash: '$2b$10$example.hash.for.admin',
        role: 'admin',
        isActive: true,
        bio: '系统管理员',
      },
      {
        username: 'user001',
        email: 'user001@example.com',
        passwordHash: '$2b$10$example.hash.for.user',
        role: 'user',
        isActive: true,
        bio: '普通用户',
      },
      {
        username: 'contributor',
        email: 'contributor@example.com',
        passwordHash: '$2b$10$example.hash.for.contributor',
        role: 'contributor',
        isActive: true,
        bio: '内容贡献者',
      },
      {
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: '$2b$10$example.hash.for.test',
        role: 'user',
        isActive: true,
        bio: '测试用户',
      },
    ]).returning();

    console.log(`✅ 创建了 ${users.length} 个用户`);

    // 3. 创建工具数据
    console.log('🛠️ 创建工具数据...');
    const tools = await db.insert(toolsSchema).values([
      // AI办公工具
      {
        name: 'WPS AI',
        description: '集成在WPS中的AI助手，支持文档生成、摘要、翻译等功能',
        url: 'https://ai.wps.cn',
        categoryId: categories[0].id,
        rating: 4.8,
        ratingCount: 1256,
        isActive: true,
        isFeatured: true,
        tags: ['办公', '文档处理', 'AI助手'],
        developer: '金山办公',
        pricing: '免费基础功能，高级功能付费',
      },
      {
        name: 'Excel AI助手',
        description: '智能数据分析与公式生成，提升表格处理效率',
        url: 'https://excel-ai.example.com',
        categoryId: categories[0].id,
        rating: 4.6,
        ratingCount: 892,
        isActive: true,
        isFeatured: false,
        tags: ['办公', '数据分析', '表格处理'],
        developer: 'Microsoft',
        pricing: 'Office 365订阅',
      },
      {
        name: '智能日程助手',
        description: '自动安排会议，智能提醒，优化时间管理',
        url: 'https://schedule-ai.example.com',
        categoryId: categories[0].id,
        rating: 4.5,
        ratingCount: 567,
        isActive: true,
        isFeatured: false,
        tags: ['办公', '时间管理', '日程安排'],
        developer: '智能科技',
        pricing: '免费',
      },

      // AI视频工具
      {
        name: '剪映AI',
        description: 'AI驱动的视频编辑工具，支持智能剪辑、特效生成',
        url: 'https://www.capcut.com',
        categoryId: categories[1].id,
        rating: 4.7,
        ratingCount: 2341,
        isActive: true,
        isFeatured: true,
        tags: ['视频编辑', 'AI剪辑', '特效生成'],
        developer: '字节跳动',
        pricing: '免费',
      },
      {
        name: 'RunwayML',
        description: '专业级AI视频生成和编辑平台',
        url: 'https://runwayml.com',
        categoryId: categories[1].id,
        rating: 4.9,
        ratingCount: 1567,
        isActive: true,
        isFeatured: true,
        tags: ['视频生成', 'AI创作', '专业工具'],
        developer: 'Runway',
        pricing: '付费订阅',
      },

      // AI编程工具
      {
        name: 'DeepSeek',
        description: '深度求索AI工具，强大的代码生成和编程助手',
        url: 'https://www.deepseek.com',
        categoryId: categories[2].id,
        rating: 4.8,
        ratingCount: 1256,
        isActive: true,
        isFeatured: true,
        tags: ['编程', '代码生成', 'AI助手'],
        developer: '深度求索',
        pricing: '免费基础功能',
      },
      {
        name: 'Cursor',
        description: 'AI代码编辑器，基于VSCode，支持智能代码补全和生成',
        url: 'https://cursor.sh',
        categoryId: categories[2].id,
        rating: 4.7,
        ratingCount: 1892,
        isActive: true,
        isFeatured: true,
        tags: ['编程', '代码编辑器', 'AI补全'],
        developer: 'Cursor',
        pricing: '免费',
      },
      {
        name: 'GitHub Copilot',
        description: 'GitHub的AI编程助手，支持多种编程语言',
        url: 'https://github.com/features/copilot',
        categoryId: categories[2].id,
        rating: 4.6,
        ratingCount: 3456,
        isActive: true,
        isFeatured: false,
        tags: ['编程', '代码补全', 'GitHub'],
        developer: 'GitHub',
        pricing: '付费订阅',
      },

      // AI聊天助手
      {
        name: '腾讯元宝',
        description: '腾讯AI助手，提供智能对话和问答服务',
        url: 'https://yuanbao.qq.com',
        categoryId: categories[3].id,
        rating: 4.5,
        ratingCount: 2341,
        isActive: true,
        isFeatured: true,
        tags: ['聊天', 'AI助手', '腾讯'],
        developer: '腾讯',
        pricing: '免费',
      },
      {
        name: 'Claude',
        description: 'Anthropic的AI助手，擅长写作和分析',
        url: 'https://claude.ai',
        categoryId: categories[3].id,
        rating: 4.8,
        ratingCount: 2987,
        isActive: true,
        isFeatured: true,
        tags: ['聊天', 'AI助手', '写作'],
        developer: 'Anthropic',
        pricing: '付费订阅',
      },

      // AI写作工具
      {
        name: '豆包AI写作',
        description: '智能内容生成工具，支持多种文体创作',
        url: 'https://write.doubao.com',
        categoryId: categories[4].id,
        rating: 4.9,
        ratingCount: 1256,
        isActive: true,
        isFeatured: true,
        tags: ['写作', '内容生成', 'AI助手'],
        developer: '豆包',
        pricing: '免费基础功能',
      },
      {
        name: '智谱AI写作',
        description: '基于大语言模型的专业写作工具',
        url: 'https://write.zhipuai.com',
        categoryId: categories[4].id,
        rating: 4.6,
        ratingCount: 892,
        isActive: true,
        isFeatured: false,
        tags: ['写作', '大语言模型', '专业工具'],
        developer: '智谱AI',
        pricing: '付费订阅',
      },

      // AI学习网站
      {
        name: 'AI学习网',
        description: '专业的AI教育和学习资源平台',
        url: 'https://ai-learning.example.com',
        categoryId: categories[5].id,
        rating: 4.4,
        ratingCount: 456,
        isActive: true,
        isFeatured: false,
        tags: ['学习', 'AI教育', '资源平台'],
        developer: 'AI教育',
        pricing: '免费',
      },
    ]).returning();

    console.log(`✅ 创建了 ${tools.length} 个工具`);

    // 4. 创建搜索记录数据
    console.log('🔍 创建搜索记录数据...');
    const searchLogs = await db.insert(searchLogsSchema).values([
      { query: 'AI写作', userId: users[1].id, resultCount: 24 },
      { query: '代码生成', userId: users[2].id, resultCount: 18 },
      { query: '视频编辑', userId: users[3].id, resultCount: 12 },
      { query: '办公工具', userId: users[1].id, resultCount: 32 },
      { query: '聊天助手', userId: users[2].id, resultCount: 45 },
    ]).returning();

    console.log(`✅ 创建了 ${searchLogs.length} 条搜索记录`);

    // 5. 创建访问统计数据
    console.log('📊 创建访问统计数据...');
    const visitStats = await db.insert(visitStatsSchema).values([
      {
        date: new Date('2024-01-01'),
        pageViews: 12548,
        uniqueVisitors: 8321,
        toolViews: 45678,
        searchCount: 12345,
      },
      {
        date: new Date('2024-01-02'),
        pageViews: 13456,
        uniqueVisitors: 9123,
        toolViews: 48912,
        searchCount: 13456,
      },
      {
        date: new Date('2024-01-03'),
        pageViews: 14234,
        uniqueVisitors: 9876,
        toolViews: 52345,
        searchCount: 14567,
      },
    ]).returning();

    console.log(`✅ 创建了 ${visitStats.length} 条访问统计`);

    // 6. 更新分类的工具数量
    console.log('🔄 更新分类工具数量...');
    for (const category of categories) {
      const toolCount = tools.filter((tool: any) => tool.categoryId === category.id).length;
      await db.update(categoriesSchema)
        .set({ toolCount, updatedAt: new Date() })
        .where({ id: category.id });
    }

    console.log('✅ 所有测试数据生成完成！');
    console.log(`📊 数据统计:`);
    console.log(`   - 分类: ${categories.length} 个`);
    console.log(`   - 用户: ${users.length} 个`);
    console.log(`   - 工具: ${tools.length} 个`);
    console.log(`   - 搜索记录: ${searchLogs.length} 条`);
    console.log(`   - 访问统计: ${visitStats.length} 条`);
  } catch (error) {
    console.error('❌ 生成测试数据时出错:', error);
    throw error;
  } finally {
    // 只有postgres需要关闭连接
    if (process.env.NODE_ENV === 'production' || process.env.USE_POSTGRES === 'true') {
      await sql.end();
    }
  }
};

// 运行脚本
if (require.main === module) {
  seedData()
    .then(() => {
      console.log('🎉 测试数据生成成功！');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 测试数据生成失败:', error);
      process.exit(1);
    });
}

export default seedData;
