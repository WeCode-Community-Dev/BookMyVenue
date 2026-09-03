import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface IFeaturedVenue extends Document {
  venueId: mongoose.Types.ObjectId;
  expiresAt: Date | null;
}

const featuredVenueSchema = new Schema<IFeaturedVenue>(
  {
    venueId: { type: Schema.Types.ObjectId, ref: 'Venues', required: true, unique: true },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

featuredVenueSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, sparse: true, name: 'idx_featured_ttl' }
);

export const FeaturedVenueModel = mongoose.model<IFeaturedVenue>(
  'FeaturedVenues',
  featuredVenueSchema,
  'FeaturedVenues'
);
