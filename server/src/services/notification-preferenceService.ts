// services/notification-preference.service.ts
import { NotificationPreference, INotificationPreference } from '../models/NotificationPreferenceModel';
import { Types } from 'mongoose';
import { logger } from '../utils/logger';

export class NotificationPreferenceService {
  
  /**
   * Get or create user notification preferences
   */
  static async getOrCreatePreferences(
    userId: Types.ObjectId | string
  ): Promise<INotificationPreference> {
    let preferences = await NotificationPreference.findOne({ userId });
    
    if (!preferences) {
      preferences = new NotificationPreference({ userId });
      await preferences.save();
      logger.info(`Created notification preferences for user ${userId}`);
    }
    
    return preferences;
  }
  
  /**
   * Update email notification settings
   */
  static async updateEmailSettings(
    userId: Types.ObjectId | string,
    settings: Partial<{
      enabled: boolean;
      types: INotificationPreference['emailNotifications']['types'];
      digest: {
        enabled: boolean;
        frequency: 'instant' | 'daily' | 'weekly';
      };
    }>
  ): Promise<INotificationPreference> {
    const preferences = await this.getOrCreatePreferences(userId);
    
    if (settings.enabled !== undefined) {
      preferences.emailNotifications.enabled = settings.enabled;
    }
    
    if (settings.types) {
      preferences.emailNotifications.types = {
        ...preferences.emailNotifications.types,
        ...settings.types,
      };
    }
    
    if (settings.digest) {
      preferences.emailNotifications.digest = {
        ...preferences.emailNotifications.digest,
        ...settings.digest,
      };
    }
    
    preferences.updatedAt = new Date();
    await preferences.save();
    
    return preferences;
  }
  
  /**
   * Update push notification settings
   */
  static async updatePushSettings(
    userId: Types.ObjectId | string,
    settings: Partial<{
      enabled: boolean;
      types: INotificationPreference['pushNotifications']['types'];
    }>
  ): Promise<INotificationPreference> {
    const preferences = await this.getOrCreatePreferences(userId);
    
    if (settings.enabled !== undefined) {
      preferences.pushNotifications.enabled = settings.enabled;
    }
    
    if (settings.types) {
      preferences.pushNotifications.types = {
        ...preferences.pushNotifications.types,
        ...settings.types,
      };
    }
    
    preferences.updatedAt = new Date();
    await preferences.save();
    
    return preferences;
  }
  
  /**
   * Update in-app notification settings
   */
  static async updateInAppSettings(
    userId: Types.ObjectId | string,
    settings: Partial<{
      enabled: boolean;
      types: INotificationPreference['inAppNotifications']['types'];
    }>
  ): Promise<INotificationPreference> {
    const preferences = await this.getOrCreatePreferences(userId);
    
    if (settings.enabled !== undefined) {
      preferences.inAppNotifications.enabled = settings.enabled;
    }
    
    if (settings.types) {
      preferences.inAppNotifications.types = {
        ...preferences.inAppNotifications.types,
        ...settings.types,
      };
    }
    
    preferences.updatedAt = new Date();
    await preferences.save();
    
    return preferences;
  }
  
  /**
   * Update quiet hours settings
   */
  static async updateQuietHours(
    userId: Types.ObjectId | string,
    settings: Partial<{
      enabled: boolean;
      start: string;
      end: string;
      timezone: string;
    }>
  ): Promise<INotificationPreference> {
    const preferences = await this.getOrCreatePreferences(userId);
    
    if (settings.enabled !== undefined) {
      preferences.quietHours.enabled = settings.enabled;
    }
    
    if (settings.start) {
      preferences.quietHours.start = settings.start;
    }
    
    if (settings.end) {
      preferences.quietHours.end = settings.end;
    }
    
    if (settings.timezone) {
      preferences.quietHours.timezone = settings.timezone;
    }
    
    preferences.updatedAt = new Date();
    await preferences.save();
    
    return preferences;
  }
  
  /**
   * Register device token for push notifications
   */
  static async registerDeviceToken(
    userId: Types.ObjectId | string,
    deviceToken: string
  ): Promise<INotificationPreference> {
    const preferences = await this.getOrCreatePreferences(userId);
    
    if (!preferences.pushNotifications.deviceTokens.includes(deviceToken)) {
      preferences.pushNotifications.deviceTokens.push(deviceToken);
      await preferences.save();
      logger.info(`Registered device token for user ${userId}`);
    }
    
    return preferences;
  }
  
  /**
   * Unregister device token
   */
  static async unregisterDeviceToken(
    userId: Types.ObjectId | string,
    deviceToken: string
  ): Promise<INotificationPreference> {
    const preferences = await this.getOrCreatePreferences(userId);
    
    preferences.pushNotifications.deviceTokens = preferences.pushNotifications.deviceTokens.filter(
      token => token !== deviceToken
    );
    
    await preferences.save();
    logger.info(`Unregistered device token for user ${userId}`);
    
    return preferences;
  }
  
  /**
   * Reset all notification preferences to default
   */
  static async resetToDefault(userId: Types.ObjectId | string): Promise<INotificationPreference> {
    await NotificationPreference.deleteOne({ userId });
    const preferences = await this.getOrCreatePreferences(userId);
    logger.info(`Reset notification preferences for user ${userId}`);
    return preferences;
  }
}