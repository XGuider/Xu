"""
配置管理模块
统一管理所有AI服务的API密钥和配置信息
从config.yaml文件读取配置，支持环境变量覆盖
"""
import os
import yaml
import logging
from typing import Dict, Optional
from dataclasses import dataclass
from pathlib import Path

logger = logging.getLogger(__name__)


@dataclass
class ProviderConfig:
    """单个提供者的配置"""
    api_key: str
    base_url: Optional[str] = None
    model: Optional[str] = None  # 默认模型
    temperature: float = 0.7
    max_tokens: int = 2000


class ConfigManager:
    """配置管理器
    
    从config.yaml文件读取配置，环境变量中的API密钥会覆盖配置文件
    支持多种配置方式，便于不同环境使用
    """
    
    # 配置文件路径
    CONFIG_FILE = Path(__file__).parent / "config.yaml"
    
    # 缓存的配置数据
    _config_data: Optional[Dict] = None
    
    @classmethod
    def _load_config_file(cls) -> Dict:
        """
        加载配置文件
        
        Returns:
            Dict: 配置数据字典
        """
        if cls._config_data is not None:
            return cls._config_data
        
        try:
            if cls.CONFIG_FILE.exists():
                with open(cls.CONFIG_FILE, 'r', encoding='utf-8') as f:
                    cls._config_data = yaml.safe_load(f) or {}
                logger.info(f"成功加载配置文件: {cls.CONFIG_FILE}")
            else:
                logger.warning(f"配置文件不存在: {cls.CONFIG_FILE}，使用默认配置")
                cls._config_data = {}
        except Exception as e:
            logger.exception(f"加载配置文件失败: {str(e)}，使用默认配置")
            cls._config_data = {}
        
        return cls._config_data
    
    @classmethod
    def _get_provider_config_from_yaml(cls, provider_name: str) -> Optional[Dict]:
        """
        从YAML配置文件中获取提供者配置
        
        Args:
            provider_name: 提供者名称
            
        Returns:
            Dict: 提供者配置字典，如果不存在则返回None
        """
        config_data = cls._load_config_file()
        providers = config_data.get("providers", {})
        return providers.get(provider_name.lower())
    
    @classmethod
    def get_env_key_mapping(cls) -> Dict[str, str]:
        """
        获取环境变量键名映射（从配置文件读取）
        
        Returns:
            Dict[str, str]: 提供者名称到环境变量键名的映射
        """
        config_data = cls._load_config_file()
        providers = config_data.get("providers", {})
        mapping = {}
        for provider_name, provider_config in providers.items():
            if isinstance(provider_config, dict) and "env_key" in provider_config:
                mapping[provider_name] = provider_config["env_key"]
        return mapping
    
    @classmethod
    def get_default_base_urls(cls) -> Dict[str, str]:
        """
        获取默认API基础URL（从配置文件读取）
        
        Returns:
            Dict[str, str]: 提供者名称到基础URL的映射
        """
        config_data = cls._load_config_file()
        providers = config_data.get("providers", {})
        urls = {}
        for provider_name, provider_config in providers.items():
            if isinstance(provider_config, dict) and "default_base_url" in provider_config:
                urls[provider_name] = provider_config["default_base_url"]
        return urls
    
    @classmethod
    def get_crawler_config(cls, key: str, default=None):
        """
        获取爬虫配置
        
        Args:
            key: 配置键名
            default: 默认值
            
        Returns:
            配置值
        """
        config_data = cls._load_config_file()
        crawler_config = config_data.get("crawler", {})
        return crawler_config.get(key, default)
    
    @classmethod
    def get_data_config(cls, key: str, default=None):
        """
        获取数据文件配置
        
        Args:
            key: 配置键名
            default: 默认值
            
        Returns:
            配置值
        """
        config_data = cls._load_config_file()
        data_config = config_data.get("data", {})
        return data_config.get(key, default)
    
    @classmethod
    def get_config(cls, provider_name: str) -> Optional[ProviderConfig]:
        """
        获取指定提供者的配置
        
        Args:
            provider_name: 提供者名称（deepseek, siliconflow, kimi, doubao）
        
        Returns:
            ProviderConfig: 配置对象，如果未配置则返回None
        """
        provider_name_lower = provider_name.lower()
        
        # 从配置文件获取提供者配置
        provider_yaml_config = cls._get_provider_config_from_yaml(provider_name_lower)
        if not provider_yaml_config:
            logger.warning(f"配置文件中未找到 {provider_name_lower} 的配置")
            return None
        
        # 从环境变量获取API密钥（优先使用环境变量）
        env_key = provider_yaml_config.get("env_key")
        if not env_key:
            logger.warning(f"{provider_name_lower} 配置中未找到 env_key")
            return None
        
        api_key = os.getenv(env_key)
        if not api_key:
            return None
        
        # 从配置文件获取其他配置
        base_url = provider_yaml_config.get("default_base_url")
        model = provider_yaml_config.get("default_model")
        temperature = provider_yaml_config.get("temperature", 0.7)
        max_tokens = provider_yaml_config.get("max_tokens", 2000)
        
        return ProviderConfig(
            api_key=api_key,
            base_url=base_url,
            model=model,
            temperature=temperature,
            max_tokens=max_tokens
        )
    
    @classmethod
    def get_all_configs(cls) -> Dict[str, ProviderConfig]:
        """
        获取所有已配置的提供者配置
        
        Returns:
            Dict[str, ProviderConfig]: 提供者名称到配置的映射
        """
        configs = {}
        config_data = cls._load_config_file()
        providers = config_data.get("providers", {})
        
        for provider_name in providers.keys():
            config = cls.get_config(provider_name)
            if config:
                configs[provider_name] = config
        return configs
    
    @classmethod
    def is_configured(cls, provider_name: str) -> bool:
        """
        检查指定提供者是否已配置
        
        Args:
            provider_name: 提供者名称
        
        Returns:
            bool: 是否已配置
        """
        return cls.get_config(provider_name) is not None
