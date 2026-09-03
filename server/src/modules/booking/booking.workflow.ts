import crypto from 'crypto';
import { Types } from 'mongoose';
import { runInTransaction } from '../../utils/dbUtils';
import { acquireSlotMutex, releaseSlotMutex } from '../../utils/mutex';
import { checkOverlap, timeStringToMinutes } from '../../utils/timeUtils';
import { logInfo, logWarn, logError } from '../../utils/logger';

import * as repo from './booking.repository';
import {
  validateDateForVenue,
  validateSelectedSlotsForVenue,
  computeServerTotalPrice,
  assertPriceWithinTolerance,
} from './booking.validator';
import { issueRefund, createOrder } from '../../services/razorpay.service';
import { EmailIntent, EmailTaskStatus } from '../../constants/email.constants';
import { enqueueEmailTask } from '../../services/email.repository';
import { findUserEmailById } from '../user/user.repository';
import { BookingStatus } from '../../constants/booking.constants';
import type { IContractSnapshot, IContractPackage } from './lock.types';

const LOCK_TTL_SECONDS = 600;
const CHECKOUT_BUFFER_MS = 60 * 1000;

function buildContractSnapshot(
  venue: {
    name: string;
    city: string;
    district: string;
    bookingType: string;
    fixedPackages?: { slotName: string; startTime: string; endTime: string; price: number }[];
    pricing?: {
      basePrice: number;
      pricingType: string;
      pricingRules: { fromTime: string; toTime: string; price: number }[];
    };
    cancellation?: {
      policy: 'refundable' | 'nonRefundable';
      refundType?: 'fullRefund' | 'timeBasedRefund';
      refundRules: { daysBefore: number; refundPercentage: number }[];
    };
  },
  selectedSlots: { startTime: number; endTime: number }[],
  serverPrice: number
): IContractSnapshot {
  const packages: IContractPackage[] = [];

  if (venue.bookingType === 'fixedBooking') {
    for (const slot of selectedSlots) {
      const pkg = (venue.fixedPackages ?? []).find(
        (p) =>
          timeStringToMinutes(p.startTime) === slot.startTime &&
          timeStringToMinutes(p.endTime) === slot.endTime
      );
      packages.push({
        pkgName: pkg?.slotName ?? `${String(slot.startTime)}-${String(slot.endTime)}`,
        pkgType: 'fixed',
        startTime: slot.startTime,
        endTime: slot.endTime,
        price: pkg?.price ?? 0,
      });
    }
  } else {
    if (!venue.pricing) {
      throw new Error('Pricing configuration is missing for flexible booking venue');
    }
    for (const slot of selectedSlots) {
      let price = venue.pricing.basePrice;
      if (venue.pricing.pricingType === 'timeBasedPricing') {
        for (const rule of venue.pricing.pricingRules) {
          const ruleStart = timeStringToMinutes(rule.fromTime);
          const ruleEnd = timeStringToMinutes(rule.toTime);
          if (slot.startTime >= ruleStart && slot.startTime < ruleEnd) {
            price = rule.price;
            break;
          }
        }
      }
      packages.push({
        pkgName: `${String(slot.startTime)}-${String(slot.endTime)}`,
        pkgType: 'flexible',
        startTime: slot.startTime,
        endTime: slot.endTime,
        price,
      });
    }
  }

  if (!venue.cancellation) {
    logError('Venue missing cancellation policy', {
      module: 'booking.workflow.ts/buildContractSnapshot',
      venueName: venue.name,
    });
  }

  return {
    venue: {
      name: venue.name,
      city: venue.city,
      district: venue.district,
    },
    packages,
    financial: {
      basePrice: serverPrice,
      taxes: 0,
      platformFee: 0,
      totalPaid: serverPrice,
    },
    cancellation: venue.cancellation ?? {
      policy: 'nonRefundable' as const,
      refundRules: [],
    },
  };
}

