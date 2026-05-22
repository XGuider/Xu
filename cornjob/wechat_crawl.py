"""
微信公众号 / 微信小程序数据抓取

对齐 crawel.py 的流程：
- 多 AI 提供者顺序调用（AIProviderFactory）
- 提示词中带「已有名称列表」减少重复生成
- 本地合并去重（不使用 AI merge）
- 写入 code/data 下按分类拆分的 JSON，并重建 crawl-log 与 wechat-search-index

环境变量（可选）：
- WECHAT_CRAWL_CONTENT: 附加主题说明，写入提示词
- WECHAT_CRAWL_PROVIDERS: 逗号分隔提供者，默认 siliconflow（与 crawel.py 默认一致）
- WECHAT_KIND: all | official | mini，默认 all
- EXISTING_WECHAT_NAMES_LIMIT: 已有名称传入模型的上限，默认 300
"""
from __future__ import annotations

import hashlib
import json
import logging
import os
import re
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple

try:
    from .factory import AIProviderFactory
    from .base import AIResponse
    from .config import ConfigManager
except (ImportError, ValueError):
    sys.path.insert(0, str(Path(__file__).parent))
    from factory import AIProviderFactory
    from base import AIResponse
    from config import ConfigManager

logger = logging.getLogger(__name__)

_data_dir = ConfigManager.get_data_config("data_dir", "/code/data")
if Path(_data_dir).is_absolute():
    DATA_DIR = Path(_data_dir)
else:
    DATA_DIR = Path(__file__).parent.parent / _data_dir

OFFICIAL_DIR = DATA_DIR / "official-accounts"
MINI_DIR = DATA_DIR / "mini-programs"
CRAWL_LOG_FILE = DATA_DIR / "crawl-log.json"
SEARCH_INDEX_FILE = DATA_DIR / "wechat-search-index.json"

VALID_CATEGORIES = ("科技", "教育", "工具", "电商", "生活", "财经", "其他")

MAX_CONTENT_LENGTH = int(
    os.getenv("MAX_CONTENT_LENGTH", str(ConfigManager.get_crawler_config("max_content_length", 15000)))
)

OFFICIAL_PROMPT_TEMPLATE = """
# Background
你是微信生态数据整理助手，负责产出「微信公众号」示例数据集（公开可查的账号介绍信息风格）。

# Objective
请生成若干 **微信公众号** 条目，每条包含：
1. name（账号名称，简短）
2. desc（功能或内容描述，10-80 字）
3. category（必须是以下之一：科技、教育、工具、电商、生活、财经、其他）

# Output
仅返回 JSON 数组，不要 markdown，不要注释。至少 15 条，示例：
[
  {{"name": "示例科技讯", "desc": "聚焦人工智能与前沿科技解读。", "category": "科技"}}
]

# Theme / extra instructions
{content}

{existing_block}
"""

MINI_PROMPT_TEMPLATE = """
# Background
你是微信生态数据整理助手，负责产出「微信小程序」条目。

# Objective
每条包含：
1. name（小程序名称）
2. appId（微信小程序 appId，格式一般为 wx 开头的 18 位字符；若不确定可生成合理占位如 wx + 16 位十六进制）
3. desc（功能描述，10-80 字）
4. category（必须是：科技、教育、工具、电商、生活、财经、其他）

# Output
仅返回 JSON 数组，不要 markdown。至少 15 条。

# Theme / extra instructions
{content}

{existing_block}
"""


def normalize_name_key(name: str) -> str:
    if not isinstance(name, str):
        return ""
    value = name.strip().lower()
    if not value:
        return ""
    value = re.sub(
        r"[\s\-_·•\.\,，/\\\(\)\[\]\{\}<>:：;；'\"“”‘’`~!@#$%^&*+=?|]+",
        "",
        value,
    )
    return value


def normalize_app_id(app_id: str) -> str:
    if not isinstance(app_id, str):
        return ""
    return app_id.strip().lower()


def stable_official_id(name_key: str) -> str:
    h = hashlib.md5(name_key.encode("utf-8")).hexdigest()[:12]
    return f"oa-{h}"


def stable_mini_id(app_id: str, name_key: str) -> str:
    aid = normalize_app_id(app_id)
    if re.fullmatch(r"wx[0-9a-f]{16}", aid):
        return aid
    raw = aid if aid else name_key
    h = hashlib.md5(raw.encode("utf-8")).hexdigest()[:12]
    return f"mp-{h}"


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def category_file_name(category: str) -> str:
    safe = re.sub(r'[/\\?*:|"<>]', "_", category.strip() or "其他") or "其他"
    return f"{safe}.json"


def clip_prompt(text: str) -> str:
    if len(text) <= MAX_CONTENT_LENGTH:
        return text
    return text[: MAX_CONTENT_LENGTH - 20] + "\n...(truncated)"


