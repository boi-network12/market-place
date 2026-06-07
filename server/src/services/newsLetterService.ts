// services/newsletter.service.ts
import { NewsletterSubscriber, INewsletterSubscriber } from '../models/NewsletterSubscriberModel';
import { EmailService } from './emailService';
import { NotificationService } from './notificationService';
import { User } from '../models/UserModel';
import { logger } from '../utils/logger';

export class NewsletterService {
  
  static async subscribe(data: {
    email: string;
    interests?: string[];
    source?: string;
    ip?: string;
    userAgent?: string;
    location?: string;
  }): Promise<{ success: boolean; message: string; subscriber?: INewsletterSubscriber }> {
    try {
      const { email, interests = [], source = 'footer_newsletter', ip, userAgent, location } = data;
      
      // Check if already subscribed
      const existing = await NewsletterSubscriber.findOne({ email: email.toLowerCase() });
      
      if (existing) {
        if (!existing.unsubscribedAt) {
          return { success: false, message: 'This email is already subscribed to our newsletter.' };
        } else {
          // Reactivate subscription
          existing.unsubscribedAt = undefined;
          existing.interests = [...new Set([...existing.interests, ...interests])];
          existing.metadata = {
            ip: ip || existing.metadata.ip,
            userAgent: userAgent || existing.metadata.userAgent,
            location: location || existing.metadata.location,
            subscribedAt: new Date(),
          };
          await existing.save();
          
          // Send welcome back email
          await EmailService.sendNewsletterWelcomeBack(email, { interests });
          
          return { success: true, message: 'Welcome back to our newsletter!', subscriber: existing };
        }
      }
      
      // Create new subscriber
      const subscriber = new NewsletterSubscriber({
        email: email.toLowerCase(),
        interests,
        source,
        isVerified: true, // Auto-verify for now (or send verification email)
        metadata: {
          ip,
          userAgent,
          location,
          subscribedAt: new Date(),
        },
      });
      
      await subscriber.save();
      
      // Send welcome email
      await EmailService.sendNewsletterWelcome(email, { interests });
      
      // Notify admins about new subscriber (optional)
      await NewsletterService.notifyAdminsOfNewSubscriber(subscriber);
      
      logger.info(`New newsletter subscriber: ${email}`);
      
      return { success: true, message: 'Successfully subscribed to newsletter!', subscriber };
    } catch (error) {
      logger.error('Newsletter subscription error:', error);
      return { success: false, message: 'Failed to subscribe. Please try again later.' };
    }
  }
  
  static async unsubscribe(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const subscriber = await NewsletterSubscriber.findOne({ email: email.toLowerCase() });
      
      if (!subscriber) {
        return { success: false, message: 'Email not found in our subscription list.' };
      }
      
      subscriber.unsubscribedAt = new Date();
      await subscriber.save();
      
      logger.info(`Newsletter unsubscribed: ${email}`);
      
      return { success: true, message: 'Successfully unsubscribed from newsletter.' };
    } catch (error) {
      logger.error('Newsletter unsubscribe error:', error);
      return { success: false, message: 'Failed to unsubscribe. Please try again later.' };
    }
  }
  
  static async getSubscribers(filters?: {
    search?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ subscribers: INewsletterSubscriber[]; total: number; page: number; totalPages: number }> {
    const page = Math.max(1, filters?.page || 1);
    const limit = Math.min(100, filters?.limit || 20);
    const skip = (page - 1) * limit;
    
    const query: any = {};
    if (filters?.search) {
      query.email = { $regex: filters.search, $options: 'i' };
    }
    if (filters?.isActive !== undefined) {
      if (filters.isActive) {
        query.unsubscribedAt = null;
      } else {
        query.unsubscribedAt = { $ne: null };
      }
    }
    
    const [subscribers, total] = await Promise.all([
      NewsletterSubscriber.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      NewsletterSubscriber.countDocuments(query),
    ]);
    
    return {
      subscribers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
  
  private static async notifyAdminsOfNewSubscriber(subscriber: INewsletterSubscriber) {
    try {
      // Get all admin users
      const admins = await User.find({ role: { $in: ['admin', 'super_admin'] } });
      
      // Create notifications for admins
      await NotificationService.bulkCreateNotifications(
        admins.map(a => a._id),
        {
          type: 'announcement',
          title: 'New Newsletter Subscriber! 📧',
          message: `${subscriber.email} just subscribed to the newsletter. Interests: ${subscriber.interests.join(', ') || 'None'}`,
          priority: 'low',
          actionUrl: '/admin/newsletter',
          actionLabel: 'View Subscribers',
          data: { subscriberEmail: subscriber.email, interests: subscriber.interests },
        }
      );
    } catch (error) {
      logger.error('Failed to notify admins about new subscriber:', error);
    }
  }
}