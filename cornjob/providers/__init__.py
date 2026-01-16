"""
AI提供者实现模块
"""
import sys
from pathlib import Path

# 处理导入路径，支持直接运行和作为模块导入
try:
    # 先尝试相对导入（作为模块导入时）
    from .deepseek import DeepSeekProvider
    from .siliconflow import SiliconFlowProvider
    from .kimi import KimiProvider
    from .doubao import DoubaoProvider
except (ImportError, ValueError):
    # 相对导入失败时，使用绝对导入（直接运行时）
    # 确保父目录在路径中
    parent_dir = str(Path(__file__).parent.parent)
    if parent_dir not in sys.path:
        sys.path.insert(0, parent_dir)
    from deepseek import DeepSeekProvider
    from siliconflow import SiliconFlowProvider
    from kimi import KimiProvider
    from doubao import DoubaoProvider

__all__ = [
    "DeepSeekProvider",
    "SiliconFlowProvider",
    "KimiProvider",
    "DoubaoProvider",
]
