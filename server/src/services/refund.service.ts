import mongoose from 'mongoose';
import Booking from '../models/booking.model';
import { Wallet } from '../models/wallet.model';
import { WalletTransaction } from '../models/walletTransaction.model';
import { RefundStatus } from '../constants/booking';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/http';
import logger from '../libs/logger';
import { updateRefundBookingStatus } from '@/repositories/booking.repository';

export const processRefund = async (bookingId: string, refundStatus: RefundStatus) => {
  const session = await mongoose.startSession();

  let refundContext = { bookingId, userId: 'unknown', refundAmount: 0 };

  try {
    session.startTransaction();

    //Update booking status
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

    //Prevent duplication
    const existingTransaction = await WalletTransaction.findOne(
      { bookingId: booking._id, source: 'REFUND' },
      null,
      { session }
    );

    if (existingTransaction) {
      throw new AppError('Refund transaction already exists for this booking', HTTP_STATUS.CONFLICT);
    }

    // Atomic wallet updation
    const wallet = await Wallet.findOneAndUpdate(
      { userId: booking.user },
      { $inc: { balance: booking.refundAmount } },
      { session, new: true }
    );

    if (!wallet) {
      throw new AppError('User wallet not found', HTTP_STATUS.NOT_FOUND);
    }

    const balanceAfter = wallet.balance;
    const balanceBefore = balanceAfter - booking.refundAmount;

    //create wallet
    await WalletTransaction.create(
      [
        {
          walletId: wallet._id,
          userId: booking.user,
          type: 'CREDIT',
          amount: booking.refundAmount,
          balanceBefore,
          balanceAfter,
          status: 'SUCCESS',
          source: 'REFUND',
          bookingId: booking._id,
          description: 'Refund for cancelled booking',
        },
      ],
      { session }
    );


    const finalized = await Booking.findOneAndUpdate(
      { _id: booking._id, refundStatus: RefundStatus.PROCESSING },
      { refundStatus: RefundStatus.COMPLETED },
      { session, new: true }
    );

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
      await Booking.findOneAndUpdate(
        { _id: bookingId, refundStatus: RefundStatus.PROCESSING },
        { refundStatus: RefundStatus.FAILED }
      ); 
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
