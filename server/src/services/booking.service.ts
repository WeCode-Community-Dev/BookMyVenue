import { HTTP_STATUS } from '@/constants/http';
import {
  BookingScenario,
  BookingStatus,
  PaymentStatus,
  PaymentMethod,
  RESERVATION_POLICY,
  CancellationType,
  RefundStatus,
  validateBookingStateTransition,
} from '@/constants/booking';
import { SettlementStatus } from '@/constants/settlement';
import { CreateBookingPayload } from '@/types/booking.types';
import { AppError } from '@/utils/AppError';
import * as bookingRepo from '@/repositories/booking.repository';
import { walletRepository } from '@/repositories/wallet.repository';
import { WalletTransaction } from '@/models/walletTransaction.model';
import { verifyPaymentSignature } from './razorpay.service';
import { processRefund } from './refund.service';
import logger from '@/libs/logger';
import mongoose from 'mongoose';
import Booking from '@/models/booking.model';
import Venue from '@/models/venue.model';
import { logAdminAction } from '@/utils/auditLogger';
import { validateVenueAvailability } from '@/utils/availabilityValidator';

import { findVenueById } from '@/repositories/venue.repository';
import { userRepository } from '@/repositories/user.repository';
import { createOrder as createRazorpayOrder } from './razorpay.service';

// ── Helpers ───────────────────────────────────────────────────

/**
 * Re-verifies that the venue is active, approved, not deleted, and the host is not blocked
 * before committing any payment.
 */
const verifyVenueAndHostActive = async (venueId: any) => {
  const targetId = typeof venueId === 'object' && venueId._id ? venueId._id.toString() : venueId.toString();
  const venue = await findVenueById(targetId);
  if (!venue || venue.isDeleted || !venue.isActive || venue.verificationStatus !== 'approved') {
    throw new AppError('Venue is no longer active or available for payment processing', HTTP_STATUS.BAD_REQUEST);
  }
  const ownerId = typeof venue.ownerId === 'object' && (venue.ownerId as any)._id ? (venue.ownerId as any)._id.toString() : venue.ownerId.toString();
  const hostUser = await userRepository.findById(ownerId);
  if (hostUser && hostUser.isBlocked) {
    throw new AppError('Venue host account is currently suspended', HTTP_STATUS.BAD_REQUEST);
  }
};

/**
 * Determines the booking scenario based on how many days
 * are between today and the event start date.
 */
const determineScenario = (eventStart: Date): BookingScenario => {
  const now = new Date();
  const diffMs = eventStart.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays > RESERVATION_POLICY.ADVANCE_THRESHOLD_DAYS) {
    return BookingScenario.ADVANCE;
  }
  return BookingScenario.IMMEDIATE;
};


export const calculateRemainingDueDate = (
  bookingDate: Date,
  eventDate: Date,
  cancellationFactor: number = 0.5
) => {
  const bookingTime = bookingDate.getTime();
  const eventTime = eventDate.getTime();
  const diffMs = eventTime - bookingTime;
  const leadTimeDays = diffMs / (1000 * 60 * 60 * 24);

  if (leadTimeDays < 0) {
    throw new AppError('Event date cannot be before booking date', HTTP_STATUS.BAD_REQUEST);
  }

  let remainingPaymentDueDate: Date;
  let isImmediatePaymentRequired: boolean;

  if (leadTimeDays < RESERVATION_POLICY.ADVANCE_THRESHOLD_DAYS) {
    // CASE 2: Short Notice Booking
    remainingPaymentDueDate = new Date(bookingTime);
    isImmediatePaymentRequired = true;
  } else {
    // CASE 1: Normal Booking
    isImmediatePaymentRequired = false;
    const daysToSubtract = leadTimeDays * cancellationFactor;
    const dueTime = eventTime - daysToSubtract * 24 * 60 * 60 * 1000;
    // Clamp to ensure it doesn't fall before bookingDate or after eventDate
    const clampedTime = Math.max(bookingTime, Math.min(eventTime, dueTime));
    remainingPaymentDueDate = new Date(clampedTime);
    // Round to 11:59 PM of the target day for clean display
    remainingPaymentDueDate.setHours(23, 59, 59, 999);
  }

  // Calculate autoCancellationDate
  let autoCancellationDate: Date;
  if (isImmediatePaymentRequired) {
    autoCancellationDate = new Date(bookingTime + 30 * 60 * 1000); // 30 minutes
  } else {
    autoCancellationDate = new Date(
      remainingPaymentDueDate.getTime() + RESERVATION_POLICY.GRACE_PERIOD_HOURS * 60 * 60 * 1000
    );
  }

  return {
    remainingPaymentDueDate,
    autoCancellationDate,
    leadTimeDays,
    isImmediatePaymentRequired,
  };
};

