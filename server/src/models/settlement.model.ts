import mongoose, { Schema, Document } from 'mongoose';
import { SettlementStatus } from '@/constants/settlement';

export interface ISettlement extends Document {
  bookingId: mongoose.Types.ObjectId;
  venueId: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  totalBookingAmount: number;
  platformFee: number;
  ownerEarnings: number;
  status: SettlementStatus;
  settledAt: Date | null;
  settledBy: 'ADMIN' | 'SYSTEM' | null;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const settlementSchema = new Schema<ISettlement>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true,
      index: true,
    },
    venueId: {
      type: Schema.Types.ObjectId,
      ref: 'Venue',
      required: true,
      index: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    totalBookingAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    platformFee: {
      type: Number,
      required: true,
      min: 0,
    },
    ownerEarnings: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(SettlementStatus),
      default: SettlementStatus.PENDING,
    },
    settledAt: {
      type: Date,
      default: null,
    },
    settledBy: {
      type: String,
      enum: ['ADMIN', 'SYSTEM', null],
      default: null,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ISettlement>('Settlement', settlementSchema);
