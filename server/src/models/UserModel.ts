// models/User.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

/* ====================== INTERFACES ====================== */

export interface IDevice extends Document, IDeviceInput {
  deviceId: string;
  deviceName: string;
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'bot' | "other";
  browser: string;
  os: string;
  ipAddress: string;
  location: {
    country: string;
    city: string;
    lat: number;
    lng: number;
    timezone: string;
  };
  lastLogin: Date;
  isActive: boolean;
}

// Add this above IDevice
export interface IDeviceInput {
  deviceId: string;
  deviceName: string;
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'bot' | 'other';
  browser: string;
  os: string;
  ipAddress: string;
  location: {
    country: string;
    city: string;
    lat: number;
    lng: number;
    timezone: string;
  };
  lastLogin?: Date;
  isActive?: boolean;
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: 'user' | 'seller' | 'admin' | 'super_admin';
  isSeller: boolean;
  sellerApproved: boolean;
  sellerSubscription: {
    active: boolean;
    startDate: Date;
    endDate: Date;
    plan: 'basic' | 'pro' | 'enterprise';
  };
  isAnonymous: boolean;
  emailVerified: boolean;
  phoneNumber?: string;
  avatar?: string;

  // Password Reset (ADD THESE TWO LINES)
  passwordResetCode?: string;
  passwordResetExpires?: Date;
  
  // Location Information
  location: {
    country: string;
    city: string;
    ipAddress: string;
    coordinates: { lat: number; lng: number };
    registeredAt: Date;
  };

  // Device & Login Management
  devices: mongoose.Types.DocumentArray<IDevice> | IDeviceInput[];
  lastLogin: Date;
  lastLoginLocation: {
    ip: string;
    device: string;
    location: string;
    timestamp: Date;
  };
  loginHistory: Array<{
    ip: string;
    device: string;
    location: string;
    timestamp: Date;
  }>;

  // Status & Security
  status: 'active' | 'suspended' | 'banned';
  emailNotifications: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  refreshToken?: string;

  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

/* ====================== SCHEMAS ====================== */

const DeviceSchema = new Schema<IDevice>(
  {
    deviceId: { type: String, required: true, unique: true },
    deviceName: { type: String, required: true },
    deviceType: {
      type: String,
      enum: ['mobile', 'tablet', 'desktop', 'bot', 'other'],
      required: true,
    },
    browser: { type: String, required: true },
    os: { type: String, required: true },
    ipAddress: { type: String, required: true },

    location: {
      country: String,
      city: String,
      lat: Number,
      lng: Number,
      timezone: String,
    },

    lastLogin: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const UserSchema = new Schema<IUser>(
  {
    // Basic Information
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 8 },
    passwordResetCode: { type: String },
    passwordResetExpires: { type: Date },
    fullName: { type: String, required: true, trim: true },

    // Role & Seller Management
    role: {
      type: String,
      enum: ['user', 'seller', 'admin', 'super_admin'],
      default: 'user',
    },
    isSeller: { type: Boolean, default: false },
    sellerApproved: { type: Boolean, default: false },
    sellerSubscription: {
      active: { type: Boolean, default: false },
      startDate: Date,
      endDate: Date,
      plan: { type: String, enum: ['basic', 'pro', 'enterprise'] },
    },

    // Account Status
    isAnonymous: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    phoneNumber: { type: String, trim: true },
    avatar: { type: String },

    // Location
    location: {
      country: String,
      city: String,
      ipAddress: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
      registeredAt: { type: Date, default: Date.now },
    },

    // Devices & Login Tracking
    devices: [DeviceSchema],
    lastLogin: { type: Date, default: Date.now },

    lastLoginLocation: {
      ip: String,
      device: String,
      location: String,
      timestamp: Date,
    },

    loginHistory: [
      {
        ip: String,
        device: String,
        location: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],

    // Security & Preferences
    status: {
      type: String,
      enum: ['active', 'suspended', 'banned'],
      default: 'active',
    },
    emailNotifications: { type: Boolean, default: true },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: String,
    refreshToken: String,
  },
  { timestamps: true }
);

/* ====================== MIDDLEWARES ====================== */

// Hash password before saving
UserSchema.pre('save', async function (this: IUser) {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
});

// Auto-generate username from email (if not provided)
UserSchema.pre('validate', function (this: IUser) {
  if (!this.username && this.email) {
    this.username = this.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  }
});

/* ====================== METHODS ====================== */

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);