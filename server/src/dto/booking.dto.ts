import { z } from 'zod';

export const createBookingSchema = z.object({
  body: z.object({
    venueId: z.string().min(1, 'venueId is required'),
    startDateTime: z.string().datetime({ message: 'startDateTime must be a valid ISO date string' }),
    endDateTime: z.string().datetime({ message: 'endDateTime must be a valid ISO date string' }),
    guests: z.number().min(1, 'guests must be at least 1'),
    contactName: z.string().min(1, 'contactName is required'),
    contactEmail: z.string().email('contactEmail must be a valid email'),
    contactPhone: z.string().min(5, 'contactPhone is required'),
    specialRequests: z.string().optional(),
  }),
});

export const getQuoteSchema = z.object({
  body: z.object({
    venueId: z.string().min(1, 'venueId is required'),
    startDateTime: z.string().datetime({ message: 'startDateTime must be a valid ISO date string' }),
    endDateTime: z.string().datetime({ message: 'endDateTime must be a valid ISO date string' }),
  }),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    razorpay_payment_id: z.string().min(1, 'razorpay_payment_id is required'),
    razorpay_order_id: z.string().min(1, 'razorpay_order_id is required'),
    razorpay_signature: z.string().min(1, 'razorpay_signature is required'),
    bookingId: z.string().min(1, 'bookingId is required'),
  }),
});

export const payWalletSchema = z.object({
  body: z.object({
    bookingId: z.string().optional(),
  }),
});

export const payBalanceSchema = z.object({
  body: z.object({
    bookingId: z.string().optional(),
  }),
});

export const verifyBalanceSchema = z.object({
  body: z.object({
    razorpay_payment_id: z.string().min(1, 'razorpay_payment_id is required'),
    razorpay_order_id: z.string().min(1, 'razorpay_order_id is required'),
    razorpay_signature: z.string().min(1, 'razorpay_signature is required'),
    bookingId: z.string().optional(),
  }),
});

export const cancelBookingSchema = z.object({
  body: z.object({
    cancellationReason: z.string().optional(),
  }),
});

export const adminForceCancelBookingSchema = z.object({
  body: z.object({
    reason: z.string().min(3, 'Reason must be at least 3 characters').max(500),
    refundPercentage: z
      .number()
      .min(0, 'Refund percentage cannot be negative')
      .max(100, 'Refund percentage cannot exceed 100')
      .optional()
      .default(100),
  }),
});
