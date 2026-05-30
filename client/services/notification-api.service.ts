import { api } from './api';

// Rename to avoid conflict with browser's Notification API
export interface AppNotification {
  _id: string;
  userId: string;
  type: 'system' | 'security' | 'order' | 'payment' | 'product' | 'seller' | 'message';
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  isDeleted: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  actionLabel?: string;
  expiresAt?: string;
  createdAt: string;
  readAt?: string;
}

export interface NotificationPreferences {
  _id: string;
  userId: string;
  emailNotifications: {
    enabled: boolean;
    types: {
      system: boolean;
      security: boolean;
      order: boolean;
      payment: boolean;
      product: boolean;
      seller: boolean;
      message: boolean;
    };
    digest: {
      enabled: boolean;
      frequency: 'instant' | 'daily' | 'weekly';
    };
  };
  pushNotifications: {
    enabled: boolean;
    types: {
      system: boolean;
      security: boolean;
      order: boolean;
      payment: boolean;
      product: boolean;
      seller: boolean;
      message: boolean;
    };
    deviceTokens: string[];
  };
  inAppNotifications: {
    enabled: boolean;
    types: {
      system: boolean;
      security: boolean;
      order: boolean;
      payment: boolean;
      product: boolean;
      seller: boolean;
      message: boolean;
    };
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
    timezone: string;
  };
}

export interface NotificationsResponse {
  notifications: AppNotification[];
  total: number;
  unreadCount: number;
}

// Generic API Response wrapper
interface ApiResponse<T = unknown> {
  success?: boolean;
  data: T;
  message?: string;
  error?: unknown;
}

class NotificationApiService {
  private baseURL = '/notifications';

  async getNotifications(params?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
    type?: string;
  }): Promise<NotificationsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params?.unreadOnly) queryParams.append('unreadOnly', 'true');
    if (params?.type) queryParams.append('type', params.type);

    const url = `${this.baseURL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await api.call<ApiResponse<NotificationsResponse>>(url, { method: 'GET' });
    return response.data;
  }

  async getUnreadCount(): Promise<number> {
    const response = await api.call<ApiResponse<{ count: number }>>(
      `${this.baseURL}/unread/count`,
      { method: 'GET' }
    );
    return response.data.count;
  }

  async markAsRead(notificationId: string): Promise<AppNotification> {
    const response = await api.call<ApiResponse<AppNotification>>(
      `${this.baseURL}/${notificationId}/read`,
      { method: 'PUT' }
    );
    return response.data;
  }

  async markAllAsRead(): Promise<{ count: number }> {
    const response = await api.call<ApiResponse<{ count: number }>>(
      `${this.baseURL}/read-all`,
      { method: 'PUT' }
    );
    return response.data;
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await api.call<void>(`${this.baseURL}/${notificationId}`, { method: 'DELETE' });
  }

  async deleteAllNotifications(): Promise<{ count: number }> {
    const response = await api.call<ApiResponse<{ count: number }>>(
      this.baseURL,
      { method: 'DELETE' }
    );
    return response.data;
  }

  async getPreferences(): Promise<NotificationPreferences> {
    const response = await api.call<ApiResponse<NotificationPreferences>>(
      `${this.baseURL}/preferences`,
      { method: 'GET' }
    );
    return response.data;
  }

  async updateEmailPreferences(settings: {
    enabled?: boolean;
    types?: Partial<NotificationPreferences['emailNotifications']['types']>;
    digest?: Partial<NotificationPreferences['emailNotifications']['digest']>;
  }): Promise<NotificationPreferences> {
    const response = await api.call<ApiResponse<NotificationPreferences>>(
      `${this.baseURL}/preferences/email`,
      {
        method: 'PUT',
        body: JSON.stringify(settings),
      }
    );
    return response.data;
  }

  async updatePushPreferences(settings: {
    enabled?: boolean;
    types?: Partial<NotificationPreferences['pushNotifications']['types']>;
  }): Promise<NotificationPreferences> {
    const response = await api.call<ApiResponse<NotificationPreferences>>(
      `${this.baseURL}/preferences/push`,
      {
        method: 'PUT',
        body: JSON.stringify(settings),
      }
    );
    return response.data;
  }

  async updateInAppPreferences(settings: {
    enabled?: boolean;
    types?: Partial<NotificationPreferences['inAppNotifications']['types']>;
  }): Promise<NotificationPreferences> {
    const response = await api.call<ApiResponse<NotificationPreferences>>(
      `${this.baseURL}/preferences/in-app`,
      {
        method: 'PUT',
        body: JSON.stringify(settings),
      }
    );
    return response.data;
  }

  async updateQuietHours(settings: {
    enabled?: boolean;
    start?: string;
    end?: string;
    timezone?: string;
  }): Promise<NotificationPreferences> {
    const response = await api.call<ApiResponse<NotificationPreferences>>(
      `${this.baseURL}/preferences/quiet-hours`,
      {
        method: 'PUT',
        body: JSON.stringify(settings),
      }
    );
    return response.data;
  }

  async resetPreferences(): Promise<NotificationPreferences> {
    const response = await api.call<ApiResponse<NotificationPreferences>>(
      `${this.baseURL}/preferences/reset`,
      { method: 'POST' }
    );
    return response.data;
  }

  async registerDeviceToken(deviceToken: string): Promise<void> {
    await api.call<void>(`${this.baseURL}/device-token`, {
      method: 'POST',
      body: JSON.stringify({ deviceToken }),
    });
  }

  async unregisterDeviceToken(deviceToken: string): Promise<void> {
    await api.call<void>(`${this.baseURL}/device-token`, {
      method: 'DELETE',
      body: JSON.stringify({ deviceToken }),
    });
  }
}

export const notificationApi = new NotificationApiService();