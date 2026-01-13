'use client';

import type { Tool } from '@/types';
import React, { createContext, use, useCallback, useMemo, useState } from 'react';

type ToolDetailContextType = {
  isOpen: boolean;
  tool: Tool | null;
  openToolDetail: (tool: Tool) => void;
  closeToolDetail: () => void;
};

const ToolDetailContext = createContext<ToolDetailContextType | undefined>(undefined);

export function ToolDetailProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tool, setTool] = useState<Tool | null>(null);

  const openToolDetail = useCallback((toolData: Tool) => {
    setTool(toolData);
    setIsOpen(true);
    // 防止背景滚动
    document.body.style.overflow = 'hidden';
  }, []);

  const closeToolDetail = useCallback(() => {
    setIsOpen(false);
    setTool(null);
    // 恢复背景滚动
    document.body.style.overflow = '';
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      tool,
      openToolDetail,
      closeToolDetail,
    }),
    [isOpen, tool, openToolDetail, closeToolDetail],
  );

  return (
    <ToolDetailContext value={value}>
      {children}
    </ToolDetailContext>
  );
}

export function useToolDetail() {
  const context = use(ToolDetailContext);
  if (context === undefined) {
    throw new Error('useToolDetail must be used within a ToolDetailProvider');
  }
  return context;
}
