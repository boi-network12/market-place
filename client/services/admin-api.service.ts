// services/admin-api.service.ts
import { api } from './api';


export interface AdminUser {
  _id: string;
  fullName: string;
  email: string;
  username: string;
  avatar?: string;
  phoneNumber?: string;
  sellerApproved: boolean;
  emailVerified: boolean;
  createdAt: string | Date;
  lastLogin?: string | Date;
  location?: {
    city?: string;
    country?: string;
  };
  status: 'active' | 'suspended' | 'banned';
  role: 'user' | 'seller' | 'admin' | 'super_admin';
  isSeller?: boolean;
  devices?: Array<{
    _id?: string;
    deviceName: string;
    deviceType: string;
    browser: string;
    os: string;
    lastLogin: string | Date;
    isActive: boolean;
  }>;
  loginHistory?: Array<{
    _id?: string;
    location: string;
    device: string;
    timestamp: string | Date;
  }>;
}

export interface SellerRequest {
  _id: string;
  userId: {
    _id: string;
    email: string;
    fullName: string;
    username: string;
    avatar?: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  data: {
    businessName: string;
    businessAddress: string;
    proofOfAddress: string;
    phoneNumber: string;
    email: string;
    transactionMethods: {
      bank?: { accountName: string; accountNumber: string; bankName: string };
      crypto?: { walletAddress: string; currency: string };
      cashApp?: { username: string };
      paypal?: { email: string };
    };
    documents: Array<{ type: string; url: string }>;
  };
  reviewedBy?: {
    _id: string;
    email: string;
    fullName: string;
  };
  reviewedAt?: Date;
  rejectionReason?: string;
  createdAt: string;
}

export interface TeamMember {
  _id: string;
  userId: string;
  email: string;
  name: string;
  role: 'admin' | 'moderator' | 'support';
  permissions: {
    manageUsers: boolean;
    manageSellers: boolean;
    manageProducts: boolean;
    manageAnnouncements: boolean;
    manageTeams: boolean;
    viewReports: boolean;
    manageEmailSubscribers: boolean;
  };
  addedBy: {
    _id: string;
    email: string;
    fullName: string;
  };
  addedAt: string;
  isActive: boolean;
}

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'emergency';
  targetAudience: 'all' | 'sellers' | 'buyers' | 'verified' | 'unverified';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdBy: {
    _id: string;
    email: string;
    fullName: string;
  };
  sentAt?: string;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
}

export interface EmailSubscriber {
  _id: string;
  email: string;
  interests: string[];
  source: string;
  isVerified: boolean;
  verifiedAt?: string;
   metadata?: {
    ip?: string;        // ✅ Correct field name
    userAgent?: string; // ✅ Correct field name
    location?: string;
    subscribedAt?: string;
  };
  unsubscribedAt?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  totalSellers: number;
  pendingSellers: number;
  totalSubscribers: number;
  totalAnnouncements: number;
  recentActivities: Array<{
    id: string;
    action: string;
    user: string;
    timestamp: string;
  }>;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

class AdminApiService {
  private baseURL = '/admin';

  // ====================== USER MANAGEMENT ======================
  
