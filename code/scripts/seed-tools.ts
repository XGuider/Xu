import { db } from '../src/libs/DB';
import { categoriesSchema as categories, toolsSchema as tools } from '../src/models/Schema';
import { eq } from 'drizzle-orm';

async function seedTools() {
  try {
    console.log('开始添加工具数据...');

    // 首先确保有分类数据
    const existingCategories = await db.select().from(categories);
    
    if (existingCategories.length === 0) {
      console.log('添加默认分类数据...');
      await db.insert(categories).values([
        {
          name: 'AI办公工具',
          slug: 'ai-office',
          description: '提升办公效率的AI工具',
          icon: 'ai-office',
          sort: 1,
          isActive: true,
          toolCount: 0,
        },
        {
          name: 'AI视频工具',
          slug: 'ai-video',
          description: 'AI驱动的视频创作工具',
          icon: 'ai-video',
          sort: 2,
          isActive: true,
          toolCount: 0,
        },
        {
          name: 'AI编程工具',
          slug: 'ai-coding',
          description: '智能代码助手和开发工具',
          icon: 'ai-coding',
          sort: 3,
          isActive: true,
          toolCount: 0,
        },
        {
          name: 'AI聊天助手',
          slug: 'ai-chat',
          description: '智能对话和问答工具',
          icon: 'ai-chat',
          sort: 4,
          isActive: true,
          toolCount: 0,
        },
      ]);
    }

    // 获取分类ID
    const categoryList = await db.select().from(categories);
    const categoryMap = new Map(categoryList.map(cat => [cat.slug, cat.id]));

    // 添加工具数据
    const toolsData = [
      // AI办公工具
      {
        name: 'WPS AI',
        description: '智能文档处理，支持自动生成、摘要和翻译',
        url: 'https://ai.wps.cn',
        categoryId: categoryMap.get('ai-office'),
        rating: 4.8,
        ratingCount: 1256,
        isActive: true,
        isFeatured: true,
        tags: ['办公', '文档', 'AI助手'],
        developer: '金山办公',
        price: '免费',
        platforms: ['Web', 'Windows', 'Mac'],
      },
      {
        name: 'Excel AI助手',
        description: '智能数据分析与公式生成，提升表格处理效率',
        url: 'https://excel.ai',
        categoryId: categoryMap.get('ai-office'),
        rating: 4.6,
        ratingCount: 892,
        isActive: true,
        isFeatured: false,
        tags: ['办公', '表格', '数据分析'],
        developer: 'Microsoft',
        price: '订阅制',
        platforms: ['Web', 'Windows', 'Mac'],
      },
      {
        name: '智能日程助手',
        description: '自动安排会议，智能提醒，优化时间管理',
        url: 'https://calendar.ai',
        categoryId: categoryMap.get('ai-office'),
        rating: 4.5,
        ratingCount: 654,
        isActive: true,
        isFeatured: false,
        tags: ['办公', '日程', '时间管理'],
        developer: 'Google',
        price: '免费',
        platforms: ['Web', 'Android', 'iOS'],
      },
      // AI视频工具
      {
        name: 'Runway ML',
        description: 'AI视频编辑和生成平台，支持文本转视频',
        url: 'https://runwayml.com',
        categoryId: categoryMap.get('ai-video'),
        rating: 4.7,
        ratingCount: 2341,
        isActive: true,
        isFeatured: true,
        tags: ['视频', 'AI生成', '编辑'],
        developer: 'Runway',
        price: '订阅制',
        platforms: ['Web'],
      },
      {
        name: 'Luma AI',
        description: '3D视频生成和编辑工具',
        url: 'https://lumalabs.ai',
        categoryId: categoryMap.get('ai-video'),
        rating: 4.4,
        ratingCount: 1234,
        isActive: true,
        isFeatured: false,
        tags: ['视频', '3D', '生成'],
        developer: 'Luma Labs',
        price: '免费试用',
        platforms: ['Web', 'iOS'],
      },
      // AI编程工具
      {
        name: 'GitHub Copilot',
        description: 'AI代码助手，智能代码补全和建议',
        url: 'https://github.com/features/copilot',
        categoryId: categoryMap.get('ai-coding'),
        rating: 4.9,
        ratingCount: 5678,
        isActive: true,
        isFeatured: true,
        tags: ['编程', '代码助手', 'AI'],
        developer: 'GitHub',
        price: '订阅制',
        platforms: ['VS Code', 'JetBrains', 'Neovim'],
      },
      {
        name: 'Cursor',
        description: 'AI驱动的代码编辑器',
        url: 'https://cursor.sh',
        categoryId: categoryMap.get('ai-coding'),
        rating: 4.6,
        ratingCount: 3456,
        isActive: true,
        isFeatured: false,
        tags: ['编程', '编辑器', 'AI'],
        developer: 'Cursor',
        price: '订阅制',
        platforms: ['Windows', 'Mac', 'Linux'],
      },
      // AI聊天助手
      {
        name: 'ChatGPT',
        description: 'OpenAI的智能对话助手',
        url: 'https://chat.openai.com',
        categoryId: categoryMap.get('ai-chat'),
        rating: 4.8,
        ratingCount: 9876,
        isActive: true,
        isFeatured: true,
        tags: ['聊天', '对话', 'AI助手'],
        developer: 'OpenAI',
        price: '免费+订阅',
        platforms: ['Web', 'Android', 'iOS'],
      },
      {
        name: 'Claude',
        description: 'Anthropic的AI助手，擅长分析和写作',
        url: 'https://claude.ai',
        categoryId: categoryMap.get('ai-chat'),
        rating: 4.7,
        ratingCount: 5432,
        isActive: true,
        isFeatured: false,
        tags: ['聊天', '分析', '写作'],
        developer: 'Anthropic',
        price: '免费+订阅',
        platforms: ['Web'],
      },
    ];

    // 检查是否已有工具数据
    const existingTools = await db.select().from(tools);
    
    if (existingTools.length === 0) {
      console.log('添加工具数据...');
      await db.insert(tools).values(toolsData);

      // 更新分类的工具数量
      for (const category of categoryList) {
        const toolCount = toolsData.filter(tool => tool.categoryId === category.id).length;
        await db.update(categories)
          .set({ toolCount })
          .where(eq(categories.id, category.id));
      }

      console.log('工具数据添加完成！');
    } else {
      console.log('工具数据已存在，跳过添加');
    }

  } catch (error) {
    console.error('添加工具数据失败:', error);
    throw error;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  seedTools()
    .then(() => {
      console.log('种子数据脚本执行完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('种子数据脚本执行失败:', error);
      process.exit(1);
    });
}

export { seedTools };
