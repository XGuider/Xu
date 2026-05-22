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

    // #region agent log
    fetch('http://127.0.0.1:7518/ingest/fc43bbf8-4676-4620-a8bd-026decddd0c4', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '8a8b40' },
      body: JSON.stringify({
        sessionId: '8a8b40',
        hypothesisId: 'H3',
        location: 'api/wechat/official/route.ts:GET:entry',
        message: 'wechat official GET entry',
        data: { cwd: process.cwd(), category, keyword, page, limit },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    const [listResult, stats] = await Promise.all([
      getList('official', { category, keyword, page, limit }),
      getCategoryStats('official'),
    ]);

    // #region agent log
    fetch('http://127.0.0.1:7518/ingest/fc43bbf8-4676-4620-a8bd-026decddd0c4', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '8a8b40' },
      body: JSON.stringify({
        sessionId: '8a8b40',
        hypothesisId: 'H4',
        location: 'api/wechat/official/route.ts:GET:success',
        message: 'wechat official GET ok',
        data: { listLen: listResult.list.length, statsKeys: Object.keys(stats).length },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    return NextResponse.json({
      success: true,
      data: {
        list: listResult.list,
        stats,
        pagination: listResult.pagination,
      },
    });
  } catch (error) {
    console.error('[api/wechat/official GET]', error);

    // #region agent log
    fetch('http://127.0.0.1:7518/ingest/fc43bbf8-4676-4620-a8bd-026decddd0c4', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '8a8b40' },
      body: JSON.stringify({
        sessionId: '8a8b40',
        hypothesisId: 'H4',
        location: 'api/wechat/official/route.ts:GET:catch',
        message: 'wechat official GET error',
        data: {
          cwd: process.cwd(),
          err: error instanceof Error ? error.message : String(error),
          name: error instanceof Error ? error.name : 'unknown',
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    return NextResponse.json(
      { success: false, message: '读取公众号数据失败' },
      { status: 500 },
    );
  }
}
