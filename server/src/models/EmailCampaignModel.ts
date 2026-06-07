// models/EmailCampaign.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IEmailCampaign extends Document {
  subject: string;
  content: string;
  htmlContent: string;
  type: 'newsletter' | 'announcement' | 'promotion' | 'custom';
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  scheduledFor?: Date;
  sentAt?: Date;
  recipientType: 'all' | 'subscribers' | 'users' | 'specific';
  recipientEmails?: string[];
  recipientIds?: string[];
  statistics: {
    total: number;
    sent: number;
    failed: number;
    opened: number;
    clicked: number;
  };
  createdBy: {
    userId: mongoose.Types.ObjectId;
    email: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const EmailCampaignSchema = new Schema<IEmailCampaign>(
  {
    subject: { type: String, required: true },
    content: { type: String, required: true },
    htmlContent: { type: String, required: true },
    type: {
      type: String,
      enum: ['newsletter', 'announcement', 'promotion', 'custom'],
      default: 'newsletter',
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'sending', 'sent', 'failed'],
      default: 'draft',
    },
    scheduledFor: { type: Date },
    sentAt: { type: Date },
    recipientType: {
      type: String,
      enum: ['all', 'subscribers', 'users', 'specific'],
      required: true,
    },
    recipientEmails: [{ type: String }],
    recipientIds: [{ type: Schema.Types.ObjectId }],
    statistics: {
      total: { type: Number, default: 0 },
      sent: { type: Number, default: 0 },
      failed: { type: Number, default: 0 },
      opened: { type: Number, default: 0 },
      clicked: { type: Number, default: 0 },
    },
    createdBy: {
      userId: { type: Schema.Types.ObjectId, required: true },
      email: { type: String, required: true },
      name: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export const EmailCampaign = mongoose.model<IEmailCampaign>(
  'EmailCampaign',
  EmailCampaignSchema
);