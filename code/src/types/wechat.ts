/** 微信公众号条目（与 doc/xiaochengxu 一致） */
export type OfficialAccount = {
  id: string;
  name: string;
  desc: string;
  category: string;
  crawlTime: string;
};

/** 微信小程序条目 */
export type MiniProgram = {
  id: string;
  name: string;
  appId: string;
  desc: string;
  category: string;
  crawlTime: string;
};

export type WechatKind = 'official' | 'mini';

/** 抓取去重日志 */
export type CrawlLog = {
  official: string[];
  mini: string[];
};

/** 关键词 → 业务侧唯一 id 列表 */
export type WechatSearchIndex = Record<string, string[]>;

export type WechatListItem = OfficialAccount | MiniProgram;

export type WechatCategoryStats = Record<string, number>;

export type WechatPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
