import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { join } from 'node:path';
import { deleteById, getCategoryStats, getList } from '@/services/wechatDataService';

const execAsync = promisify(execFile);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    const keyword = searchParams.get('keyword') || '';
    const page = Number.parseInt(searchParams.get('page') || '1', 10);
    const limit = Number.parseInt(searchParams.get('limit') || '20', 10);

    const [listResult, stats] = await Promise.all([
      getList('official', { category, keyword, page, limit }),
      getCategoryStats('official'),
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
    console.error('[api/wechat/official GET]', error);
    return NextResponse.json(
      { success: false, message: '读取公众号数据失败' },
      { status: 500 },
    );
  }
}

export async function POST() {
  try {
    const projectRoot = join(process.cwd(), '..');
    const pythonScript = join(projectRoot, 'cornjob', 'wechat_crawl.py');

    console.log('[api/wechat/official POST] 开始抓取公众号数据...');

    const { stdout, stderr } = await execAsync('python', [pythonScript], {
      cwd: projectRoot,
      env: {
        ...process.env,
        WECHAT_CRAWL_KIND: 'official',
        PYTHONPATH: projectRoot,
      },
      timeout: 300000,
    });

    if (stderr) {
      console.warn('[api/wechat/official POST] 警告:', stderr);
    }

    console.log('[api/wechat/official POST] 抓取完成:', stdout);

    return NextResponse.json({
      success: true,
      message: '公众号数据抓取完成',
      data: { output: stdout.trim() },
    });
  } catch (error) {
    console.error('[api/wechat/official POST] 抓取失败:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, message: `抓取公众号数据失败: ${errorMessage}` },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { success: false, message: '缺少 ID 参数' },
        { status: 400 },
      );
    }

    const deleted = await deleteById('official', id);
    if (deleted) {
      return NextResponse.json({ success: true, message: '删除成功' });
    } else {
      return NextResponse.json(
        { success: false, message: '删除失败，数据不存在' },
        { status: 404 },
      );
    }
  } catch (error) {
    console.error('[api/wechat/official DELETE]', error);
    return NextResponse.json(
      { success: false, message: '删除公众号数据失败' },
      { status: 500 },
    );
  }
}
