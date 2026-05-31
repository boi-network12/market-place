// contexts/AdminContext.tsx
"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { adminApi, AdminUser, SellerRequest, TeamMember, Announcement, EmailSubscriber, DashboardStats } from '@/services/admin-api.service';

interface AdminContextType {
  // State
  isLoading: boolean;
  users: AdminUser[];
  sellerRequests: SellerRequest[];
  teamMembers: TeamMember[];
  announcements: Announcement[];
  emailSubscribers: EmailSubscriber[];
  dashboardStats: DashboardStats | null;
  totalUsers: number;
  totalSellerRequests: number;
  currentPage: number;
  
  // User Management
  fetchUsers: (filters?: { search?: string; role?: string; status?: string; page?: number }) => Promise<void>;
  updateUserStatus: (userId: string, status: 'active' | 'suspended' | 'banned', reason?: string) => Promise<void>;
  updateUserRole: (userId: string, role: 'user' | 'seller' | 'admin') => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  
  // Seller Request Management
  fetchSellerRequests: (status?: 'pending' | 'approved' | 'rejected', page?: number) => Promise<void>;
  approveSellerRequest: (requestId: string) => Promise<void>;
  rejectSellerRequest: (requestId: string, reason: string) => Promise<void>;
  submitSellerRequest: (data: SellerRequestFormData) => Promise<void>;
  
  // Team Management
  fetchTeamMembers: () => Promise<void>;
  searchUsersForTeam: (searchTerm: string) => Promise<Array<{ _id: string; email: string; fullName: string; avatar?: string }>>;
  addTeamMember: (userId: string, email: string, name: string, role: 'admin' | 'moderator' | 'support') => Promise<void>;
  updateTeamMemberRole: (memberId: string, role: 'admin' | 'moderator' | 'support') => Promise<void>;
  removeTeamMember: (memberId: string) => Promise<void>;
  
  // Announcement Management
  fetchAnnouncements: (page?: number) => Promise<void>;
  createAnnouncement: (data: { title: string; content: string; type: string; targetAudience: string; priority: string; expiresAt?: Date }) => Promise<void>;
  sendAnnouncement: (announcementId: string) => Promise<void>;
  deleteAnnouncement: (announcementId: string) => Promise<void>;
  
  // Email Subscriber Management
  fetchEmailSubscribers: (filters?: { search?: string; isVerified?: boolean; page?: number }) => Promise<void>;
  sendEmailToSubscribers: (subject: string, content: string, subscriberIds?: string[]) => Promise<{ sent: number; failed: number }>;
  exportSubscribers: (format: 'csv' | 'json') => Promise<void>;
  
  // Dashboard
  fetchDashboardStats: () => Promise<void>;
}

