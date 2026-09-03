import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import {
  EmailIntent,
  type EmailIntentType,
  EmailTaskStatus,
  type EmailTaskStatusType,
} from '../constants/email.constants';

export interface IEmailTask extends Document {
  intent: EmailIntentType;
  recipient: string;
  subject: string;
  metadata: Record<string, string>;
  status: EmailTaskStatusType;
  workerId: string | null;
  lockedAt: Date | null;
  retryAfter: Date;
  retries: number;
  lastError: string | null;
  deleteAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EmailTaskSchema = new Schema<IEmailTask>(
  {
    intent: {
      type: String,
      enum: Object.values(EmailIntent),
      required: true,
    },
    recipient: { type: String, required: true },
    subject: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    status: {
      type: String,
      enum: Object.values(EmailTaskStatus),
      default: EmailTaskStatus.PENDING,
    },
    workerId: { type: String, default: null },
    lockedAt: { type: Date, default: null },
    retryAfter: { type: Date, required: true },
    retries: { type: Number, default: 0 },
    lastError: { type: String, default: null },
    deleteAt: { type: Date, required: true }, // TTL: completed → 15 min, pending/failed → 7 days
  },
  { timestamps: true }
);

// Compound index for fast polling
EmailTaskSchema.index({ status: 1, lockedAt: 1, retryAfter: 1 });
EmailTaskSchema.index({ deleteAt: 1 }, { expireAfterSeconds: 0 });

export const EmailTaskModel = mongoose.model<IEmailTask>(
  'EmailTasks',
  EmailTaskSchema,
  'EmailTasks'
);
