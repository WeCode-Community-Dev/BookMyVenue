import { z } from 'zod';
import type { IVenue } from '../venue/venue.types';
import { timeStringToMinutes, isBookableDate } from '../../utils/timeUtils';

export const venueIdParamSchema = z.object({
  id: z
    .string()
    .trim()
    .regex(/^[a-f\d]{24}$/i, 'Invalid venue ID format'),
});

export type VenueIdParamDTO = z.infer<typeof venueIdParamSchema>;

const selectedSlotSchema = z
  .object({
    startTime: z.number().int().min(0).max(1439),
    endTime: z.number().int().min(1).max(1440),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: 'endTime must be strictly greater than startTime',
    path: ['endTime'],
  });

export const blockSlotBodySchema = z.object({
  date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be in YYYY-MM-DD format')
    .refine(isBookableDate, {
      message: 'Date must be between tomorrow and 90 days from today',
    }),
  selectedSlots: z
    .array(selectedSlotSchema)
    .min(1, 'At least one slot must be selected')
    .max(24, 'Cannot select more than 24 slots at once'),
  expectedPrice: z.number().positive('expectedPrice must be greater than 0'),
});

export type BlockSlotBodyDTO = z.infer<typeof blockSlotBodySchema>;

export function validateDateForVenue(
  venue: IVenue,
  date: string
): { valid: boolean; reason?: string } {
  const dateObj = new Date(date + 'T00:00:00');
  const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

  if (!venue.workingDays.includes(dayOfWeek)) {
    return { valid: false, reason: `Venue is not open on ${dayOfWeek}s.` };
  }

  const isBlocked = venue.blockedDates.some(
    (blockedDate) => blockedDate.toISOString().split('T')[0] === date
  );
  if (isBlocked) {
    return { valid: false, reason: 'This date is blocked by the venue.' };
  }

  // Check temporary block
  if (venue.temporaryBlockAfterDate) {
    const blockDate = new Date(venue.temporaryBlockAfterDate);
    dateObj.setHours(0, 0, 0, 0);
    blockDate.setHours(0, 0, 0, 0);
    if (dateObj >= blockDate) {
      return { valid: false, reason: "This date is after the venue's temporary booking block" };
    }
  }

  // Check inactivity block
  if (venue.inactivity?.blockedAfterDate) {
    const blockDate = new Date(venue.inactivity.blockedAfterDate);
    dateObj.setHours(0, 0, 0, 0);
    blockDate.setHours(0, 0, 0, 0);
    if (dateObj >= blockDate) {
      return { valid: false, reason: "This date falls within the venue's closing period" };
    }
  }

  return { valid: true };
}

export function validateSelectedSlotsForVenue(
  venue: IVenue,
  selectedSlots: { startTime: number; endTime: number }[]
): { valid: boolean; reason?: string } {
  // Guard against overlapping selected slots
  const sortedSlots = [...selectedSlots].sort((a, b) => a.startTime - b.startTime);
  for (let i = 0; i < sortedSlots.length - 1; i++) {
    if (sortedSlots[i].endTime > sortedSlots[i + 1].startTime) {
      return { valid: false, reason: 'Selected slots cannot overlap each other.' };
    }
  }

  if (venue.bookingType === 'fixedBooking') {
    for (const slot of selectedSlots) {
      const match = (venue.fixedPackages ?? []).find(
        (pkg) =>
          timeStringToMinutes(pkg.startTime) === slot.startTime &&
          timeStringToMinutes(pkg.endTime) === slot.endTime
      );
      if (!match) {
        return {
          valid: false,
          reason: 'One or more selected slots do not match any fixed package.',
        };
      }
    }
  } else {
    // flexibleBooking
    if (!venue.workingHours) {
      return { valid: false, reason: 'Venue working hours are not configured.' };
    }
    const openMin = timeStringToMinutes(venue.workingHours.open);
    const closeMin = timeStringToMinutes(venue.workingHours.close);
    const duration = venue.flexibleBooking?.slotDuration ?? 60;
    const buffer = venue.flexibleBooking?.bufferTime ?? 0;
    const cycle = duration + buffer;

    for (const slot of selectedSlots) {
      if (slot.startTime < openMin || slot.endTime > closeMin) {
        return { valid: false, reason: 'One or more slots are outside venue working hours.' };
      }
      if (slot.endTime - slot.startTime !== duration) {
        return {
          valid: false,
          reason: `All slots must be exactly ${String(duration)} minutes long.`,
        };
      }
      if ((slot.startTime - openMin) % cycle !== 0) {
        return {
          valid: false,
          reason: "Slot times do not align with the venue's scheduling grid.",
        };
      }
    }

    // Must be contiguous
    for (let i = 0; i < sortedSlots.length - 1; i++) {
      if (sortedSlots[i].endTime + buffer !== sortedSlots[i + 1].startTime) {
        return { valid: false, reason: 'Multiple flexible slots must be contiguous.' };
      }
    }
  }

  return { valid: true };
}

