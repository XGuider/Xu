import type {
  CrawlLog,
  WechatCategoryStats,
  WechatKind,
  WechatListItem,
  WechatPagination,
  WechatSearchIndex,
} from '@/types/wechat';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const DATA_DIR = join(process.cwd(), 'data');
const OFFICIAL_DIR = join(DATA_DIR, 'official-accounts');
const MINI_DIR = join(DATA_DIR, 'mini-programs');
const CRAWL_LOG_FILE = join(DATA_DIR, 'crawl-log.json');
const SEARCH_INDEX_FILE = join(DATA_DIR, 'wechat-search-index.json');

const CATEGORY_ORDER = ['科技', '教育', '工具', '电商', '生活', '财经', '其他'] as const;

const KEYWORD_RULES: { category: string; keywords: string[] }[] = [
  { category: '科技', keywords: ['科技', '前端', 'AI', '程序员', '技术', '开发', '算法'] },
  { category: '教育', keywords: ['教育', '学习', '考研', '课程', '读书', '知识'] },
  { category: '工具', keywords: ['工具', '效率', '神器', '办公', '计算器'] },
  { category: '电商', keywords: ['电商', '购物', '商城', '团购', '外卖'] },
  { category: '生活', keywords: ['美食', '旅行', '健康', '生活', '家居'] },
  { category: '财经', keywords: ['财经', '股票', '基金', '理财', '投资'] },
];

