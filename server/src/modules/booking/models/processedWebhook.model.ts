import mongoose, { Schema } from 'mongoose';
import type { IProcessedWebhook } from '../booking.types';

const ProcessedWebhookSchema = new Schema<IProcessedWebhook>(
  {
    // Razorpay event_id — unique index is the idempotency gate.
    // Duplicate inserts throw MongoServerError code 11000, which the
    // webhook controller catches to return 200 immediately.
    eventId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Auto-expire records after 30 days to avoid unbounded collection growth.
// A 30-day window is sufficient; Razorpay never replays events that old.
ProcessedWebhookSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export const ProcessedWebhookModel = mongoose.model<IProcessedWebhook>(
  'ProcessedWebhooks',
  ProcessedWebhookSchema,
  'ProcessedWebhooks'
);
