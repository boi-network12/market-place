// models/AdminTeam.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ITeamMember extends Document {
  userId: mongoose.Types.ObjectId;
  email: string;
  name: string;
  role: 'admin' | 'moderator' | 'support';
  permissions: {
    manageUsers: boolean;
    manageSellers: boolean;
    manageProducts: boolean;
    manageAnnouncements: boolean;
    manageTeams: boolean;
    viewReports: boolean;
    manageEmailSubscribers: boolean;
  };
  addedBy: mongoose.Types.ObjectId;
  addedAt: Date;
  isActive: boolean;
}

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'emergency';
  targetAudience: 'all' | 'sellers' | 'buyers' | 'verified' | 'unverified';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdBy: mongoose.Types.ObjectId;
  sentAt?: Date;
  expiresAt?: Date;
  readBy: Array<{
    userId: mongoose.Types.ObjectId;
    readAt: Date;
  }>;
  isActive: boolean;
}

export interface IEmailSubscriber extends Document {
  email: string;
  interests: string[];
  source: string;
  isVerified: boolean;
  verifiedAt?: Date;
  unsubscribedAt?: Date;
  createdAt: Date;
  metadata: {
    ip?: string;
    userAgent?: string;
    location?: string;
  };
}

const TeamMemberSchema = new Schema<ITeamMember>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'moderator', 'support'], required: true },
  permissions: {
    manageUsers: { type: Boolean, default: false },
    manageSellers: { type: Boolean, default: false },
    manageProducts: { type: Boolean, default: false },
    manageAnnouncements: { type: Boolean, default: false },
    manageTeams: { type: Boolean, default: false },
    viewReports: { type: Boolean, default: false },
    manageEmailSubscribers: { type: Boolean, default: false },
  },
  addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  addedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

const AnnouncementSchema = new Schema<IAnnouncement>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['info', 'warning', 'success', 'emergency'], default: 'info' },
  targetAudience: { type: String, enum: ['all', 'sellers', 'buyers', 'verified', 'unverified'], default: 'all' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sentAt: { type: Date },
  expiresAt: { type: Date },
  readBy: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    readAt: { type: Date, default: Date.now },
  }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const EmailSubscriberSchema = new Schema<IEmailSubscriber>({
  email: { type: String, required: true, unique: true, lowercase: true },
  interests: [{ type: String }],
  source: { type: String, default: 'footer_newsletter' },
  isVerified: { type: Boolean, default: false },
  verifiedAt: { type: Date },
  unsubscribedAt: { type: Date },
  metadata: {
    ip: String,
    userAgent: String,
    location: String,
  },
}, { timestamps: true });

export const TeamMember = mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);
export const Announcement = mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
export const EmailSubscriber = mongoose.model<IEmailSubscriber>('EmailSubscriber', EmailSubscriberSchema);