"""
数据爬取模块
使用AI提供者工厂来提取AI工具信息，并与已有数据进行整合去重
"""
import json
import logging
import os
import sys
from typing import List, Dict, Any, Optional
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
# 处理相对路径和绝对路径
if Path(_data_dir).is_absolute():
    DATA_DIR = Path(_data_dir)
else:
    DATA_DIR = Path(__file__).parent.parent / _data_dir
TOOLS_FILE = DATA_DIR / _tools_file

# 配置常量（从配置文件读取，环境变量可覆盖）
MAX_CONTENT_LENGTH = int(os.getenv("MAX_CONTENT_LENGTH", str(ConfigManager.get_crawler_config("max_content_length", 15000))))


class DataFetcher:
    """数据获取器
    
    负责使用AI提供者提取AI工具信息，并与已有数据进行整合去重
    支持多个AI提供者并行调用，并自动去重合并结果
    """
    
    # AI提取提示词模板 - 用于生成工具数据
    EXTRACT_PROMPT_TEMPLATE = """
# Background (背景)
你是一个专业的AI工具数据生成器，负责生成和整理AI相关工具的信息。

# Role (角色)
你是一个智能数据生成助手，能够生成准确的AI工具相关信息。

# Objective (目标)
请生成以下AI工具的关键信息：
1. 工具名称 (Tool Name)
2. 工具描述 (Tool Description)
3. 工具URL (Tool URL)
4. 工具分类 (Tool Category) 请参考/code/data/categories.json文件中的分类。
5. 工具标签 (Tool Tags) 请根据工具的描述生成相关的标签。


# Key Requirements (关键要求)
- 确保生成的信息准确无误
- 工具名称应该简洁明了
- 工具描述应该包含核心功能和使用场景
- 工具URL必须是完整且可访问的链接
- 工具分类应该符合常见的AI工具分类体系（如：AI办公工具、AI视频工具、AI编程工具、AI聊天助手、AI写作工具、AI学习网站）
- 工具标签应该是多个相关的关键词

# Expected Output (期望输出)
请以JSON格式返回生成的数据。请生成多个工具（至少10个），返回一个JSON数组，格式如下：
[
  {{
    "name": "工具名称",
    "description": "工具描述",
    "url": "工具URL",
    "category": "工具分类",
    "tags": ["标签1", "标签2", "标签3"]
  }},
  ...
]

# Content (内容)
{content}
"""
    
    # AI整合去重提示词模板
    MERGE_PROMPT_TEMPLATE = """
# Background (背景)
你是一个专业的数据整合助手，负责合并和去重AI工具数据。

# Role (角色)
你需要将新提取的工具数据与已有数据进行整合，去除重复项，并保持数据格式一致。

# Objective (目标)
整合以下两组数据：
1. 已有数据（existing_data）：当前数据库中已存在的工具数据
2. 新数据（new_data）：刚刚提取的新工具数据

# Key Requirements (关键要求)
- 去重策略：优先使用URL作为唯一标识，如果URL相同，认为是同一个工具
- 如果URL为空，使用工具名称（转小写）作为唯一标识
- 合并时保留信息最完整的记录
- 如果新工具的描述更长，使用新描述
- 合并标签列表并去重
- 保持数据格式一致

# Expected Output (期望输出)
请返回整合去重后的JSON数组，格式与输入数据保持一致：
[
  {{
    "name": "工具名称",
    "description": "工具描述",
    "url": "工具URL",
    "category": "工具分类",
    "tags": ["标签1", "标签2", "标签3"]
  }},
  ...
]

# Existing Data (已有数据)
{existing_data}

# New Data (新数据)
{new_data}
"""
    
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
    
    def _create_extract_prompt(self, content: str = "") -> str:
        """
        创建AI提取提示词
        
        Args:
            content: 可选的内容参数
            
        Returns:
            str: 格式化后的提示词
        """
        return self.EXTRACT_PROMPT_TEMPLATE.format(content=content)
    
    def _create_merge_prompt(self, existing_data: List[Dict[str, Any]], new_data: List[Dict[str, Any]]) -> str:
        """
        创建AI整合去重提示词
        
        Args:
            existing_data: 已有数据
            new_data: 新数据
            
        Returns:
            str: 格式化后的提示词
        """
        existing_json = json.dumps(existing_data, ensure_ascii=False, indent=2)
        new_json = json.dumps(new_data, ensure_ascii=False, indent=2)
        
        # 限制内容长度，避免超出token限制
        if len(existing_json) > self.max_content_length:
            existing_json = existing_json[:self.max_content_length] + "...[内容已截断]"
        if len(new_json) > self.max_content_length:
            new_json = new_json[:self.max_content_length] + "...[内容已截断]"
        
        return self.MERGE_PROMPT_TEMPLATE.format(
            existing_data=existing_json,
            new_data=new_json
        )
    
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
                    tools.append({
                        "name": item.get("name", "").strip(),
                        "description": item.get("description", "").strip(),
                        "url": item.get("url", "").strip(),
                        "category": item.get("category", "").strip(),
                        "tags": item.get("tags", []) if isinstance(item.get("tags"), list) else []
                    })
            
            logger.info(f"成功解析 {len(tools)} 个工具")
            return tools
            
        except json.JSONDecodeError as e:
            logger.error(f"解析AI响应JSON失败: {str(e)}")
            logger.debug(f"响应内容: {response.content[:500]}")
            return []
        except Exception as e:
            logger.exception(f"解析AI响应时出错: {str(e)}")
            return []
    
    def extract_tools_with_ai(
        self, 
        content: str = "",
        use_all_providers: bool = True
    ) -> List[Dict[str, Any]]:
        """
        使用AI提供者提取工具信息（多次调用）
        
        Args:
            content: 可选的内容参数
            use_all_providers: 是否使用所有可用的提供者
            
        Returns:
            List[Dict[str, Any]]: 提取并去重后的工具列表
        """
        # 创建提示词
        prompt = self._create_extract_prompt(content)
        
        # 确定要使用的提供者
        providers_to_use = self.providers if use_all_providers else [self.providers[0]] if self.providers else []
        
        if not providers_to_use:
            logger.warning("没有可用的AI提供者")
            return []
        
        logger.info(f"使用 {len(providers_to_use)} 个AI提供者提取工具信息")
        
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
            # 确定唯一标识
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
                # 合并标签
                existing_tags = existing.get("tags", [])
                new_tags = tool.get("tags", [])
                tools_dict[identifier]["tags"] = list(set(existing_tags + new_tags))
            else:
                tools_dict[identifier] = tool.copy()
        
        result = list(tools_dict.values())
        logger.info(f"简单去重完成，原始工具数: {len(tools)}, 去重后: {len(result)}")
        return result
    
    def merge_with_ai(
        self,
        existing_data: List[Dict[str, Any]],
        new_data: List[Dict[str, Any]],
        provider_name: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        使用AI提供者整合去重数据
        
        Args:
            existing_data: 已有数据
            new_data: 新数据
            provider_name: 使用的AI提供者名称，如果为None则使用第一个可用提供者
            
        Returns:
            List[Dict[str, Any]]: 整合去重后的数据
        """
        if not new_data:
            logger.info("新数据为空，返回已有数据")
            return existing_data
        
        if not existing_data:
            logger.info("已有数据为空，返回新数据")
            return new_data
        
        # 确定使用的提供者
        if provider_name is None:
            available_providers = self.providers
            if not available_providers:
                logger.warning("没有可用的AI提供者，使用简单去重")
                return self._simple_deduplicate(existing_data + new_data)
            provider_name = available_providers[0]
        
        try:
            logger.info(f"使用 {provider_name} 进行数据整合去重...")
            provider = AIProviderFactory.create_provider(provider_name)
            if provider is None:
                logger.warning(f"无法创建 {provider_name} 提供者，使用简单去重")
                return self._simple_deduplicate(existing_data + new_data)
            
            # 创建整合提示词
            prompt = self._create_merge_prompt(existing_data, new_data)
            
            # 调用AI进行整合
            response = provider.chat(prompt)
            merged_data = self._parse_ai_response(response)
            
            if merged_data:
                logger.info(f"AI整合完成，整合后共 {len(merged_data)} 个工具")
                return merged_data
            else:
                logger.warning("AI整合失败，使用简单去重")
                return self._simple_deduplicate(existing_data + new_data)
                
        except Exception as e:
            logger.exception(f"使用AI整合数据时出错: {str(e)}，使用简单去重")
            return self._simple_deduplicate(existing_data + new_data)
    
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
    
    def save_tools(self, data: List[Dict[str, Any]]) -> bool:
        """
        保存数据到tools.json
        
        Args:
            data: 要保存的数据列表
            
        Returns:
            bool: 是否保存成功
        """
        try:
            # 确保目录存在
            DATA_DIR.mkdir(parents=True, exist_ok=True)
            
            # 保存数据
            with open(TOOLS_FILE, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            
            logger.info(f"成功保存 {len(data)} 条数据到 {TOOLS_FILE}")
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
            
            # 2. 使用AI提取新数据
            logger.info("步骤2: 使用AI提取新数据...")
            new_data = self.extract_tools_with_ai(content=content, use_all_providers=use_all_providers)
            logger.info(f"提取到 {len(new_data)} 条新数据")
            
            # 3. 使用AI整合去重
            logger.info("步骤3: 使用AI整合去重...")
            merged_data = self.merge_with_ai(existing_data, new_data)
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
    
    # 配置日志（从配置文件读取，环境变量可覆盖）
    log_level = os.getenv("LOG_LEVEL", ConfigManager.get_crawler_config("log_level", "WARNING")).upper()
    logging.basicConfig(
        level=getattr(logging, log_level, logging.WARNING),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler(f'crawl_{datetime.now().strftime("%Y%m%d")}.log')
        ]
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
