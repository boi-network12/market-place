// controllers/notification.controller.ts
import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notificationService';
import { NotificationPreferenceService } from '../services/notification-preferenceService';
import { AppError } from '../middlewares/errorMiddleware';
import { logger } from '../utils/logger';

export class NotificationController {
  
  /**
   * Get user's notifications
   * GET /api/notifications
   */
  static async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const unreadOnly = req.query.unreadOnly === 'true';
      const type = req.query.type as any;
      
      const result = await NotificationService.getUserNotifications(userId, {
        page,
        limit,
        unreadOnly,
        type,
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
   * Get unread notification count
   * GET /api/notifications/unread/count
   */
  static async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const count = await NotificationService.getUnreadCount(userId);
      
      res.json({
        success: true,
        data: { count },
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Mark notification as read
   * PUT /api/notifications/:id/read
   */
  static async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const userId = req.userId!;
      
      const notification = await NotificationService.markAsRead(id, userId);
      
      if (!notification) {
        throw new AppError('Notification not found', 404);
      }
      
      res.json({
        success: true,
        message: 'Notification marked as read',
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Mark all notifications as read
   * PUT /api/notifications/read-all
   */
  static async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const count = await NotificationService.markAllAsRead(userId);
      
      res.json({
        success: true,
        message: `${count} notifications marked as read`,
        data: { count },
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Delete notification
   * DELETE /api/notifications/:id
   */
  static async deleteNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const userId = req.userId!;
      
      const deleted = await NotificationService.deleteNotification(id, userId);
      
      if (!deleted) {
        throw new AppError('Notification not found', 404);
      }
      
      res.json({
        success: true,
        message: 'Notification deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Delete all notifications
   * DELETE /api/notifications
   */
  static async deleteAllNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const count = await NotificationService.deleteAllNotifications(userId);
      
      res.json({
        success: true,
        message: `${count} notifications deleted`,
        data: { count },
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get notification preferences
   * GET /api/notifications/preferences
   */
  static async getPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const preferences = await NotificationPreferenceService.getOrCreatePreferences(userId);
      
      res.json({
        success: true,
        data: preferences,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Update email notification settings
   * PUT /api/notifications/preferences/email
   */
  static async updateEmailPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { enabled, types, digest } = req.body;
      
      const preferences = await NotificationPreferenceService.updateEmailSettings(userId, {
        enabled,
        types,
        digest,
      });
      
      res.json({
        success: true,
        message: 'Email preferences updated',
        data: preferences,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Update push notification settings
   * PUT /api/notifications/preferences/push
   */
  static async updatePushPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { enabled, types } = req.body;
      
      const preferences = await NotificationPreferenceService.updatePushSettings(userId, {
        enabled,
        types,
      });
      
      res.json({
        success: true,
        message: 'Push preferences updated',
        data: preferences,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Update in-app notification settings
   * PUT /api/notifications/preferences/in-app
   */
  static async updateInAppPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { enabled, types } = req.body;
      
      const preferences = await NotificationPreferenceService.updateInAppSettings(userId, {
        enabled,
        types,
      });
      
      res.json({
        success: true,
        message: 'In-app preferences updated',
        data: preferences,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Update quiet hours settings
   * PUT /api/notifications/preferences/quiet-hours
   */
  static async updateQuietHours(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { enabled, start, end, timezone } = req.body;
      
      const preferences = await NotificationPreferenceService.updateQuietHours(userId, {
        enabled,
        start,
        end,
        timezone,
      });
      
      res.json({
        success: true,
        message: 'Quiet hours updated',
        data: preferences,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Register device token for push notifications
   * POST /api/notifications/device-token
   */
  static async registerDeviceToken(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { deviceToken } = req.body;
      
      if (!deviceToken) {
        throw new AppError('Device token is required', 400);
      }
      
      const preferences = await NotificationPreferenceService.registerDeviceToken(userId, deviceToken);
      
      res.json({
        success: true,
        message: 'Device token registered successfully',
        data: preferences,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Unregister device token
   * DELETE /api/notifications/device-token
   */
  static async unregisterDeviceToken(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { deviceToken } = req.body;
      
      if (!deviceToken) {
        throw new AppError('Device token is required', 400);
      }
      
      const preferences = await NotificationPreferenceService.unregisterDeviceToken(userId, deviceToken);
      
      res.json({
        success: true,
        message: 'Device token unregistered successfully',
        data: preferences,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Reset notification preferences to default
   * POST /api/notifications/preferences/reset
   */
  static async resetPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const preferences = await NotificationPreferenceService.resetToDefault(userId);
      
      res.json({
        success: true,
        message: 'Preferences reset to default',
        data: preferences,
      });
    } catch (error) {
      next(error);
    }
  }
}