// ── Public API ────────────────────────────────────────────────

export const getBookingByVenueId = async (id: string) => {
  return bookingRepo.getBookingByVenueId(id);
};

/**
 * Standalone service to calculate booking quotes (pricing breakdown, scenarios, and deposits).
 * This ensures the backend has sole ownership of pricing calculations.
 */
export const calculateQuoteService = async (
  venueId: string,
  startDateTime: string | Date,
  endDateTime: string | Date
) => {
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);
  const now = new Date();

  // Run comprehensive availability validation
  const availability = await validateVenueAvailability(venueId, start, end);

  // Calculate total amount (base + GST + platform fee)
  const durationInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  const baseAmount = durationInHours * availability.pricePerHour;
  const gst = baseAmount * RESERVATION_POLICY.GST_PERCENTAGE;
  const platformFee = baseAmount * RESERVATION_POLICY.PLATFORM_FEE_PERCENTAGE;
  const totalAmount = Math.round(baseAmount + gst + platformFee);

  // Determine scenario
  const scenario = determineScenario(start);

  // Calculate deposit and balance
  const reservationDeposit =
    scenario === BookingScenario.IMMEDIATE
      ? totalAmount
      : Math.round(totalAmount * RESERVATION_POLICY.DEPOSIT_PERCENTAGE);

  const remainingBalance = totalAmount - reservationDeposit;

  // Calculate due date details
  const deadlineDetails = calculateRemainingDueDate(now, start, 0.5);

  return {
    durationInHours,
    baseAmount,
    gst,
    platformFee,
    totalAmount,
    reservationDeposit,
    remainingBalance,
    bookingScenario: scenario,
    remainingPaymentDueDate: deadlineDetails.remainingPaymentDueDate,
    autoCancellationDate: deadlineDetails.autoCancellationDate,
    isImmediatePaymentRequired: scenario === BookingScenario.IMMEDIATE,
  };
};

/**
 * Creates a new booking using the reservation deposit model.
 *
 * Returns the saved booking document along with the amount that
 * should be charged via Razorpay right now (deposit or full).
 */
