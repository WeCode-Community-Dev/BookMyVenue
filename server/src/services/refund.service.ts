import mongoose from 'mongoose';
import { RefundStatus } from '../constants/booking';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/http';
import logger from '../libs/logger';
import {
  updateRefundBookingStatus,
  finalizeRefundBooking,
  markRefundFailed,
} from '@/repositories/booking.repository';
import { walletRepository } from '@/repositories/wallet.repository';

export const processRefund = async (bookingId: string, refundStatus: RefundStatus) => {
  const session = await mongoose.startSession();

  let refundContext = { bookingId, userId: 'unknown', refundAmount: 0 };

  try {
    session.startTransaction();

    // Update booking status to PROCESSING
    const booking = await updateRefundBookingStatus(bookingId, refundStatus, session);

    if (!booking) {
      throw new AppError(
        'Booking not eligible for refund or refund already in progress',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // For logging
    refundContext = {
      bookingId: String(booking._id),
      userId: String(booking.user),
      refundAmount: booking.refundAmount,
    };

    if (booking.refundAmount <= 0) {
      throw new AppError('Refund amount must be greater than zero', HTTP_STATUS.BAD_REQUEST);
    }

    // Prevent duplication
    const existingTransaction = await walletRepository.findRefundTransaction(
      String(booking._id),
      session
    );

    if (existingTransaction) {
      throw new AppError('Refund transaction already exists for this booking', HTTP_STATUS.CONFLICT);
    }

    // Atomic wallet credit
    const wallet = await walletRepository.creditRefundToWallet(
      String(booking.user),
      booking.refundAmount,
      session
    );

    if (!wallet) {
      throw new AppError('User wallet not found', HTTP_STATUS.NOT_FOUND);
    }

    const balanceAfter = wallet.balance;
    const balanceBefore = balanceAfter - booking.refundAmount;

    // Create wallet transaction record
    await walletRepository.createRefundTransaction(
      {
        walletId: wallet._id as mongoose.Types.ObjectId,
        userId: booking.user as mongoose.Types.ObjectId,
        amount: booking.refundAmount,
        balanceBefore,
        balanceAfter,
        bookingId: booking._id as mongoose.Types.ObjectId,
      },
      session
    );

    const finalized = await finalizeRefundBooking(String(booking._id), session);

    if (!finalized) {
      throw new AppError(
        'Failed to finalize refund: booking state changed unexpectedly',
        HTTP_STATUS.SERVER_ERROR
      );
    }

    await session.commitTransaction();

    logger.info(`Refund processed successfully for booking ${refundContext.bookingId}`);
  } catch (error) {

    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    try {
      await markRefundFailed(bookingId);
      logger.warn(`Marked refund as FAILED for booking ${refundContext.bookingId}`);
    } catch (markErr) {
      const markErrorMsg = markErr instanceof Error ? markErr.message : 'Unknown error';
      logger.error(`Failed to mark booking refund as FAILED for booking ${refundContext.bookingId}: ${markErrorMsg}`);
    }

    throw error;
  } finally {
    session.endSession();
  }
};
