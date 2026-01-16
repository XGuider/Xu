"""
AI提供者工厂类
使用工厂模式创建不同的AI提供者实例，实现调用方和被调用方的解耦
"""
import sys
from typing import Optional, Dict
from pathlib import Path

# 处理导入路径，支持直接运行和作为模块导入
try:
    # 先尝试相对导入（作为模块导入时）
    from .base import AIProvider
    from .config import ConfigManager
    from .providers import (
        DeepSeekProvider,
        SiliconFlowProvider,
        KimiProvider,
        DoubaoProvider
    )
except (ImportError, ValueError):
    # 相对导入失败时，使用绝对导入（直接运行时）
    from base import AIProvider
    from config import ConfigManager
    from providers import (
        DeepSeekProvider,
        SiliconFlowProvider,
        KimiProvider,
        DoubaoProvider
    )


class AIProviderFactory:
    """AI提供者工厂类
    
    负责创建和管理不同的AI提供者实例
    调用方只需要知道提供者名称，不需要了解具体实现
    """
    
    # 提供者类映射
    PROVIDER_CLASSES: Dict[str, type] = {
        "deepseek": DeepSeekProvider,
        "siliconflow": SiliconFlowProvider,
        "kimi": KimiProvider,
        "doubao": DoubaoProvider,
    }
    
    @classmethod
    def create_provider(
        cls, 
        provider_name: str,
        api_key: Optional[str] = None,
        base_url: Optional[str] = None
    ) -> Optional[AIProvider]:
        """
        创建AI提供者实例
        
        Args:
            provider_name: 提供者名称（deepseek, siliconflow, kimi, doubao）
            api_key: API密钥（可选，如果不提供则从配置中读取）
            base_url: API基础URL（可选）
        
        Returns:
            AIProvider: AI提供者实例，如果创建失败则返回None
        
        Raises:
            ValueError: 当提供者名称无效时
        """
        provider_name = provider_name.lower()
        
        if provider_name not in cls.PROVIDER_CLASSES:
            raise ValueError(
                f"不支持的提供者: {provider_name}。"
                f"支持的提供者: {', '.join(cls.PROVIDER_CLASSES.keys())}"
            )
        
        # 如果没有提供api_key，尝试从配置中获取
        if api_key is None:
            config = ConfigManager.get_config(provider_name)
            if config is None:
                env_key_mapping = ConfigManager.get_env_key_mapping()
                env_key = env_key_mapping.get(provider_name)
                raise ValueError(
                    f"未找到 {provider_name} 的配置。"
                    f"请设置环境变量 {env_key or '对应的环境变量'}"
                )
            api_key = config.api_key
            if base_url is None:
                base_url = config.base_url
        
        if not api_key:
            raise ValueError(f"{provider_name} 的API密钥不能为空")
        
        # 获取提供者类并创建实例
        provider_class = cls.PROVIDER_CLASSES[provider_name]
        return provider_class(api_key=api_key, base_url=base_url)
    
    @classmethod
    def get_available_providers(cls) -> list:
        """
        获取所有可用的提供者列表（已配置的）
        
        Returns:
            list: 可用提供者名称列表
        """
        return list(ConfigManager.get_all_configs().keys())
    
    @classmethod
    def is_provider_available(cls, provider_name: str) -> bool:
        """
        检查指定提供者是否可用（已配置）
        
        Args:
            provider_name: 提供者名称
        
        Returns:
            bool: 是否可用
        """
        return ConfigManager.is_configured(provider_name.lower())
    
    @classmethod
    def create_all_available_providers(cls) -> Dict[str, AIProvider]:
        """
        创建所有已配置的提供者实例
        
        Returns:
            Dict[str, AIProvider]: 提供者名称到实例的映射
        """
        providers = {}
        for provider_name in cls.get_available_providers():
            try:
                provider = cls.create_provider(provider_name)
                if provider:
                    providers[provider_name] = provider
            except Exception as e:
                print(f"创建 {provider_name} 提供者失败: {e}")
        return providers
