import { HTTP_STATUS } from '@/constants/http';
import { MESSAGES } from '@/constants/messages';
import { AppError } from '@/utils/AppError';
import success from '@/utils/response';
import { NextFunction, Request, Response } from 'express';
import {
  createBookingService,
  getBookingByVenueId,
  verifyAndConfirmDepositService,
  cancelBookingService,
  deleteBookingService,
  payBalanceService,
  verifyBalancePaymentService,
  calculateQuoteService,
  getBookingByIdService,
} from '@/services/booking.service';
import { createOrder as createRazorpayOrder } from '@/services/razorpay.service';
import { CreateBookingPayload } from '@/types/booking.types';

// POST /bookings/quote
export const getBookingQuote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { venueId, startDateTime, endDateTime } = req.body;
    if (!venueId || !startDateTime || !endDateTime) {
      throw new AppError(
        'venueId, startDateTime, and endDateTime are required',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const quote = await calculateQuoteService(venueId, startDateTime, endDateTime);
    success(res, HTTP_STATUS.OK, quote, 'Quote calculated successfully');
  } catch (error) {
    next(error);
  }
};

// POST /bookings
export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError(MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);

    const payload: CreateBookingPayload = req.body;

    // Service returns booking + the amount to charge via Razorpay
    const { booking, razorpayChargeAmount } = await createBookingService(userId, payload);

    // Create Razorpay order for the charge amount (deposit or full)
    const orderDetails = await createRazorpayOrder(razorpayChargeAmount, booking._id.toString());

    success(res, HTTP_STATUS.CREATED, { payment: orderDetails, booking }, 'Booking created');
  } catch (error) {
    next(error);
  }
};

// POST /bookings/verify-payment
export const verifyPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError(MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, bookingId } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !bookingId) {
      throw new AppError('Missing payment verification details', HTTP_STATUS.BAD_REQUEST);
    }

    const booking = await verifyAndConfirmDepositService(
      userId,
      bookingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    success(res, HTTP_STATUS.OK, booking, 'Payment verified and booking confirmed');
  } catch (error) {
    next(error);
  }
};

// POST /bookings/pay-balance
export const payBalance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError(MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);

    const { bookingId } = req.body;
    if (!bookingId) {
      throw new AppError('Booking ID is required', HTTP_STATUS.BAD_REQUEST);
    }

    const { booking, razorpayChargeAmount } = await payBalanceService(userId, bookingId);

    // Create Razorpay order for the remaining balance
    const orderDetails = await createRazorpayOrder(
      razorpayChargeAmount,
      `${booking._id.toString()}-balance`
    );

    success(
      res,
      HTTP_STATUS.OK,
      { payment: orderDetails, booking },
      'Balance payment order created'
    );
  } catch (error) {
    next(error);
  }
};

// POST /bookings/verify-balance
export const verifyBalancePayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError(MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, bookingId } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !bookingId) {
      throw new AppError('Missing payment verification details', HTTP_STATUS.BAD_REQUEST);
    }

    const booking = await verifyBalancePaymentService(
      userId,
      bookingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    success(res, HTTP_STATUS.OK, booking, 'Balance payment verified and booking confirmed');
  } catch (error) {
    next(error);
  }
};

// DELETE /bookings/:bookingId
// Deletes a PENDING (unpaid) booking to free the slot.
// Called on: payment failure, modal close without payment, or explicit user cancellation.
export const deleteBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError(MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);

    const { bookingId } = req.params;
    if (!bookingId || typeof bookingId !== 'string') {
      throw new AppError('Invalid Booking ID parameter', HTTP_STATUS.BAD_REQUEST);
    }

    await deleteBookingService(userId, bookingId);

    success(res, HTTP_STATUS.OK, null, 'Booking deleted successfully');
  } catch (error) {
    next(error);
  }
};

// GET /bookings/venues/:venueId
export const getBookingAvailability = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { venueId } = req.params;
    if (!venueId) throw new AppError('Venue id is required', HTTP_STATUS.BAD_REQUEST);
    const bookings = await getBookingByVenueId(venueId as string);
    success(res, HTTP_STATUS.OK, bookings, 'Bookings Fetched');
  } catch (error) {
    next(error);
  }
};

// PATCH /bookings/:bookingId/cancel
export const cancelBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id as string;

    const bookingId = req.params.bookingId as string;
    const { reason } = req.body;
    
    if (!reason) {
      throw new AppError('Cancellation reason is required', HTTP_STATUS.BAD_REQUEST);
    }

    await cancelBookingService(userId, bookingId, reason);

    success(res, HTTP_STATUS.OK, null, 'Booking cancelled successfully');
  }catch(error){
    next(error);
  }
}
// GET /bookings/:bookingId
export const getBookingById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError(MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);

    const { bookingId } = req.params;
    if (!bookingId || typeof bookingId !== 'string') {
      throw new AppError('Invalid Booking ID parameter', HTTP_STATUS.BAD_REQUEST);
    }

    const booking = await getBookingByIdService(userId, bookingId);
    success(res, HTTP_STATUS.OK, booking, 'Booking fetched successfully');
  } catch (error) {
    next(error);
  }
};
