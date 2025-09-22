import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  createCategory,
  deleteCategory,
  getActiveCategories,
  getAllCategories,
  updateCategory,
} from '@/services/categoryService';

// 分类验证模式
const CategorySchema = z.object({
  name: z.string().min(1, '分类名称不能为空'),
  slug: z.string().min(1, '分类标识不能为空'),
  description: z.string().optional(),
  icon: z.string().optional(),
  sort: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

// GET - 获取分类列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const categories = includeInactive
      ? await getAllCategories()
      : await getActiveCategories();

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('获取分类数据失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取分类数据失败',
        message: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 },
    );
  }
}

// POST - 创建新分类
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证输入数据
    const validatedData = CategorySchema.parse(body);

    // 创建分类
    const newCategory = await createCategory(validatedData);

    return NextResponse.json({
      success: true,
      message: '分类创建成功',
      data: newCategory,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: '数据验证失败',
        errors: error.issues,
      }, { status: 400 });
    }

    console.error('创建分类失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '创建分类失败',
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 },
    );
  }
}

// PUT - 更新分类
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({
        success: false,
        message: '分类ID不能为空',
      }, { status: 400 });
    }

    // 验证更新数据
    const validatedData = CategorySchema.partial().parse(updateData);

    // 更新分类
    const updatedCategory = await updateCategory(id, validatedData);

    if (!updatedCategory) {
      return NextResponse.json({
        success: false,
        message: '分类不存在',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: '分类更新成功',
      data: updatedCategory,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: '数据验证失败',
        errors: error.issues,
      }, { status: 400 });
    }

    console.error('更新分类失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '更新分类失败',
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 },
    );
  }
}

// DELETE - 删除分类
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        message: '分类ID不能为空',
      }, { status: 400 });
    }

    // 删除分类
    const success = await deleteCategory(id);

    if (!success) {
      return NextResponse.json({
        success: false,
        message: '分类不存在或删除失败',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: '分类删除成功',
    });
  } catch (error) {
    console.error('删除分类失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '删除分类失败',
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 },
    );
  }
}
