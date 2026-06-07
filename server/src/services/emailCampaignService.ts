// services/emailCampaign.service.ts
import { EmailCampaign, IEmailCampaign } from '../models/EmailCampaignModel';
import { NewsletterSubscriber } from '../models/NewsletterSubscriberModel';
import { User } from '../models/UserModel';
import { EmailService } from './emailService';
import { NotificationService } from './notificationService';
import { logger } from '../utils/logger';
import mongoose from 'mongoose';

export class EmailCampaignService {
  
  /**
   * Create a new email campaign
   */
  static async createCampaign(
    data: {
      subject: string;
      content: string;
      htmlContent: string;
      type: 'newsletter' | 'announcement' | 'promotion' | 'custom';
      recipientType: 'all' | 'subscribers' | 'users' | 'specific';
      recipientEmails?: string[];
      recipientIds?: string[];
      scheduledFor?: Date;
    },
    createdBy: { userId: string; email: string; name: string }
  ): Promise<IEmailCampaign> {
    const campaign = new EmailCampaign({
      ...data,
      status: data.scheduledFor ? 'scheduled' : 'draft',
      createdBy: {
        userId: new mongoose.Types.ObjectId(createdBy.userId),
        email: createdBy.email,
        name: createdBy.name,
      },
    });
    
    await campaign.save();
    return campaign;
  }
  
