import type { Types } from 'mongoose';
import { BookingStatus, type BookingStatusType } from '../../constants/booking.constants';
import { PaymentStatus } from '../../constants/payment.constants';
import { logError, logInfo, logWarn } from '../../utils/logger';
import { issueRefund } from '../../services/razorpay.service';
import {
  markWebhookProcessed,
  createBooking,
  createFailedBooking,
  findAllBookings,
  findLockByIdRaw,
  deleteLockById,
  fetchMyBookings,
  fetchBookingById,
  fetchBookingByPaymentReference,
  type AggregatedBooking,
} from './booking.repository';
import type { PaginationParams, PaginatedResponse } from '../../types/pagination.types';
import { minutesToTimeString } from '../../utils/timeUtils';
import {
  EmailIntent,
  EmailTaskStatus,
  type EmailIntentType,
} from '../../constants/email.constants';
import type { ILock } from './lock.types';
import type { IBooking } from './booking.types';
import type { RazorpayWebhookNotes } from './booking.types';
import { findUserEmailById } from '../user/user.repository';
import { findVenueNameAndOwner, findVenueById } from '../venue/venue.repository';
import { enqueueEmailTask } from '../../services/email.repository';

async function enqueueEmail(
  intent: EmailIntentType,
  recipient: string,
  subject: string,
  metadata: Record<string, string>
): Promise<void> {
  try {
    await enqueueEmailTask(recipient, intent, subject, EmailTaskStatus.PENDING, metadata);
  } catch (err) {
    logError('Failed to enqueue email task', {
      module: 'booking.service.ts/enqueueEmail',
      intent,
      recipient,
      error: (err as Error).message,
    });
  }
}

async function resolveCustomerEmail(userId: string): Promise<string | null> {
  try {
    return await findUserEmailById(userId);
  } catch {
    return null;
  }
}

async function resolveVenueInfo(
  venueId: string
): Promise<{ venueName: string; ownerEmail: string | null } | null> {
  try {
    const venue = await findVenueNameAndOwner(venueId);
    if (!venue) return null;

    const ownerEmail = await findUserEmailById(venue.ownerUserId.toString());

    return {
      venueName: venue.name,
      ownerEmail: ownerEmail,
    };
  } catch {
    return null;
  }
}

