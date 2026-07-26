import type { Request, Response } from 'express';
import { Types } from 'mongoose';
import { ResponseUtil } from '../../utils/responseUtils';
import { logError } from '../../utils/logger';
import * as workflow from './booking.workflow';
import * as service from './booking.service';
import type { BookingStatusType } from '../../constants/booking.constants';
import { verifyPaymentSignature } from '../../services/razorpay.service';
import { getUserReviewedBookings } from '../review/review.service';
import { findVenueById } from '../venue/venue.repository';
import type {
  BlockSlotBodyDTO,
  CheckoutBodyDTO,
  SaveBookerDetailsBodyDTO,
  VerifyPaymentBodyDTO,
  VenueIdParamDTO,
  AdminBookingFiltersDTO,
} from './booking.validator';

export const blockSlot = async (req: Request, res: Response): Promise<void> => {
  try {
    const validated = req.validated;
    if (!validated) {
      ResponseUtil.badRequest(res, 'Validation failed');
      return;
    }
    const { id: venueId } = validated.params as VenueIdParamDTO;
    const { date, selectedSlots, expectedPrice } = validated.body as BlockSlotBodyDTO;
    const userId = req.user?.userId;

    if (!userId) {
      ResponseUtil.unauthorized(res, 'User identity not found in token');
      return;
    }

    // Guard: only Approved, active, non-deleted venues accept slot locks.
    // Return 404 (not 403) to avoid leaking existence of non-public venues.
    const venue = await findVenueById(venueId);
    if (!venue || !venue.active || venue.status !== 'Approved' || venue.deleted) {
      ResponseUtil.notFound(res, 'Venue not found');
      return;
    }

    const sessionToken = req.headers['x-session-token'] as string | undefined;

    const result = await workflow.blockSlotWorkflow(
      venueId,
      userId,
      date,
      expectedPrice,
      selectedSlots,
      sessionToken
    );

    ResponseUtil.success(res, 'Slot locked successfully. Proceed to checkout.', result);
  } catch (err) {
    const error = err as Error;
    if (error.message.includes('not found') || error.message.includes('unavailable')) {
      ResponseUtil.notFound(res, error.message);
    } else if (
      error.message.includes('no longer available') ||
      error.message.includes('Someone else is booking')
    ) {
      ResponseUtil.conflict(res, error.message);
    } else if (error.message.includes('Invalid') || error.message.includes('mismatch')) {
      ResponseUtil.badRequest(res, error.message);
    } else {
      logError('blockSlot controller error', {
        module: 'booking.controller.ts/blockSlot',
        error: error.message,
      });
      ResponseUtil.internalServerError(res, 'Failed to acquire slot lock. Please try again.');
    }
  }
};

export const saveBookerDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const validated = req.validated;
    if (!validated) {
      ResponseUtil.badRequest(res, 'Validation failed');
      return;
    }
    const { lockId, guestCount, eventType, bookerInfo } =
      validated.body as SaveBookerDetailsBodyDTO;
    const userId = req.user?.userId;

    if (!userId) {
      ResponseUtil.unauthorized(res, 'User identity not found in token');
      return;
    }

    await workflow.saveBookerDetailsWorkflow(lockId, userId, guestCount, eventType, bookerInfo);

    ResponseUtil.success(res, 'Booker details saved successfully.');
  } catch (err) {
    const error = err as Error;
    if (error.message.includes('expired')) {
      ResponseUtil.badRequest(res, error.message);
    } else {
      logError('saveBookerDetails controller error', {
        module: 'booking.controller.ts/saveBookerDetails',
        error: error.message,
      });
      ResponseUtil.internalServerError(res, 'Failed to save booker details. Please try again.');
    }
  }
};

export const initCheckout = async (req: Request, res: Response): Promise<void> => {
  try {
    const validated = req.validated;
    if (!validated) {
      ResponseUtil.badRequest(res, 'Validation failed');
      return;
    }
    const { lockId } = validated.body as CheckoutBodyDTO;
    const userId = req.user?.userId;

    if (!userId) {
      ResponseUtil.unauthorized(res, 'User identity not found in token');
      return;
    }

    const result = await workflow.initCheckoutWorkflow(userId, lockId);

    ResponseUtil.success(res, 'Checkout order created successfully.', result);
  } catch (err) {
    const error = err as Error;
    if (error.message.includes('expired') || error.message.includes('Insufficient')) {
      ResponseUtil.badRequest(res, error.message);
    } else {
      logError('initCheckout controller error', {
        module: 'booking.controller.ts/initCheckout',
        error: error.message,
      });
      ResponseUtil.internalServerError(res, 'Failed to create checkout order. Please try again.');
    }
  }
};