  async getUsers(filters?: {
    search?: string;
    role?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ users: AdminUser[]; total: number; page: number; totalPages: number }> {
    const queryParams = new URLSearchParams();
    if (filters?.search) queryParams.append('search', filters.search);
    if (filters?.role) queryParams.append('role', filters.role);
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());
    
    const url = `${this.baseURL}/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.call<ApiResponse<{ users: AdminUser[]; total: number; page: number; totalPages: number }>>(url, { method: 'GET' });
    return response.data;
  }

  async updateUserStatus(userId: string, status: 'active' | 'suspended' | 'banned', reason?: string): Promise<void> {
    await api.call(`${this.baseURL}/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, reason }),
    });
  }

  async updateUserRole(userId: string, role: 'user' | 'seller' | 'admin'): Promise<void> {
    await api.call(`${this.baseURL}/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  async deleteUser(userId: string): Promise<void> {
    await api.call(`${this.baseURL}/users/${userId}`, { method: 'DELETE' });
  }

  // ====================== SELLER REQUEST MANAGEMENT ======================
  
  async getSellerRequests(filters?: {
    status?: 'pending' | 'approved' | 'rejected';
    page?: number;
    limit?: number;
  }): Promise<{ requests: SellerRequest[]; total: number; page: number; totalPages: number }> {
    const queryParams = new URLSearchParams();
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());
    
    const url = `${this.baseURL}/seller-requests${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.call<ApiResponse<{ requests: SellerRequest[]; total: number; page: number; totalPages: number }>>(url, { method: 'GET' });
    return response.data;
  }

  async approveSellerRequest(requestId: string): Promise<void> {
    await api.call(`${this.baseURL}/seller-requests/${requestId}/approve`, { method: 'POST' });
  }

  async rejectSellerRequest(requestId: string, reason: string): Promise<void> {
    await api.call(`${this.baseURL}/seller-requests/${requestId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async submitSellerRequest(data: unknown): Promise<void> {
    await api.call('/auth/become-seller-request', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getBadgeCounts(): Promise<{
    sellerRequests: number;
    emailSubscribers: number;
    emailCampaigns: number;
    announcements: number;
    newUsers: number;
    disputes: number;
  }> {
    const response = await api.call<ApiResponse<{
      sellerRequests: number;
      emailSubscribers: number;
      emailCampaigns: number;
      announcements: number;
      newUsers: number;
      disputes: number;
    }>>(`${this.baseURL}/badge-counts`, { method: 'GET' });
    return response.data;
  }

  // ====================== TEAM MANAGEMENT ======================
  
  async getTeamMembers(): Promise<TeamMember[]> {
    const response = await api.call<ApiResponse<{ members: TeamMember[] }>>(`${this.baseURL}/team`, { method: 'GET' });
    return response.data.members;
  }

  async searchUsers(searchTerm: string): Promise<Array<{ _id: string; email: string; fullName: string; avatar?: string }>> {
    const response = await api.call<ApiResponse<{ users: Array<{ _id: string; email: string; fullName: string; avatar?: string }> }>>(
      `${this.baseURL}/team/search?q=${encodeURIComponent(searchTerm)}`,
      { method: 'GET' }
    );
    return response.data.users;
  }

  async addTeamMember(userId: string, email: string, name: string, role: 'admin' | 'moderator' | 'support'): Promise<TeamMember> {
    const response = await api.call<ApiResponse<{ member: TeamMember }>>(`${this.baseURL}/team`, {
      method: 'POST',
      body: JSON.stringify({ userId, email, name, role }),
    });
    return response.data.member;
  }

  async updateTeamMemberRole(memberId: string, role: 'admin' | 'moderator' | 'support'): Promise<TeamMember> {
    const response = await api.call<ApiResponse<{ member: TeamMember }>>(`${this.baseURL}/team/${memberId}`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
    return response.data.member;
  }

  async removeTeamMember(memberId: string): Promise<void> {
    await api.call(`${this.baseURL}/team/${memberId}`, { method: 'DELETE' });
  }

  // ====================== ANNOUNCEMENT MANAGEMENT ======================
  
  async getAnnouncements(filters?: { isActive?: boolean; page?: number; limit?: number }): Promise<{ announcements: Announcement[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (filters?.isActive !== undefined) queryParams.append('isActive', filters.isActive.toString());
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());
    
    const url = `${this.baseURL}/announcements${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.call<ApiResponse<{ announcements: Announcement[]; total: number }>>(url, { method: 'GET' });
    return response.data;
  }

  async createAnnouncement(data: {
    title: string;
    content: string;
    type: string;
    targetAudience: string;
    priority: string;
    expiresAt?: Date;
  }): Promise<Announcement> {
    const response = await api.call<ApiResponse<{ announcement: Announcement }>>(`${this.baseURL}/announcements`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data.announcement;
  }

  async sendAnnouncement(announcementId: string): Promise<{ count: number }> {
    const response = await api.call<ApiResponse<{ count: number }>>(`${this.baseURL}/announcements/${announcementId}/send`, { method: 'POST' });
    return response.data;
  }

  async deleteAnnouncement(announcementId: string): Promise<void> {
    await api.call(`${this.baseURL}/announcements/${announcementId}`, { method: 'DELETE' });
  }

  // ====================== EMAIL SUBSCRIBER MANAGEMENT ======================
  
  async getEmailSubscribers(filters?: {
    search?: string;
    isVerified?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ subscribers: EmailSubscriber[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (filters?.search) queryParams.append('search', filters.search);
    // ✅ Fix: The backend expects 'isActive', not 'isVerified'
    if (filters?.isVerified !== undefined) queryParams.append('isActive', filters.isVerified ? 'true' : 'false');
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());
    
    const url = `/admin/email-subscribers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.call<ApiResponse<{ subscribers: EmailSubscriber[]; total: number }>>(url, { method: 'GET' });
    return response.data;
  }

  async sendEmailToSubscribers(subject: string, content: string, subscriberIds?: string[]): Promise<{ sent: number; failed: number }> {
    const response = await api.call<ApiResponse<{ sent: number; failed: number }>>(`${this.baseURL}/email-subscribers/send`, {
      method: 'POST',
      body: JSON.stringify({ subject, content, subscriberIds }),
    });
    return response.data;
  }

  async exportSubscribers(format: 'csv' | 'json'): Promise<void> {
    const url = `${this.baseURL}/email-subscribers/export?format=${format}`;
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

  // ====================== DASHBOARD ======================
  
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.call<ApiResponse<DashboardStats>>(`${this.baseURL}/stats`, { method: 'GET' });
    return response.data;
  }
}

export const adminApi = new AdminApiService();