// models/EmailTemplate.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IEmailTemplate extends Document {
  name: string;
  subject: string;
  content: string;
  htmlContent: string;
  type: 'newsletter' | 'announcement' | 'promotion' | 'welcome' | 'custom';
  isDefault: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EmailTemplateSchema = new Schema<IEmailTemplate>(
  {
    name: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    content: { type: String, required: true },
    htmlContent: { type: String, required: true },
    type: {
      type: String,
      enum: ['newsletter', 'announcement', 'promotion', 'welcome', 'custom'],
      default: 'custom',
    },
    isDefault: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const EmailTemplate = mongoose.model<IEmailTemplate>(
  'EmailTemplate',
  EmailTemplateSchema
);