export async function blockSlotWorkflow(
  venueId: string,
  userId: string,
  date: string,
  expectedPrice: number,
  selectedSlots: { startTime: number; endTime: number }[],
  sessionToken?: string
): Promise<{ lockId: string; expiresAt: string; amountToPay: number }> {
  const venue = await repo.fetchApprovedVenueForBooking(venueId);
  if (!venue) {
    throw new Error('Venue not found or unavailable for booking.');
  }

  const dateCheck = validateDateForVenue(venue, date);
  if (!dateCheck.valid) {
    throw new Error(dateCheck.reason ?? 'Invalid date');
  }

  const slotCheck = validateSelectedSlotsForVenue(venue, selectedSlots);
  if (!slotCheck.valid) {
    throw new Error(slotCheck.reason ?? 'Invalid slots');
  }

  const serverPrice = computeServerTotalPrice(venue, selectedSlots);
  const priceCheck = assertPriceWithinTolerance(serverPrice, expectedPrice, 2);
  if (!priceCheck.valid) {
    throw new Error(priceCheck.reason ?? 'Price mismatch');
  }

  const contractSnapshot = buildContractSnapshot(venue, selectedSlots, serverPrice);

  const sortedSlots = [...selectedSlots].sort((a, b) => a.startTime - b.startTime);
  const effectiveStart = sortedSlots[0].startTime;
  const effectiveEnd = sortedSlots[sortedSlots.length - 1].endTime;

  const sessionTokenHash = sessionToken
    ? crypto.createHash('sha256').update(sessionToken).digest('hex')
    : undefined;

  const mutexAcquired = await acquireSlotMutex(venueId, date);
  if (!mutexAcquired) {
    throw new Error('Someone else is booking this slot right now. Please try again in a moment.');
  }

  let lock;
  try {
    lock = await runInTransaction(async (session) => {
      const conflicts = await repo.fetchActiveConflicts(venueId, date, {
        excludeUserId: userId,
        excludeSessionTokenHash: sessionTokenHash,
        session,
      });

      if (checkOverlap(effectiveStart, effectiveEnd, conflicts)) {
        throw new Error(
          'The selected time slot is no longer available. Please choose a different slot.'
        );
      }

      const deleteConditions: Record<string, unknown>[] = [{ userId: new Types.ObjectId(userId) }];
      if (sessionTokenHash) {
        deleteConditions.push({ sessionTokenHash });
      }
      await repo.deleteLocksByConditions(
        [
          { userId: new Types.ObjectId(userId) },
          ...(sessionTokenHash ? [{ sessionTokenHash }] : []),
        ],
        session
      );

      const [newLock] = await repo.createLock(
        [
          {
            venueId: new Types.ObjectId(venueId),
            userId: new Types.ObjectId(userId),
            date,
            startTime: effectiveStart,
            endTime: effectiveEnd,
            price: serverPrice,
            sessionTokenHash,
            contractSnapshot,
            createdAt: new Date(),
          },
        ],
        session
      );
      return newLock;
    });
  } finally {
    await releaseSlotMutex(venueId, date);
  }

  const expiresAt = new Date(lock.createdAt.getTime() + LOCK_TTL_SECONDS * 1000);

  logInfo('Slot lock acquired', {
    lockId: lock._id.toString(),
    venueId,
    userId,
    date,
    startTime: effectiveStart,
    endTime: effectiveEnd,
  });

  return {
    lockId: lock._id.toString(),
    expiresAt: expiresAt.toISOString(),
    amountToPay: serverPrice,
  };
}

export async function saveBookerDetailsWorkflow(
  lockId: string,
  userId: string,
  guestCount?: number,
  eventType?: string,
  bookerInfo?: Record<string, unknown>
): Promise<boolean> {
  const lock = await repo.updateLockBookerDetails(
    lockId,
    userId,
    guestCount,
    eventType,
    bookerInfo
  );
  if (!lock) {
    throw new Error('Booking session expired. Please re-select your slot and try again.');
  }
  return true;
}

export async function initCheckoutWorkflow(
  userId: string,
  lockId: string
): Promise<{ orderId: string; amount: number; currency: string }> {
  const lock = await repo.findLockById(lockId, userId);

  if (!lock) {
    throw new Error('Lock expired. Please re-select your slot and try again.');
  }

  const lockCreatedAt =
    lock.createdAt instanceof Date ? lock.createdAt.getTime() : new Date(lock.createdAt).getTime();

  const lockExpiresAtMs = lockCreatedAt + LOCK_TTL_SECONDS * 1000;
  const remainingMs = lockExpiresAtMs - Date.now();

  if (remainingMs < CHECKOUT_BUFFER_MS) {
    logWarn('Checkout rejected: insufficient time remaining on lock', {
      lockId,
      userId,
      remainingSeconds: Math.floor(remainingMs / 1000),
    });
    throw new Error('Insufficient time to complete payment. Please re-select your slot.');
  }

  const amountPaise = Math.round(lock.price * 100);

  const order = await createOrder({
    amountPaise,
    currency: 'INR',
    notes: {
      lockId: lock._id.toString(),
      venueId: lock.venueId.toString(),
      userId: lock.userId.toString(),
    },
  });

  logInfo('Razorpay checkout order created', {
    lockId: lock._id.toString(),
    orderId: order.orderId,
    amount: order.amount,
  });

  return {
    orderId: order.orderId,
    amount: order.amount,
    currency: order.currency,
  };
}