function categoryFileName(category: string): string {
  const safe = category.replace(/[/\\?*:|"<>]/g, '_').trim() || '其他';
  return `${safe}.json`;
}

/** 初始化微信数据目录与日志文件 */
export async function initDirs(): Promise<void> {
  await mkdir(OFFICIAL_DIR, { recursive: true });
  await mkdir(MINI_DIR, { recursive: true });
  try {
    await readFile(CRAWL_LOG_FILE, 'utf-8');
  } catch {
    const empty: CrawlLog = { official: [], mini: [] };
    await writeFile(CRAWL_LOG_FILE, `${JSON.stringify(empty, null, 2)}\n`, 'utf-8');
  }
}

/** 根据名称+描述关键词自动分类 */
export function autoCategory(text: string): string {
  const t = text.toLowerCase();
  for (const rule of KEYWORD_RULES) {
    if (rule.keywords.some(kw => t.includes(kw.toLowerCase()))) {
      return rule.category;
    }
  }
  return '其他';
}

async function readCrawlLog(): Promise<CrawlLog> {
  await initDirs();
  try {
    const raw = await readFile(CRAWL_LOG_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<CrawlLog>;
    return {
      official: Array.isArray(parsed.official) ? parsed.official : [],
      mini: Array.isArray(parsed.mini) ? parsed.mini : [],
    };
  } catch {
    return { official: [], mini: [] };
  }
}

async function writeCrawlLog(log: CrawlLog): Promise<void> {
  await writeFile(CRAWL_LOG_FILE, `${JSON.stringify(log, null, 2)}\n`, 'utf-8');
}

/** 判断业务 ID 是否已在抓取日志中 */
export async function isDuplicate(kind: WechatKind, id: string): Promise<boolean> {
  const log = await readCrawlLog();
  const bucket = kind === 'official' ? log.official : log.mini;
  return bucket.includes(id);
}

/** 记录已成功写入的业务 ID */
export async function logCrawled(kind: WechatKind, id: string): Promise<void> {
  const log = await readCrawlLog();
  const bucket = kind === 'official' ? log.official : log.mini;
  if (!bucket.includes(id)) {
    bucket.push(id);
  }
  await writeCrawlLog(log);
}

function dirFor(kind: WechatKind): string {
  return kind === 'official' ? OFFICIAL_DIR : MINI_DIR;
}

async function readCategoryFile(kind: WechatKind, category: string): Promise<WechatListItem[]> {
  const file = join(dirFor(kind), categoryFileName(category));
  try {
    const raw = await readFile(file, 'utf-8');
    const arr = JSON.parse(raw) as unknown;
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

async function writeCategoryFile(kind: WechatKind, category: string, list: WechatListItem[]): Promise<void> {
  const file = join(dirFor(kind), categoryFileName(category));
  await writeFile(file, `${JSON.stringify(list, null, 2)}\n`, 'utf-8');
}

/** 单条写入：分类文件内按 id 二次去重 */
export async function saveData(kind: WechatKind, item: WechatListItem): Promise<boolean> {
  await initDirs();
  const category = item.category || '其他';
  const list = await readCategoryFile(kind, category);
  if (list.some(row => row.id === item.id)) {
    return false;
  }
  list.push(item);
  await writeCategoryFile(kind, category, list);
  return true;
}

function tokenizeForIndex(text: string): string[] {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) {
    return [];
  }
  const parts = cleaned.split(/[,，.。;；、\s]+/).filter(Boolean);
  const tokens = new Set<string>();
  for (const p of parts) {
    const w = p.trim();
    if (w.length >= 2) {
      tokens.add(w.toLowerCase());
    }
    if (w.length >= 1 && /[a-z\d]{2,}/i.test(w)) {
      tokens.add(w.toLowerCase());
    }
  }
  return [...tokens];
}

/** 遍历本地 JSON 构建倒排索引（关键词 → id） */
export async function buildSearchIndex(): Promise<void> {
  await initDirs();
  const index: WechatSearchIndex = {};

  async function ingest(kind: WechatKind): Promise<void> {
    const base = dirFor(kind);
    let names: string[] = [];
    try {
      names = await readdir(base);
    } catch {
      return;
    }
    for (const name of names) {
      if (!name.endsWith('.json')) {
        continue;
      }
      const raw = await readFile(join(base, name), 'utf-8');
      let list: WechatListItem[] = [];
      try {
        list = JSON.parse(raw) as WechatListItem[];
        if (!Array.isArray(list)) {
          continue;
        }
      } catch {
        continue;
      }
      for (const row of list) {
        const blob = `${row.name} ${row.desc} ${'appId' in row ? row.appId : ''}`;
        const tokens = tokenizeForIndex(blob);
        for (const t of tokens) {
          if (!index[t]) {
            index[t] = [];
          }
          if (!index[t].includes(row.id)) {
            index[t].push(row.id);
          }
        }
      }
    }
  }

  await ingest('official');
  await ingest('mini');
  await writeFile(SEARCH_INDEX_FILE, `${JSON.stringify(index, null, 2)}\n`, 'utf-8');
}

async function loadAllItems(kind: WechatKind): Promise<WechatListItem[]> {
  await initDirs();
  const base = dirFor(kind);
  let names: string[] = [];
  try {
    names = await readdir(base);
  } catch {
    return [];
  }
  const out: WechatListItem[] = [];
  for (const name of names) {
    if (!name.endsWith('.json')) {
      continue;
    }
    try {
      const raw = await readFile(join(base, name), 'utf-8');
      const arr = JSON.parse(raw) as unknown;
      if (Array.isArray(arr)) {
        out.push(...arr);
      }
    } catch {
      /* skip corrupt file */
    }
  }
  return out;
}

function matchesKeyword(row: WechatListItem, keyword: string): boolean {
  const k = keyword.trim().toLowerCase();
  if (!k) {
    return true;
  }
  const base = `${row.name} ${row.desc}`.toLowerCase();
  if (base.includes(k)) {
    return true;
  }
  if ('appId' in row && row.appId.toLowerCase().includes(k)) {
    return true;
  }
  return false;
}

/** 列表 + 分类筛选 + 关键词 + 分页 */
export async function getList(
  kind: WechatKind,
  options: { category?: string; keyword?: string; page?: number; limit?: number },
): Promise<{ list: WechatListItem[]; pagination: WechatPagination }> {
  await initDirs();
  const category = (options.category || 'all').trim();
  const keyword = (options.keyword || '').trim();
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.min(100, Math.max(1, options.limit ?? 20));

  let rows: WechatListItem[] = [];
  if (category === 'all' || category === '') {
    rows = await loadAllItems(kind);
  } else {
    rows = await readCategoryFile(kind, category);
  }

  if (keyword) {
    rows = rows.filter(r => matchesKeyword(r, keyword));
  }

  rows.sort((a, b) => (a.crawlTime < b.crawlTime ? 1 : -1));

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const list = rows.slice(start, start + limit);

  return {
    list,
    pagination: { page, limit, total, totalPages },
  };
}

/** 各分类条目数量统计 */
export async function getCategoryStats(kind: WechatKind): Promise<WechatCategoryStats> {
  await initDirs();
  const stats: WechatCategoryStats = {};
  for (const c of CATEGORY_ORDER) {
    stats[c] = 0;
  }
  const base = dirFor(kind);
  let names: string[] = [];
  try {
    names = await readdir(base);
  } catch {
    return stats;
  }
  for (const name of names) {
    if (!name.endsWith('.json')) {
      continue;
    }
    const cat = name.slice(0, -'.json'.length);
    const list = await readCategoryFile(kind, cat);
    stats[cat] = list.length;
  }
  return stats;
}
