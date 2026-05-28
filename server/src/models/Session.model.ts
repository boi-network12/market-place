// models/Session.model.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

/* ====================== INTERFACE ====================== */

export interface ISession extends Document {
  userId: Types.ObjectId;
  token: string;
  refreshToken: string;
  deviceId: string;

  deviceInfo: {
    name: string;
    type: 'mobile' | 'tablet' | 'desktop' | 'bot';
    browser: string;
    os: string;
  };

  ipAddress: string;
  location: {
    country: string;
    city: string;
    lat: number;
    lng: number;
  };

  lastActivity: Date;
  expiresAt: Date;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

/* ====================== SCHEMA ====================== */

const SessionSchema = new Schema<ISession>(
  {
    // Reference to User
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Authentication Tokens
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    refreshToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // Device Identification
    deviceId: {
      type: String,
      required: true,
      index: true,
    },

    deviceInfo: {
      name: { type: String, required: true },
      type: {
        type: String,
        enum: ['mobile', 'tablet', 'desktop', 'bot'],
        required: true,
      },
      browser: { type: String, required: true },
      os: { type: String, required: true },
    },

    // Location & Security
    ipAddress: { type: String, required: true },

    location: {
      country: String,
      city: String,
      lat: Number,
      lng: Number,
    },

    // Session Management
    lastActivity: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt
  }
);

/* ====================== INDEXES ====================== */

// TTL Index - Automatically delete expired sessions
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Compound indexes for better query performance
SessionSchema.index({ userId: 1, isActive: 1 });
SessionSchema.index({ deviceId: 1, userId: 1 });

/* ====================== MODEL ====================== */

export const Session = mongoose.model<ISession>('Session', SessionSchema);