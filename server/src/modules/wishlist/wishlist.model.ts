import mongoose, { Schema } from 'mongoose';
import type { Document } from 'mongoose';

export interface IWishlistItem extends Document {
  userId: mongoose.Types.ObjectId;
  venueId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const WishlistSchema = new Schema<IWishlistItem>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    venueId: {
      type: Schema.Types.ObjectId,
      ref: 'Venues',
      required: true,
    },
  },
  { timestamps: true }
);

// Unique compound index: one wishlist entry per user-venue pair
WishlistSchema.index(
  { userId: 1, venueId: 1 },
  {
    unique: true,
    name: 'idx_user_venue_unique',
  }
);

// Index for "My Wishlist" listing (user + most recent first)
WishlistSchema.index({ userId: 1, createdAt: -1 }, { name: 'idx_user_recency' });

export const WishlistModel = mongoose.model<IWishlistItem>(
  'Wishlists',
  WishlistSchema,
  'Wishlists'
);
