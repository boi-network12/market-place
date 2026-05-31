// models/NotificationPreference.model.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface INotificationPreference extends Document {
  userId: Types.ObjectId;
  emailNotifications: {
    enabled: boolean;
    types: {
      system: boolean;
      security: boolean;
      order: boolean;
      payment: boolean;
      product: boolean;
      seller: boolean;
      message: boolean;
    };
    digest: {
      enabled: boolean;
      frequency: 'instant' | 'daily' | 'weekly';
    };
  };
  pushNotifications: {
    enabled: boolean;
    types: {
      system: boolean;
      security: boolean;
      order: boolean;
      payment: boolean;
      product: boolean;
      seller: boolean;
      message: boolean;
      account: boolean;
    };
    deviceTokens: string[];
  };
  inAppNotifications: {
    enabled: boolean;
    types: {
      system: boolean;
      security: boolean;
      order: boolean;
      payment: boolean;
      product: boolean;
      seller: boolean;
      message: boolean;
      account: boolean;
      announcement: boolean;
    };
  };
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string; // HH:mm format
    timezone: string;
  };
  updatedAt: Date;
}

const NotificationPreferenceSchema = new Schema<INotificationPreference>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    emailNotifications: {
      enabled: {
        type: Boolean,
        default: true,
      },
      types: {
        system: { type: Boolean, default: true },
        security: { type: Boolean, default: true },
        order: { type: Boolean, default: true },
        payment: { type: Boolean, default: true },
        product: { type: Boolean, default: true },
        seller: { type: Boolean, default: true },
        message: { type: Boolean, default: true },
      },
      digest: {
        enabled: { type: Boolean, default: false },
        frequency: {
          type: String,
          enum: ['instant', 'daily', 'weekly'],
          default: 'instant',
        },
      },
    },
    pushNotifications: {
      enabled: {
        type: Boolean,
        default: true,
      },
      types: {
        system: { type: Boolean, default: true },
        security: { type: Boolean, default: true },
        order: { type: Boolean, default: true },
        payment: { type: Boolean, default: true },
        product: { type: Boolean, default: true },
        seller: { type: Boolean, default: true },
        message: { type: Boolean, default: true },
      },
      deviceTokens: [String],
    },
    inAppNotifications: {
      enabled: {
        type: Boolean,
        default: true,
      },
      types: {
        system: { type: Boolean, default: true },
        security: { type: Boolean, default: true },
        order: { type: Boolean, default: true },
        payment: { type: Boolean, default: true },
        product: { type: Boolean, default: true },
        seller: { type: Boolean, default: true },
        message: { type: Boolean, default: true },
      },
    },
    quietHours: {
      enabled: { type: Boolean, default: false },
      start: { type: String, default: '22:00' },
      end: { type: String, default: '08:00' },
      timezone: { type: String, default: 'UTC' },
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const NotificationPreference = mongoose.model<INotificationPreference>(
  'NotificationPreference',
  NotificationPreferenceSchema
);