// services/admin.service.ts
import { User, IUser } from '../models/UserModel';
import { NotificationService } from './notificationService';
import { EmailService } from './emailService';
import { logger } from '../utils/logger';
import mongoose, { Schema, Types } from 'mongoose';
import { Announcement, EmailSubscriber, IAnnouncement, IEmailSubscriber, ITeamMember, TeamMember } from '../models/AdminTeamModel';
import { SellerRequest } from '../models/SellerRequestModel';
import { NewsletterSubscriber } from '../models/NewsletterSubscriberModel';


export class AdminService {
  
  // ====================== USER MANAGEMENT ======================
  
  static async getAllUsers(filters: {
    search?: string;
    role?: string;
    status?: string;
    isSeller?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ users: IUser[]; total: number; page: number; totalPages: number }> {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(100, filters.limit || 20);
    const skip = (page - 1) * limit;

    const query: any = {};

    if (filters.search) {
      query.$or = [
        { email: { $regex: filters.search, $options: 'i' } },
        { username: { $regex: filters.search, $options: 'i' } },
        { fullName: { $regex: filters.search, $options: 'i' } },
      ];
    }

    if (filters.role) query.role = filters.role;
    if (filters.status) query.status = filters.status;
    if (filters.isSeller !== undefined) query.isSeller = filters.isSeller;

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password -refreshToken -twoFactorSecret -passwordResetCode -passwordResetExpires')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(query),
    ]);

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getUserDetails(userId: string): Promise<IUser | null> {
    return await User.findById(userId)
      .select('-password -refreshToken -twoFactorSecret -passwordResetCode -passwordResetExpires')
      .populate('devices');
  }

  static async updateUserStatus(
    userId: string,
    status: 'active' | 'suspended' | 'banned',
    reason?: string
  ): Promise<IUser | null> {
    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select('-password');

    if (user && status === 'banned') {
      await NotificationService.createNotification({
        userId: user._id,
        type: 'security',
        title: 'Account Suspended',
        message: `Your account has been ${status}${reason ? `: ${reason}` : ''}. Please contact support.`,
        priority: 'high',
      });
    }

    return user;
  }

  static async updateUserRole(userId: string, role: 'user' | 'seller' | 'admin'): Promise<IUser | null> {
    return await User.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');
  }

  static async deleteUser(userId: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(userId);
    return !!result;
  }

  // ====================== SELLER MANAGEMENT ======================
  
