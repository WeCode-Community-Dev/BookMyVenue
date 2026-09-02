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
  | 'approve_venue'
  | 'reject_venue'
  // Venue lifecycle -- owner and system initiated as well as admin
  | 'request_inactivity'
  | 'cancel_inactivity'
  | 'approve_inactivity'
  | 'reject_inactivity'
  | 'venue_closed'
  | 'reopen_venue'
  | 'request_venue_deletion';

// 'system' covers scheduled workers, which have no human actor
export type ModerationActorRole = 'superAdmin' | 'admin' | 'owner' | 'system';

export interface IModerationActivity extends Document {
  actorId?: mongoose.Types.ObjectId;
  actorRole: ModerationActorRole;
  action: ModerationActionType;
  targetId: string; // The ID of the user, venue, or review
  targetType: 'user' | 'venue' | 'review';
  reason?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const ModerationActivitySchema = new Schema<IModerationActivity>(
  {
    // Absent for 'system' actions
    actorId: { type: Schema.Types.ObjectId, ref: 'Users' },
    actorRole: {
      type: String,
      enum: ['superAdmin', 'admin', 'owner', 'system'],
      required: true,
      default: 'admin',
    },
    action: { type: String, required: true },
    targetId: { type: String, required: true },
    targetType: { type: String, enum: ['user', 'venue', 'review'], required: true },
    reason: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Index for faster queries on logs
ModerationActivitySchema.index({ actorId: 1, createdAt: -1 });
ModerationActivitySchema.index({ createdAt: -1 });
ModerationActivitySchema.index({ action: 1 });
ModerationActivitySchema.index({ targetId: 1, targetType: 1 });
// Drives the owner-facing per-venue history
ModerationActivitySchema.index({ targetType: 1, targetId: 1, createdAt: -1 });

export const ModerationActivityModel = mongoose.model<IModerationActivity>(
  'ModerationActivity',
  ModerationActivitySchema,
  'ModerationActivities'
);

export interface ModerationLogLean {
  _id: Types.ObjectId;
  actorId?: { _id: Types.ObjectId; username: string; email: string } | null;
  actorRole: ModerationActorRole;
  action: ModerationActionType;
  targetId: string;
  targetType: 'user' | 'venue' | 'review';
  reason?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}