interface SellerRequestFormData {
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
  documents?: Array<{ type: string; url: string }>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [sellerRequests, setSellerRequests] = useState<SellerRequest[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [emailSubscribers, setEmailSubscribers] = useState<EmailSubscriber[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalSellerRequests, setTotalSellerRequests] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // ====================== USER MANAGEMENT ======================
  
  const fetchUsers = useCallback(async (filters?: { search?: string; role?: string; status?: string; page?: number }) => {
    if (!isAdmin) return;
    
    setIsLoading(true);
    try {
      const response = await adminApi.getUsers(filters);
      setUsers(response.users);
      setTotalUsers(response.total);
      setCurrentPage(response.page);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  const updateUserStatus = useCallback(async (userId: string, status: 'active' | 'suspended' | 'banned', reason?: string) => {
    if (!isAdmin) return;
    
    setIsLoading(true);
    try {
      await adminApi.updateUserStatus(userId, status, reason);
      await fetchUsers({ page: currentPage });
    } catch (error) {
      console.error('Failed to update user status:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, fetchUsers, currentPage]);

  const updateUserRole = useCallback(async (userId: string, role: 'user' | 'seller' | 'admin') => {
    if (!isAdmin) return;
    
    setIsLoading(true);
    try {
      await adminApi.updateUserRole(userId, role);
      await fetchUsers({ page: currentPage });
    } catch (error) {
      console.error('Failed to update user role:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, fetchUsers, currentPage]);

  const deleteUser = useCallback(async (userId: string) => {
    if (!isAdmin) return;
    
    setIsLoading(true);
    try {
      await adminApi.deleteUser(userId);
      await fetchUsers({ page: currentPage });
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, fetchUsers, currentPage]);

  // ====================== SELLER REQUEST MANAGEMENT ======================
  
  const fetchSellerRequests = useCallback(async (status?: 'pending' | 'approved' | 'rejected', page?: number) => {
    if (!isAdmin) return;
    
    setIsLoading(true);
    try {
      const response = await adminApi.getSellerRequests({ status, page });
      setSellerRequests(response.requests);
      setTotalSellerRequests(response.total);
    } catch (error) {
      console.error('Failed to fetch seller requests:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  const approveSellerRequest = useCallback(async (requestId: string) => {
    if (!isAdmin) return;
    
    setIsLoading(true);
    try {
      await adminApi.approveSellerRequest(requestId);
      await fetchSellerRequests('pending');
    } catch (error) {
      console.error('Failed to approve seller request:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, fetchSellerRequests]);

  const rejectSellerRequest = useCallback(async (requestId: string, reason: string) => {
    if (!isAdmin) return;
    
    setIsLoading(true);
    try {
      await adminApi.rejectSellerRequest(requestId, reason);
      await fetchSellerRequests('pending');
    } catch (error) {
      console.error('Failed to reject seller request:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, fetchSellerRequests]);

  const submitSellerRequest = useCallback(async (data: SellerRequestFormData) => {
    setIsLoading(true);
    try {
      await adminApi.submitSellerRequest(data);
    } catch (error) {
      console.error('Failed to submit seller request:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ====================== TEAM MANAGEMENT ======================
  
  const fetchTeamMembers = useCallback(async () => {
    if (!isAdmin) return;
    
    setIsLoading(true);
    try {
      const members = await adminApi.getTeamMembers();
      setTeamMembers(members);
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  const searchUsersForTeam = useCallback(async (searchTerm: string) => {
    if (!isAdmin) return [];
    
    try {
      return await adminApi.searchUsers(searchTerm);
    } catch (error) {
      console.error('Failed to search users:', error);
      return [];
    }
  }, [isAdmin]);

  const addTeamMember = useCallback(async (userId: string, email: string, name: string, role: 'admin' | 'moderator' | 'support') => {
    if (!isAdmin) return;
    
    setIsLoading(true);
    try {
      await adminApi.addTeamMember(userId, email, name, role);
      await fetchTeamMembers();
    } catch (error) {
      console.error('Failed to add team member:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, fetchTeamMembers]);

  const updateTeamMemberRole = useCallback(async (memberId: string, role: 'admin' | 'moderator' | 'support') => {
    if (!isAdmin) return;
    
    setIsLoading(true);
    try {
      await adminApi.updateTeamMemberRole(memberId, role);
      await fetchTeamMembers();
    } catch (error) {
      console.error('Failed to update team member role:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, fetchTeamMembers]);

  const removeTeamMember = useCallback(async (memberId: string) => {
    if (!isAdmin) return;
    
    setIsLoading(true);
    try {
      await adminApi.removeTeamMember(memberId);
      await fetchTeamMembers();
    } catch (error) {
      console.error('Failed to remove team member:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, fetchTeamMembers]);

  // ====================== ANNOUNCEMENT MANAGEMENT ======================
  
  const fetchAnnouncements = useCallback(async (page?: number) => {
    if (!isAdmin) return;
    
    setIsLoading(true);
    try {
      const response = await adminApi.getAnnouncements({ page });
      setAnnouncements(response.announcements);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  const createAnnouncement = useCallback(async (data: { title: string; content: string; type: string; targetAudience: string; priority: string; expiresAt?: Date }) => {
    if (!isAdmin) return;
    
    setIsLoading(true);
    try {
      await adminApi.createAnnouncement(data);
      await fetchAnnouncements();
    } catch (error) {
      console.error('Failed to create announcement:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, fetchAnnouncements]);

  const sendAnnouncement = useCallback(async (announcementId: string) => {
    if (!isAdmin) return;
    
    setIsLoading(true);
    try {
      await adminApi.sendAnnouncement(announcementId);
    } catch (error) {
      console.error('Failed to send announcement:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  const deleteAnnouncement = useCallback(async (announcementId: string) => {
    if (!isAdmin) return;
    
    setIsLoading(true);
    try {
      await adminApi.deleteAnnouncement(announcementId);
      await fetchAnnouncements();
    } catch (error) {
      console.error('Failed to delete announcement:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, fetchAnnouncements]);

  // ====================== EMAIL SUBSCRIBER MANAGEMENT ======================
  
  const fetchEmailSubscribers = useCallback(async (filters?: { search?: string; isVerified?: boolean; page?: number }) => {
    if (!isAdmin) return;
    
    setIsLoading(true);
    try {
      const response = await adminApi.getEmailSubscribers(filters);
      setEmailSubscribers(response.subscribers);
    } catch (error) {
      console.error('Failed to fetch email subscribers:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  const sendEmailToSubscribers = useCallback(async (subject: string, content: string, subscriberIds?: string[]) => {
    if (!isAdmin) return { sent: 0, failed: 0 };
    
    setIsLoading(true);
    try {
      const result = await adminApi.sendEmailToSubscribers(subject, content, subscriberIds);
      return result;
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  const exportSubscribers = useCallback(async (format: 'csv' | 'json') => {
    if (!isAdmin) return;
    
    setIsLoading(true);
    try {
      await adminApi.exportSubscribers(format);
    } catch (error) {
      console.error('Failed to export subscribers:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  // ====================== DASHBOARD ======================
  
  const fetchDashboardStats = useCallback(async () => {
    if (!isAdmin) return;
    
    setIsLoading(true);
    try {
      const stats = await adminApi.getDashboardStats();
      setDashboardStats(stats);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  // Auto-fetch data when admin logs in
  useEffect(() => {
    if (isAdmin && isAuthenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchDashboardStats();
      fetchUsers({ page: 1 });
      fetchSellerRequests('pending');
      fetchTeamMembers();
    }
  }, [isAdmin, isAuthenticated, fetchDashboardStats, fetchUsers, fetchSellerRequests, fetchTeamMembers]);

  const value: AdminContextType = {
    isLoading,
    users,
    sellerRequests,
    teamMembers,
    announcements,
    emailSubscribers,
    dashboardStats,
    totalUsers,
    totalSellerRequests,
    currentPage,
    
    fetchUsers,
    updateUserStatus,
    updateUserRole,
    deleteUser,
    
    fetchSellerRequests,
    approveSellerRequest,
    rejectSellerRequest,
    submitSellerRequest,
    
    fetchTeamMembers,
    searchUsersForTeam,
    addTeamMember,
    updateTeamMemberRole,
    removeTeamMember,
    
    fetchAnnouncements,
    createAnnouncement,
    sendAnnouncement,
    deleteAnnouncement,
    
    fetchEmailSubscribers,
    sendEmailToSubscribers,
    exportSubscribers,
    
    fetchDashboardStats,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}