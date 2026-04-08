"""
数据爬取模块
使用AI提供者工厂来提取AI工具信息，并与已有数据进行整合去重
"""
import json
import logging
import os
import sys
import re
import urllib.parse
import urllib.request
from typing import List, Dict, Any, Optional, Tuple
from pathlib import Path

# 处理导入路径，支持直接运行和作为模块导入
try:
    # 先尝试相对导入（作为模块导入时）
    from .factory import AIProviderFactory
    from .base import AIProvider, AIResponse
    from .config import ConfigManager
except (ImportError, ValueError):
    # 相对导入失败时，使用绝对导入（直接运行时）
    sys.path.insert(0, str(Path(__file__).parent))
    from factory import AIProviderFactory
    from base import AIProvider, AIResponse
    from config import ConfigManager

# 配置日志
logger = logging.getLogger(__name__)

# 数据文件路径（从配置文件读取）
_data_dir = ConfigManager.get_data_config("data_dir", "/code/data")
_tools_file = ConfigManager.get_data_config("tools_file", "tools.json")
_categories_file = ConfigManager.get_data_config("categories_file", "categories.json")
# 处理相对路径和绝对路径
if Path(_data_dir).is_absolute():
    DATA_DIR = Path(_data_dir)
else:
    DATA_DIR = Path(__file__).parent.parent / _data_dir
TOOLS_FILE = DATA_DIR / _tools_file
CATEGORIES_FILE = DATA_DIR / _categories_file

# 配置常量（从配置文件读取，环境变量可覆盖）
MAX_CONTENT_LENGTH = int(os.getenv("MAX_CONTENT_LENGTH", str(ConfigManager.get_crawler_config("max_content_length", 15000))))

# 工具图标保存目录（写到 Next.js public 下）
PUBLIC_DIR = Path(__file__).parent.parent / "code" / "public"
TOOL_ICON_DIR = PUBLIC_DIR / "assets" / "images" / "tools"

# favicon 下载配置（环境变量可覆盖）
FAVICON_SIZE = int(os.getenv("FAVICON_SIZE", "128"))
FETCH_ICONS = os.getenv("FETCH_ICONS", "true").strip().lower() in {"1", "true", "yes", "y", "on"}
REFRESH_ICONS = os.getenv("REFRESH_ICONS", "false").strip().lower() in {"1", "true", "yes", "y", "on"}


