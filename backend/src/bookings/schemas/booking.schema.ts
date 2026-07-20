import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type BookingDocument = Booking & Document;

export enum BookingStatus {
  LOCKED = 'LOCKED', // Legacy/Session locks
  REQUESTED = 'REQUESTED',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED_BY_CUSTOMER = 'CANCELLED_BY_CUSTOMER',
  CANCELLED_BY_OWNER = 'CANCELLED_BY_OWNER',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  NO_SHOW = 'NO_SHOW',
  CANCELLED = 'CANCELLED', // Legacy cancellation
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED',
}

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Venue', required: true })
  venueId: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  hours: number;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ type: String, enum: BookingStatus, default: BookingStatus.LOCKED })
  status: string;

  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: string;

  @Prop({ type: String, required: false })
  refundStatus?: string;

  @Prop({ type: Date, required: false })
  lockedUntil?: Date;

  @Prop({ type: Date, required: false })
  cancelledAt?: Date;

  @Prop({ type: String, required: false })
  cancelledBy?: string;

  @Prop({ type: String, required: false })
  cancellationReason?: string;

  @Prop({ type: Number, required: false })
  refundAmount?: number;

  @Prop({ type: Date, required: false })
  refundRequestedAt?: Date;

  @Prop({ type: Date, required: false })
  refundedAt?: Date;

  @Prop({ type: String, enum: ['NONE', 'PENDING', 'APPROVED', 'REJECTED'], default: 'NONE' })
  rescheduleStatus: string;

  @Prop({ type: Object, required: false })
  pendingReschedule?: {
    requestedDate: string;
    requestedHours: number;
    requestedSlot?: {
      startTime: string;
      endTime: string;
      price: number;
    };
    requestedAt: Date;
    reason?: string;
  };
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
