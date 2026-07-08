import mongoose, { Schema } from 'mongoose';
import { BookingStatus, BookingScenario, PaymentMethod, PaymentStatus, CancellationType, RefundStatus } from '../constants/booking';
import Counter from './counter.model';

const bookingSchema = new Schema(
  {
    bookingId: {
      type: String,
      unique: true,
    },

    venue: {
      type: Schema.Types.ObjectId,
      ref: 'Venue',
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    startDateTime: {
      type: Date,
      required: true,
    },

    endDateTime: {
      type: Date,
      required: true,
    },

    guests: {
      type: Number,
      required: true,
      min: 1,
    },

    contactName: {
      type: String,
      required: true,
      trim: true,
    },

    contactEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    contactPhone: {
      type: String,
      required: true,
      trim: true,
    },

    specialRequests: {
      type: String,
      default: '',
      trim: true,
    },

    // ── Reservation Model Fields ─────────────────────────────

    bookingScenario: {
      type: String,
      enum: Object.values(BookingScenario),
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      default: PaymentMethod.RAZORPAY,
    },

    bookingStatus: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.RESERVED,
    },

    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },

    // ── Financial Fields ─────────────────────────────────────

    totalAmount: {
      type: Number,
      required: true,
    },

    reservationDeposit: {
      type: Number,
      required: true,
    },

    remainingBalance: {
      type: Number,
      required: true,
    },

    amountPaid: {
      type: Number,
      default: 0,
    },

    remainingPaymentDueDate: {
      type: Date,
      default: null,
    },

    autoCancellationDate: {
      type: Date,
      default: null,
    },

    isImmediatePaymentRequired: {
      type: Boolean,
      default: false,
    },

    cancellationReason: {
      type: String,
      default: '',
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    cancellationType: {
      type: String,
      enum: Object.values(CancellationType),
      default: null,
    },

    refundStatus: {
      type: String,
      enum: Object.values(RefundStatus),
      default: RefundStatus.NOT_ELIGIBLE,
    },

    refundAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.pre('save', async function (next: any) {
  if (!this.isNew || (this as any).bookingId) return next();
  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'bookingId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const seqStr = String(counter.seq).padStart(5, '0');
    (this as any).bookingId = `BK-${seqStr}`;
    next();
  } catch (error: any) {
    next(error);
  }
});

export default mongoose.model('Booking', bookingSchema);