export function computeServerTotalPrice(
  venue: IVenue,
  selectedSlots: { startTime: number; endTime: number }[]
): number {
  let totalPrice = 0;

  if (venue.bookingType === 'fixedBooking') {
    for (const slot of selectedSlots) {
      const match = (venue.fixedPackages ?? []).find(
        (pkg) =>
          timeStringToMinutes(pkg.startTime) === slot.startTime &&
          timeStringToMinutes(pkg.endTime) === slot.endTime
      );
      if (match) totalPrice += match.price;
    }
  } else {
    // flexibleBooking
    if (!venue.pricing) {
      throw new Error('Pricing configuration is missing for flexible booking venue');
    }
    for (const slot of selectedSlots) {
      let appliedPrice = venue.pricing.basePrice;
      if (venue.pricing.pricingType === 'timeBasedPricing') {
        for (const rule of venue.pricing.pricingRules) {
          const ruleStart = timeStringToMinutes(rule.fromTime);
          const ruleEnd = timeStringToMinutes(rule.toTime);
          if (slot.startTime >= ruleStart && slot.startTime < ruleEnd) {
            appliedPrice = rule.price;
            break;
          }
        }
      }
      totalPrice += appliedPrice;
    }
  }

  return totalPrice;
}

export function assertPriceWithinTolerance(
  serverPrice: number,
  clientPrice: number,
  tolerancePct = 2
): { valid: boolean; reason?: string } {
  if (serverPrice <= 0) {
    return {
      valid: false,
      reason: 'Server could not compute a valid price for this slot. Please contact support.',
    };
  }
  const drift = Math.abs(serverPrice - clientPrice) / serverPrice;
  if (drift > tolerancePct / 100) {
    return {
      valid: false,
      reason: `Price mismatch. Expected ₹${String(serverPrice)} but received ₹${String(clientPrice)}. Please refresh and try again.`,
    };
  }
  return { valid: true };
}

export const checkoutBodySchema = z.object({
  lockId: z
    .string()
    .trim()
    .regex(/^[a-f\d]{24}$/i, 'Invalid lockId format'),
});

export type CheckoutBodyDTO = z.infer<typeof checkoutBodySchema>;

const bookerInfoSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z
    .string()
    .trim()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Valid email is required'),
  phone: z.string().trim().min(10, 'Valid phone number is required'),
  place: z.string().trim().min(1, 'Place is required'),
  note: z.string().trim().optional(),
});

export const saveBookerDetailsBodySchema = z.object({
  lockId: z
    .string()
    .trim()
    .regex(/^[a-f\d]{24}$/i, 'Invalid lockId format'),
  guestCount: z.number().int().positive('Guest count must be positive'),
  eventType: z.string().trim().min(1, 'Event type is required').max(100, 'Event type is too long'),
  bookerInfo: bookerInfoSchema,
});

export type SaveBookerDetailsBodyDTO = z.infer<typeof saveBookerDetailsBodySchema>;

export const verifyPaymentBodySchema = z.object({
  orderId: z.string().trim().min(1, 'orderId is required'),
  paymentId: z.string().trim().min(1, 'paymentId is required'),
  signature: z.string().trim().min(1, 'razorpay_signature is required'),
});

export type VerifyPaymentBodyDTO = z.infer<typeof verifyPaymentBodySchema>;

export const fetchMyBookingsQuerySchema = z.object({});
export type FetchMyBookingsQueryDTO = z.infer<typeof fetchMyBookingsQuerySchema>;

export const adminBookingFiltersSchema = z.object({
  status: z.enum(['confirmed', 'pending', 'cancelled', 'completed', 'in_progress']).optional(),
  venueId: z
    .string()
    .trim()
    .regex(/^[a-f\d]{24}$/i, 'Invalid venue ID format')
    .optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort: z.string().optional(),
});

export type AdminBookingFiltersDTO = z.infer<typeof adminBookingFiltersSchema>;

export const bookingRefIdParamSchema = z.object({
  bookingRefId: z
    .string()
    .trim()
    .refine(
      (val) => {
        const isObjectId = /^[a-f\d]{24}$/i.test(val);
        const isBookingRef = val.toUpperCase().startsWith('BMV-') && val.length === 10;
        return isObjectId || isBookingRef;
      },
      {
        message: 'Invalid booking ID or reference format',
      }
    ),
});
export type BookingRefIdParamDTO = z.infer<typeof bookingRefIdParamSchema>;
