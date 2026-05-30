// services/notification.service.ts
import { Notification, INotification } from '../models/NotificationModel';
import { NotificationPreference } from '../models/NotificationPreferenceModel';
import { EmailService } from './emailService';
import { logger } from '../utils/logger';
import { Types } from 'mongoose';

interface CreateNotificationDTO {
  userId: Types.ObjectId | string;
  type: INotification['type'];
  title: string;
  message: string;
  priority?: INotification['priority'];
  actionUrl?: string;
  actionLabel?: string;
  data?: Record<string, any>;
}

export class NotificationService {
  
  /**
   * Create a new notification for a user
   */
  static async createNotification(dto: CreateNotificationDTO): Promise<INotification> {
    try {
      // Check if user wants this type of notification
      const preferences = await NotificationPreference.findOne({ userId: dto.userId });
      
      if (preferences && !preferences.inAppNotifications.enabled) {
        logger.info(`Notification skipped: User ${dto.userId} has disabled in-app notifications`);
        return null as any;
      }
      
      if (preferences && !preferences.inAppNotifications.types[dto.type]) {
        logger.info(`Notification skipped: User ${dto.userId} disabled ${dto.type} notifications`);
        return null as any;
      }
      
      // Create the notification
      const notification = new Notification({
        userId: dto.userId,
        type: dto.type,
        title: dto.title,
        message: dto.message,
        priority: dto.priority || 'medium',
        actionUrl: dto.actionUrl,
        actionLabel: dto.actionLabel,
        data: dto.data || {},
      });
      
      await notification.save();
      
      // Send email if user wants email notifications for this type
      await this.sendEmailIfNeeded(notification, preferences);
      
      // Send push notification if user has push enabled
      await this.sendPushIfNeeded(notification, preferences);
      
      logger.info(`Notification created for user ${dto.userId}: ${dto.title}`);
      
      return notification;
    } catch (error) {
      logger.error('Failed to create notification:', error);
      throw error;
    }
  }
  
