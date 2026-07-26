import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface IRefreshToken extends Document {
  userId: mongoose.Types.ObjectId;
  tokenHash: string;
  rootTokenId: mongoose.Types.ObjectId;
  parentTokenId: mongoose.Types.ObjectId | null;
  isUsed: boolean;
  expiresAt: Date;
  active: boolean;
  deleted: boolean;
  revokedAt: Date | null;
  revokedReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const RefreshTokenSchema = new Schema<IRefreshToken>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    tokenHash: { type: String, required: true },
    rootTokenId: { type: Schema.Types.ObjectId, ref: 'RefreshTokens', required: true },
    parentTokenId: { type: Schema.Types.ObjectId, ref: 'RefreshTokens', default: null },
    isUsed: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    active: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
    revokedAt: { type: Date, default: null },
    revokedReason: { type: String, default: null },
  },
  { timestamps: true }
);

RefreshTokenSchema.index({ tokenHash: 1 }, { unique: true });
RefreshTokenSchema.index({ userId: 1, tokenHash: 1 });
RefreshTokenSchema.index({ rootTokenId: 1 });

export const RefreshTokenModel = mongoose.model<IRefreshToken>(
  'RefreshTokens',
  RefreshTokenSchema,
  'RefreshTokens'
);
