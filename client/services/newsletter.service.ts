// services/newsletter.service.ts
import { api } from './api';

export interface NewsletterSubscriber {
  _id: string;
  email: string;
  interests: string[];
  source: string;
  isVerified: boolean;
  verifiedAt?: string;
  createdAt: string;
}

export interface SubscribeData {
  email: string;
  interests?: string[];
  source?: string;
}

export interface UnsubscribeData {
  email: string;
}

export interface GetSubscribersFilters {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

class NewsletterServiceClass {
  private baseURL = '/newsletter';

  /**
   * Subscribe to newsletter
   */
  async subscribe(data: SubscribeData): Promise<{ success: boolean; message: string; data?: { email: string } }> {
    try {
      const response = await api.call(`${this.baseURL}/subscribe`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response as { success: boolean; message: string; data?: { email: string } };
    } catch (error: unknown) {
      const err = error as Error;
      return {
        success: false,
        message: err?.message || 'Failed to subscribe',
      };
    }
  }

  /**
   * Unsubscribe from newsletter
   */
  async unsubscribe(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.call(`${this.baseURL}/unsubscribe`, {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      return response as { success: boolean; message: string };
    } catch (error: unknown) {
        const err = error as Error;
      return {
        success: false,
        message: err?.message || 'Failed to unsubscribe',
      };
    }
  }

  /**
   * Get all subscribers (Admin only)
   */
  async getSubscribers(filters?: GetSubscribersFilters): Promise<{
    subscribers: NewsletterSubscriber[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();
    if (filters?.search) queryParams.append('search', filters.search);
    if (filters?.isActive !== undefined) queryParams.append('isActive', filters.isActive.toString());
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());

    const url = `/admin/newsletter/subscribers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.call(url, { method: 'GET' }) as {
    data: {
        subscribers: NewsletterSubscriber[];
        total: number;
        page: number;
        totalPages: number;
    };
    };

    return response.data;
  }

  /**
   * Export subscribers (Admin only)
   */
  async exportSubscribers(format: 'csv' | 'json'): Promise<void> {
    const url = `/admin/newsletter/export?format=${format}`;
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `subscribers.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);
  }

  /**
   * Send newsletter to subscribers (Admin only)
   */
  async sendNewsletter(subject: string, content: string, subscriberIds?: string[]): Promise<{ sent: number; failed: number }> {
    const response = await api.call(`/admin/newsletter/send`, {
      method: 'POST',
      body: JSON.stringify({ subject, content, subscriberIds }),
    })as {
    data: {
      sent: number;
      failed: number;
    };
  };
    return response.data;
  }
}

export const NewsletterService = new NewsletterServiceClass();