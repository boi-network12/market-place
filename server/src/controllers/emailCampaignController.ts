// controllers/emailCampaign.controller.ts
import { Request, Response, NextFunction } from 'express';
import { EmailCampaignService } from '../services/emailCampaignService';
import { AppError } from '../middlewares/errorMiddleware';
import { logger } from '../utils/logger';

interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
  userName?: string;
}

export class EmailCampaignController {
  
  /**
   * Create email campaign
   * POST /api/admin/email/campaigns
   */
  static async createCampaign(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        subject,
        content,
        htmlContent,
        type,
        recipientType,
        recipientEmails,
        recipientIds,
        scheduledFor,
      } = req.body;
      
      if (!subject || !content || !htmlContent || !recipientType) {
        throw new AppError('Subject, content, and recipient type are required', 400);
      }
      
      const campaign = await EmailCampaignService.createCampaign(
        {
          subject,
          content,
          htmlContent,
          type: type || 'custom',
          recipientType,
          recipientEmails,
          recipientIds,
          scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
        },
        {
          userId: req.userId!,
          email: req.userEmail!,
          name: req.userName!,
        }
      );
      
      // If not scheduled, send immediately
      let result = null;
      if (!scheduledFor) {
        result = await EmailCampaignService.sendCampaign(campaign._id.toString());
      }
      
      res.json({
        success: true,
        message: scheduledFor ? 'Campaign scheduled successfully' : 'Campaign sent successfully',
        data: { campaign, result },
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get all campaigns
   * GET /api/admin/email/campaigns
   */
  static async getCampaigns(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, type, page, limit } = req.query;
      
      const result = await EmailCampaignService.getCampaigns({
        status: status as string,
        type: type as string,
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
  
  /**
   * Get single campaign
   * GET /api/admin/email/campaigns/:id
   */
  static async getCampaign(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const campaignId = Array.isArray(id) ? id[0] : id; 
      
      const campaign = await EmailCampaignService.getCampaign(campaignId);
      if (!campaign) {
        throw new AppError('Campaign not found', 404);
      }
      
      res.json({
        success: true,
        data: { campaign },
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Update campaign
   * PUT /api/admin/email/campaigns/:id
   */
  static async updateCampaign(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const campaignId = Array.isArray(id) ? id[0] : id;
      const updates = req.body;
      
      const campaign = await EmailCampaignService.updateCampaign(campaignId, updates);
      if (!campaign) {
        throw new AppError('Campaign not found', 404);
      }
      
      res.json({
        success: true,
        message: 'Campaign updated successfully',
        data: { campaign },
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Delete campaign
   * DELETE /api/admin/email/campaigns/:id
   */
  static async deleteCampaign(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const campaignId = Array.isArray(id) ? id[0] : id;
      const deleted = await EmailCampaignService.deleteCampaign(campaignId);
      if (!deleted) {
        throw new AppError('Campaign not found', 404);
      }
      
      res.json({
        success: true,
        message: 'Campaign deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Send campaign
   * POST /api/admin/email/campaigns/:id/send
   */
  static async sendCampaign(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const campaignId = Array.isArray(id) ? id[0] : id;
      const result = await EmailCampaignService.sendCampaign(campaignId);
      
      res.json({
        success: true,
        message: `Campaign sent: ${result.sent} delivered, ${result.failed} failed`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Send to specific users
   * POST /api/admin/email/send-to-users
   */
  static async sendToSpecificUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { subject, content, htmlContent, userIds } = req.body;
      
      if (!subject || !content || !htmlContent || !userIds || !userIds.length) {
        throw new AppError('Subject, content, and user IDs are required', 400);
      }
      
      const result = await EmailCampaignService.sendToSpecificUsers(
        subject,
        content,
        htmlContent,
        userIds,
        {
          userId: req.userId!,
          email: req.userEmail!,
          name: req.userName!,
        }
      );
      
      res.json({
        success: true,
        message: `Email sent to ${result.sent} users (${result.failed} failed)`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Send to all subscribers
   * POST /api/admin/email/send-to-subscribers
   */
  static async sendToAllSubscribers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { subject, content, htmlContent } = req.body;
      
      if (!subject || !content || !htmlContent) {
        throw new AppError('Subject and content are required', 400);
      }
      
      const result = await EmailCampaignService.sendToAllSubscribers(
        subject,
        content,
        htmlContent,
        {
          userId: req.userId!,
          email: req.userEmail!,
          name: req.userName!,
        }
      );
      
      res.json({
        success: true,
        message: `Newsletter sent to ${result.sent} subscribers (${result.failed} failed)`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Send to all users
   * POST /api/admin/email/send-to-all-users
   */
  static async sendToAllUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { subject, content, htmlContent } = req.body;
      
      if (!subject || !content || !htmlContent) {
        throw new AppError('Subject and content are required', 400);
      }
      
      const result = await EmailCampaignService.sendToAllUsers(
        subject,
        content,
        htmlContent,
        {
          userId: req.userId!,
          email: req.userEmail!,
          name: req.userName!,
        }
      );
      
      res.json({
        success: true,
        message: `Announcement sent to ${result.sent} users (${result.failed} failed)`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}