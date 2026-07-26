import mongoose, { Schema } from 'mongoose';
import type { Document } from 'mongoose';

export interface IReview extends Document {
  venueId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  bookingId?: mongoose.Types.ObjectId | null;
  rating?: number; // 1-5, optional (upserted doc may have no comment)
  comment?: string; // optional (rating-only doc may have no comment)
  status: 'visible' | 'flagged' | 'removed';
  moderationReason?: string;
  moderatedBy?: mongoose.Types.ObjectId;
  moderatedAt?: Date;
  editedAt?: Date;
  ownerReply?: { text: string; repliedAt: Date };
  hideRequestedBy?: mongoose.Types.ObjectId;
  hideRequestReason?: string;
  hideRequestedAt?: Date;
  hideRequestStatus: 'none' | 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    venueId: {
      type: Schema.Types.ObjectId,
      ref: 'Venues',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
      index: true,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Bookings',
      default: null,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 1000,
      trim: true,
    },
    status: {
      type: String,
      enum: ['visible', 'flagged', 'removed'],
      default: 'visible',
      index: true,
    },
    moderationReason: {
      type: String,
      maxlength: 500,
    },
    moderatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
    moderatedAt: {
      type: Date,
    },
    editedAt: {
      type: Date,
    },
    ownerReply: {
      text: { type: String, maxlength: 500, trim: true },
      repliedAt: { type: Date },
    },
    hideRequestedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
    hideRequestReason: {
      type: String,
      maxlength: 500,
    },
    hideRequestedAt: {
      type: Date,
    },
    hideRequestStatus: {
      type: String,
      enum: ['none', 'pending', 'approved', 'rejected'],
      default: 'none',
      index: true,
    },
  },
  { timestamps: true }
);

// Index for venue reviews listing (public view filters to visible)
ReviewSchema.index({ venueId: 1, status: 1, createdAt: -1 }, { name: 'idx_venue_status_recency' });

// Partial unique index: only one rating per (userId, venueId)
ReviewSchema.index(
  { userId: 1, venueId: 1 },
  {
    unique: true,
    partialFilterExpression: { rating: { $exists: true } },
    name: 'idx_user_venue_rating',
  }
);

// Index for admin hide-request moderation queue
ReviewSchema.index(
  { hideRequestStatus: 1, hideRequestedAt: -1 },
  { name: 'idx_hide_request_queue' }
);

export const ReviewModel = mongoose.model<IReview>('Reviews', ReviewSchema, 'Reviews');
