import mongoose, { Schema } from 'mongoose';
import { BookingStatus, BookingScenario, PaymentMethod, PaymentStatus, CancellationType, RefundStatus } from '../constants/booking';
import { SettlementStatus } from '../constants/settlement';
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

    settlementStatus: {
      type: String,
      enum: [...Object.values(SettlementStatus), null],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ── Database Scalability Indexes (100,000+ Bookings Threshold) ──

// 1. Hot Availability Overlap Index
bookingSchema.index({ venue: 1, bookingStatus: 1, startDateTime: 1, endDateTime: 1 });

// 2. User Booking History Index
bookingSchema.index({ user: 1, createdAt: -1 });

// 3. Owner Booking List Index
bookingSchema.index({ venue: 1, createdAt: -1 });

// 4. Hourly Auto-Completion Cron Partial Index
bookingSchema.index(
  { bookingStatus: 1, endDateTime: 1 },
  { partialFilterExpression: { bookingStatus: BookingStatus.CONFIRMED } }
);

// 5. Overdue Balance Auto-Cancellation Cron Partial Index
bookingSchema.index(
  { bookingStatus: 1, remainingPaymentDueDate: 1 },
  { partialFilterExpression: { bookingStatus: BookingStatus.RESERVED } }
);

bookingSchema.pre('save', async function () {
  if (!this.isNew || (this as any).bookingId) return;
  
  const counter = await Counter.findByIdAndUpdate(
    { _id: 'bookingId' },
    { $inc: { seq: 1 } },
    { returnDocument: 'after', upsert: true }
  );
  
  const seqStr = String(counter.seq).padStart(5, '0');
  (this as any).bookingId = `BK-${seqStr}`;
});

export default mongoose.model('Booking', bookingSchema);
