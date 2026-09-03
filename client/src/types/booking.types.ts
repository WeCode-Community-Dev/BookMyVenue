export interface CheckoutResponse {
  orderId: string;
  amount: number;
  currency: string;
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayErrorResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id: string;
      payment_id: string;
    };
  };
}

export interface Slot {
  slotId: string;
  name: string | null;
  startTime: string;
  endTime: string;
  price: number;
  isAvailable: boolean;
  reason: string | null;
}

export interface BookingCardDTO {
  _id: string;
  bookingRef: string;
  venueName: string;
  venueId: string;
  city: string;
  district: string;
  coverImage: string;
  date: string;
  timeRange: string;
  bookedOn: string;
  guestCount?: number;
  eventType?: string;
  totalPrice: number;
  paymentMethod?: string;
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  uiStatus: 'upcoming' | 'completed' | 'cancelled' | 'in_progress';
  hasReview?: boolean;
}

export interface BookingDetailDTO extends BookingCardDTO {
  address: string;
  contactPhone: string;
  contactEmail?: string;
  googleMapsUrl?: string;
  amenities: string[];
  cancellationPolicy: string;
  cancellationRefundPct?: number;
  paymentReference: string;
  bookerInfo?: {
    name: string;
    email: string;
    phone: string;
    place: string;
    note?: string;
  };
}

export interface CancelBookingResponse {
  refundAmount: number;
}

export interface BookerInfoForm {
  guestCount: number;
  eventType: string;
  name: string;
  email: string;
  phone: string;
  place: string;
  note?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface VerifyPaymentPayload {
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface VerifyPaymentResult {
  _id: string;
  bookingRef: string;
}

export interface LockSlotPayload {
  date: string;
  startTime: string;
  endTime: string;
}

export interface LockSlotResponse {
  lockId: string;
  expiresAt: string;
  amountToPay: number;
}

export interface BookableDatesResponse {
  bookableDates: string[];
  disabledDates: string[];
  maxDate: string;
}

export interface DayAvailabilityResponse {
  venueId: string;
  date: string;
  bookingType: string;
  slots: Slot[];
}
