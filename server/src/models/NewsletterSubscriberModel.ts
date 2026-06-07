// models/NewsletterSubscriber.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface INewsletterSubscriber extends Document {
  email: string;
  interests: string[];
  source: string;
  isVerified: boolean;
  verifiedAt?: Date;
  unsubscribedAt?: Date;
  metadata: {
    ip?: string;
    userAgent?: string;
    location?: string;
    subscribedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterSubscriberSchema = new Schema<INewsletterSubscriber>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    interests: [{ type: String }],
    source: { type: String, default: 'footer_newsletter' },
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    unsubscribedAt: { type: Date },
    metadata: {
      ip: String,
      userAgent: String,
      location: String,
      subscribedAt: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

export const NewsletterSubscriber = mongoose.model<INewsletterSubscriber>(
  'NewsletterSubscriber',
  NewsletterSubscriberSchema
);