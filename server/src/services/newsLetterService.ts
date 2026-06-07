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
  
  // services/newsletter.service.ts
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
    
    // Fix: Handle isActive correctly - active means NOT unsubscribed
    if (filters?.isActive !== undefined) {
      if (filters.isActive) {
        // Active subscribers: unsubscribedAt doesn't exist OR is null
        query.$or = [
          { unsubscribedAt: { $exists: false } },
          { unsubscribedAt: null }
        ];
      } else {
        // Inactive subscribers: have an unsubscribedAt date
        query.unsubscribedAt = { $exists: true, $ne: null };
      }
    } else {
      // Default: only show active subscribers
      query.$or = [
        { unsubscribedAt: { $exists: false } },
        { unsubscribedAt: null }
      ];
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

  static async sendToSubscribers(
    subject: string, 
    htmlContent: string, 
    subscriberIds?: string[]
  ): Promise<{ sent: number; failed: number }> {
    let subscribers: INewsletterSubscriber[] = [];
    
    if (subscriberIds && subscriberIds.length > 0) {
      subscribers = await NewsletterSubscriber.find({ 
        _id: { $in: subscriberIds }, 
        unsubscribedAt: null 
      });
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
          html: this.buildNewsletterEmail(subscriber.email, subject, htmlContent),
        });
        sent++;
      } catch (error) {
        logger.error(`Failed to send email to ${subscriber.email}:`, error);
        failed++;
      }
    }

    return { sent, failed };
  }

  static async exportSubscribers(format: 'csv' | 'json'): Promise<string> {
    const subscribers = await NewsletterSubscriber.find({ unsubscribedAt: null });

    if (format === 'csv') {
      const headers = ['Email', 'Interests', 'Source', 'Verified', 'Created At'];
      const rows = subscribers.map((s) => [
        s.email,
        s.interests.join('; '),
        s.source,
        s.isVerified ? 'Yes' : 'No',
        s.createdAt.toISOString(),
      ]);
      
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    } else {
      return JSON.stringify(subscribers, null, 2);
    }
  }

  private static buildNewsletterEmail(email: string, subject: string, htmlContent: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4f46e5;">Kamdi Market</h1>
        </div>
        ${htmlContent}
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; font-size: 12px; color: #999;">
          <p>You're receiving this because you subscribed to our newsletter.</p>
          <a href="${process.env.FRONTEND_URL}/unsubscribe?email=${encodeURIComponent(email)}" style="color: #4f46e5;">Unsubscribe</a>
        </div>
      </div>
    `;
  }
}