  /**
   * Get user's notifications with pagination
   */
  static async getUserNotifications(
    userId: Types.ObjectId | string,
    options: {
      page?: number;
      limit?: number;
      unreadOnly?: boolean;
      type?: INotification['type'];
    } = {}
  ): Promise<{ notifications: INotification[]; total: number; unreadCount: number }> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, options.limit || 20);
    const skip = (page - 1) * limit;
    
    const query: any = {
      userId: userId,
      isDeleted: false,
    };
    
    if (options.unreadOnly) {
      query.isRead = false;
    }
    
    if (options.type) {
      query.type = options.type;
    }
    
    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query)
        .sort({ priority: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(query),
      Notification.countDocuments({ userId: userId, isRead: false, isDeleted: false }),
    ]);
    
    return { notifications, total, unreadCount };
  }
  
  /**
   * Mark a single notification as read
   */
  static async markAsRead(
    notificationId: string,
    userId: Types.ObjectId | string
  ): Promise<INotification | null> {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId: userId, isDeleted: false },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
    
    return notification;
  }
  
  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: Types.ObjectId | string): Promise<number> {
    const result = await Notification.updateMany(
      { userId: userId, isRead: false, isDeleted: false },
      { isRead: true, readAt: new Date() }
    );
    
    return result.modifiedCount;
  }
  
  /**
   * Delete a notification (soft delete)
   */
  static async deleteNotification(
    notificationId: string,
    userId: Types.ObjectId | string
  ): Promise<boolean> {
    const result = await Notification.findOneAndUpdate(
      { _id: notificationId, userId: userId },
      { isDeleted: true }
    );
    
    return !!result;
  }
  
  /**
   * Delete all notifications for a user (soft delete)
   */
  static async deleteAllNotifications(userId: Types.ObjectId | string): Promise<number> {
    const result = await Notification.updateMany(
      { userId: userId, isDeleted: false },
      { isDeleted: true }
    );
    
    return result.modifiedCount;
  }
  
  /**
   * Get unread notification count
   */
  static async getUnreadCount(userId: Types.ObjectId | string): Promise<number> {
    return await Notification.countDocuments({
      userId: userId,
      isRead: false,
      isDeleted: false,
    });
  }
  
  /**
   * Send email notification if user has email enabled
   */
  private static async sendEmailIfNeeded(
    notification: INotification,
    preferences: any
  ): Promise<void> {
    if (!preferences || !preferences.emailNotifications.enabled) {
      return;
    }
    
    // Check quiet hours
    if (this.isInQuietHours(preferences)) {
      logger.info(`Email notification queued for later (quiet hours): ${notification.userId}`);
      // TODO: Queue email for later delivery
      return;
    }
    
    const typeEnabled = preferences.emailNotifications.types[notification.type];
    const digestEnabled = preferences.emailNotifications.digest.enabled;
    
    if (typeEnabled && !digestEnabled) {
      try {
        // Send email based on notification type
        await this.sendEmailByType(notification, preferences);
      } catch (error) {
        logger.error(`Failed to send email for notification ${notification._id}:`, error);
      }
    }
  }
  
  /**
   * Send push notification if user has push enabled
   */
  private static async sendPushIfNeeded(
    notification: INotification,
    preferences: any
  ): Promise<void> {
    if (!preferences || !preferences.pushNotifications.enabled) {
      return;
    }
    
    // Check quiet hours
    if (this.isInQuietHours(preferences)) {
      return;
    }
    
    const typeEnabled = preferences.pushNotifications.types[notification.type];
    
    if (typeEnabled && preferences.pushNotifications.deviceTokens.length > 0) {
      // TODO: Implement push notification via FCM/APNS
      logger.info(`Push notification would be sent to ${preferences.pushNotifications.deviceTokens.length} devices`);
    }
  }
  
  /**
   * Send email based on notification type
   */
  private static async sendEmailByType(notification: INotification, preferences: any): Promise<void> {
    // This would call EmailService with appropriate templates
    // For now, we'll log it
    logger.info(`Email would be sent for ${notification.type}: ${notification.title}`);
    
    // Example implementation:
    // await EmailService.sendNotificationEmail(user.email, {
    //   title: notification.title,
    //   message: notification.message,
    //   type: notification.type,
    //   actionUrl: notification.actionUrl,
    // });
  }
  
  /**
   * Check if current time is within quiet hours
   */
  private static isInQuietHours(preferences: any): boolean {
    if (!preferences.quietHours.enabled) {
      return false;
    }
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    
    const [startHour, startMinute] = preferences.quietHours.start.split(':').map(Number);
    const [endHour, endMinute] = preferences.quietHours.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMinute;
    let endTime = endHour * 60 + endMinute;
    
    // Handle overnight quiet hours
    if (endTime < startTime) {
      endTime += 24 * 60;
    }
    
    const currentAdjusted = currentTime + (currentTime < startTime ? 24 * 60 : 0);
    
    return currentAdjusted >= startTime && currentAdjusted <= endTime;
  }
  
  /**
   * Bulk create notifications for multiple users
   */
  static async bulkCreateNotifications(
    userIds: (Types.ObjectId | string)[],
    dto: Omit<CreateNotificationDTO, 'userId'>
  ): Promise<void> {
    const notifications = userIds.map(userId => ({
      userId,
      ...dto,
      data: dto.data || {},
    }));
    
    try {
      await Notification.insertMany(notifications);
      logger.info(`Bulk created ${notifications.length} notifications`);
    } catch (error) {
      logger.error('Failed to bulk create notifications:', error);
    }
  }
  
  /**
   * Clean up old notifications (runs via cron job)
   */
  static async cleanupOldNotifications(daysToKeep: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    const result = await Notification.updateMany(
      {
        createdAt: { $lt: cutoffDate },
        isRead: true,
      },
      { isDeleted: true }
    );
    
    logger.info(`Cleaned up ${result.modifiedCount} old notifications`);
    return result.modifiedCount;
  }
}