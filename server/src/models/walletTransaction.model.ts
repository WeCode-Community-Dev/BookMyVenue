import mongoose, { Schema, Document } from 'mongoose';

export interface IWalletTransaction extends Document {
  walletId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;

  type: 'CREDIT' | 'DEBIT';

  amount: number;

  balanceBefore: number;
  balanceAfter: number;

  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REVERSED';

  source:
    | 'BOOKING_DEPOSIT'
    | 'BOOKING_PAYMENT'
    | 'REFUND'
    | 'CASHBACK'
    | 'ADJUSTMENT'
    | 'WITHDRAWAL';

  bookingId?: mongoose.Types.ObjectId;
  paymentId?: mongoose.Types.ObjectId;

  description?: string;

  metadata?: Record<string, any>;

  createdAt: Date;
  updatedAt: Date;
}

const walletTransactionSchema = new Schema<IWalletTransaction>(
  {
    walletId: {
      type: Schema.Types.ObjectId,
      ref: 'Wallet',
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ['CREDIT', 'DEBIT'],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    balanceBefore: {
      type: Number,
      required: true,
    },

    balanceAfter: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED', 'REVERSED'],
      default: 'SUCCESS',
    },

    source: {
      type: String,
      enum: [
        'BOOKING_DEPOSIT',
        'BOOKING_PAYMENT',
        'REFUND',
        'CASHBACK',
        'ADJUSTMENT',
        'WITHDRAWAL',
      ],
      required: true,
    },

    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
    },

    paymentId: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
    },

    description: String,

    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate refund transactions for the same booking at the database level.
// sparse: true ensures the index only applies when bookingId is present (non-booking transactions are unaffected).
walletTransactionSchema.index(
  { bookingId: 1, source: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { source: 'REFUND' },
  }
);

export const WalletTransaction = mongoose.model<IWalletTransaction>(
  'WalletTransaction',
  walletTransactionSchema
);
