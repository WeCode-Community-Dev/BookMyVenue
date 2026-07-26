import mongoose, { type Document, Schema } from 'mongoose';

export type BanScope = 'full' | 'commenting' | 'owner_dashboard' | 'venue_creation';
export type BanRecordStatus = 'active' | 'lifted' | 'expired';

export interface IBannedUser extends Document {
  userId: mongoose.Types.ObjectId;
  scope: BanScope;
  venueId?: mongoose.Types.ObjectId | null;
  reason: string;
  bannedBy: mongoose.Types.ObjectId;
  bannedAt: Date;
  expiresAt?: Date | null;
  status: BanRecordStatus;
  liftedBy?: mongoose.Types.ObjectId | null;
  liftedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const BannedUserSchema = new Schema<IBannedUser>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
      index: true,
    },
    scope: {
      type: String,
      enum: ['full', 'commenting', 'owner_dashboard', 'venue_creation'],
      required: true,
    },
    venueId: {
      type: Schema.Types.ObjectId,
      ref: 'Venues',
      default: null,
    },
    reason: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true,
    },
    bannedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    bannedAt: {
      type: Date,
      required: true,
      default: (): Date => new Date(),
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'lifted', 'expired'],
      default: 'active',
      index: true,
    },
    liftedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      default: null,
    },
    liftedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Composite index for enforcement lookups
BannedUserSchema.index({ userId: 1, scope: 1, status: 1 }, { name: 'idx_user_scope_status' });

// Index for expiry sweep
BannedUserSchema.index({ status: 1, expiresAt: 1 }, { name: 'idx_active_expiry' });

export const BannedUserModel = mongoose.model<IBannedUser>(
  'BannedUsers',
  BannedUserSchema,
  'BannedUsers'
);
