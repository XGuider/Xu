import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { 
  getTools, 
  createTool, 
  updateTool, 
  deleteTool,
  type CreateToolData,
  type UpdateToolData 
} from '@/services/toolService';

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

// GET - 获取工具列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get('page') || '1');
    const limit = Number.parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';

    const result = await getTools({
      page,
      limit,
      search: search || undefined,
      category: category || undefined,
      status: status || undefined,
    });

    return NextResponse.json({
      success: true,
      data: result,
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

    const newTool = await createTool(validatedData as CreateToolData);

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

    // 验证更新数据
    const validatedData = ToolSchema.partial().parse(updateData);

    const updatedTool = await updateTool(id, validatedData as UpdateToolData);

    if (!updatedTool) {
      return NextResponse.json({
        success: false,
        message: '工具不存在',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: '工具更新成功',
      data: updatedTool,
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

    const success = await deleteTool(id);

    if (!success) {
      return NextResponse.json({
        success: false,
        message: '工具不存在',
      }, { status: 404 });
    }

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
