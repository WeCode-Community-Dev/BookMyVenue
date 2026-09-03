import mongoose, { Schema } from 'mongoose';
import type { IBooking } from '../booking.types';
import { BookingStatus } from '../../../constants/booking.constants';
import { PaymentStatus } from '../../../constants/payment.constants';

const BookingSchema = new Schema<IBooking>(
  {
    venueId: { type: Schema.Types.ObjectId, ref: 'Venues', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    date: { type: String, required: true },
    startTime: { type: Number, required: true }, // minutes from midnight
    endTime: { type: Number, required: true }, // minutes from midnight
    price: { type: Number, required: true },
    paymentReference: { type: String, required: true, trim: true }, // Razorpay payment_id
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      required: true,
      default: BookingStatus.CONFIRMED,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      required: true,
      default: PaymentStatus.PAID,
    },
    guestCount: { type: Number, required: false },
    eventType: { type: String, required: false, trim: true },
    bookerInfo: {
      name: { type: String, required: false, trim: true },
      email: { type: String, required: false, trim: true },
      phone: { type: String, required: false, trim: true },
      place: { type: String, required: false, trim: true },
      note: { type: String, required: false, trim: true },
    },
    paymentMethod: { type: String, required: false, trim: true },
    advancePaid: { type: Number, required: false },
    remainingAmount: { type: Number, required: false },
    cancellationReason: { type: String, required: false, trim: true },
    contractSnapshot: { type: Schema.Types.Mixed }, // typed via IContractSnapshot from lock.types
  },
  { timestamps: true }
);

BookingSchema.index({ venueId: 1, date: 1 });

BookingSchema.index({ venueId: 1, date: 1, startTime: 1, endTime: 1, status: 1 });

BookingSchema.index({ paymentStatus: 1 });

BookingSchema.index(
  { venueId: 1, date: 1, startTime: 1, endTime: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: {
        $in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED, BookingStatus.IN_PROGRESS],
      },
    },
  }
);

export const BookingModel = mongoose.model<IBooking>('Bookings', BookingSchema, 'Bookings');
