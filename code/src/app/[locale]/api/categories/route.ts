import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createCategory, getCategories, updateCategory } from '@/services/fileDataService';
import { createCategorySchema, updateCategorySchema } from '@/validations/categoryValidation';

// GET - 获取分类列表
export async function GET() {
  try {
    const categories = await getCategories();

    // 只返回活跃的分类
    const activeCategories = categories.filter(cat => cat.isActive);

    return NextResponse.json({
      success: true,
      data: activeCategories,
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

    // 验证请求数据
    const validationResult = createCategorySchema.safeParse(body);
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

    // 创建分类
    const category = await createCategory(validationResult.data);

    return NextResponse.json({
      success: true,
      data: category,
      message: '分类创建成功',
    }, { status: 201 });
  } catch (error) {
    console.error('创建分类失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '创建分类失败',
        message: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 },
    );
  }
}

// PUT - 更新分类
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证请求数据
    const validationResult = updateCategorySchema.safeParse(body);
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

    // 更新分类
    const category = await updateCategory(validationResult.data);

    return NextResponse.json({
      success: true,
      data: category,
      message: '分类更新成功',
    });
  } catch (error) {
    console.error('更新分类失败:', error);

    // 检查是否是404错误（分类不存在）
    if (error instanceof Error && error.message.includes('不存在')) {
      return NextResponse.json(
        {
          success: false,
          error: '分类不存在',
          message: error.message,
        },
        { status: 404 },
      );
    }

    // 检查是否是400错误（slug已存在）
    if (error instanceof Error && error.message.includes('已存在')) {
      return NextResponse.json(
        {
          success: false,
          error: '数据冲突',
          message: error.message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: '更新分类失败',
        message: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 },
    );
  }
}
