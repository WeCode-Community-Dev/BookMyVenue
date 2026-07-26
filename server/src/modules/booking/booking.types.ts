import type { Document, Types } from 'mongoose';
import type { BookingStatusType } from '../../constants/booking.constants';
import type { PaymentStatusType } from '../../constants/payment.constants';
import type { IContractSnapshot } from './lock.types';

export type BookingStatus = BookingStatusType;

export interface RazorpayWebhookNotes {
  lockId?: string;
  venueId?: string;
  userId?: string;
}

export interface IBooking extends Document {
  venueId: Types.ObjectId;
  userId: Types.ObjectId;
  date: string; // YYYY-MM-DD
  startTime: number; // minutes from midnight
  endTime: number; // minutes from midnight
  price: number;
  paymentReference: string; // Razorpay payment_id
  status: BookingStatus;
  paymentStatus: PaymentStatusType;
  guestCount?: number;
  eventType?: string;
  bookerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    place?: string;
    note?: string;
  };
  paymentMethod?: string;
  contractSnapshot?: IContractSnapshot;

  // Future update fields (Not needed for MVP now)
  advancePaid?: number;
  remainingAmount?: number;
  cancellationReason?: string;

  createdAt: Date;
  updatedAt: Date;
}

// Aggregated booking for admin/owner queries with populated refs
export interface AggregatedBooking {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  venueId: Types.ObjectId;
  date: string;
  startTime: number;
  endTime: number;
  price: number;
  paymentReference: string;
  status: BookingStatusType;
  paymentStatus: PaymentStatusType;
  guestCount?: number;
  eventType?: string;
  bookerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    place?: string;
    note?: string;
  };
  paymentMethod?: string;
  advancePaid?: number;
  remainingAmount?: number;
  createdAt: Date;
  updatedAt: Date;
  contractSnapshot?: IContractSnapshot;
  venue: {
    _id: Types.ObjectId;
    name: string;
    city: string;
    district: string;
    coverImage: string;
    address: string;
    contact: {
      phone: string;
      email?: string;
    };
    googleMapsUrl?: string;
    amenities: string[];
  };
  // User who made the booking (for admin view)
  user?: {
    _id: Types.ObjectId;
    username: string;
    email: string;
    phone?: string;
    status: string;
  };
}

// Computed UI status for display
export type UIBookingStatus = 'confirmed' | 'completed' | 'cancelled';

// FailedBooking (No TTL - usefull later)
export interface IFailedBooking extends Document {
  venueId: Types.ObjectId;
  userId: Types.ObjectId;
  date: string;
  startTime: number;
  endTime: number;
  amountPaid: number; // in paise
  paymentReference: string; // Razorpay payment_id
  refundReference: string; // Razorpay refund_id
  reason: string; // e.g: 'TTL_EXPIRED_COLLISION'
  createdAt: Date;
}

// ProcessedWebhook
export interface IProcessedWebhook extends Document {
  eventId: string;
  createdAt: Date;
}
