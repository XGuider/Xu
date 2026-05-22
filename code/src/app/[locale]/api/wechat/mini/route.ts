import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getCategoryStats, getList } from '@/services/wechatDataService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    const keyword = searchParams.get('keyword') || '';
    const page = Number.parseInt(searchParams.get('page') || '1', 10);
    const limit = Number.parseInt(searchParams.get('limit') || '20', 10);

    const [listResult, stats] = await Promise.all([
      getList('mini', { category, keyword, page, limit }),
      getCategoryStats('mini'),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        list: listResult.list,
        stats,
        pagination: listResult.pagination,
      },
    });
  } catch (error) {
    console.error('[api/wechat/mini GET]', error);
    return NextResponse.json(
      { success: false, message: '读取小程序数据失败' },
      { status: 500 },
    );
  }
}
