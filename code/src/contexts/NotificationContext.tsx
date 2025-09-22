'use client';

import type { NotificationType } from '@/components/ui/Notification';
import React, { createContext, use, useCallback, useMemo, useState } from 'react';
import Notification from '@/components/ui/Notification';

export type NotificationData = {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
};

type NotificationContextType = {
  notifications: NotificationData[];
  addNotification: (notification: Omit<NotificationData, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = use(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

type NotificationProviderProps = {
  children: React.ReactNode;
};

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const addNotification = useCallback((notification: Omit<NotificationData, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };

    setNotifications(prev => [...prev, newNotification]);

    // 自动移除通知
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 3000);
    }
  }, [removeNotification]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const value: NotificationContextType = useMemo(() => ({
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  }), [notifications, addNotification, removeNotification, clearNotifications]);

  return (
    <NotificationContext value={value}>
      {children}
      {/* 渲染所有通知 */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            type={notification.type}
            message={notification.message}
            duration={0} // 由上下文管理自动移除
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext>
  );
};
