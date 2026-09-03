import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface IPasswordResetRequest extends Document {
  emailHash: string;
  ip: string;
  userAgent: string;
  emailSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PasswordResetRequestSchema = new Schema<IPasswordResetRequest>(
  {
    emailHash: { type: String, required: true },
    ip: { type: String, required: true },
    userAgent: { type: String, required: true },
    emailSent: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, expires: 7200 },
  },
  { timestamps: true }
);

PasswordResetRequestSchema.index({ emailHash: 1, createdAt: -1 });

export const PasswordResetRequestModel = mongoose.model<IPasswordResetRequest>(
  'PasswordResetRequests',
  PasswordResetRequestSchema,
  'PasswordResetRequests'
);
