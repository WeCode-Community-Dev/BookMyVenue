import { Document, Types } from 'mongoose';
import { BookingStatus, BookingScenario, PaymentMethod, PaymentStatus } from '@/constants/booking';

export interface IBooking extends Document {
  bookingId?: string;
  venue: Types.ObjectId;
  user: Types.ObjectId;
  startDateTime: Date;
  endDateTime: Date;
  guests: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  specialRequests: string;
  bookingScenario: BookingScenario;
  paymentMethod: PaymentMethod;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  reservationDeposit: number;
  remainingBalance: number;
  amountPaid: number;
  remainingPaymentDueDate: Date | null;
  autoCancellationDate: Date | null;
  isImmediatePaymentRequired: boolean;
  cancellationReason: string;
  createdAt: Date;
  updatedAt: Date;
}

// Shape expected from the client when creating a booking
export interface CreateBookingPayload {
  venueId: string;
  startDateTime: string;
  endDateTime: string;
  guests: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  specialRequests?: string;
}
