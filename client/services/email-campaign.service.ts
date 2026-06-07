// services/email-campaign.service.ts
import { api } from './api';

export interface EmailCampaign {
  _id: string;
  subject: string;
  content: string;
  htmlContent: string;
  type: 'newsletter' | 'announcement' | 'promotion' | 'custom';
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  scheduledFor?: string;
  sentAt?: string;
  recipientType: 'all' | 'subscribers' | 'users' | 'specific';
  recipientEmails?: string[];
  recipientIds?: string[];
  statistics: {
    total: number;
    sent: number;
    failed: number;
    opened: number;
    clicked: number;
  };
  createdBy: {
    userId: string;
    email: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignData {
  subject: string;
  content: string;
  htmlContent: string;
  type?: EmailCampaign['type'];
  recipientType: EmailCampaign['recipientType'];
  recipientEmails?: string[];
  recipientIds?: string[];
  scheduledFor?: string;
}

export interface SendToUsersData {
  subject: string;
  content: string;
  htmlContent: string;
  userIds: string[];
}

class EmailCampaignService {
  private baseURL = '/admin/email';

  async getCampaigns(filters?: {
    status?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<{ campaigns: EmailCampaign[]; total: number; page: number; totalPages: number }> {
    const queryParams = new URLSearchParams();
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.type) queryParams.append('type', filters.type);
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());
    
    const url = `${this.baseURL}/campaigns${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.call(url, { method: 'GET' }) as {
      data: { campaigns: EmailCampaign[]; total: number; page: number; totalPages: number };
    };
    return response.data;
  }

  async getCampaign(id: string): Promise<EmailCampaign> {
    const response = await api.call(`${this.baseURL}/campaigns/${id}`, { method: 'GET' }) as {
      data: { campaign: EmailCampaign };
    };
    return response.data.campaign;
  }

  async createCampaign(data: CreateCampaignData): Promise<{ campaign: EmailCampaign; result?: { sent: number; failed: number } }> {
    const response = await api.call(`${this.baseURL}/campaigns`, {
      method: 'POST',
      body: JSON.stringify(data),
    }) as {
      data: { campaign: EmailCampaign; result?: { sent: number; failed: number } };
    };
    return response.data;
  }

  async updateCampaign(id: string, updates: Partial<EmailCampaign>): Promise<EmailCampaign> {
    const response = await api.call(`${this.baseURL}/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }) as {
      data: { campaign: EmailCampaign };
    };
    return response.data.campaign;
  }

  async deleteCampaign(id: string): Promise<void> {
    await api.call(`${this.baseURL}/campaigns/${id}`, { method: 'DELETE' });
  }

  async sendCampaign(id: string): Promise<{ sent: number; failed: number }> {
    const response = await api.call(`${this.baseURL}/campaigns/${id}/send`, { method: 'POST' }) as {
      data: { sent: number; failed: number };
    };
    return response.data;
  }

  async sendToSpecificUsers(data: SendToUsersData): Promise<{ sent: number; failed: number }> {
    const response = await api.call(`${this.baseURL}/send-to-users`, {
      method: 'POST',
      body: JSON.stringify(data),
    }) as {
      data: { sent: number; failed: number };
    };
    return response.data;
  }

  async sendToAllSubscribers(subject: string, content: string, htmlContent: string): Promise<{ sent: number; failed: number }> {
    const response = await api.call(`${this.baseURL}/send-to-subscribers`, {
      method: 'POST',
      body: JSON.stringify({ subject, content, htmlContent }),
    }) as {
      data: { sent: number; failed: number };
    };
    return response.data;
  }

  async sendToAllUsers(subject: string, content: string, htmlContent: string): Promise<{ sent: number; failed: number }> {
    const response = await api.call(`${this.baseURL}/send-to-all-users`, {
      method: 'POST',
      body: JSON.stringify({ subject, content, htmlContent }),
    }) as {
      data: { sent: number; failed: number };
    };
    return response.data;
  }
}

export const emailCampaignService = new EmailCampaignService();