  static async getSellerRequests(filters: {
    status?: 'pending' | 'approved' | 'rejected';
    page?: number;
    limit?: number;
  }): Promise<{ requests: any[]; total: number; page: number; totalPages: number }> {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(100, filters.limit || 20);
    const skip = (page - 1) * limit;

    const query: any = {};
    if (filters.status) query.status = filters.status;

    const [requests, total] = await Promise.all([
      SellerRequest.find(query)
        .populate('userId', 'email fullName username avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      SellerRequest.countDocuments(query),
    ]);

    return {
      requests,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getSellerRequestDetails(requestId: string): Promise<any | null> {
    return await SellerRequest.findById(requestId)
      .populate('userId', 'email fullName username avatar phoneNumber location');
  }

  static async approveSellerRequest(
    requestId: string,
    adminId: string
  ): Promise<{ success: boolean; message: string }> {
    const request = await SellerRequest.findById(requestId);
    if (!request) {
      return { success: false, message: 'Request not found' };
    }

    if (request.status !== 'pending') {
      return { success: false, message: `Request already ${request.status}` };
    }

    // Update seller request status
    request.status = 'approved';
    request.reviewedBy = new Types.ObjectId(adminId);
    request.reviewedAt = new Date();
    await request.save();

    // Update user to seller
    const user = await User.findById(request.userId);
    if (user) {
      user.isSeller = true;
      user.sellerApproved = true;
      user.role = 'seller';
      await user.save();
    }

    // Send approval notification
    await NotificationService.createNotification({
      userId: request.userId,
      type: 'account',
      title: 'Seller Application Approved! 🎉',
      message: 'Congratulations! Your seller application has been approved. You can now start listing products.',
      priority: 'high',
      actionUrl: '/seller/dashboard',
      actionLabel: 'Go to Seller Dashboard',
    });

    await EmailService.sendEmail({
      to: request?.data?.email || user?.email || '',
      subject: 'Seller Application Approved - Kamdi Market',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #4f46e5;">Seller Application Approved! 🎉</h1>
          <p>Congratulations! Your seller application has been approved.</p>
          <p>You can now start listing your products on Kamdi Market.</p>
          <a href="${process.env.FRONTEND_URL}/seller/dashboard" 
             style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">
            Go to Seller Dashboard
          </a>
        </div>
      `,
    }).catch(err => logger.error('Approval email failed:', err));

    logger.info(`Seller request ${requestId} approved by admin ${adminId}`);
    return { success: true, message: 'Seller request approved successfully' };
  }

  static async rejectSellerRequest(
    requestId: string,
    adminId: string,
    reason: string
  ): Promise<{ success: boolean; message: string }> {
    const request = await SellerRequest.findById(requestId);
    if (!request) {
      return { success: false, message: 'Request not found' };
    }

    if (request.status !== 'pending') {
      return { success: false, message: `Request already ${request.status}` };
    }

    request.status = 'rejected';
    request.reviewedBy = new Types.ObjectId(adminId);
    request.reviewedAt = new Date();
    request.rejectionReason = reason;
    await request.save();

    // Send rejection notification
    await NotificationService.createNotification({
      userId: request.userId,
      type: 'account',
      title: 'Seller Application Update',
      message: `Your seller application was not approved at this time. Reason: ${reason}`,
      priority: 'medium',
    });

    const user = await User.findById(request.userId);

    await EmailService.sendEmail({
      to: request?.data?.email || user?.email || '',
      subject: 'Seller Application Update - Kamdi Market',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #dc2626;">Seller Application Update</h1>
          <p>Thank you for your interest in becoming a seller on Kamdi Market.</p>
          <p>After careful review, we are unable to approve your application at this time.</p>
          <p><strong>Reason:</strong> ${reason}</p>
          <p>You can reapply after addressing the issues above.</p>
        </div>
      `,
    }).catch(err => logger.error('Rejection email failed:', err));

    return { success: true, message: 'Seller request rejected' };
  }

  // ====================== TEAM MANAGEMENT ======================
  
  static async getTeamMembers(): Promise<ITeamMember[]> {
    return await TeamMember.find().populate('addedBy', 'email fullName');
  }

  static async addTeamMember(
    userId: string,
    email: string,
    name: string,
    role: 'admin' | 'moderator' | 'support',
    addedBy: string
  ): Promise<ITeamMember> {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    // Check if already a team member
    const existing = await TeamMember.findOne({ userId: user._id });
    if (existing) {
      throw new Error('User is already a team member');
    }

    // Set permissions based on role
    let permissions = {
      manageUsers: false,
      manageSellers: false,
      manageProducts: false,
      manageAnnouncements: false,
      manageTeams: false,
      viewReports: false,
      manageEmailSubscribers: false,
    };

    switch (role) {
      case 'admin':
        permissions = {
          manageUsers: true,
          manageSellers: true,
          manageProducts: true,
          manageAnnouncements: true,
          manageTeams: true,
          viewReports: true,
          manageEmailSubscribers: true,
        };
        break;
      case 'moderator':
        permissions = {
          manageUsers: true,
          manageSellers: true,
          manageProducts: true,
          manageAnnouncements: true,
          manageTeams: false,
          viewReports: true,
          manageEmailSubscribers: false,
        };
        break;
      case 'support':
        permissions = {
          manageUsers: true,
          manageSellers: false,
          manageProducts: false,
          manageAnnouncements: false,
          manageTeams: false,
          viewReports: false,
          manageEmailSubscribers: false,
        };
        break;
    }

    const teamMember = new TeamMember({
      userId: user._id,
      email,
      name,
      role,
      permissions,
      addedBy: new Types.ObjectId(addedBy),
    });

    await teamMember.save();

    // Update user role in User collection
    await User.findByIdAndUpdate(user._id, { role: 'admin' });

    return teamMember;
  }

  static async updateTeamMemberRole(
    memberId: string,
    role: 'admin' | 'moderator' | 'support'
  ): Promise<ITeamMember | null> {
    let permissions = {
      manageUsers: false,
      manageSellers: false,
      manageProducts: false,
      manageAnnouncements: false,
      manageTeams: false,
      viewReports: false,
      manageEmailSubscribers: false,
    };

    switch (role) {
      case 'admin':
        permissions = {
          manageUsers: true,
          manageSellers: true,
          manageProducts: true,
          manageAnnouncements: true,
          manageTeams: true,
          viewReports: true,
          manageEmailSubscribers: true,
        };
        break;
      case 'moderator':
        permissions = {
          manageUsers: true,
          manageSellers: true,
          manageProducts: true,
          manageAnnouncements: true,
          manageTeams: false,
          viewReports: true,
          manageEmailSubscribers: false,
        };
        break;
      case 'support':
        permissions = {
          manageUsers: true,
          manageSellers: false,
          manageProducts: false,
          manageAnnouncements: false,
          manageTeams: false,
          viewReports: false,
          manageEmailSubscribers: false,
        };
        break;
    }

    return await TeamMember.findByIdAndUpdate(
      memberId,
      { role, permissions },
      { new: true }
    );
  }

  static async removeTeamMember(memberId: string): Promise<boolean> {
    const member = await TeamMember.findById(memberId);
    if (member) {
      // Downgrade user role back to user
      await User.findByIdAndUpdate(member.userId, { role: 'user' });
    }
    const result = await TeamMember.findByIdAndDelete(memberId);
    return !!result;
  }

  static async searchUsers(searchTerm: string): Promise<IUser[]> {
    return await User.find({
      $or: [
        { email: { $regex: searchTerm, $options: 'i' } },
        { username: { $regex: searchTerm, $options: 'i' } },
        { fullName: { $regex: searchTerm, $options: 'i' } },
      ],
    })
    .select('_id email username fullName avatar')
    .limit(20);
  }

  // ====================== ANNOUNCEMENTS ======================
  
  static async createAnnouncement(
    data: {
      title: string;
      content: string;
      type: 'info' | 'warning' | 'success' | 'emergency';
      targetAudience: 'all' | 'sellers' | 'buyers' | 'verified' | 'unverified';
      priority: 'low' | 'medium' | 'high' | 'critical';
      expiresAt?: Date;
    },
    createdBy: string
  ): Promise<IAnnouncement> {
    const announcement = new Announcement({
      ...data,
      createdBy: new Types.ObjectId(createdBy),
    });

    await announcement.save();
    return announcement;
  }

  static async getAnnouncements(filters: {
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ announcements: IAnnouncement[]; total: number }> {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(100, filters.limit || 20);
    const skip = (page - 1) * limit;

    const query: any = {};
    if (filters.isActive !== undefined) query.isActive = filters.isActive;

    const [announcements, total] = await Promise.all([
      Announcement.find(query)
        .populate('createdBy', 'email fullName')
        .sort({ priority: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Announcement.countDocuments(query),
    ]);

    return { announcements, total };
  }

  static async sendAnnouncement(announcementId: string): Promise<{ success: boolean; count: number }> {
    const announcement = await Announcement.findById(announcementId);
    if (!announcement) {
      return { success: false, count: 0 };
    }

    // Build query for target audience
    const userQuery: any = { status: 'active' };
    
    switch (announcement.targetAudience) {
      case 'sellers':
        userQuery.isSeller = true;
        break;
      case 'buyers':
        userQuery.isSeller = false;
        break;
      case 'verified':
        userQuery.emailVerified = true;
        break;
      case 'unverified':
        userQuery.emailVerified = false;
        break;
      case 'all':
      default:
        break;
    }

    const users = await User.find(userQuery).select('_id');
    
    // Create notifications for all users
    await NotificationService.bulkCreateNotifications(
      users.map(u => u._id),
      {
        type: 'announcement',
        title: announcement.title,
        message: announcement.content,
        priority: announcement.priority === 'critical' ? 'high' : 
                 announcement.priority === 'high' ? 'high' : 'medium',
        actionUrl: '/announcements',
        actionLabel: 'Read More',
        data: { announcementId: announcement._id.toString() },
      }
    );

    // Mark as sent
    announcement.sentAt = new Date();
    await announcement.save();

    logger.info(`Announcement "${announcement.title}" sent to ${users.length} users`);

    return { success: true, count: users.length };
  }

  static async deleteAnnouncement(announcementId: string): Promise<boolean> {
    const result = await Announcement.findByIdAndDelete(announcementId);
    return !!result;
  }

  // ====================== EMAIL SUBSCRIBER MANAGEMENT ======================
  
  static async getEmailSubscribers(filters: {
    search?: string;
    isVerified?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ subscribers: any[]; total: number }> {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(100, filters.limit || 20);
    const skip = (page - 1) * limit;

    const query: any = {};
    if (filters.search) {
      query.email = { $regex: filters.search, $options: 'i' };
    }
    if (filters.isVerified !== undefined) {
      query.isVerified = filters.isVerified;
    }
    // Important: Only get active subscribers (not unsubscribed)
    query.unsubscribedAt = null; // or { $exists: false } depending on your schema

    const [subscribers, total] = await Promise.all([
      NewsletterSubscriber.find(query)  // Make sure this is NewsletterSubscriber, not EmailSubscriber
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      NewsletterSubscriber.countDocuments(query),
    ]);

    return { subscribers, total };
  }

  static async sendEmailToSubscribers(
    subject: string,
    html: string,
    subscriberIds?: string[]
  ): Promise<{ success: boolean; sent: number; failed: number }> {
    let subscribers: any[] = [];
    
    if (subscriberIds && subscriberIds.length > 0) {
      subscribers = await NewsletterSubscriber.find({ _id: { $in: subscriberIds }, unsubscribedAt: null });
    } else {
      subscribers = await NewsletterSubscriber.find({ unsubscribedAt: null });
    }

    let sent = 0;
    let failed = 0;

    for (const subscriber of subscribers) {
      try {
        await EmailService.sendEmail({
          to: subscriber.email,
          subject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #4f46e5;">Kamdi Market</h1>
              </div>
              ${html}
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; font-size: 12px; color: #999;">
                <p>You're receiving this because you subscribed to our newsletter.</p>
                <a href="${process.env.FRONTEND_URL}/unsubscribe?email=${encodeURIComponent(subscriber.email)}" style="color: #4f46e5;">Unsubscribe</a>
              </div>
            </div>
          `,
        });
        sent++;
      } catch (error) {
        logger.error(`Failed to send email to ${subscriber.email}:`, error);
        failed++;
      }
    }

    logger.info(`Email campaign sent: ${sent} success, ${failed} failed`);
    return { success: true, sent, failed };
  }

  static async exportSubscribers(format: 'csv' | 'json'): Promise<string> {
    const subscribers = await NewsletterSubscriber.find({ unsubscribedAt: null });

    if (format === 'csv') {
      const headers = ['Email', 'Interests', 'Source', 'Verified', 'Created At'];
      const rows = subscribers.map((s: any) => [
        s.email,
        s.interests.join('; '),
        s.source,
        s.isVerified ? 'Yes' : 'No',
        s.createdAt.toISOString(),
      ]);
      
      const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
      return csvContent;
    } else {
      return JSON.stringify(subscribers, null, 2);
    }
  }

  static async unsubscribeSubscriber(email: string): Promise<boolean> {
    const result = await EmailSubscriber.findOneAndUpdate(
      { email: email.toLowerCase() },
      { unsubscribedAt: new Date() }
    );
    return !!result;
  }

  static async getDashboardStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    bannedUsers: number;
    totalSellers: number;
    pendingSellers: number;
    totalSubscribers: number;
    totalAnnouncements: number;
    recentActivities: Array<{ id: string; action: string; user: string; timestamp: string }>;
  }> {
    const [
      totalUsers,
      activeUsers,
      bannedUsers,
      totalSellers,
      pendingSellers,
      totalSubscribers,
      totalAnnouncements,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: 'active' }),
      User.countDocuments({ status: 'banned' }),
      User.countDocuments({ isSeller: true, sellerApproved: true }),
      SellerRequest.countDocuments({ status: 'pending' }),
      EmailSubscriber.countDocuments({ unsubscribedAt: null }),
      Announcement.countDocuments(),
    ]);

    // Get recent activities from login history
    const recentUsers = await User.find()
      .sort({ lastLogin: -1 })
      .limit(5)
      .select('fullName email lastLogin lastLoginLocation');
    
    const recentActivities = recentUsers.map(user => ({
      id: user._id.toString(),
      action: 'User Login',
      user: user.fullName || user.email,
      timestamp: user.lastLogin?.toISOString() || new Date().toISOString(),
    }));

    return {
      totalUsers,
      activeUsers,
      bannedUsers,
      totalSellers,
      pendingSellers,
      totalSubscribers,
      totalAnnouncements,
      recentActivities,
    };
  }
}