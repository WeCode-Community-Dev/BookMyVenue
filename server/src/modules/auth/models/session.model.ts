import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  rootTokenId: mongoose.Types.ObjectId;
  absoluteExpiresAt: Date;
  lastLogin: Date;
  ipAddress: string;
  userAgent: string;
  active: boolean;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    rootTokenId: {
      type: Schema.Types.ObjectId,
      ref: 'RefreshTokens',
      required: true,
      unique: true,
    },
    absoluteExpiresAt: { type: Date, required: true, index: { expires: 0 } },
    lastLogin: { type: Date, default: Date.now },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
    active: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

SessionSchema.index({ userId: 1 });

export const SessionModel = mongoose.model<ISession>('Sessions', SessionSchema, 'Sessions');