class DataFetcher:
    """数据获取器
    
    负责使用AI提供者提取AI工具信息，并与已有数据进行整合去重
    支持多个AI提供者并行调用，并自动去重合并结果
    """
    
    # AI提取提示词模板 - 用于生成工具数据
    EXTRACT_PROMPT_TEMPLATE = """
# Background (背景)
你是一个专业的AI工具数据抓取器，负责抓取和整理AI相关工具的信息。

# Role (角色)
你是一个智能数据生成助手，能够生成准确的AI工具相关信息。

# Objective (目标)
请生成“尽可能新的/仍在活跃更新的 AI 工具”（尽量覆盖 2026 年仍然热门或新发布的工具）的关键信息：
1. 工具名称 (Tool Name) - 必填，简洁明了
2. 工具描述 (Tool Description) - 必填，包含核心功能和使用场景
3. 工具URL (Tool URL) - 必填，尽量给“官方站点/产品落地页”的完整可访问 HTTPS 链接
4. 工具分类ID (Category ID) - 必填，请参考/code/data/categories.json文件中的分类ID（1-9）
5. 工具标签 (Tool Tags) - 可选，多个相关的关键词数组
6. 开发者/公司 (developer) - 可选
7. 价格 (pricing) - 可选，如“免费 / 订阅制 / 按量付费 / 免费+付费”

# Key Requirements (关键要求)
- 确保生成的信息准确无误
- 工具名称应该简洁明了，不超过50个字符
- 工具描述应该详细描述核心功能和使用场景，建议10-50个字符
- 工具URL必须是完整且可访问的HTTPS链接
- 工具分类ID必须是在categories.json中存在的有效ID（1-9）
- 工具标签应该是1-5个相关的关键词，使用中文

# Expected Output (期望输出)
请以JSON格式返回生成的数据。请生成多个工具（至少20个），返回一个JSON数组，格式如下：
[
  {{
    "name": "ChatGPT",
    "description": "由OpenAI开发的对话式AI助手，支持自然语言交互，可用于写作、编程、学习、客服等多种场景。",
    "url": "https://chatgpt.com",
    "categoryId": 4,
    "tags": [
      "对话AI",
      "自然语言处理",
      "多场景应用"
    ]
  }},
  {{
    "name": "Midjourney",
    "description": "AI图像生成工具，通过自然语言描述生成高质量的艺术作品和图像。",
    "url": "https://www.midjourney.com",
    "categoryId": 8,
    "tags": [
      "图像生成",
      "AI艺术",
      "创意设计"
    ]
  }}
]

注意：
- 必须返回有效的JSON数组格式
- 不要包含id、rating、ratingCount、isActive、isFeatured等字段（这些字段会在后续处理中自动添加）
- categoryId必须是1-9之间的整数，对应categories.json中的分类ID
- tags必须是字符串数组，至少包含2个标签
- 不要返回logo字段（logo会在本地根据url自动下载favicon并生成）

# Content (内容)
{content}
"""
    
    # 注意：整合去重不使用 AI（按工具名/URL 本地规则合并）
    
    def __init__(self, providers: Optional[List[str]] = None, max_content_length: Optional[int] = None):
        """
        初始化数据获取器
        
        Args:
            providers: 要使用的AI提供者列表，如果为None则使用所有可用的提供者
            max_content_length: 最大内容长度，如果为None则使用模块级常量MAX_CONTENT_LENGTH
        """
        self.providers = providers or AIProviderFactory.get_available_providers()
        self.max_content_length = max_content_length or MAX_CONTENT_LENGTH
        logger.info(f"初始化DataFetcher，提供者: {self.providers}, 最大内容长度: {self.max_content_length}")
    
    def _create_extract_prompt(self, content: str = "", existing_tool_names: Optional[List[str]] = None) -> str:
        """
        创建AI提取提示词
        
        Args:
            content: 可选的内容参数
            existing_tool_names: 已有工具名称列表（用于让模型过滤/避开已存在的工具）
            
        Returns:
            str: 格式化后的提示词
        """
        existing_block = ""
        if existing_tool_names:
            # 只传名称给大模型用于过滤，避免重复生成
            # 做长度保护，防止提示词过长
            names = [n.strip() for n in existing_tool_names if isinstance(n, str) and n.strip()]
            # 去重（保持顺序）
            seen = set()
            deduped = []
            for n in names:
                key = self._normalize_name_key(n)
                if key and key not in seen:
                    seen.add(key)
                    deduped.append(n)
            # 控制数量，避免 prompt 过长（默认最多 300 个名称）
            max_names = int(os.getenv("EXISTING_TOOL_NAMES_LIMIT", "300"))
            clipped = deduped[:max_names]
            existing_block = (
                "\n\n# Existing Tools (已有工具名称列表)\n"
                "下面这些工具已经存在于 tools.json 中，请【不要】重复返回（name 相同或非常相似也算重复）：\n"
                + "\n".join([f"- {n}" for n in clipped])
                + "\n"
            )

        return self.EXTRACT_PROMPT_TEMPLATE.format(content=content) + existing_block
    
    # _create_merge_prompt 已废弃：不再使用 AI 做 merge
    
    def _parse_ai_response(self, response: AIResponse) -> List[Dict[str, Any]]:
        """
        解析AI响应，提取工具信息
        
        Args:
            response: AI响应对象
            
        Returns:
            List[Dict[str, Any]]: 工具信息列表
        """
        if not response.success:
            logger.warning(f"AI响应失败: {response.error_message}")
            return []
        
        try:
            content = response.content.strip()
            # 移除可能的markdown代码块标记
            if content.startswith("```"):
                lines = content.split("\n")
                # 移除第一行和最后一行（代码块标记）
                if len(lines) > 2:
                    # 检查是否有语言标识（如 ```json）
                    if lines[0].strip().startswith("```"):
                        content = "\n".join(lines[1:-1])
                    else:
                        content = "\n".join(lines[1:-1])
            
            # 尝试解析JSON
            data = json.loads(content)
            
            # 如果是单个对象，转换为列表
            if isinstance(data, dict):
                data = [data]
            
            # 验证数据格式
            tools = []
            for item in data:
                if isinstance(item, dict) and "name" in item:
                    # 提取categoryId，如果没有则尝试从category字段获取
                    category_id = item.get("categoryId")
                    if category_id is None:
                        # 尝试从category字段解析（可能是字符串或数字）
                        category = item.get("category", "")
                        if isinstance(category, int):
                            category_id = category
                        elif isinstance(category, str) and category.strip().isdigit():
                            category_id = int(category.strip())
                        else:
                            logger.warning(f"工具 {item.get('name')} 缺少有效的categoryId")
                            continue
                    
                    # 验证categoryId是否在有效范围内（1-9）
                    if not isinstance(category_id, int) or category_id < 1 or category_id > 9:
                        logger.warning(f"工具 {item.get('name')} 的categoryId无效: {category_id}")
                        continue
                    
                    # 新提取的工具不包含id，id会在保存时自动分配（自增）
                    tool = {
                        "name": item.get("name", "").strip(),
                        "description": item.get("description", "").strip(),
                        "url": item.get("url", "").strip(),
                        "categoryId": category_id,
                        "rating": 0,
                        "ratingCount": 0,
                        "isActive": True,
                        "isFeatured": False,
                        "tags": item.get("tags", []) if isinstance(item.get("tags"), list) else [],
                        "developer": item.get("developer", "").strip() if isinstance(item.get("developer"), str) else "",
                        "pricing": item.get("pricing", "").strip() if isinstance(item.get("pricing"), str) else ""
                    }
                    
                    # 验证必填字段
                    if not tool["name"] or not tool["description"] or not tool["url"]:
                        logger.warning(f"工具数据不完整，跳过: {tool.get('name', '未知')}")
                        continue
                    
                    tools.append(tool)
            
            logger.info(f"成功解析 {len(tools)} 个工具")
            return tools
            
        except json.JSONDecodeError as e:
            logger.error(f"解析AI响应JSON失败: {str(e)}")
            logger.debug(f"响应内容: {response.content[:500]}")
            return []
        except Exception as e:
            logger.exception(f"解析AI响应时出错: {str(e)}")
            return []
    
    def _normalize_name_key(self, name: str) -> str:
        """
        将工具名规范化为稳定去重键（用于“按工具名去重”）

        策略：
        - 小写
        - 去除空白与常见标点符号
        - 合并连续空白
        """
        if not isinstance(name, str):
            return ""
        value = name.strip().lower()
        if not value:
            return ""
        # 保留字母数字与中文，其余视为分隔符
        value = re.sub(r"[\s\-_·•\.\,，/\\\(\)\[\]\{\}<>:：;；'\"“”‘’`~!@#$%^&*+=?|]+", "", value)
        return value

    def _canonicalize_url(self, url: str) -> str:
        """
        URL 规范化，用于更稳定地比较 URL：
        - 补全 scheme 的情况不在这里处理（上游要求必须 https）
        - host 小写
        - 去掉末尾 /
        """
        if not isinstance(url, str):
            return ""
        raw = url.strip()
        if not raw:
            return ""
        try:
            parsed = urllib.parse.urlparse(raw)
            if not parsed.scheme or not parsed.netloc:
                return raw.rstrip("/")
            netloc = parsed.netloc.lower()
            path = parsed.path.rstrip("/")
            # 保留 query（有些产品页区分 query），但去掉 fragment
            rebuilt = urllib.parse.urlunparse((parsed.scheme, netloc, path, "", parsed.query, ""))
            return rebuilt
        except Exception:
            return raw.rstrip("/")

    def _choose_better_tool(self, existing: Dict[str, Any], incoming: Dict[str, Any]) -> Dict[str, Any]:
        """
        合并同一工具的两条记录，尽量保留更完整的信息。
        """
        merged = existing.copy()

        # 描述：更长者优先
        if len(str(incoming.get("description", "")).strip()) > len(str(existing.get("description", "")).strip()):
            merged["description"] = incoming.get("description", "")

        # URL：优先选择更像“官方 HTTPS”的（同时做 canonicalize）
        existing_url = self._canonicalize_url(str(existing.get("url", "")))
        incoming_url = self._canonicalize_url(str(incoming.get("url", "")))
        if incoming_url and (not existing_url or len(incoming_url) >= len(existing_url)):
            merged["url"] = incoming.get("url", "")

        # categoryId：若现有缺失/非法，使用新的
        try:
            existing_cat = int(existing.get("categoryId")) if existing.get("categoryId") is not None else None
        except Exception:
            existing_cat = None
        try:
            incoming_cat = int(incoming.get("categoryId")) if incoming.get("categoryId") is not None else None
        except Exception:
            incoming_cat = None
        if existing_cat is None or not (1 <= existing_cat <= 9):
            if incoming_cat is not None and 1 <= incoming_cat <= 9:
                merged["categoryId"] = incoming_cat

        # tags：合并去重，保持顺序
        existing_tags = existing.get("tags", []) if isinstance(existing.get("tags"), list) else []
        incoming_tags = incoming.get("tags", []) if isinstance(incoming.get("tags"), list) else []
        merged_tags: List[str] = []
        for tag in existing_tags + incoming_tags:
            if isinstance(tag, str):
                t = tag.strip()
                if t and t not in merged_tags:
                    merged_tags.append(t)
        merged["tags"] = merged_tags

        # developer / pricing：有值则补齐（不覆盖已有非空）
        if not str(merged.get("developer", "")).strip() and str(incoming.get("developer", "")).strip():
            merged["developer"] = incoming.get("developer", "")
        if not str(merged.get("pricing", "")).strip() and str(incoming.get("pricing", "")).strip():
            merged["pricing"] = incoming.get("pricing", "")

        return merged

    def merge_datasets_locally(
        self,
        existing_data: List[Dict[str, Any]],
        new_data: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        本地整合去重（不使用AI）

        去重优先级：
        - 先用 URL 规范化后去重（如果两条都有 URL 且相同）
        - 再用“工具名规范化 key”去重（满足你说的：可通过工具名去除，不需要使用AI）
        """
        if not new_data:
            return existing_data
        if not existing_data:
            return new_data

        by_url: Dict[str, Dict[str, Any]] = {}
        by_name: Dict[str, str] = {}  # name_key -> url_key (或 name_key 自身占位)

        def upsert(tool: Dict[str, Any]) -> None:
            url_key = self._canonicalize_url(str(tool.get("url", "")))
            name_key = self._normalize_name_key(str(tool.get("name", "")))

            # 1) URL 命中
            if url_key:
                if url_key in by_url:
                    by_url[url_key] = self._choose_better_tool(by_url[url_key], tool)
                else:
                    by_url[url_key] = tool.copy()
                if name_key and name_key not in by_name:
                    by_name[name_key] = url_key
                return

            # 2) 无 URL 时，按 name_key 命中
            if name_key:
                mapped = by_name.get(name_key)
                if mapped and mapped in by_url:
                    by_url[mapped] = self._choose_better_tool(by_url[mapped], tool)
                    return
                # 没映射：用 name_key 作为临时“伪 URL key”
                pseudo_key = f"name:{name_key}"
                if pseudo_key in by_url:
                    by_url[pseudo_key] = self._choose_better_tool(by_url[pseudo_key], tool)
                else:
                    by_url[pseudo_key] = tool.copy()
                by_name[name_key] = pseudo_key
                return

            # 3) 既没 URL 也没 name_key：丢弃
            logger.warning("跳过无效工具（无可用URL且名称不可用）")

        for t in existing_data:
            if isinstance(t, dict):
                upsert(t)
        for t in new_data:
            if isinstance(t, dict):
                upsert(t)

        merged = list(by_url.values())
        logger.info(f"本地整合去重完成，已有: {len(existing_data)}, 新增: {len(new_data)}, 合并后: {len(merged)}")
        return merged

    def _favicon_fetch_url(self, tool_url: str) -> Tuple[str, str]:
        """
        根据工具 URL 生成 favicon 拉取地址与域名。
        这里使用 Google S2 favicon 服务，稳定返回 png。
        """
        canonical = self._canonicalize_url(tool_url)
        parsed = urllib.parse.urlparse(canonical)
        domain = parsed.netloc or ""
        domain = domain.split("@")[-1]
        domain = domain.split(":")[0]
        fetch_url = f"https://www.google.com/s2/favicons?domain={urllib.parse.quote(domain)}&sz={FAVICON_SIZE}"
        return fetch_url, domain

    def _safe_icon_filename(self, tool: Dict[str, Any], domain: str) -> str:
        """
        生成稳定的本地图标文件名（png）。
        """
        name_key = self._normalize_name_key(str(tool.get("name", "")))
        base = name_key or domain or "tool"
        base = re.sub(r"[^a-z0-9\u4e00-\u9fff]+", "-", base.lower()).strip("-")
        if not base:
            base = "tool"
        return f"{base}.png"

    def ensure_tool_icon(self, tool: Dict[str, Any]) -> Optional[str]:
        """
        确保工具有本地图标，并返回写入 tools.json 的 logo 路径。

        - 图片保存到: code/public/assets/images/tools/<name>.png
        - tools.json 写入: /assets/images/tools/<name>.png
        """
        if not FETCH_ICONS:
            return None
        url = str(tool.get("url", "")).strip()
        if not url:
            return None

        try:
            TOOL_ICON_DIR.mkdir(parents=True, exist_ok=True)
            fetch_url, domain = self._favicon_fetch_url(url)
            filename = self._safe_icon_filename(tool, domain)
            target_path = TOOL_ICON_DIR / filename

            # 若已有且不要求刷新，直接复用
            if target_path.exists() and not REFRESH_ICONS:
                return f"/assets/images/tools/{filename}"

            req = urllib.request.Request(
                fetch_url,
                headers={
                    "User-Agent": "Mozilla/5.0 (compatible; XuCrawler/1.0; +https://example.com)"
                }
            )
            with urllib.request.urlopen(req, timeout=20) as resp:
                content_type = resp.headers.get("Content-Type", "")
                body = resp.read()

            if not body or len(body) < 100:
                logger.warning(f"下载favicon失败（内容过小），工具: {tool.get('name')}, url: {url}")
                return None

            # 简单校验：期望 png 或 ico（S2 一般返回 png）
            if "image" not in content_type:
                logger.warning(f"下载favicon失败（非图片响应: {content_type}），工具: {tool.get('name')}, url: {url}")
                return None

            with open(target_path, "wb") as f:
                f.write(body)
            return f"/assets/images/tools/{filename}"
        except Exception as e:
            logger.warning(f"下载favicon异常，工具: {tool.get('name')}, url: {url}, err: {e}")
            return None

    def extract_tools_with_ai(
        self, 
        content: str = "",
        use_all_providers: bool = True,
        existing_tool_names: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """
        使用AI提供者提取工具信息（多次调用）
        
        Args:
            content: 可选的内容参数
            use_all_providers: 是否使用所有可用的提供者
            
        Returns:
            List[Dict[str, Any]]: 提取并去重后的工具列表
        """
        # 创建提示词（带已有工具名过滤）
        prompt = self._create_extract_prompt(content=content, existing_tool_names=existing_tool_names)
        
        # 确定要使用的提供者
        providers_to_use = self.providers if use_all_providers else [self.providers[0]] if self.providers else []
        
        if not providers_to_use:
            logger.warning("没有可用的AI提供者")
            return []
        
        logger.info(f"使用 {len(providers_to_use)} 个AI提供者提取工具信息")
        
        # 构建本地兜底过滤集合（防止模型仍返回重复）
        existing_name_keys = set()
        if existing_tool_names:
            for n in existing_tool_names:
                key = self._normalize_name_key(str(n))
                if key:
                    existing_name_keys.add(key)

        # 调用所有提供者进行多次提取
        all_tools = []
        for provider_name in providers_to_use:
            try:
                logger.info(f"正在使用 {provider_name} 提取工具信息...")
                provider = AIProviderFactory.create_provider(provider_name)
                if provider is None:
                    logger.warning(f"无法创建 {provider_name} 提供者")
                    continue
                
                response = provider.chat(prompt)
                tools = self._parse_ai_response(response)
                if tools:
                    # 本地兜底过滤：如果工具名已存在，则跳过
                    if existing_name_keys:
                        filtered = []
                        skipped = 0
                        for t in tools:
                            key = self._normalize_name_key(str(t.get("name", "")))
                            if key and key in existing_name_keys:
                                skipped += 1
                                continue
                            filtered.append(t)
                        if skipped:
                            logger.info(f"{provider_name} 返回 {skipped} 条已存在工具，已过滤")
                        tools = filtered
                    all_tools.extend(tools)  # 直接扩展列表，后续统一去重
                    logger.info(f"{provider_name} 提取到 {len(tools)} 个工具")
                else:
                    logger.warning(f"{provider_name} 未提取到工具")
                    
            except Exception as e:
                logger.exception(f"使用 {provider_name} 提取工具时出错: {str(e)}")
                continue
        
        # 基础去重（基于URL或名称）
        if all_tools:
            deduplicated = self._simple_deduplicate(all_tools)
            logger.info(f"提取完成，共提取到 {len(deduplicated)} 个工具（去重后）")
            return deduplicated
        else:
            logger.warning("所有提供者都未能提取到工具")
            return []
    
    def _simple_deduplicate(self, tools: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        简单去重（基于URL或名称）
        
        Args:
            tools: 工具列表
            
        Returns:
            List[Dict[str, Any]]: 去重后的工具列表
        """
        tools_dict: Dict[str, Dict[str, Any]] = {}
        
        for tool in tools:
            # 确定唯一标识（优先使用URL）
            identifier = tool.get("url", "").strip()
            if not identifier:
                identifier = tool.get("name", "").strip().lower()
            
            if not identifier:
                logger.warning("跳过无效工具（无URL和名称）")
                continue
            
            # 如果已存在，保留信息更完整的
            if identifier in tools_dict:
                existing = tools_dict[identifier]
                # 如果新工具的描述更长，使用新工具
                if len(tool.get("description", "")) > len(existing.get("description", "")):
                    tools_dict[identifier] = tool.copy()
                # 合并标签（去重）
                existing_tags = existing.get("tags", [])
                new_tags = tool.get("tags", [])
                # 合并标签并去重，保持顺序
                merged_tags = existing_tags + [tag for tag in new_tags if tag not in existing_tags]
                tools_dict[identifier]["tags"] = merged_tags
                # 如果新工具的categoryId更合理，更新它
                if tool.get("categoryId") and not existing.get("categoryId"):
                    tools_dict[identifier]["categoryId"] = tool.get("categoryId")
            else:
                tools_dict[identifier] = tool.copy()
        
        result = list(tools_dict.values())
        logger.info(f"简单去重完成，原始工具数: {len(tools)}, 去重后: {len(result)}")
        return result
    
    # merge_with_ai 已废弃：不再使用 AI 做 merge
    
    def load_tools(self) -> List[Dict[str, Any]]:
        """
        加载已有的tools.json数据
        
        Returns:
            List[Dict[str, Any]]: 工具数据列表
        """
        try:
            if not TOOLS_FILE.exists():
                logger.warning(f"文件不存在: {TOOLS_FILE}，返回空列表")
                return []
            
            with open(TOOLS_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # 验证数据格式
            if isinstance(data, list):
                logger.info(f"成功加载 {len(data)} 条工具数据")
                return data
            else:
                logger.warning("数据格式不正确，返回空列表")
                return []
                
        except Exception as e:
            logger.exception(f"加载tools.json失败: {str(e)}")
            return []
    
    def load_categories(self) -> List[Dict[str, Any]]:
        """
        加载已有的categories.json数据
        
        Returns:
            List[Dict[str, Any]]: 分类数据列表
        """
        try:
            if not CATEGORIES_FILE.exists():
                logger.warning(f"文件不存在: {CATEGORIES_FILE}，返回空列表")
                return []
            
            with open(CATEGORIES_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # 验证数据格式
            if isinstance(data, list):
                logger.info(f"成功加载 {len(data)} 条分类数据")
                return data
            else:
                logger.warning("分类数据格式不正确，返回空列表")
                return []
                
        except Exception as e:
            logger.exception(f"加载categories.json失败: {str(e)}")
            return []
    
    def update_category_tool_counts(self, tools_data: List[Dict[str, Any]]) -> bool:
        """
        根据tools.json中的categoryId统计并更新categories.json中的toolCount字段
        
        Args:
            tools_data: 工具数据列表
            
        Returns:
            bool: 是否更新成功
        """
        try:
            # 加载分类数据
            categories = self.load_categories()
            if not categories:
                logger.warning("没有分类数据，跳过toolCount更新")
                return False
            
            # 统计每个分类的工具数量（只统计isActive为True的工具）
            tool_counts: Dict[int, int] = {}
            for tool in tools_data:
                category_id = tool.get("categoryId")
                is_active = tool.get("isActive", True)
                
                if category_id is not None and is_active:
                    category_id = int(category_id)
                    tool_counts[category_id] = tool_counts.get(category_id, 0) + 1
            
            # 更新分类的toolCount
            updated_count = 0
            for category in categories:
                category_id = category.get("id")
                if category_id is not None:
                    category_id = int(category_id)
                    new_count = tool_counts.get(category_id, 0)
                    old_count = category.get("toolCount", 0)
                    category["toolCount"] = new_count
                    if new_count != old_count:
                        updated_count += 1
                        logger.debug(f"分类 {category.get('name', '未知')} (ID: {category_id}) 的toolCount: {old_count} -> {new_count}")
            
            # 保存更新后的分类数据
            with open(CATEGORIES_FILE, 'w', encoding='utf-8') as f:
                json.dump(categories, f, ensure_ascii=False, indent=2)
            
            logger.info(f"成功更新 {updated_count} 个分类的toolCount字段")
            return True
            
        except Exception as e:
            logger.exception(f"更新categories.json的toolCount失败: {str(e)}")
            return False
    
    def save_tools(self, data: List[Dict[str, Any]]) -> bool:
        """
        保存数据到tools.json，并自动更新categories.json中的toolCount字段
        
        Args:
            data: 要保存的数据列表
            
        Returns:
            bool: 是否保存成功
        """
        try:
            # 确保目录存在
            DATA_DIR.mkdir(parents=True, exist_ok=True)
            
            # 确保每个工具都有id字段，自动分配缺失的id（自增）
            processed_data = []
            existing_ids = set()
            
            # 先收集所有已有的id
            for tool in data:
                if "id" in tool and tool["id"] is not None:
                    existing_ids.add(int(tool["id"]))
            
            # 计算下一个可用的id（从最大id+1开始，如果没有id则从1开始）
            next_id = max(existing_ids) + 1 if existing_ids else 1
            
            # 处理每个工具，确保都有id
            for tool in data:
                processed_tool = tool.copy()
                
                # 如果缺少id，自动分配自增id
                if "id" not in processed_tool or processed_tool["id"] is None:
                    # 确保next_id不与已有id冲突（处理可能的id间隙）
                    while next_id in existing_ids:
                        next_id += 1
                    processed_tool["id"] = next_id
                    existing_ids.add(next_id)
                    next_id += 1  # 自增到下一个可用id
                    logger.debug(f"为工具 '{processed_tool.get('name', '未知')}' 分配id: {processed_tool['id']}")
                else:
                    # 确保已有工具的id是整数类型
                    processed_tool["id"] = int(processed_tool["id"])
                
                # 确保其他必需字段有默认值
                if "rating" not in processed_tool:
                    processed_tool["rating"] = 0
                if "ratingCount" not in processed_tool:
                    processed_tool["ratingCount"] = 0
                if "isActive" not in processed_tool:
                    processed_tool["isActive"] = True
                if "isFeatured" not in processed_tool:
                    processed_tool["isFeatured"] = False
                if "tags" not in processed_tool:
                    processed_tool["tags"] = []
                if "developer" not in processed_tool:
                    processed_tool["developer"] = ""
                if "pricing" not in processed_tool:
                    processed_tool["pricing"] = ""

                # 确保有 logo（本地 favicon），并写入 tools.json 的 logo 路径
                if not str(processed_tool.get("logo", "")).strip():
                    logo_path = self.ensure_tool_icon(processed_tool)
                    if logo_path:
                        processed_tool["logo"] = logo_path
                
                processed_data.append(processed_tool)
            
            # 保存数据
            with open(TOOLS_FILE, 'w', encoding='utf-8') as f:
                json.dump(processed_data, f, ensure_ascii=False, indent=2)
            
            logger.info(f"成功保存 {len(processed_data)} 条数据到 {TOOLS_FILE}")
            
            # 保存完成后，自动更新categories.json中的toolCount字段
            logger.info("开始更新categories.json中的toolCount字段...")
            update_success = self.update_category_tool_counts(processed_data)
            if update_success:
                logger.info("toolCount字段更新完成")
            else:
                logger.warning("toolCount字段更新失败，但不影响工具数据保存")
            
            return True
            
        except Exception as e:
            logger.exception(f"保存tools.json失败: {str(e)}")
            return False
    
    def run(self, content: str = "", use_all_providers: bool = True) -> bool:
        """
        执行完整的数据提取和整合流程
        
        Args:
            content: 可选的内容参数
            use_all_providers: 是否使用所有可用的提供者进行提取
            
        Returns:
            bool: 是否执行成功
        """
        try:
            # 1. 加载已有数据
            logger.info("步骤1: 加载已有数据...")
            existing_data = self.load_tools()
            logger.info(f"已加载 {len(existing_data)} 条已有数据")

            # 提取已有工具名称，用于让大模型侧过滤（避免重复生成）
            existing_tool_names: List[str] = []
            for t in existing_data:
                if isinstance(t, dict) and isinstance(t.get("name"), str) and t["name"].strip():
                    existing_tool_names.append(t["name"].strip())
            
            # 2. 使用AI提取新数据
            logger.info("步骤2: 使用AI提取新数据...")
            new_data = self.extract_tools_with_ai(
                content=content,
                use_all_providers=use_all_providers,
                existing_tool_names=existing_tool_names
            )
            logger.info(f"提取到 {len(new_data)} 条新数据")
            
            # 3. 使用AI整合去重
            logger.info("步骤3: 本地整合去重（按工具名/URL，不使用AI）...")
            merged_data = self.merge_datasets_locally(existing_data, new_data)
            logger.info(f"整合后共 {len(merged_data)} 条数据")
            
            # 4. 保存数据
            logger.info("步骤4: 保存数据...")
            success = self.save_tools(merged_data)
            
            if success:
                logger.info("数据提取和整合流程完成")
                return True
            else:
                logger.error("保存数据失败")
                return False
                
        except Exception as e:
            logger.exception(f"执行流程失败: {str(e)}")
            return False


if __name__ == "__main__":
    import sys
    from datetime import datetime
    
    # 自定义延迟文件处理器：只在有日志输出时才创建文件
    class LazyFileHandler(logging.Handler):
        """延迟文件处理器：只在第一次有日志记录时才创建文件"""
        def __init__(self, filename, mode='a', encoding='utf-8'):
            super().__init__()
            self._filename = filename
            self._mode = mode
            self._encoding = encoding
            self._file_handler = None
            self._file_created = False
        
        def emit(self, record):
            """发送日志记录，首次调用时创建文件"""
            if not self._file_created:
                # 首次有日志输出时才创建文件
                try:
                    self._file_handler = logging.FileHandler(
                        self._filename, 
                        self._mode, 
                        encoding=self._encoding
                    )
                    self._file_handler.setFormatter(self.formatter)
                    self._file_created = True
                except Exception as e:
                    # 如果创建文件失败，只输出到控制台，不抛出异常
                    self.handleError(record)
                    return
            
            # 调用文件处理器的emit方法
            if self._file_handler:
                self._file_handler.emit(record)
        
        def close(self):
            """关闭文件处理器"""
            if self._file_handler:
                self._file_handler.close()
            super().close()
    
    # 配置日志（从配置文件读取，环境变量可覆盖）
    log_level = os.getenv("LOG_LEVEL", ConfigManager.get_crawler_config("log_level", "WARNING")).upper()
    log_file = f'crawl_{datetime.now().strftime("%Y%m%d")}.log'
    
    # 创建处理器列表
    handlers = [logging.StreamHandler(sys.stdout)]
    # 使用延迟文件处理器，只在有日志输出时才创建文件
    handlers.append(LazyFileHandler(log_file))
    
    logging.basicConfig(
        level=getattr(logging, log_level, logging.WARNING),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=handlers
    )
    

    # 从环境变量读取配置
    content = os.getenv("CRAWL_CONTENT", "")
    crawl_providers_str = os.getenv("CRAWL_PROVIDERS", "siliconflow")
    
    # 解析提供者列表
    if crawl_providers_str:
        providers = [p.strip() for p in crawl_providers_str.split(",") if p.strip()]
        use_all_providers = False
    else:
        providers = None
        use_all_providers = True
    
    logger.info(f"开始数据提取和整合任务 - 内容: {content[:50] if content else '无'}, 提供者: {providers or '所有可用提供者'}")
    
    try:
        # 创建数据获取器
        fetcher = DataFetcher(providers=providers)
        
        # 执行完整流程
        success = fetcher.run(content=content, use_all_providers=use_all_providers)

        
        
        if success:
            print(f"\n{'='*60}")
            print(f"数据提取和整合任务完成")
            print(f"数据文件: {TOOLS_FILE}")
            print(f"{'='*60}\n")
        else:
            logger.error("任务执行失败")
            print("\n错误: 任务执行失败")
            sys.exit(1)
            
    except Exception as e:
        logger.exception(f"任务失败: {str(e)}")
        print(f"\n错误: {str(e)}")
        sys.exit(1)
