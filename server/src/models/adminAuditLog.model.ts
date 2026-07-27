import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminAuditLog extends Document {
  adminId: mongoose.Types.ObjectId;
  action: string;
  targetType: 'USER' | 'VENUE' | 'OWNER' | 'BOOKING' | 'SETTLEMENT' | 'CATEGORY';
  targetId?: string;
  reason?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const adminAuditLogSchema = new Schema<IAdminAuditLog>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    targetType: {
      type: String,
      enum: ['USER', 'VENUE', 'OWNER', 'BOOKING', 'SETTLEMENT', 'CATEGORY'],
      required: true,
      index: true,
    },
    targetId: {
      type: String,
      default: '',
    },
    reason: {
      type: String,
      default: '',
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IAdminAuditLog>('AdminAuditLog', adminAuditLogSchema);
