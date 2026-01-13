import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createTool, getFeaturedTools, getToolById, getTools, getToolsByCategoryId, searchTools, updateTool } from '@/services/fileDataService';
import { createToolSchema, updateToolSchema } from '@/validations/toolValidation';

// GET - 获取工具列表或单个工具（仅读取本地文件数据）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // 如果提供了 id 参数，返回单个工具
    if (id) {
      const tool = await getToolById(id);
      if (!tool) {
        return NextResponse.json(
          {
            success: false,
            message: '工具不存在',
            error: '未找到指定的工具',
          },
          { status: 404 },
        );
      }
      return NextResponse.json({
        success: true,
        data: {
          tools: [tool],
        },
      });
    }

    // 否则返回工具列表
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const featured = searchParams.get('featured') === 'true';
    const page = Number.parseInt(searchParams.get('page') || '1');
    const limit = Number.parseInt(searchParams.get('limit') || '10');

    let tools = await getTools();

    // 应用筛选条件
    if (featured) {
      tools = await getFeaturedTools(limit);
    } else if (category) {
      tools = await getToolsByCategoryId(Number.parseInt(category));
    } else if (search) {
      tools = await searchTools(search);
    }

    // 只返回活跃的工具
    tools = tools.filter(tool => tool.isActive);

    // 分页处理
    const offset = (page - 1) * limit;
    const paginatedTools = tools.slice(offset, offset + limit);
    const total = tools.length;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        tools: paginatedTools,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    });
  } catch (error) {
    console.error('获取工具列表失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取工具列表失败',
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 },
    );
  }
}

// POST - 创建新工具
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证请求数据
    const validationResult = createToolSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: '数据验证失败',
          message: '请检查输入数据',
          details: validationResult.error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 },
      );
    }

    // 创建工具
    const tool = await createTool(validationResult.data);

    return NextResponse.json({
      success: true,
      data: tool,
      message: '工具创建成功',
    }, { status: 201 });
  } catch (error) {
    console.error('创建工具失败:', error);

    // 检查是否是400错误（分类不存在）
    if (error instanceof Error && error.message.includes('不存在')) {
      return NextResponse.json(
        {
          success: false,
          error: '分类不存在',
          message: error.message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: '创建工具失败',
        message: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 },
    );
  }
}

// PUT - 更新工具
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证请求数据
    const validationResult = updateToolSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: '数据验证失败',
          message: '请检查输入数据',
          details: validationResult.error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 },
      );
    }

    // 更新工具
    const tool = await updateTool(validationResult.data);

    return NextResponse.json({
      success: true,
      data: tool,
      message: '工具更新成功',
    });
  } catch (error) {
    console.error('更新工具失败:', error);

    // 检查是否是404错误（工具不存在）
    if (error instanceof Error && error.message.includes('不存在')) {
      return NextResponse.json(
        {
          success: false,
          error: '工具不存在',
          message: error.message,
        },
        { status: 404 },
      );
    }

    // 检查是否是400错误（分类不存在）
    if (error instanceof Error && error.message.includes('分类') && error.message.includes('不存在')) {
      return NextResponse.json(
        {
          success: false,
          error: '分类不存在',
          message: error.message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: '更新工具失败',
        message: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 },
    );
  }
}