export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId, paymentId, signature } = req.validated?.body as VerifyPaymentBodyDTO;

    const isAuthentic = verifyPaymentSignature({
      orderId,
      paymentId,
      signature,
    });

    if (!isAuthentic) {
      ResponseUtil.badRequest(res, 'Invalid payment signature');
      return;
    }

    const booking = await service.getBookingByPaymentReference(paymentId);
    if (booking) {
      const bookingRef = `BMV-${booking._id.toString().slice(-6).toUpperCase()}`;
      ResponseUtil.success(res, 'Payment verified successfully', {
        _id: booking._id.toString(),
        bookingRef,
      });
    } else {
      ResponseUtil.success(res, 'Payment verified successfully');
    }
  } catch (err) {
    const error = err as Error;
    logError('verifyPayment controller error', {
      module: 'booking.controller.ts/verifyPayment',
      error: error.message,
    });
    ResponseUtil.internalServerError(res, 'Failed to verify payment');
  }
};

export const releaseLock = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const sessionToken = req.headers['x-session-token'] as string | undefined;

    await workflow.releaseLockWorkflow(userId, sessionToken);

    ResponseUtil.success(res, 'Lock released successfully');
  } catch (err) {
    const error = err as Error;
    logError('releaseLock controller error', {
      module: 'booking.controller.ts/releaseLock',
      error: error.message,
    });
    ResponseUtil.internalServerError(res, 'Failed to release lock');
  }
};

export const getMyBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      ResponseUtil.unauthorized(res, 'User identity not found in token');
      return;
    }

    const [bookingsResult, reviewedBookingIds] = await Promise.all([
      service.getMyBookings(userId),
      getUserReviewedBookings(userId),
    ]);

    // Merge hasReview flag into completed bookings
    const result = {
      ...bookingsResult,
      bookings: {
        ...bookingsResult.bookings,
        completed: bookingsResult.bookings.completed.map((booking: Record<string, unknown>) => ({
          ...booking,
          hasReview: reviewedBookingIds.has(booking._id as string),
        })),
      },
    };

    ResponseUtil.success(res, 'My bookings retrieved successfully', result);
  } catch (err) {
    const error = err as Error;
    logError('fetchMyBookings controller error', {
      module: 'booking.controller.ts/fetchMyBookings',
      error: error.message,
    });
    ResponseUtil.internalServerError(res, 'Failed to fetch your bookings.');
  }
};

export const getBookingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      ResponseUtil.unauthorized(res, 'User identity not found in token');
      return;
    }

    const bookingId = req.params.bookingRefId as string;
    const isBookingRef = bookingId.toUpperCase().startsWith('BMV-') && bookingId.length === 10;
    if (!Types.ObjectId.isValid(bookingId) && !isBookingRef) {
      ResponseUtil.badRequest(res, 'Invalid booking ID or reference');
      return;
    }

    const booking = await service.getBookingById(bookingId, userId);
    if (!booking) {
      ResponseUtil.notFound(res, 'Booking not found');
      return;
    }

    ResponseUtil.success(res, 'Booking details retrieved successfully', booking);
  } catch (err) {
    const error = err as Error;
    logError('getBookingById controller error', {
      module: 'booking.controller.ts/getBookingById',
      error: error.message,
    });
    ResponseUtil.internalServerError(res, 'Failed to fetch booking details.');
  }
};

export const cancelBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      ResponseUtil.unauthorized(res, 'User identity not found in token');
      return;
    }

    const bookingId = req.params.bookingRefId as string;
    const reason = (req.body as { reason?: string }).reason;
    const isBookingRef = bookingId.toUpperCase().startsWith('BMV-') && bookingId.length === 10;
    if (!Types.ObjectId.isValid(bookingId) && !isBookingRef) {
      ResponseUtil.badRequest(res, 'Invalid booking ID or reference');
      return;
    }

    await workflow.cancelBookingWorkflow(userId, bookingId, reason);

    ResponseUtil.success(res, 'Booking cancelled successfully');
  } catch (err) {
    const error = err as Error;
    if (error.message.includes('not found')) {
      ResponseUtil.notFound(res, error.message);
    } else if (error.message.includes('already been cancelled')) {
      ResponseUtil.conflict(res, error.message);
    } else if (
      error.message.includes('Cannot') ||
      error.message.includes('Only confirmed') ||
      error.message.includes('Cancellation window')
    ) {
      ResponseUtil.badRequest(res, error.message);
    } else {
      logError('cancelBooking controller error', {
        module: 'booking.controller.ts/cancelBooking',
        error: error.message,
      });
      ResponseUtil.internalServerError(res, 'Failed to cancel booking. Please try again.');
    }
  }
};

export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, venueId } = req.validated?.query as AdminBookingFiltersDTO;
    const paginationParams = req.pagination ?? { page: 1, limit: 10, skip: 0, sort: '' };
    const result = await service.getAllBookings(paginationParams, {
      status: status as BookingStatusType | undefined,
      venueId,
    });

    ResponseUtil.paginated(
      res,
      'All bookings retrieved successfully',
      result.bookings,
      result.pagination,
      'bookings'
    );
  } catch (err) {
    const error = err as Error;
    logError('getAllBookings controller error', {
      module: 'booking.controller.ts/getAllBookings',
      error: error.message,
    });
    ResponseUtil.internalServerError(res, 'Failed to fetch all bookings.');
  }
};
