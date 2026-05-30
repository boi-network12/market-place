// contexts/NotificationContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { 
  notificationApi, 
  AppNotification, 
  NotificationPreferences 
} from '@/services/notification-api.service';

// Define proper types for preference updates
type EmailPreferencesUpdate = {
  enabled?: boolean;
  types?: Partial<NotificationPreferences['emailNotifications']['types']>;
  digest?: Partial<NotificationPreferences['emailNotifications']['digest']>;
};

type PushPreferencesUpdate = {
  enabled?: boolean;
  types?: Partial<NotificationPreferences['pushNotifications']['types']>;
};

type InAppPreferencesUpdate = {
  enabled?: boolean;
  types?: Partial<NotificationPreferences['inAppNotifications']['types']>;
};

type QuietHoursUpdate = {
  enabled?: boolean;
  start?: string;
  end?: string;
  timezone?: string;
};

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  preferences: NotificationPreferences | null;
  currentPage: number;
  totalNotifications: number;
  
  fetchNotifications: (page?: number, limit?: number) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
  updateEmailPreferences: (settings: EmailPreferencesUpdate) => Promise<void>;
  updatePushPreferences: (settings: PushPreferencesUpdate) => Promise<void>;
  updateInAppPreferences: (settings: InAppPreferencesUpdate) => Promise<void>;
  updateQuietHours: (settings: QuietHoursUpdate) => Promise<void>;
  resetPreferences: () => Promise<void>;
  registerDeviceToken: (token: string) => Promise<void>;
  unregisterDeviceToken: (token: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const POLLING_INTERVAL = 30000; // 30 seconds

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNotifications, setTotalNotifications] = useState(0);

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);

  // ====================== API CALLS ======================

  const fetchNotifications = useCallback(async (page = 1, limit = 20) => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      const response = await notificationApi.getNotifications({ page, limit });

      if (page === 1) {
        setNotifications(response.notifications);
      } else {
        setNotifications(prev => [...prev, ...response.notifications]);
      }

      setUnreadCount(response.unreadCount);
      setTotalNotifications(response.total);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const count = await notificationApi.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  }, [isAuthenticated]);

  const fetchPreferences = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const prefs = await notificationApi.getPreferences();
      setPreferences(prefs);
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
    }
  }, [isAuthenticated]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationApi.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId
            ? { ...notif, isRead: true, readAt: new Date().toISOString() }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true, readAt: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      throw error;
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      await notificationApi.deleteNotification(notificationId);

      const wasUnread = notifications.some(n => n._id === notificationId && !n.isRead);

      setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
      if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1));
      setTotalNotifications(prev => prev - 1);
    } catch (error) {
      console.error('Failed to delete notification:', error);
      throw error;
    }
  }, [notifications]);

  const deleteAllNotifications = useCallback(async () => {
    try {
      await notificationApi.deleteAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
      setTotalNotifications(0);
    } catch (error) {
      console.error('Failed to delete all notifications:', error);
      throw error;
    }
  }, []);

  const updateEmailPreferences = useCallback(async (settings: EmailPreferencesUpdate) => {
    try {
      const updated = await notificationApi.updateEmailPreferences(settings);
      setPreferences(updated);
    } catch (error) {
      console.error('Failed to update email preferences:', error);
      throw error;
    }
  }, []);

  const updatePushPreferences = useCallback(async (settings: PushPreferencesUpdate) => {
    try {
      const updated = await notificationApi.updatePushPreferences(settings);
      setPreferences(updated);
    } catch (error) {
      console.error('Failed to update push preferences:', error);
      throw error;
    }
  }, []);

  const updateInAppPreferences = useCallback(async (settings: InAppPreferencesUpdate) => {
    try {
      const updated = await notificationApi.updateInAppPreferences(settings);
      setPreferences(updated);
    } catch (error) {
      console.error('Failed to update in-app preferences:', error);
      throw error;
    }
  }, []);

  const updateQuietHours = useCallback(async (settings: QuietHoursUpdate) => {
    try {
      const updated = await notificationApi.updateQuietHours(settings);
      setPreferences(updated);
    } catch (error) {
      console.error('Failed to update quiet hours:', error);
      throw error;
    }
  }, []);

  const resetPreferences = useCallback(async () => {
    try {
      const updated = await notificationApi.resetPreferences();
      setPreferences(updated);
    } catch (error) {
      console.error('Failed to reset preferences:', error);
      throw error;
    }
  }, []);

  const registerDeviceToken = useCallback(async (token: string) => {
    try {
      await notificationApi.registerDeviceToken(token);
    } catch (error) {
      console.error('Failed to register device token:', error);
    }
  }, []);

  const unregisterDeviceToken = useCallback(async (token: string) => {
    try {
      await notificationApi.unregisterDeviceToken(token);
    } catch (error) {
      console.error('Failed to unregister device token:', error);
    }
  }, []);

  // ====================== POLLING ======================

  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);

    pollingIntervalRef.current = setInterval(() => {
      if (isAuthenticated && document.visibilityState === 'visible') {
        fetchUnreadCount();
        if (window.location.pathname === '/notifications') {
          fetchNotifications(currentPage);
        }
      }
    }, POLLING_INTERVAL);
  }, [isAuthenticated, fetchUnreadCount, fetchNotifications, currentPage]);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // Reset state when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
    // eslint-disable-next-line react-hooks/set-state-in-effect
      setNotifications([]);
      setUnreadCount(0);
      setPreferences(null);
      setCurrentPage(1);
      setTotalNotifications(0);
      isInitializedRef.current = false;
      stopPolling();
    }
  }, [isAuthenticated, stopPolling]);

  // Initialize when user logs in
  useEffect(() => {
    if (isAuthenticated && !isInitializedRef.current) {
      isInitializedRef.current = true;
      fetchNotifications(1);
      fetchPreferences();
      startPolling();
    }
  }, [isAuthenticated, fetchNotifications, fetchPreferences, startPolling]);

  // Visibility change handler
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated) {
        fetchUnreadCount();
        startPolling();
      } else {
        stopPolling();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isAuthenticated, fetchUnreadCount, startPolling, stopPolling]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    preferences,
    currentPage,
    totalNotifications,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    updateEmailPreferences,
    updatePushPreferences,
    updateInAppPreferences,
    updateQuietHours,
    resetPreferences,
    registerDeviceToken,
    unregisterDeviceToken,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}