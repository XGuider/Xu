import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getActiveCategories } from '@/services/categoryService';

export async function GET(_request: NextRequest) {
  try {
    const categories = await getActiveCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('获取分类数据失败:', error);
    return NextResponse.json(
      { error: '获取分类数据失败' },
      { status: 500 },
    );
  }
}
