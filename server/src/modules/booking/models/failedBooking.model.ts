import mongoose, { Schema } from 'mongoose';
import type { IFailedBooking } from '../booking.types';

const FailedBookingSchema = new Schema<IFailedBooking>(
  {
    venueId: { type: Schema.Types.ObjectId, ref: 'Venues', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    date: { type: String, required: true },
    startTime: { type: Number, required: true },
    endTime: { type: Number, required: true },
    amountPaid: { type: Number, required: true }, // paise
    paymentReference: { type: String, required: true, trim: true },
    refundReference: { type: String, required: true, trim: true },
    reason: { type: String, required: true, trim: true }, // e.g. 'TTL_EXPIRED_COLLISION'
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // immutable audit log
  }
);

export const FailedBookingModel = mongoose.model<IFailedBooking>(
  'FailedBookings',
  FailedBookingSchema,
  'FailedBookings'
);