  /**
   * Get all campaigns
   */
  static async getCampaigns(filters?: {
    status?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<{ campaigns: IEmailCampaign[]; total: number; page: number; totalPages: number }> {
    const page = Math.max(1, filters?.page || 1);
    const limit = Math.min(100, filters?.limit || 20);
    const skip = (page - 1) * limit;
    
    const query: any = {};
    if (filters?.status) query.status = filters.status;
    if (filters?.type) query.type = filters.type;
    
    const [campaigns, total] = await Promise.all([
      EmailCampaign.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      EmailCampaign.countDocuments(query),
    ]);
    
    return { campaigns, total, page, totalPages: Math.ceil(total / limit) };
  }
  
  /**
   * Get single campaign
   */
  static async getCampaign(campaignId: string): Promise<IEmailCampaign | null> {
    return await EmailCampaign.findById(campaignId);
  }
  
  /**
   * Update campaign
   */
  static async updateCampaign(
    campaignId: string,
    updates: Partial<IEmailCampaign>
  ): Promise<IEmailCampaign | null> {
    // Only allow updates if status is draft
    const campaign = await EmailCampaign.findById(campaignId);
    if (campaign && campaign.status !== 'draft') {
      throw new Error('Cannot update campaign that is already sent or scheduled');
    }
    
    return await EmailCampaign.findByIdAndUpdate(campaignId, updates, { new: true });
  }
  
  /**
   * Delete campaign
   */
  static async deleteCampaign(campaignId: string): Promise<boolean> {
    const campaign = await EmailCampaign.findById(campaignId);
    if (campaign && campaign.status === 'sent') {
      throw new Error('Cannot delete sent campaign');
    }
    const result = await EmailCampaign.findByIdAndDelete(campaignId);
    return !!result;
  }
  
  /**
   * Send campaign immediately
   */
  static async sendCampaign(campaignId: string): Promise<{ sent: number; failed: number }> {
    const campaign = await EmailCampaign.findById(campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    
    if (campaign.status === 'sent') {
      throw new Error('Campaign already sent');
    }
    
    // Get recipients based on type
    let recipients: Array<{ email: string; name?: string; id?: string }> = [];
    
    switch (campaign.recipientType) {
      case 'subscribers':
        const subscribers = await NewsletterSubscriber.find({ unsubscribedAt: null });
        recipients = subscribers.map(s => ({ email: s.email, name: s.email.split('@')[0] }));
        break;
        
      case 'users':
        const users = await User.find({ status: 'active' }).select('email fullName');
        recipients = users.map(u => ({ email: u.email, name: u.fullName, id: u._id.toString() }));
        break;
        
      case 'specific':
        if (campaign.recipientEmails && campaign.recipientEmails.length > 0) {
          recipients = campaign.recipientEmails.map(email => ({ email, name: email.split('@')[0] }));
        }
        if (campaign.recipientIds && campaign.recipientIds.length > 0) {
          const specificUsers = await User.find({ _id: { $in: campaign.recipientIds } }).select('email fullName');
          recipients.push(...specificUsers.map(u => ({ email: u.email, name: u.fullName, id: u._id.toString() })));
        }
        break;
        
      case 'all':
      default:
        const allSubscribers = await NewsletterSubscriber.find({ unsubscribedAt: null });
        const allUsers = await User.find({ status: 'active' }).select('email fullName');
        const allEmails = new Set<string>();
        
        allSubscribers.forEach(s => allEmails.add(s.email));
        allUsers.forEach(u => allEmails.add(u.email));
        
        recipients = Array.from(allEmails).map(email => ({ email, name: email.split('@')[0] }));
        break;
    }
    
    // Remove duplicates
    const uniqueRecipients = Array.from(
      new Map(recipients.map(r => [r.email, r])).values()
    );
    
    campaign.statistics.total = uniqueRecipients.length;
    campaign.status = 'sending';
    await campaign.save();
    
    let sent = 0;
    let failed = 0;
    
    // Send emails in batches
    const batchSize = 50;
    for (let i = 0; i < uniqueRecipients.length; i += batchSize) {
      const batch = uniqueRecipients.slice(i, i + batchSize);
      
      await Promise.allSettled(
        batch.map(async (recipient) => {
          try {
            // Personalize content
            let personalizedHtml = campaign.htmlContent;
            if (recipient.name) {
              personalizedHtml = personalizedHtml.replace(/{{name}}/g, recipient.name);
            }
            personalizedHtml = personalizedHtml.replace(/{{email}}/g, recipient.email);
            
            await EmailService.sendEmail({
              to: recipient.email,
              subject: campaign.subject,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  ${personalizedHtml}
                  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; font-size: 12px; color: #999;">
                    <p>You're receiving this because you're subscribed to our updates.</p>
                    <a href="${process.env.FRONTEND_URL}/unsubscribe?email=${encodeURIComponent(recipient.email)}" style="color: #4f46e5;">Unsubscribe</a>
                  </div>
                </div>
              `,
            });
            
            sent++;
            campaign.statistics.sent = sent;
          } catch (error) {
            failed++;
            campaign.statistics.failed = failed;
            logger.error(`Failed to send email to ${recipient.email}:`, error);
          }
          
          await campaign.save();
        })
      );
      
      // Small delay between batches
      if (i + batchSize < uniqueRecipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    campaign.status = 'sent';
    campaign.sentAt = new Date();
    await campaign.save();
    
    logger.info(`Campaign "${campaign.subject}" sent: ${sent} success, ${failed} failed`);
    
    return { sent, failed };
  }
  
  /**
   * Send to specific users (special people)
   */
  static async sendToSpecificUsers(
    subject: string,
    content: string,
    htmlContent: string,
    userIds: string[],
    createdBy: { userId: string; email: string; name: string }
  ): Promise<{ sent: number; failed: number }> {
    const campaign = await this.createCampaign(
      {
        subject,
        content,
        htmlContent,
        type: 'custom',
        recipientType: 'specific',
        recipientIds: userIds,
      },
      createdBy
    );
    
    return await this.sendCampaign(campaign._id.toString());
  }
  
  /**
   * Send to all subscribers
   */
  static async sendToAllSubscribers(
    subject: string,
    content: string,
    htmlContent: string,
    createdBy: { userId: string; email: string; name: string }
  ): Promise<{ sent: number; failed: number }> {
    const campaign = await this.createCampaign(
      {
        subject,
        content,
        htmlContent,
        type: 'newsletter',
        recipientType: 'subscribers',
      },
      createdBy
    );
    
    return await this.sendCampaign(campaign._id.toString());
  }
  
  /**
   * Send to all users
   */
  static async sendToAllUsers(
    subject: string,
    content: string,
    htmlContent: string,
    createdBy: { userId: string; email: string; name: string }
  ): Promise<{ sent: number; failed: number }> {
    const campaign = await this.createCampaign(
      {
        subject,
        content,
        htmlContent,
        type: 'announcement',
        recipientType: 'users',
      },
      createdBy
    );
    
    return await this.sendCampaign(campaign._id.toString());
  }
}