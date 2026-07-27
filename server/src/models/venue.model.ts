import mongoose from 'mongoose';
import { IVenue } from '@/types/venue.types';
const venueSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },

    images: [
      {
        type: String,
      },
    ],

    address: {
      street: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      district: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      pincode: {
        type: String,
        required: true,
      },
    },

    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },

      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    isAvailabilityConfigured: {
      type: Boolean,
      default: false,
    },

    amenities: [
      {
        type: String,
        trim: true,
      },
    ],

    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    rejectionReason: {
      type: String,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isElite: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Nearby venue search
venueSchema.index({ location: '2dsphere' });

// Active Non-Deleted Owner Venues Partial Index
venueSchema.index(
  { ownerId: 1, verificationStatus: 1, isActive: 1 },
  { partialFilterExpression: { isDeleted: false } }
);

// Public Search Filter Partial Index
venueSchema.index(
  { categoryId: 1, verificationStatus: 1, isActive: 1 },
  { partialFilterExpression: { isDeleted: false } }
);

// Virtual for Availability config
venueSchema.virtual('availability', {
  ref: 'Availability',
  localField: '_id',
  foreignField: 'venueId',
  justOne: true,
});

venueSchema.set('toJSON', { virtuals: true });
venueSchema.set('toObject', { virtuals: true });

const Venue = mongoose.model<IVenue>('Venue', venueSchema);

export default Venue;
