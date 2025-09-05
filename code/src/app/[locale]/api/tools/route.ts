import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// 工具验证模式
const ToolSchema = z.object({
  name: z.string().min(1, '工具名称不能为空'),
  description: z.string().min(10, '描述至少10个字符'),
  url: z.string().url('请输入有效的URL'),
  categoryId: z.string().min(1, '请选择分类'),
  tags: z.array(z.string()).optional(),
  developer: z.string().optional(),
  price: z.string().optional(),
  platforms: z.array(z.string()).optional(),
});

// 模拟数据库
type ToolItem = {
  id: string;
  name: string;
  description: string;
  url: string;
  categoryId: string;
  category: string;
  rating: number;
  ratingCount: number;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  developer: string;
  createdAt: string;
  updatedAt: string;
};

const tools: ToolItem[] = [
  {
    id: '1',
    name: 'DeepSeek',
    description: '深度求索AI工具，强大的代码生成和编程助手',
    url: 'https://www.deepseek.com',
    categoryId: '3',
    category: 'AI编程工具',
    rating: 4.8,
    ratingCount: 1256,
    isActive: true,
    isFeatured: true,
    tags: ['编程', '代码生成', 'AI助手'],
    developer: '深度求索',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: '腾讯元宝',
    description: '腾讯AI助手，智能对话和内容创作',
    url: 'https://yuanbao.qq.com',
    categoryId: '4',
    category: 'AI聊天助手',
    rating: 4.6,
    ratingCount: 892,
    isActive: true,
    isFeatured: true,
    tags: ['聊天', 'AI助手', '腾讯'],
    developer: '腾讯',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// GET - 获取工具列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get('page') || '1');
    const limit = Number.parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';

    // 筛选工具
    const filteredTools = tools.filter((tool) => {
      const matchesSearch = !search
        || tool.name.toLowerCase().includes(search.toLowerCase())
        || tool.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !category || tool.categoryId === category;
      const matchesStatus = !status
        || (status === 'active' && tool.isActive)
        || (status === 'inactive' && !tool.isActive);

      return matchesSearch && matchesCategory && matchesStatus;
    });

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTools = filteredTools.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        tools: paginatedTools,
        pagination: {
          page,
          limit,
          total: filteredTools.length,
          totalPages: Math.ceil(filteredTools.length / limit),
        },
      },
    });
  } catch (error) {
    console.error('获取工具列表失败:', error);
    return NextResponse.json(
      { success: false, message: '获取工具列表失败' },
      { status: 500 },
    );
  }
}

// POST - 创建新工具
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证输入数据
    const validatedData = ToolSchema.parse(body);

    // 生成新工具
    const newTool: ToolItem = {
      id: (tools.length + 1).toString(),
      ...validatedData,
      category: '',
      rating: 0,
      ratingCount: 0,
      isActive: true,
      isFeatured: false,
      tags: validatedData.tags ?? [],
      developer: validatedData.developer ?? '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tools.push(newTool);

    return NextResponse.json({
      success: true,
      message: '工具创建成功',
      data: newTool,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: '数据验证失败',
        errors: error.issues,
      }, { status: 400 });
    }

    console.error('创建工具失败:', error);
    return NextResponse.json(
      { success: false, message: '创建工具失败' },
      { status: 500 },
    );
  }
}

// PUT - 更新工具
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({
        success: false,
        message: '工具ID不能为空',
      }, { status: 400 });
    }

    const toolIndex = tools.findIndex(tool => tool.id === id);
    if (toolIndex === -1) {
      return NextResponse.json({
        success: false,
        message: '工具不存在',
      }, { status: 404 });
    }

    // 验证更新数据
    const validatedData = ToolSchema.partial().parse(updateData);

    // 更新工具
    const updatedTool: ToolItem = {
      ...tools[toolIndex]!,
      ...validatedData,
      tags: validatedData.tags ?? tools[toolIndex]!.tags,
      developer: validatedData.developer ?? tools[toolIndex]!.developer,
      updatedAt: new Date().toISOString(),
    };

    tools[toolIndex] = updatedTool;

    return NextResponse.json({
      success: true,
      message: '工具更新成功',
      data: tools[toolIndex],
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: '数据验证失败',
        errors: error.issues,
      }, { status: 400 });
    }

    console.error('更新工具失败:', error);
    return NextResponse.json(
      { success: false, message: '更新工具失败' },
      { status: 500 },
    );
  }
}

// DELETE - 删除工具
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        message: '工具ID不能为空',
      }, { status: 400 });
    }

    const toolIndex = tools.findIndex(tool => tool.id === id);
    if (toolIndex === -1) {
      return NextResponse.json({
        success: false,
        message: '工具不存在',
      }, { status: 404 });
    }

    // 软删除 - 设置状态为不活跃
    tools[toolIndex] = {
      ...tools[toolIndex]!,
      isActive: false,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: '工具删除成功',
    });
  } catch (error) {
    console.error('删除工具失败:', error);
    return NextResponse.json(
      { success: false, message: '删除工具失败' },
      { status: 500 },
    );
  }
}