// Processes a captured payment webhook.
export async function processCapturedPayment(
  paymentId: string,
  amountPaise: number,
  notes: RazorpayWebhookNotes,
  paymentMethod?: string
): Promise<{ success: boolean; isDuplicate?: boolean; error?: string }> {
  try {
    await markWebhookProcessed(paymentId);
  } catch (err) {
    const error = err as { code?: number; message: string };
    if (error.code === 11000) {
      logInfo('Duplicate webhook received — skipping (already processed)', {
        module: 'booking.service.ts/processCapturedPayment',
        eventId: paymentId,
      });
      return { success: true, isDuplicate: true };
    }
    logError('CRITICAL: Failed to record webhook idempotency marker', {
      module: 'booking.service.ts/processCapturedPayment',
      eventId: paymentId,
      error: error.message,
    });
    return {
      success: false,
      error: 'Idempotency gate error — refusing to process to prevent duplicate booking',
    };
  }

  const { lockId, venueId, userId } = notes;
  if (!lockId || !venueId || !userId) {
    logError('Webhook payment captured notes are missing required fields', {
      module: 'booking.service.ts/processCapturedPayment',
      eventId: paymentId,
      notes,
    });
    return { success: false, error: 'Missing notes metadata' };
  }

  const [venueInfo, customerEmail] = await Promise.all([
    resolveVenueInfo(venueId),
    resolveCustomerEmail(userId),
  ]);

  const venueName = venueInfo?.venueName ?? 'the venue';
  const ownerEmail = venueInfo?.ownerEmail ?? null;

  let lock: (ILock & { _id: Types.ObjectId }) | null;
  try {
    lock = await findLockByIdRaw(lockId);
  } catch (err) {
    logError('Failed to query LockModel in webhook service', {
      module: 'booking.service.ts/processCapturedPayment',
      lockId,
      error: (err as Error).message,
    });
    return { success: false, error: 'Lock query failed' };
  }

  // Scenario A: Slot lock is active. Confirm the booking and delete the lock.
  if (lock) {
    const expectedAmountPaise = Math.round(lock.price * 100);
    if (Math.abs(amountPaise - expectedAmountPaise) > 100) {
      logWarn(
        'Captured payment amount does not match lock price — proceeding, but flagging for review',
        {
          module: 'booking.service.ts/processCapturedPayment',
          lockId,
          paymentId,
          expectedAmountPaise,
          capturedAmountPaise: amountPaise,
        }
      );
    }

    logInfo('Webhook Scenario A: Lock exists, creating booking', {
      lockId,
      venueId,
      userId,
      paymentId,
    });

    // Transfer contractSnapshot from lock to booking
    let contractSnapshot = lock.contractSnapshot;

    if (!contractSnapshot) {
      logWarn('Lock missing contractSnapshot — building fallback from venue', {
        module: 'booking.service.ts/processCapturedPayment',
        lockId,
        venueId,
      });
      const fallbackVenue = await findVenueById(venueId);
      if (fallbackVenue) {
        const totalPrice = amountPaise / 100;
        contractSnapshot = {
          venue: {
            name: fallbackVenue.name,
            city: fallbackVenue.city,
            district: fallbackVenue.district,
          },
          packages: [
            {
              pkgName: `${String(lock.startTime)}-${String(lock.endTime)}`,
              pkgType: fallbackVenue.bookingType === 'fixedBooking' ? 'fixed' : 'flexible',
              startTime: lock.startTime,
              endTime: lock.endTime,
              price: totalPrice,
            },
          ],
          financial: { basePrice: totalPrice, taxes: 0, platformFee: 0, totalPaid: totalPrice },
          cancellation: fallbackVenue.cancellation,
        };
      }
    }

    // Security re-verify: fetch venue and log inconsistencies
    try {
      const currentVenue = await findVenueById(venueId);
      if (currentVenue && contractSnapshot) {
        if (currentVenue.name !== contractSnapshot.venue.name) {
          logWarn('Venue name changed since lock was acquired', {
            module: 'booking.service.ts/processCapturedPayment',
            lockId,
            venueId,
            snapshotName: contractSnapshot.venue.name,
            currentName: currentVenue.name,
          });
        }
        if (currentVenue.cancellation.policy !== contractSnapshot.cancellation.policy) {
          logWarn('Venue cancellation policy changed since lock was acquired', {
            module: 'booking.service.ts/processCapturedPayment',
            lockId,
            venueId,
            snapshotPolicy: contractSnapshot.cancellation.policy,
            currentPolicy: currentVenue.cancellation.policy,
          });
        }
      }
    } catch (err) {
      logWarn('Failed to re-verify venue during webhook processing', {
        module: 'booking.service.ts/processCapturedPayment',
        lockId,
        venueId,
        error: (err as Error).message,
      });
    }

    try {
      await createBooking({
        venueId,
        userId,
        date: lock.date,
        startTime: lock.startTime,
        endTime: lock.endTime,
        price: amountPaise / 100,
        paymentReference: paymentId,
        status: BookingStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PAID,
        guestCount: lock.guestCount,
        eventType: lock.eventType,
        bookerInfo: lock.bookerInfo,
        paymentMethod: paymentMethod,
        contractSnapshot,
      });
    } catch (err) {
      const error = err as { code?: number; message: string };
      if (error.code === 11000) {
        logError('CRITICAL: Slot already booked (duplicate-key) — issuing automatic refund', {
          module: 'booking.service.ts/processCapturedPayment',
          lockId,
          paymentId,
          venueId,
          userId,
        });
        try {
          await issueRefund(paymentId, amountPaise);
        } catch (refundErr) {
          logError('CRITICAL: Automatic refund failed after lost double-booking race', {
            module: 'booking.service.ts/processCapturedPayment',
            lockId,
            paymentId,
            error: (refundErr as Error).message,
          });
        }
        if (notes.lockId) {
          await deleteLockById(notes.lockId).catch(() => undefined);
        }
        return { success: false, error: 'Slot already booked; refund issued' };
      }
      logError('CRITICAL: Failed to create booking in Scenario A', {
        module: 'booking.service.ts/processCapturedPayment',
        eventId: paymentId,
        error: (err as Error).message,
      });
      return { success: false, error: 'Booking creation failed' };
    }

    try {
      if (notes.lockId) {
        await deleteLockById(notes.lockId);
      }
    } catch (err) {
      logWarn('Failed to delete lock after booking creation', {
        module: 'booking.service.ts/processCapturedPayment',
        lockId,
        error: (err as Error).message,
      });
    }

    const emailMetadata = {
      venueName,
      date: lock.date,
      startTime: minutesToTimeString(lock.startTime),
      endTime: minutesToTimeString(lock.endTime),
      amount: String(amountPaise / 100),
      paymentReference: paymentId,
    };

    if (customerEmail) {
      void enqueueEmail(
        EmailIntent.BOOKING_CONFIRMATION,
        customerEmail,
        `Booking Confirmed – ${venueName} on ${lock.date}`,
        emailMetadata
      );
    }

    if (ownerEmail) {
      void enqueueEmail(
        EmailIntent.BOOKING_CONFIRMATION,
        ownerEmail,
        `New Booking Received – ${venueName} on ${lock.date}`,
        emailMetadata
      );
    }

    logInfo('Scenario A complete: booking confirmed', { lockId, paymentId });
    return { success: true };
  }

  // Scenario B: Slot lock has expired. Issue safety refund and log failed booking.
  logWarn('Webhook Scenario B: Lock TTL expired — issuing safety refund', {
    lockId,
    venueId,
    userId,
    paymentId,
  });

  let refundId: string;
  try {
    const refundResult = await issueRefund(paymentId, amountPaise);
    refundId = refundResult.refundId;
  } catch (err) {
    logError('CRITICAL: Razorpay refund failed in Scenario B', {
      module: 'booking.service.ts/processCapturedPayment',
      paymentId,
      amountPaise,
      error: (err as Error).message,
    });
    return { success: false, error: 'Refund failed — manual review required' };
  }

  try {
    await createFailedBooking({
      venueId,
      userId,
      date: 'UNKNOWN',
      startTime: 0,
      endTime: 0,
      amountPaid: amountPaise,
      paymentReference: paymentId,
      refundReference: refundId,
      reason: 'TTL_EXPIRED_COLLISION',
    });
  } catch (err) {
    logError('Failed to create FailedBooking audit record', {
      module: 'booking.service.ts/processCapturedPayment',
      paymentId,
      refundId,
      error: (err as Error).message,
    });
  }

  if (customerEmail) {
    void enqueueEmail(
      EmailIntent.BOOKING_REFUND,
      customerEmail,
      `Booking Failed – Full Refund Initiated for ${venueName}`,
      {
        venueName,
        date: 'your selected date',
        startTime: 'your selected slot',
        endTime: 'your selected slot',
        amount: String(amountPaise / 100),
        refundReference: refundId,
      }
    );
  }

  logInfo('Scenario B complete: refund issued', { paymentId, refundId });
  return { success: true };
}

export async function getAllBookings(
  paginationParams: PaginationParams,
  filters?: { status?: BookingStatusType; venueId?: string }
): Promise<PaginatedResponse<AggregatedBooking, 'bookings'>> {
  return findAllBookings(paginationParams, filters);
}

export async function getMyBookings(userId: string): Promise<{
  bookings: {
    upcoming: Record<string, unknown>[];
    cancelled: Record<string, unknown>[];
    completed: Record<string, unknown>[];
  };
}> {
  return fetchMyBookings(userId);
}

export async function getBookingById(
  bookingId: string,
  userId: string
): Promise<Record<string, unknown> | null> {
  return fetchBookingById(bookingId, userId);
}

export async function getBookingByPaymentReference(paymentId: string): Promise<IBooking | null> {
  return fetchBookingByPaymentReference(paymentId);
}
