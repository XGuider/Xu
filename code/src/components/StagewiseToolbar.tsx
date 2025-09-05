'use client';

import { useEffect } from 'react';

// 动态导入工具栏，避免在服务端执行
const initStagewiseToolbar = async () => {
  // 只在开发环境中初始化
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  try {
    // 动态导入工具栏
    const { initToolbar } = await import('@21st-extension/toolbar');

    // 定义工具栏配置
    const stagewiseConfig = {
      plugins: [
        // 可以在这里添加更多插件
        // 例如：性能监控、错误追踪、调试工具等
      ],
      // 工具栏主题配置
      theme: {
        primary: '#3b82f6', // 使用项目的蓝色主题
        background: '#ffffff',
        text: '#1f2937',
      },
      // 工具栏位置配置
      position: 'bottom-right',
      // 是否显示工具栏切换按钮
      showToggle: true,
    };

    // 初始化工具栏
    initToolbar(stagewiseConfig);

    console.warn('Stagewise toolbar initialized successfully');
  } catch (error) {
    console.warn('Failed to initialize Stagewise toolbar:', error);
  }
};

/**
 * Stagewise工具栏组件
 * 仅在开发环境中初始化工具栏
 */
export function StagewiseToolbar() {
  useEffect(() => {
    // 在客户端挂载后初始化工具栏
    initStagewiseToolbar();
  }, []);

  // 这个组件不渲染任何内容
  return null;
}