export async function releaseLockWorkflow(userId?: string, sessionToken?: string): Promise<void> {
  if (!userId && !sessionToken) return;

  const deleteConditions: Record<string, unknown>[] = [];
  if (userId) deleteConditions.push({ userId: new Types.ObjectId(userId) });
  if (sessionToken) {
    const sessionTokenHash = crypto.createHash('sha256').update(sessionToken).digest('hex');
    deleteConditions.push({ sessionTokenHash });
  }

  await repo.deleteLocksByConditions(deleteConditions);
}

export async function cancelBookingWorkflow(
  userId: string,
  bookingId: string,
  reason?: string
): Promise<boolean> {
  const booking = await repo.fetchUserBookingByRefIdOrId(bookingId, userId);

  if (!booking) {
    throw new Error('Booking not found');
  }

  if (booking.status !== BookingStatus.CONFIRMED) {
    throw new Error('Only confirmed bookings can be cancelled');
  }

  const now = new Date();
  const bookingEnd = new Date(`${booking.date}T00:00:00`);
  bookingEnd.setMinutes(booking.endTime);

  if (bookingEnd < now) {
    throw new Error('Cannot cancel a booking that has already started or completed');
  }

  const bookingDetails = await repo.fetchBookingById(booking._id.toString(), userId);
  if (!bookingDetails || (bookingDetails.cancellationRefundPct as number) === 0) {
    throw new Error('Cancellation window passed or non-refundable venue');
  }

  const hasSnapshot = bookingDetails.contractSnapshot !== undefined;
  if (!hasSnapshot) {
    logWarn('Booking missing contractSnapshot — falling back to live venue data', {
      module: 'booking.workflow.ts/cancelBookingWorkflow',
      bookingId: booking._id.toString(),
      userId,
    });
  }

  // Atomic guard: only one concurrent cancellation request can ever pass
  // this point for a given booking. If another request already cancelled
  // it (race or retry), this returns null and we stop before touching
  // Razorpay — this is what prevents a double refund.
  const claimed = await repo.claimBookingForCancellation(booking._id.toString(), userId, reason);
  if (!claimed) {
    throw new Error('This booking has already been cancelled.');
  }

  const amountPaise = claimed.price * 100;
  const refundAmountPaise = Math.floor(
    amountPaise * ((bookingDetails.cancellationRefundPct as number) / 100)
  );

  if (refundAmountPaise > 0 && claimed.paymentReference) {
    try {
      await issueRefund(claimed.paymentReference, refundAmountPaise);
    } catch (err) {
      logError('CRITICAL: Razorpay refund failed after booking was already marked cancelled', {
        module: 'booking.workflow.ts/cancelBookingWorkflow',
        bookingId: claimed._id.toString(),
        paymentId: claimed.paymentReference,
        amountPaise: refundAmountPaise,
        error: (err as Error).message,
      });
      throw new Error('Booking cancelled, but the refund failed. Please contact support.', {
        cause: err,
      });
    }
  }

  try {
    const customerEmail = await findUserEmailById(userId);

    if (customerEmail) {
      const venueName = bookingDetails.venueName as string;
      const date = bookingDetails.date as string;
      const timeRange = bookingDetails.timeRange as string;
      const bookingRef = bookingDetails.bookingRef as string;

      await enqueueEmailTask(
        customerEmail,
        EmailIntent.BOOKING_CANCELLATION,
        `Booking Cancelled – ${venueName}`,
        EmailTaskStatus.PENDING,
        {
          bookingRef,
          venueName,
          date,
          timeRange,
          refundAmount: (refundAmountPaise / 100).toString(),
        }
      );
    }
  } catch (emailErr) {
    logWarn('Failed to queue cancellation email', {
      bookingId,
      error: (emailErr as Error).message,
    });
  }

  return true;
}
