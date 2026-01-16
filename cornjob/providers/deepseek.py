"""
DeepSeek API提供者实现
"""
import logging
import requests
import sys
from typing import Optional, Dict, Any
from pathlib import Path

# 处理导入路径，支持直接运行和作为模块导入
try:
    # 先尝试相对导入（作为模块导入时）
    from ..base import AIProvider, AIResponse
    from ..config import ConfigManager
except (ImportError, ValueError):
    # 相对导入失败时，使用绝对导入（直接运行时）
    sys.path.insert(0, str(Path(__file__).parent.parent))
    from base import AIProvider, AIResponse
    from config import ConfigManager

logger = logging.getLogger(__name__)


class DeepSeekProvider(AIProvider):
    """DeepSeek AI提供者"""
    
    PROVIDER_NAME = "deepseek"
    
    @classmethod
    def _get_default_base_url(cls) -> str:
        """从配置获取默认基础URL"""
        provider_config = ConfigManager._get_provider_config_from_yaml(cls.PROVIDER_NAME)
        if provider_config and "default_base_url" in provider_config:
            return provider_config["default_base_url"]
        return "https://api.deepseek.com/v1/chat/completions"
    
    @classmethod
    def _get_default_model(cls) -> str:
        """从配置获取默认模型"""
        provider_config = ConfigManager._get_provider_config_from_yaml(cls.PROVIDER_NAME)
        if provider_config and "default_model" in provider_config:
            return provider_config["default_model"]
        return "deepseek-chat"
    
    def __init__(self, api_key: str, base_url: Optional[str] = None):
        """
        初始化DeepSeek提供者
        
        Args:
            api_key: DeepSeek API密钥
            base_url: API基础URL（可选，如果不提供则从配置文件读取）
        """
        super().__init__(api_key, base_url or self._get_default_base_url())
    
    def _validate_config(self) -> None:
        """验证配置"""
        if not self.api_key:
            raise ValueError("DeepSeek API密钥不能为空")
    
    def get_provider_name(self) -> str:
        """获取提供者名称"""
        return "deepseek"
    
    def get_default_model(self) -> str:
        """获取默认模型"""
        return self._get_default_model()
    
    def _get_timeout(self) -> int:
        """从配置获取请求超时时间"""
        try:
            timeout = ConfigManager.get_crawler_config("request_timeout", 120)
            return int(timeout)
        except Exception:
            return 120  # 默认 120 秒
    
    def chat(
        self, 
        prompt: str, 
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2000,
        **kwargs
    ) -> AIResponse:
        """
        发送聊天请求到DeepSeek API
        
        Args:
            prompt: 提示词
            model: 模型名称（默认使用deepseek-chat）
            temperature: 温度参数
            max_tokens: 最大token数
            **kwargs: 其他参数
        
        Returns:
            AIResponse: 响应对象
        """
        model = model or self._get_default_model()
        logger.info(f"DeepSeek API 请求 - 模型: {model}, prompt长度: {len(prompt)}")
        try:
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.api_key}"
            }
            
            payload = {
                "model": model,
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "temperature": temperature,
                "max_tokens": max_tokens,
                **kwargs
            }
            
            logger.debug(f"DeepSeek API 请求URL: {self.base_url}")
            timeout = self._get_timeout()
            logger.debug(f"使用超时时间: {timeout} 秒")
            response = requests.post(
                self.base_url,
                headers=headers,
                json=payload,
                timeout=timeout
            )
            response.raise_for_status()
            logger.debug(f"DeepSeek API 响应状态码: {response.status_code}")
            
            data = response.json()
            
            # 解析响应
            if "choices" in data and len(data["choices"]) > 0:
                content = data["choices"][0]["message"]["content"]
                usage = data.get("usage", {})
                
                return self._create_success_response(
                    content=content,
                    usage=usage,
                    model=data.get("model", model)
                )
            else:
                logger.warning("DeepSeek API 响应格式异常，未找到choices字段")
                return self._create_error_response("API响应格式异常")
                
        except requests.exceptions.Timeout as e:
            logger.error(f"DeepSeek API 请求超时: {str(e)}")
            return self._create_error_response(f"请求超时: {str(e)}")
        except requests.exceptions.RequestException as e:
            logger.error(f"DeepSeek API 请求失败: {str(e)}")
            return self._create_error_response(f"请求失败: {str(e)}")
        except Exception as e:
            logger.exception(f"DeepSeek API 处理响应时出错: {str(e)}")
            return self._create_error_response(f"处理响应时出错: {str(e)}")
