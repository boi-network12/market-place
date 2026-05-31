import mongoose, { Types } from "mongoose";
import { Schema } from "mongoose";

interface SellerRequestData {
  userId: Types.ObjectId;
  businessName: string;
  businessAddress: string;
  proofOfAddress: string;
  phoneNumber: string;
  email: string;
  transactionMethods: {
    bank?: { accountName: string; accountNumber: string; bankName: string };
    crypto?: { walletAddress: string; currency: string };
    cashApp?: { username: string };
    paypal?: { email: string };
  };
  documents: Array<{ type: string; url: string }>;
}

interface SellerRequest extends Document {
  userId: Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  data: SellerRequestData;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  rejectionReason?: string;
}

// Add this model
const SellerRequestSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  data: {
    businessName: String,
    businessAddress: String,
    proofOfAddress: String,
    phoneNumber: String,
    email: String,
    transactionMethods: {
      bank: { accountName: String, accountNumber: String, bankName: String },
      crypto: { walletAddress: String, currency: String },
      cashApp: { username: String },
      paypal: { email: String },
    },
    documents: [{ type: String, url: String }],
  },
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: Date,
  rejectionReason: String,
}, { timestamps: true });

export const SellerRequest = mongoose.model('SellerRequest', SellerRequestSchema);