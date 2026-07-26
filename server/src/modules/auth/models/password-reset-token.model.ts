import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface IPasswordResetToken extends Document {
  userId: mongoose.Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  used: boolean;
  usedAt: Date | null;
  active: boolean;
  deleted: boolean;
  requestIp: string;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
  revokedAt: Date | null;
  revokedReason: string | null;
}

const PasswordResetTokenSchema = new Schema<IPasswordResetToken>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    tokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    used: { type: Boolean, default: false },
    usedAt: { type: Date, default: null },
    active: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
    requestIp: { type: String, required: true },
    userAgent: { type: String, required: true },
    revokedAt: { type: Date, default: null },
    revokedReason: { type: String, default: null },
  },
  { timestamps: true }
);

// Fast lookup by hash during reset validation
PasswordResetTokenSchema.index({ tokenHash: 1 }, { unique: true });

// Bulk-invalidate all tokens for a user after successful reset
PasswordResetTokenSchema.index({ userId: 1 });

export const PasswordResetTokenModel = mongoose.model<IPasswordResetToken>(
  'PasswordResetTokens',
  PasswordResetTokenSchema,
  'PasswordResetTokens'
);