def strip_json_fence(content: str) -> str:
    content = content.strip()
    if content.startswith("```"):
        lines = content.split("\n")
        if len(lines) >= 2 and lines[0].strip().startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        content = "\n".join(lines)
    return content.strip()


def parse_ai_response_array(response: AIResponse) -> List[Dict[str, Any]]:
    if not response.success:
        logger.warning("AI 响应失败: %s", response.error_message)
        return []
    try:
        raw = strip_json_fence(response.content)
        data = json.loads(raw)
        if isinstance(data, dict):
            data = [data]
        if not isinstance(data, list):
            return []
        return [x for x in data if isinstance(x, dict)]
    except json.JSONDecodeError as e:
        logger.error("解析 JSON 失败: %s", e)
        return []


def normalize_category(cat: Any) -> str:
    if not isinstance(cat, str):
        return "其他"
    c = cat.strip()
    return c if c in VALID_CATEGORIES else "其他"


def parse_official_items(rows: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    for item in rows:
        name = str(item.get("name", "")).strip()
        desc = str(item.get("desc", "") or item.get("description", "")).strip()
        if not name or not desc:
            continue
        out.append(
            {
                "name": name,
                "desc": desc,
                "category": normalize_category(item.get("category")),
            }
        )
    return out


def parse_mini_items(rows: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    for item in rows:
        name = str(item.get("name", "")).strip()
        desc = str(item.get("desc", "") or item.get("description", "")).strip()
        app_id = str(item.get("appId", "") or item.get("appid", "")).strip()
        if not name or not desc:
            continue
        if not app_id:
            app_id = f"wx{hashlib.md5(name.encode()).hexdigest()[:16]}"
        out.append(
            {
                "name": name,
                "appId": app_id,
                "desc": desc,
                "category": normalize_category(item.get("category")),
            }
        )
    return out


def attach_official_meta(rows: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    res = []
    for r in rows:
        nk = normalize_name_key(r["name"])
        rid = stable_official_id(nk) if nk else stable_official_id(r["name"])
        res.append(
            {
                "id": rid,
                "name": r["name"],
                "desc": r["desc"],
                "category": r["category"],
                "crawlTime": utc_now_iso(),
            }
        )
    return res


def attach_mini_meta(rows: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    res = []
    for r in rows:
        nk = normalize_name_key(r["name"])
        rid = stable_mini_id(r["appId"], nk or r["name"])
        res.append(
            {
                "id": rid,
                "name": r["name"],
                "appId": r["appId"],
                "desc": r["desc"],
                "category": r["category"],
                "crawlTime": utc_now_iso(),
            }
        )
    return res


def choose_longer_desc(a: Dict[str, Any], b: Dict[str, Any]) -> Dict[str, Any]:
    m = a.copy()
    if len(str(b.get("desc", "")).strip()) > len(str(a.get("desc", "")).strip()):
        m["desc"] = b["desc"]
    if a.get("category") == "其他" and b.get("category") != "其他":
        m["category"] = b["category"]
    m["crawlTime"] = utc_now_iso()
    return m


def merge_row_keep_id(primary: Dict[str, Any], secondary: Dict[str, Any]) -> Dict[str, Any]:
    m = choose_longer_desc(primary, secondary)
    m["id"] = primary.get("id") or secondary.get("id")
    ap = primary.get("appId")
    bp = secondary.get("appId")
    if ap or bp:
        m["appId"] = ap or bp
    return m


def merge_official(existing: List[Dict[str, Any]], incoming: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    by_key: Dict[str, Dict[str, Any]] = {}
    for row in existing:
        nk = normalize_name_key(row.get("name", ""))
        if not nk:
            continue
        by_key[nk] = row.copy()
    for row in incoming:
        nk = normalize_name_key(row.get("name", ""))
        if not nk:
            continue
        if nk not in by_key:
            by_key[nk] = row.copy()
        else:
            by_key[nk] = merge_row_keep_id(by_key[nk], row)
    return list(by_key.values())


def mini_merge_key(row: Dict[str, Any]) -> str:
    aid = normalize_app_id(str(row.get("appId", "")))
    if re.fullmatch(r"wx[0-9a-f]{16}", aid):
        return f"aid:{aid}"
    nk = normalize_name_key(str(row.get("name", "")))
    return f"name:{nk}" if nk else ""


def merge_mini(existing: List[Dict[str, Any]], incoming: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    by_k: Dict[str, Dict[str, Any]] = {}
    for row in existing + incoming:
        k = mini_merge_key(row)
        if not k:
            continue
        if k not in by_k:
            by_k[k] = row.copy()
        else:
            by_k[k] = merge_row_keep_id(by_k[k], row)
    return list(by_k.values())


def load_json_dir(dir_path: Path) -> List[Dict[str, Any]]:
    if not dir_path.exists():
        return []
    rows: List[Dict[str, Any]] = []
    for fp in sorted(dir_path.glob("*.json")):
        try:
            data = json.loads(fp.read_text(encoding="utf-8"))
            if isinstance(data, list):
                rows.extend([x for x in data if isinstance(x, dict)])
        except Exception as e:
            logger.warning("跳过损坏文件 %s: %s", fp, e)
    return rows


def wipe_and_save_by_category(dir_path: Path, rows: List[Dict[str, Any]]) -> None:
    dir_path.mkdir(parents=True, exist_ok=True)
    for fp in dir_path.glob("*.json"):
        fp.unlink()
    groups: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
    for row in rows:
        cat = normalize_category(row.get("category"))
        row["category"] = cat
        groups[cat].append(row)
    for cat, lst in groups.items():
        lst.sort(key=lambda x: str(x.get("name", "")))
        path = dir_path / category_file_name(cat)
        path.write_text(json.dumps(lst, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        logger.info("写入 %s (%s 条)", path, len(lst))


def rebuild_crawl_log() -> None:
    official = load_json_dir(OFFICIAL_DIR)
    mini = load_json_dir(MINI_DIR)
    log = {
        "official": sorted({str(x.get("id", "")) for x in official if x.get("id")}),
        "mini": sorted({str(x.get("id", "")) for x in mini if x.get("id")}),
    }
    CRAWL_LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
    CRAWL_LOG_FILE.write_text(json.dumps(log, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def tokenize(text: str) -> List[str]:
    cleaned = re.sub(r"\s+", " ", text).strip()
    if not cleaned:
        return []
    parts = re.split(r"[,，.。;；、\s]+", cleaned)
    tokens: Set[str] = set()
    for p in parts:
        w = p.strip()
        if len(w) >= 2:
            tokens.add(w.lower())
        if w and re.search(r"[a-z\d]{2,}", w, re.I):
            tokens.add(w.lower())
    return sorted(tokens)


def rebuild_search_index() -> None:
    index: Dict[str, List[str]] = defaultdict(list)
    all_rows: List[Dict[str, Any]] = load_json_dir(OFFICIAL_DIR) + load_json_dir(MINI_DIR)
    for row in all_rows:
        rid = str(row.get("id", ""))
        if not rid:
            continue
        blob = f"{row.get('name', '')} {row.get('desc', '')} {row.get('appId', '')}"
        for tok in tokenize(blob):
            index[tok].append(rid)
    for tok in list(index.keys()):
        seen: Set[str] = set()
        deduped: List[str] = []
        for i in index[tok]:
            if i not in seen:
                seen.add(i)
                deduped.append(i)
        index[tok] = deduped
    SEARCH_INDEX_FILE.write_text(
        json.dumps(dict(sorted(index.items())), ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def existing_names_block(
    label: str,
    names: List[str],
) -> str:
    if not names:
        return ""
    limit = int(os.getenv("EXISTING_WECHAT_NAMES_LIMIT", "300"))
    clipped = names[:limit]
    lines = "\n".join(f"- {n}" for n in clipped)
    return (
        f"\n\n# Existing ({label})\n"
        f"以下名称已存在，请勿重复返回相同或极度相似的条目：\n{lines}\n"
    )


class WechatDataFetcher:
    def __init__(self, providers: Optional[List[str]] = None):
        self.providers = providers or AIProviderFactory.get_available_providers()
        logger.info("WechatDataFetcher 提供者: %s", self.providers)

    def _providers_to_use(self, use_all: bool) -> List[str]:
        if use_all:
            return list(self.providers)
        return [self.providers[0]] if self.providers else []

    def extract_official(
        self,
        content: str,
        existing_names: List[str],
        use_all_providers: bool,
    ) -> List[Dict[str, Any]]:
        block = existing_names_block("公众号名称", existing_names)
        prompt = clip_prompt(OFFICIAL_PROMPT_TEMPLATE.format(content=content or "覆盖多个垂直领域。", existing_block=block))
        keys: Set[str] = set(normalize_name_key(n) for n in existing_names if normalize_name_key(n))
        merged_raw: List[Dict[str, Any]] = []
        for pname in self._providers_to_use(use_all_providers):
            try:
                provider = AIProviderFactory.create_provider(pname)
                if provider is None:
                    continue
                logger.info("公众号提取: 调用 %s", pname)
                resp = provider.chat(prompt)
                rows = parse_ai_response_array(resp)
                items = parse_official_items(rows)
                kept = []
                for it in items:
                    nk = normalize_name_key(it["name"])
                    if nk and nk in keys:
                        continue
                    kept.append(it)
                    if nk:
                        keys.add(nk)
                merged_raw.extend(kept)
                logger.info("%s 返回公众号候选 %s 条（过滤后 %s）", pname, len(items), len(kept))
            except Exception:
                logger.exception("公众号提取失败 provider=%s", pname)
        return attach_official_meta(merged_raw)

    def extract_mini(
        self,
        content: str,
        existing_names: List[str],
        use_all_providers: bool,
    ) -> List[Dict[str, Any]]:
        block = existing_names_block("小程序名称", existing_names)
        prompt = clip_prompt(MINI_PROMPT_TEMPLATE.format(content=content or "覆盖工具、电商、教育等常见小程序。", existing_block=block))
        name_keys: Set[str] = set(normalize_name_key(n) for n in existing_names if normalize_name_key(n))
        merged_raw: List[Dict[str, Any]] = []
        for pname in self._providers_to_use(use_all_providers):
            try:
                provider = AIProviderFactory.create_provider(pname)
                if provider is None:
                    continue
                logger.info("小程序提取: 调用 %s", pname)
                resp = provider.chat(prompt)
                rows = parse_ai_response_array(resp)
                items = parse_mini_items(rows)
                kept = []
                for it in items:
                    nk = normalize_name_key(it["name"])
                    if nk and nk in name_keys:
                        continue
                    kept.append(it)
                    if nk:
                        name_keys.add(nk)
                merged_raw.extend(kept)
                logger.info("%s 返回小程序候选 %s 条（过滤后 %s）", pname, len(items), len(kept))
            except Exception:
                logger.exception("小程序提取失败 provider=%s", pname)
        return attach_mini_meta(merged_raw)

    def run_official(self, content: str, use_all_providers: bool) -> None:
        existing = load_json_dir(OFFICIAL_DIR)
        names = [str(x.get("name", "")).strip() for x in existing if x.get("name")]
        fresh = self.extract_official(content, names, use_all_providers)
        merged = merge_official(existing, fresh)
        wipe_and_save_by_category(OFFICIAL_DIR, merged)
        logger.info("公众号合并后共 %s 条", len(merged))

    def run_mini(self, content: str, use_all_providers: bool) -> None:
        existing = load_json_dir(MINI_DIR)
        names = [str(x.get("name", "")).strip() for x in existing if x.get("name")]
        fresh = self.extract_mini(content, names, use_all_providers)
        merged = merge_mini(existing, fresh)
        wipe_and_save_by_category(MINI_DIR, merged)
        logger.info("小程序合并后共 %s 条", len(merged))

    def run(self, kind: str, content: str, use_all_providers: bool) -> bool:
        try:
            if kind in ("all", "official"):
                logger.info("=== 微信公众号抓取 ===")
                self.run_official(content, use_all_providers)
            if kind in ("all", "mini"):
                logger.info("=== 微信小程序抓取 ===")
                self.run_mini(content, use_all_providers)
            rebuild_crawl_log()
            rebuild_search_index()
            logger.info("已更新 %s 与 %s", CRAWL_LOG_FILE.name, SEARCH_INDEX_FILE.name)
            return True
        except Exception:
            logger.exception("微信抓取流程失败")
            return False


def _setup_logging() -> None:
    log_level = os.getenv("LOG_LEVEL", ConfigManager.get_crawler_config("log_level", "WARNING")).upper()
    logging.basicConfig(
        level=getattr(logging, log_level, logging.WARNING),
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[logging.StreamHandler(sys.stdout)],
    )


if __name__ == "__main__":
    _setup_logging()
    content = os.getenv("WECHAT_CRAWL_CONTENT", "")
    kind = os.getenv("WECHAT_KIND", "all").strip().lower()
    if kind not in ("all", "official", "mini"):
        kind = "all"

    rp_env = os.environ.get("WECHAT_CRAWL_PROVIDERS")
    if rp_env is None or not str(rp_env).strip():
        raw_providers = "siliconflow"
    else:
        raw_providers = str(rp_env).strip()

    if raw_providers.lower() == "all":
        fetcher = WechatDataFetcher(providers=None)
        use_all_providers = True
    else:
        plist = [p.strip() for p in raw_providers.split(",") if p.strip()]
        if not plist:
            plist = ["siliconflow"]
        fetcher = WechatDataFetcher(providers=plist)
        use_all_providers = len(plist) > 1

    ok = fetcher.run(kind=kind, content=content, use_all_providers=use_all_providers)
    if ok:
        print(f"\n{'=' * 60}")
        print("微信数据抓取完成")
        print(f"公众号目录: {OFFICIAL_DIR}")
        print(f"小程序目录: {MINI_DIR}")
        print(f"{'=' * 60}\n")
    else:
        sys.exit(1)