export const createBookingService = async (userId: string, payload: CreateBookingPayload) => {
  const start = new Date(payload.startDateTime);
  const end = new Date(payload.endDateTime);

  // 1. Double-click idempotency check (created within last 10 seconds for same slot)
  const tenSecondsAgo = new Date(Date.now() - 10 * 1000);
  const recentDuplicate = await Booking.findOne({
    user: userId,
    venue: payload.venueId,
    startDateTime: start,
    endDateTime: end,
    bookingStatus: BookingStatus.PENDING,
    createdAt: { $gte: tenSecondsAgo },
  });

  if (recentDuplicate) {
    return { booking: recentDuplicate, razorpayChargeAmount: recentDuplicate.reservationDeposit };
  }

  // 2. Execute availability validation and booking creation in a Mongo transaction session
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    await validateVenueAvailability(payload.venueId, start, end, session);
    const quote = await calculateQuoteService(payload.venueId, start, end);

    const booking = await bookingRepo.createBooking(
      userId,
      payload,
      {
        totalAmount: quote.totalAmount,
        reservationDeposit: quote.reservationDeposit,
        remainingBalance: quote.remainingBalance,
        bookingScenario: quote.bookingScenario,
        remainingPaymentDueDate: quote.remainingPaymentDueDate,
        autoCancellationDate: quote.autoCancellationDate,
        isImmediatePaymentRequired: quote.isImmediatePaymentRequired,
      },
      session
    );

    await session.commitTransaction();
    return { booking, razorpayChargeAmount: quote.reservationDeposit };
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Unified service workflow that creates a booking and generates the corresponding Razorpay order.
 * Keeps controllers thin and HTTP-focused.
 */
export const createBookingWithOrderService = async (userId: string, payload: CreateBookingPayload) => {
  const { booking, razorpayChargeAmount } = await createBookingService(userId, payload);
  const orderDetails = await createRazorpayOrder(razorpayChargeAmount, booking._id.toString());
  return { payment: orderDetails, booking };
};

/**
 * Verifies the Razorpay payment signature after the customer
 * pays the reservation deposit (or full amount for IMMEDIATE).
 */
export const verifyAndConfirmDepositService = async (
  userId: string,
  bookingId: string,
  orderId: string,
  paymentId: string,
  signature: string
) => {
  // ── 1. Verify Razorpay signature ───────────────────────
  const isValid = verifyPaymentSignature(orderId, paymentId, signature);
  if (!isValid) {
    throw new AppError('Payment signature verification failed', HTTP_STATUS.BAD_REQUEST);
  }

  // ── 2. Find the booking ────────────────────────────────
  const booking = await bookingRepo.findBookingById(bookingId);
  if (!booking) {
    throw new AppError('Booking not found', HTTP_STATUS.NOT_FOUND);
  }

  // ── 3. Ownership check ─────────────────────────────────
  if (booking.user._id.toString() !== userId) {
    throw new AppError('Unauthorized access to booking', HTTP_STATUS.UNAUTHORIZED);
  }

  // ── Live Venue & Host Status Re-Verification ───────────
  await verifyVenueAndHostActive(booking.venue);

  // ── 4. Update booking based on scenario ────────────────
  if (booking.bookingScenario === BookingScenario.IMMEDIATE) {
    // Full payment — mark as CONFIRMED + PAID
    return bookingRepo.confirmFullPayment(bookingId, booking.totalAmount);
  }

  // Deposit payment — mark as RESERVED + DEPOSIT_PAID
  return bookingRepo.confirmDepositPayment(bookingId, booking.reservationDeposit);
};

/**
 * Processes the remaining balance payment for RESERVED bookings.
 * Called when the user clicks "Pay Balance" on their bookings page.
 */
export const payBalanceService = async (userId: string, bookingId: string) => {
  // ── 1. Find the booking ────────────────────────────────
  const booking = await bookingRepo.findBookingById(bookingId);
  if (!booking) {
    throw new AppError('Booking not found', HTTP_STATUS.NOT_FOUND);
  }

  // ── 2. Ownership check ─────────────────────────────────
  if (booking.user._id.toString() !== userId) {
    throw new AppError('Unauthorized access to booking', HTTP_STATUS.UNAUTHORIZED);
  }

  // ── Live Venue & Host Status Re-Verification ───────────
  await verifyVenueAndHostActive(booking.venue);

  // ── 3. Status check ────────────────────────────────────
  if (booking.bookingStatus !== BookingStatus.RESERVED) {
    throw new AppError('Only reserved bookings can have balance paid', HTTP_STATUS.BAD_REQUEST);
  }
  const allowedStatuses = [
    PaymentStatus.PARTIAL,
    PaymentStatus.DEPOSIT_PAID,
    PaymentStatus.OVERDUE,
  ];
  if (!allowedStatuses.includes(booking.paymentStatus as PaymentStatus)) {
    throw new AppError('Deposit must be paid before balance payment', HTTP_STATUS.BAD_REQUEST);
  }

  // ── 4. Check deadline hasn't expired ───────────────────
  if (booking.remainingPaymentDueDate && new Date() > booking.remainingPaymentDueDate) {
    throw new AppError('Balance payment deadline has passed', HTTP_STATUS.BAD_REQUEST);
  }

  // ── 5. Return the remaining balance for Razorpay order ─
  return {
    booking,
    razorpayChargeAmount: booking.remainingBalance,
  };
};

/**
 * Verifies the Razorpay payment for the balance and confirms
 * the booking fully.
 */
export const verifyBalancePaymentService = async (
  userId: string,
  bookingId: string,
  orderId: string,
  paymentId: string,
  signature: string
) => {
  // ── 1. Verify Razorpay signature ───────────────────────
  const isValid = verifyPaymentSignature(orderId, paymentId, signature);
  if (!isValid) {
    throw new AppError('Payment signature verification failed', HTTP_STATUS.BAD_REQUEST);
  }

  // ── 2. Find the booking ────────────────────────────────
  const booking = await bookingRepo.findBookingById(bookingId);
  if (!booking) {
    throw new AppError('Booking not found', HTTP_STATUS.NOT_FOUND);
  }

  // ── 3. Ownership check ─────────────────────────────────
  if (booking.user._id.toString() !== userId) {
    throw new AppError('Unauthorized access to booking', HTTP_STATUS.UNAUTHORIZED);
  }

  // ── 4. Mark as fully paid ──────────────────────────────
  return bookingRepo.confirmFullPayment(bookingId, booking.totalAmount);
};

/**
 * Permanently deletes a booking that hasn't been paid yet (PENDING payment status).
 * Called on payment failure, modal dismiss without paying, or explicit user cancel.
 * Frees the reserved slot.
 */
export const deleteBookingService = async (
  userId: string,
  bookingId: string
) => {
  const booking = await bookingRepo.findBookingById(bookingId);
  if (!booking) {
    // Already deleted — treat as success (idempotent)
    return;
  }

  if (booking.user._id.toString() !== userId) {
    throw new AppError('Unauthorized access to booking', HTTP_STATUS.UNAUTHORIZED);
  }

  if (booking.paymentStatus !== PaymentStatus.PENDING) {
    throw new AppError(
      'Only pending bookings can be cancelled',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  await bookingRepo.deleteBookingById(bookingId);
};

export const getUserBookingsService = async (
  userId: string,
  page: number,
  limit: number,
  status?: string
) => {
  const result = await bookingRepo.findBookingsByUser(userId, page, limit, status);

  const now = new Date();

  const processedBookings = result.bookings.map(doc => {
    const booking = doc.toObject ? doc.toObject() : doc;
    let isCancellable = false;

    if (
      (booking.bookingStatus === BookingStatus.RESERVED || booking.bookingStatus === BookingStatus.CONFIRMED) &&
      booking.startDateTime
    ) {
      const eventStartTime = new Date(booking.startDateTime);
      const daysUntilEvent = (eventStartTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      if (daysUntilEvent >= 7) {
        isCancellable = true;
      }
    }

    const venueDoc = (booking.venue as any) ?? {};
    const venueImages: string[] = venueDoc.images ?? [];

    const rawPaymentStatus: string = booking.paymentStatus ?? '';
    const paymentStatus =
      rawPaymentStatus.toUpperCase() === PaymentStatus.DEPOSIT_PAID
        ? 'partial'
        : rawPaymentStatus.toLowerCase();

    const bookingStatus = (booking.bookingStatus ?? '').toLowerCase();

    return {
      ...booking,
      id: String(booking._id),
      bookingStatus,
      paymentStatus,
      isCancellable,
      venue: {
        id: String(venueDoc._id ?? venueDoc.id ?? ''),
        name: venueDoc.name ?? '',
        imageUrl: venueImages[0] ?? null,
        location: venueDoc.address
          ? [venueDoc.address.city, venueDoc.address.state].filter(Boolean).join(', ')
          : '',
      },
    };
  });

  return {
    bookings: processedBookings,
    pagination: result.pagination,
  };
};

/**
 * Cancels a user's booking.
 *
 * Event-Date Relative Policy:
 * - > 14 days before event: 100% refund of amount paid
 * - 7 to 14 days before event: 50% refund of amount paid
 * - < 7 days before event: Cancellation not permitted
 *
 * @param userId User ID
 * @param bookingId Booking ID
 * @param cancellationReason Reason for cancellation
 */

export const cancelBookingService = async (userId: string, bookingId: string, cancellationReason: string) => {

  const booking = await bookingRepo.findBookingById(bookingId);
  if (!booking) {
    throw new AppError('Booking not found', HTTP_STATUS.NOT_FOUND);
  }

  if (booking.user._id.toString() !== userId) {
    throw new AppError('Unauthorized access to booking', HTTP_STATUS.FORBIDDEN);
  }

  if (booking.bookingStatus === BookingStatus.CANCELLED) {
    throw new AppError('Booking is already cancelled', HTTP_STATUS.BAD_REQUEST);
  }

  if (![BookingStatus.RESERVED, BookingStatus.CONFIRMED].includes(booking.bookingStatus as BookingStatus)) {
    throw new AppError(`Cannot cancel booking in ${booking.bookingStatus} state`, HTTP_STATUS.BAD_REQUEST);
  }

  // Slot Validation 
  if (!booking.startDateTime || !booking.endDateTime) {
    throw new AppError('Invalid booking slot. Cancellation aborted to prevent data corruption.', HTTP_STATUS.SERVER_ERROR);
  }

  // Event Already Started 
  const now = new Date();
  const eventStartTime = new Date(booking.startDateTime);

  if (now.getTime() >= eventStartTime.getTime()) {
    throw new AppError('Cannot cancel a booking after the event has started', HTTP_STATUS.BAD_REQUEST);
  }

  // Event-Date Relative Cancellation Window Validation
  const daysUntilEvent = (eventStartTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

  const refundFactor = daysUntilEvent >= 14 ? 1.0 : 0.5;
  if (daysUntilEvent < 7) {
    throw new AppError('Cancellations are not permitted less than 7 days prior to event', HTTP_STATUS.BAD_REQUEST);
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Calculate refund
    const amountPaid = booking.amountPaid || 0;
    const refundAmount = Math.round(amountPaid * refundFactor);
    const isRefundEligible = refundAmount > 0;

    const cancellationDetails = {
      cancellationType: CancellationType.USER,
      refundStatus: isRefundEligible ? RefundStatus.PENDING : RefundStatus.NOT_ELIGIBLE,
      refundAmount,
    };

    // Slot release and booking update
    await bookingRepo.cancelBooking(bookingId, cancellationReason, session, cancellationDetails);

    await session.commitTransaction();

    // Refund Processing
    if (isRefundEligible) {
      try {
        await processRefund(bookingId, RefundStatus.PENDING);
      } catch (error) {
        logger.error(`Refund processing failed for booking ${bookingId}`);
      }
    }
  } catch (error) {
    await session.abortTransaction();
    throw new AppError('Failed to cancel booking due to internal error', HTTP_STATUS.SERVER_ERROR);
  } finally {
    session.endSession();
  }
};

export const getBookingByIdService = async (userId: string, bookingId: string) => {
  const booking = await bookingRepo.findBookingById(bookingId);
  if (!booking) {
    throw new AppError('Booking not found', HTTP_STATUS.NOT_FOUND);
  }
  if (booking.user._id.toString() !== userId) {
    throw new AppError('Unauthorized access to booking', HTTP_STATUS.UNAUTHORIZED);
  }
  return booking;
};

export const getOwnerBookingsService = async (
  ownerId: string,
  page: number,
  limit: number,
  status?: string
) => {
  // 1. Fetch all active venues owned by this owner
  const venues = await Venue.find({ ownerId, isDeleted: { $ne: true } }).select('_id');
  const venueIds = venues.map(v => v._id);

  // 2. Fetch bookings for these venues
  const result = await bookingRepo.findBookingsByVenueIds(venueIds, page, limit, status);

  // 3. Process bookings to include helpful UI fields
  const processedBookings = result.bookings.map(doc => {
    const booking = doc.toObject ? doc.toObject() : doc;
    const venueDoc = (booking.venue as any) ?? {};
    const venueImages = venueDoc.images ?? [];

    const rawPaymentStatus = booking.paymentStatus ?? '';
    const paymentStatus =
      rawPaymentStatus.toUpperCase() === PaymentStatus.DEPOSIT_PAID
        ? 'partial'
        : rawPaymentStatus.toLowerCase();

    return {
      ...booking,
      id: String(booking._id),
      bookingStatus: (booking.bookingStatus ?? '').toLowerCase(),
      paymentStatus,
      venue: {
        id: String(venueDoc._id ?? venueDoc.id ?? ''),
        name: venueDoc.name ?? '',
        imageUrl: venueImages[0] ?? null,
        location: venueDoc.address
          ? [venueDoc.address.city, venueDoc.address.state].filter(Boolean).join(', ')
          : '',
      },
    };
  });

  // 4. Calculate owner bookings stats
  const [totalCount, confirmedCount, reservedCount, pendingCount] = await Promise.all([
    Booking.countDocuments({ venue: { $in: venueIds } }),
    Booking.countDocuments({ venue: { $in: venueIds }, bookingStatus: BookingStatus.CONFIRMED }),
    Booking.countDocuments({ venue: { $in: venueIds }, bookingStatus: BookingStatus.RESERVED }),
    Booking.countDocuments({ venue: { $in: venueIds }, bookingStatus: BookingStatus.PENDING }),
  ]);

  return {
    bookings: processedBookings,
    pagination: result.pagination,
    stats: {
      total: totalCount,
      confirmed: confirmedCount,
      pending: reservedCount + pendingCount,
    },
  };
};

export const getOwnerBookingByIdService = async (ownerId: string, bookingId: string) => {
  const booking = await bookingRepo.findBookingById(bookingId);
  if (!booking) {
    throw new AppError('Booking not found', HTTP_STATUS.NOT_FOUND);
  }

  // Ensure owner owns the venue associated with this booking
  const venue = await Venue.findById(booking.venue?._id || booking.venue);
  if (!venue || venue.ownerId.toString() !== ownerId) {
    throw new AppError('Unauthorized access to booking details', HTTP_STATUS.UNAUTHORIZED);
  }

  return booking;
};

export const updateOwnerBookingStatusService = async (
  ownerId: string,
  bookingId: string,
  bookingStatus?: string
) => {
  const booking = await bookingRepo.findBookingById(bookingId);
  if (!booking) {
    throw new AppError('Booking not found', HTTP_STATUS.NOT_FOUND);
  }

  // Ensure owner owns the venue associated with this booking
  const venue = await Venue.findById(booking.venue?._id || booking.venue);
  if (!venue || venue.ownerId.toString() !== ownerId) {
    throw new AppError('Unauthorized access to booking details', HTTP_STATUS.UNAUTHORIZED);
  }

  // Block updates on finalized bookings
  const currentStatus = booking.bookingStatus;
  if (currentStatus === BookingStatus.CANCELLED || currentStatus === BookingStatus.COMPLETED) {
    throw new AppError('Cannot modify a finalized booking', HTTP_STATUS.BAD_REQUEST);
  }

  const updates: Record<string, any> = {};
  const now = new Date();

  if (bookingStatus) {
    const validBookingStatuses = Object.values(BookingStatus);
    if (!validBookingStatuses.includes(bookingStatus.toUpperCase() as any)) {
      throw new AppError('Invalid booking status value', HTTP_STATUS.BAD_REQUEST);
    }

    // Strict Owner State Machine Whitelist (CVE-BMV-009)
    const OWNER_ALLOWED_TRANSITIONS: Record<string, string[]> = {
      [BookingStatus.RESERVED]: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
      [BookingStatus.CONFIRMED]: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
    };
    const targetStatus = bookingStatus.toUpperCase();
    const allowedTargets = OWNER_ALLOWED_TRANSITIONS[currentStatus] ?? [];
    if (!allowedTargets.includes(targetStatus)) {
      throw new AppError(
        `Owner status change from ${currentStatus} to ${targetStatus} is not permitted`,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // 1. Transition to confirmed
    if (bookingStatus.toUpperCase() === BookingStatus.CONFIRMED) {
      if (currentStatus !== BookingStatus.RESERVED) {
        throw new AppError('Only reserved bookings can be manually confirmed', HTTP_STATUS.BAD_REQUEST);
      }
      updates.bookingStatus = BookingStatus.CONFIRMED;
      if (booking.paymentStatus === PaymentStatus.PENDING) {
        updates.paymentStatus = PaymentStatus.PARTIAL;
      }
    }

    // 2. Transition to completed
    if (bookingStatus.toUpperCase() === BookingStatus.COMPLETED) {
      if (currentStatus !== BookingStatus.CONFIRMED) {
        throw new AppError('Only confirmed bookings can be marked as completed', HTTP_STATUS.BAD_REQUEST);
      }
      if (now.getTime() < new Date(booking.endDateTime).getTime()) {
        throw new AppError('Cannot complete a booking before the checkout time has passed', HTTP_STATUS.BAD_REQUEST);
      }
      updates.bookingStatus = BookingStatus.COMPLETED;
      updates.paymentStatus = PaymentStatus.PAID;
      updates.amountPaid = booking.totalAmount;
      updates.settlementStatus = SettlementStatus.PENDING;
    }

    // 3. Transition to cancelled by Owner (with 100% user refund trigger)
    if (bookingStatus.toUpperCase() === BookingStatus.CANCELLED) {
      updates.bookingStatus = BookingStatus.CANCELLED;
      updates.cancellationType = CancellationType.OWNER;
      updates.cancelledAt = new Date();
      updates.cancellationReason = 'Cancelled by venue owner';
      
      const amountPaid = booking.amountPaid || 0;
      if (amountPaid > 0) {
        updates.refundAmount = amountPaid;
        updates.refundStatus = RefundStatus.PENDING;
      } else {
        updates.refundStatus = RefundStatus.NOT_ELIGIBLE;
      }
    }
  }

  const updatedBooking = await Booking.findByIdAndUpdate(
    bookingId,
    { $set: updates },
    { new: true }
  ).populate('venue');

  if (updates.refundStatus === RefundStatus.PENDING) {
    try {
      await processRefund(bookingId, RefundStatus.PENDING);
    } catch (err) {
      logger.error(`Owner cancellation refund failed for booking ${bookingId}`);
    }
  }

  return updatedBooking;
};

// ── Admin Bookings ──────────────────────────────────────────

export const getAdminBookingsService = async (
  page: number,
  limit: number,
  search?: string,
  status?: string,
  categoryId?: string,
  sort?: string
) => {
  return bookingRepo.getAdminBookings(page, limit, search, status, categoryId, sort);
};

/**
 * Enables instant booking payment using internal User Wallet balance.
 */
export const payBookingWithWalletService = async (userId: string, bookingId: string) => {
  const booking = await bookingRepo.findBookingById(bookingId);
  if (!booking) {
    throw new AppError('Booking not found', HTTP_STATUS.NOT_FOUND);
  }
  if (booking.user._id.toString() !== userId) {
    throw new AppError('Unauthorized access to booking', HTTP_STATUS.UNAUTHORIZED);
  }
  if (booking.paymentStatus === PaymentStatus.PAID) {
    throw new AppError('Booking is already fully paid', HTTP_STATUS.BAD_REQUEST);
  }

  // Live venue and host status re-verification
  await verifyVenueAndHostActive(booking.venue);

  const chargeAmount =
    booking.bookingScenario === BookingScenario.IMMEDIATE || booking.paymentStatus === PaymentStatus.DEPOSIT_PAID
      ? booking.remainingBalance || booking.totalAmount
      : booking.reservationDeposit;

  const wallet = await walletRepository.getOrCreateByUserId(userId);
  if (wallet.balance < chargeAmount) {
    throw new AppError(
      `Insufficient wallet balance. Required: ₹${chargeAmount}, Available: ₹${wallet.balance}`,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const balanceBefore = wallet.balance;
  const balanceAfter = balanceBefore - chargeAmount;

  // Deduct wallet balance
  await walletRepository.creditRefundToWallet(userId, -chargeAmount);

  // Record wallet DEBIT transaction
  await WalletTransaction.create({
    walletId: wallet._id,
    userId: booking.user,
    type: 'DEBIT',
    amount: chargeAmount,
    balanceBefore,
    balanceAfter,
    status: 'SUCCESS',
    source: 'BOOKING_PAYMENT',
    bookingId: booking._id,
    description: `Payment for booking ${booking.bookingId || booking._id} via Wallet`,
  });

  // Update booking state
  const targetStatus =
    booking.bookingScenario === BookingScenario.IMMEDIATE || booking.paymentStatus === PaymentStatus.DEPOSIT_PAID
      ? BookingStatus.CONFIRMED
      : BookingStatus.RESERVED;

  validateBookingStateTransition(booking.bookingStatus, targetStatus);

  booking.paymentMethod = PaymentMethod.WALLET;
  if (targetStatus === BookingStatus.CONFIRMED) {
    booking.bookingStatus = BookingStatus.CONFIRMED;
    booking.paymentStatus = PaymentStatus.PAID;
    booking.amountPaid = booking.totalAmount;
    booking.remainingBalance = 0;
  } else {
    booking.bookingStatus = BookingStatus.RESERVED;
    booking.paymentStatus = PaymentStatus.DEPOSIT_PAID;
    booking.amountPaid = chargeAmount;
    booking.remainingBalance = booking.totalAmount - chargeAmount;
  }

  await booking.save();
  return booking;
};

/**
 * Returns a cancellation refund quote preview before confirming cancellation.
 */
export const getCancellationQuoteService = async (userId: string, bookingId: string) => {
  const booking = await bookingRepo.findBookingById(bookingId);
  if (!booking) {
    throw new AppError('Booking not found', HTTP_STATUS.NOT_FOUND);
  }
  if (booking.user._id.toString() !== userId) {
    throw new AppError('Unauthorized access to booking', HTTP_STATUS.FORBIDDEN);
  }

  const now = new Date();
  const eventStartTime = new Date(booking.startDateTime);
  const daysUntilEvent = (eventStartTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

  let refundFactor = 0;
  let isCancellable = false;
  if (daysUntilEvent >= 14) {
    refundFactor = 1.0;
    isCancellable = true;
  } else if (daysUntilEvent >= 7) {
    refundFactor = 0.5;
    isCancellable = true;
  }

  const amountPaid = booking.amountPaid || 0;
  const estimatedRefundAmount = Math.round(amountPaid * refundFactor);

  return {
    bookingId: booking._id,
    daysUntilEvent: Math.round(daysUntilEvent * 10) / 10,
    refundFactor,
    refundPercentage: refundFactor * 100,
    amountPaid,
    estimatedRefundAmount,
    isCancellable,
  };
};

/**
 * Empowers Admin to force-cancel any booking during guest disputes or venue emergencies,
 * with mandatory audit logging and custom wallet refund capabilities.
 */
export const adminForceCancelBookingService = async (
  adminId: string,
  bookingId: string,
  reason: string,
  refundPercentage: number = 100
) => {
  const booking = await bookingRepo.findBookingById(bookingId);
  if (!booking) {
    throw new AppError('Booking not found', HTTP_STATUS.NOT_FOUND);
  }
  
  validateBookingStateTransition(booking.bookingStatus, BookingStatus.CANCELLED);

  const factor = Math.max(0, Math.min(100, refundPercentage)) / 100;
  const amountPaid = booking.amountPaid || 0;
  const refundAmount = Math.round(amountPaid * factor);

  booking.bookingStatus = BookingStatus.CANCELLED;
  (booking as any).cancellationType = CancellationType.ADMIN;
  (booking as any).cancellationReason = reason || 'Admin forced cancellation';
  (booking as any).refundAmount = refundAmount;

  if (refundAmount > 0) {
    (booking as any).refundStatus = RefundStatus.COMPLETED;
    // Credit refund to user's wallet
    await walletRepository.creditRefundToWallet(booking.user._id.toString(), refundAmount);

    const wallet = await walletRepository.getOrCreateByUserId(booking.user._id.toString());
    await WalletTransaction.create({
      walletId: wallet._id,
      userId: booking.user._id,
      type: 'CREDIT',
      amount: refundAmount,
      balanceBefore: wallet.balance - refundAmount,
      balanceAfter: wallet.balance,
      status: 'SUCCESS',
      source: 'REFUND',
      bookingId: booking._id,
      description: `Admin forced refund for booking ${booking.bookingId || booking._id} (${refundPercentage}%)`,
    });
  } else {
    (booking as any).refundStatus = RefundStatus.NOT_ELIGIBLE;
  }

  await booking.save();

  // Log action in AdminAuditLog
  await logAdminAction(adminId, 'FORCE_CANCEL_BOOKING', 'BOOKING', bookingId, reason, {
    refundPercentage,
    refundAmount,
  });

  return booking;
};
