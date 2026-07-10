import mongoose from 'mongoose';
import { IAvailability } from '@/types/availability.types';

const availabilitySchema = new mongoose.Schema(
  {
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
      required: true,
      unique: true,
      index: true,
    },
    openingTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/, // Ensures HH:mm format
    },
    closingTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    availableDays: [
      {
        type: Number,
        min: 0,
        max: 6,
      },
    ],
    minBookingDuration: {
      type: Number,
      required: true,
      min: 1,
    },
    maxBookingDuration: {
      type: Number,
      default: null,
      min: 1,
    },
    pricePerHour: {
      type: Number,
      required: true,
      min: 0,
    },
    bufferTime: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Availability = mongoose.model<IAvailability>('Availability', availabilitySchema);

export default Availability;
