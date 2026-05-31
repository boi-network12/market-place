// controllers/admin.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/adminService';
import { AppError } from '../middlewares/errorMiddleware';
import { logger } from '../utils/logger';
import { User } from '../models/UserModel';
import { Types } from 'mongoose';

// Extend Request type
interface AdminRequest extends Request {
  userId?: string;
  userRole?: string;
}

interface ParamsWithId {
  userId: string;
}

interface ParamsWithRequestId {
  requestId: string;
}

interface ParamsWithMemberId {
  memberId: string;
}

interface ParamsWithAnnouncementId {
  announcementId: string;
}

export class AdminController {
  
  // ====================== USER MANAGEMENT ======================
  
  static async getAllUsers(req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const { search, role, status, isSeller, page, limit } = req.query;
      
      const result = await AdminService.getAllUsers({
        search: search as string,
        role: role as string,
        status: status as string,
        isSeller: isSeller === 'true',
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
      });
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async getUserDetails(req: AdminRequest & { params: ParamsWithId }, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      
      const user = await AdminService.getUserDetails(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }
      
      res.json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async updateUserStatus(req: AdminRequest & { params: ParamsWithId }, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { status, reason } = req.body;
      
      if (!['active', 'suspended', 'banned'].includes(status)) {
        throw new AppError('Invalid status', 400);
      }
      
      const user = await AdminService.updateUserStatus(userId, status, reason);
      if (!user) {
        throw new AppError('User not found', 404);
      }
      
      logger.info(`User ${userId} status updated to ${status} by admin ${req.userId}`);
      
      res.json({
        success: true,
        message: `User ${status} successfully`,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async updateUserRole(req: AdminRequest & { params: ParamsWithId }, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { role } = req.body;
      
      if (!['user', 'seller', 'admin'].includes(role)) {
        throw new AppError('Invalid role', 400);
      }
      
      const user = await AdminService.updateUserRole(userId, role);
      if (!user) {
        throw new AppError('User not found', 404);
      }
      
      logger.info(`User ${userId} role updated to ${role} by admin ${req.userId}`);
      
      res.json({
        success: true,
        message: `User role updated to ${role}`,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async deleteUser(req: AdminRequest & { params: ParamsWithId }, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      
      // Prevent self-deletion
      if (userId === req.userId) {
        throw new AppError('You cannot delete your own account', 400);
      }
      
      const deleted = await AdminService.deleteUser(userId);
      if (!deleted) {
        throw new AppError('User not found', 404);
      }
      
      logger.info(`User ${userId} deleted by admin ${req.userId}`);
      
      res.json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
  
  // ====================== SELLER MANAGEMENT ======================
  
  static async getSellerRequests(req: AdminRequest & { params: ParamsWithId }, res: Response, next: NextFunction) {
    try {
      const { status, page, limit } = req.query;
      
      const result = await AdminService.getSellerRequests({
        status: status as 'pending' | 'approved' | 'rejected',
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
      });
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async getSellerRequestDetails(req: AdminRequest & { params: ParamsWithRequestId }, res: Response, next: NextFunction) {
    try {
      const { requestId } = req.params;
      
      const request = await AdminService.getSellerRequestDetails(requestId);
      if (!request) {
        throw new AppError('Request not found', 404);
      }
      
      res.json({
        success: true,
        data: { request },
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async approveSellerRequest(req: AdminRequest & { params: ParamsWithRequestId }, res: Response, next: NextFunction) {
    try {
      const { requestId } = req.params;
      
      const result = await AdminService.approveSellerRequest(requestId, req.userId!);
      
      if (!result.success) {
        throw new AppError(result.message, 400);
      }
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async rejectSellerRequest(req: AdminRequest & { params: ParamsWithRequestId }, res: Response, next: NextFunction) {
    try {
      const { requestId } = req.params;
      const { reason } = req.body;
      
      if (!reason) {
        throw new AppError('Rejection reason is required', 400);
      }
      
      const result = await AdminService.rejectSellerRequest(requestId, req.userId!, reason);
      
      if (!result.success) {
        throw new AppError(result.message, 400);
      }
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
  
  // ====================== TEAM MANAGEMENT ======================
  
  static async getTeamMembers(req: AdminRequest & { params: ParamsWithId }, res: Response, next: NextFunction) {
    try {
      const members = await AdminService.getTeamMembers();
      
      res.json({
        success: true,
        data: { members },
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async searchUsers(req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string') {
        throw new AppError('Search query is required', 400);
      }
      
      const users = await AdminService.searchUsers(q);
      
      res.json({
        success: true,
        data: { users },
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async addTeamMember(req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const { userId, email, name, role } = req.body;
      
      if (!email || !name || !role) {
        throw new AppError('Email, name, and role are required', 400);
      }
      
      if (!['admin', 'moderator', 'support'].includes(role)) {
        throw new AppError('Invalid role', 400);
      }
      
      const member = await AdminService.addTeamMember(userId, email, name, role, req.userId!);
      
      logger.info(`Team member ${email} added by admin ${req.userId}`);
      
      res.json({
        success: true,
        message: 'Team member added successfully',
        data: { member },
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async updateTeamMemberRole(req: AdminRequest & { params: ParamsWithMemberId }, res: Response, next: NextFunction) {
    try {
      const { memberId } = req.params;
      const { role } = req.body;
      
      if (!['admin', 'moderator', 'support'].includes(role)) {
        throw new AppError('Invalid role', 400);
      }
      
      const member = await AdminService.updateTeamMemberRole(memberId, role);
      if (!member) {
        throw new AppError('Team member not found', 404);
      }
      
      logger.info(`Team member ${memberId} role updated to ${role} by admin ${req.userId}`);
      
      res.json({
        success: true,
        message: 'Team member role updated',
        data: { member },
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async removeTeamMember(req: AdminRequest & { params: ParamsWithMemberId }, res: Response, next: NextFunction) {
    try {
      const { memberId } = req.params;
      
      const removed = await AdminService.removeTeamMember(memberId);
      if (!removed) {
        throw new AppError('Team member not found', 404);
      }
      
      logger.info(`Team member ${memberId} removed by admin ${req.userId}`);
      
      res.json({
        success: true,
        message: 'Team member removed successfully',
      });
    } catch (error) {
      next(error);
    }
  }
  
  // ====================== ANNOUNCEMENTS ======================
  
  static async createAnnouncement(req: AdminRequest & { params: ParamsWithId }, res: Response, next: NextFunction) {
    try {
      const { title, content, type, targetAudience, priority, expiresAt } = req.body;
      
      if (!title || !content) {
        throw new AppError('Title and content are required', 400);
      }
      
      const announcement = await AdminService.createAnnouncement(
        {
          title,
          content,
          type: type || 'info',
          targetAudience: targetAudience || 'all',
          priority: priority || 'medium',
          expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        },
        req.userId!
      );
      
      logger.info(`Announcement created by admin ${req.userId}: ${title}`);
      
      res.json({
        success: true,
        message: 'Announcement created successfully',
        data: { announcement },
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async getAnnouncements(req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const { isActive, page, limit } = req.query;
      
      const result = await AdminService.getAnnouncements({
        isActive: isActive === 'true',
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
      });
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async sendAnnouncement(req: AdminRequest & { params: ParamsWithAnnouncementId }, res: Response, next: NextFunction) {
    try {
      const { announcementId } = req.params;
      
      const result = await AdminService.sendAnnouncement(announcementId);
      
      if (!result.success) {
        throw new AppError('Failed to send announcement', 400);
      }
      
      logger.info(`Announcement ${announcementId} sent by admin ${req.userId} to ${result.count} users`);
      
      res.json({
        success: true,
        message: `Announcement sent to ${result.count} users`,
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async deleteAnnouncement(req: AdminRequest & { params: ParamsWithAnnouncementId }, res: Response, next: NextFunction) {
    try {
      const { announcementId } = req.params;
      
      const deleted = await AdminService.deleteAnnouncement(announcementId);
      if (!deleted) {
        throw new AppError('Announcement not found', 404);
      }
      
      res.json({
        success: true,
        message: 'Announcement deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
  
  // ====================== EMAIL SUBSCRIBER MANAGEMENT ======================
  
  static async getEmailSubscribers(req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const { search, isVerified, page, limit } = req.query;
      
      const result = await AdminService.getEmailSubscribers({
        search: search as string,
        isVerified: isVerified === 'true',
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
      });
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async sendEmailToSubscribers(req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const { subject, content, subscriberIds } = req.body;
      
      if (!subject || !content) {
        throw new AppError('Subject and content are required', 400);
      }
      
      const result = await AdminService.sendEmailToSubscribers(subject, content, subscriberIds);
      
      logger.info(`Email campaign sent by admin ${req.userId}: ${subject} (${result.sent} sent, ${result.failed} failed)`);
      
      res.json({
        success: true,
        message: `Email sent to ${result.sent} subscribers (${result.failed} failed)`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async exportSubscribers(req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const { format = 'csv' } = req.query;
      
      const data = await AdminService.exportSubscribers(format as 'csv' | 'json');
      
      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=subscribers.csv');
        res.send(data);
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=subscribers.json');
        res.send(data);
      }
    } catch (error) {
      next(error);
    }
  }
  
  static async unsubscribeSubscriber(req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      
      if (!email) {
        throw new AppError('Email is required', 400);
      }
      
      const unsubscribed = await AdminService.unsubscribeSubscriber(email);
      
      res.json({
        success: true,
        message: unsubscribed ? 'Subscriber unsubscribed' : 'Subscriber not found',
      });
    } catch (error) {
      next(error);
    }
  }

  static async getDashboardStats(req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getDashboardStats();
      
      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}