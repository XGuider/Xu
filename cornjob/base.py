"""
AI提供者抽象基类
定义统一的接口规范，实现调用方和被调用方的解耦
"""
import logging
from abc import ABC, abstractmethod
from typing import Dict, Optional, Any
from dataclasses import dataclass

# 配置日志
logger = logging.getLogger(__name__)


@dataclass
class AIResponse:
    """AI API响应数据类"""
    content: str  # 返回的内容
    success: bool  # 是否成功
    error_message: Optional[str] = None  # 错误信息
    usage: Optional[Dict[str, Any]] = None  # 使用量信息（token等）
    model: Optional[str] = None  # 使用的模型


class AIProvider(ABC):
    """AI提供者抽象基类
    
    所有AI服务提供者都需要实现这个接口，确保调用方可以统一使用
    """
    
    def __init__(self, api_key: str, base_url: Optional[str] = None):
        """
        初始化AI提供者
        
        Args:
            api_key: API密钥
            base_url: API基础URL（可选，某些服务可能需要）
        """
        self.api_key = api_key
        self.base_url = base_url
        logger.info(f"初始化 {self.__class__.__name__}，base_url: {base_url}")
        self._validate_config()
    
    @abstractmethod
    def _validate_config(self) -> None:
        """验证配置是否有效"""
        pass
    
    @abstractmethod
    def chat(self, prompt: str, **kwargs) -> AIResponse:
        """
        发送聊天请求
        
        Args:
            prompt: 提示词
            **kwargs: 其他参数（如temperature, max_tokens等）
        
        Returns:
            AIResponse: 响应对象
        """
        pass
    
    @abstractmethod
    def get_provider_name(self) -> str:
        """获取提供者名称"""
        pass
    
    @abstractmethod
    def get_default_model(self) -> str:
        """获取默认模型名称"""
        pass
    
    def _create_error_response(self, error_message: str) -> AIResponse:
        """创建错误响应"""
        logger.error(f"{self.__class__.__name__} 错误: {error_message}")
        return AIResponse(
            content="",
            success=False,
            error_message=error_message
        )
    
    def _create_success_response(
        self, 
        content: str, 
        usage: Optional[Dict[str, Any]] = None,
        model: Optional[str] = None
    ) -> AIResponse:
        """创建成功响应"""
        logger.info(
            f"{self.__class__.__name__} 成功响应，"
            f"模型: {model or self.get_default_model()}, "
            f"内容长度: {len(content)}"
        )
        if usage:
            logger.debug(f"使用量信息: {usage}")
        return AIResponse(
            content=content,
            success=True,
            usage=usage,
            model=model or self.get_default_model()
        )
