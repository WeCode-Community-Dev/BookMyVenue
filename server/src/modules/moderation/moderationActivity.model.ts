import type { Document, Types } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export type ModerationActionType =
  | 'ban_user'
  | 'unban_user'
  | 'suspend_venue'
  | 'unsuspend_venue'
  | 'remove_review'
  | 'restore_review'
  | 'auto_suspend_venue'
  | 'extend_venue_deadline'
  | 'reject_venue';

export interface IModerationActivity extends Document {
  adminId: mongoose.Types.ObjectId;
  action: ModerationActionType;
  targetId: string; // The ID of the user, venue, or review
  targetType: 'user' | 'venue' | 'review';
  reason?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const ModerationActivitySchema = new Schema<IModerationActivity>(
  {
    adminId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    action: { type: String, required: true },
    targetId: { type: String, required: true },
    targetType: { type: String, enum: ['user', 'venue', 'review'], required: true },
    reason: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Index for faster queries on logs
ModerationActivitySchema.index({ adminId: 1, createdAt: -1 });
ModerationActivitySchema.index({ createdAt: -1 });
ModerationActivitySchema.index({ action: 1 });
ModerationActivitySchema.index({ targetId: 1, targetType: 1 });

export const ModerationActivityModel = mongoose.model<IModerationActivity>(
  'ModerationActivity',
  ModerationActivitySchema,
  'ModerationActivities'
);

export interface ModerationLogLean {
  _id: Types.ObjectId;
  adminId: { _id: Types.ObjectId; username: string; email: string };
  action: ModerationActionType;
  targetId: string;
  targetType: 'user' | 'venue' | 'review';
  reason?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}
