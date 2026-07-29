import mongoose from 'mongoose';
import Booking from '@/models/booking.model';
import Owner from '@/models/owner.model';
import { BookingStatus, PaymentStatus } from '@/constants/booking';
import { SettlementStatus, PLATFORM_FEE_PERCENTAGE } from '@/constants/settlement';
import * as settlementRepo from '@/repositories/settlement.repository';
import { walletRepository } from '@/repositories/wallet.repository';
import { AppError } from '@/utils/AppError';
import { HTTP_STATUS } from '@/constants/http';
import logger from '@/libs/logger';

/**
 * Core settlement processor — called by both admin manual release and the cron job.
 * Uses a Mongo transaction to ensure atomicity.
 */
export const processSettlement = async (
  bookingId: string,
  settledBy: 'ADMIN' | 'SYSTEM'
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1. Find and validate the booking
    const booking = await Booking.findById(bookingId)
      .populate('venue', 'ownerId _id')
      .session(session);

    if (!booking) {
      throw new AppError('Booking not found', HTTP_STATUS.NOT_FOUND);
    }
    if (booking.bookingStatus !== BookingStatus.COMPLETED) {
      throw new AppError('Booking must be COMPLETED before settlement', HTTP_STATUS.BAD_REQUEST);
    }
    if (booking.paymentStatus !== PaymentStatus.PAID) {
      throw new AppError('Booking must be fully PAID before settlement', HTTP_STATUS.BAD_REQUEST);
    }
    if (
      booking.settlementStatus === SettlementStatus.SETTLED ||
      booking.settlementStatus === SettlementStatus.PROCESSING
    ) {
      throw new AppError('Settlement already processed or in progress', HTTP_STATUS.CONFLICT);
    }

    // 2. Idempotency check
    const existing = await settlementRepo.findSettlementByBookingId(bookingId);
    if (existing) {
      throw new AppError('Settlement already exists for this booking', HTTP_STATUS.CONFLICT);
    }

    // 3. Calculate amounts (12% platform fee + 1% statutory TDS tax deduction)
    const totalAmount = booking.totalAmount;
    const platformFee = Math.round(totalAmount * PLATFORM_FEE_PERCENTAGE * 100) / 100;
    const tdsAmount = Math.round(totalAmount * 0.01 * 100) / 100; // 1% statutory TDS
    const ownerEarnings = Math.round((totalAmount - platformFee - tdsAmount) * 100) / 100;

    const venue = booking.venue as any;
    const ownerId = venue?.ownerId;
    if (!ownerId) {
      throw new AppError('Cannot determine venue owner for settlement', HTTP_STATUS.SERVER_ERROR);
    }

    const ownerDoc = await Owner.findOne({ userId: ownerId });
    if (ownerDoc && ownerDoc.isPayoutFrozen) {
      throw new AppError(
        'Settlement cannot be processed because owner payouts are currently frozen under investigation',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // 4. Create settlement record (PROCESSING)
    const settlement = await settlementRepo.createSettlement(
      {
        bookingId: booking._id,
        venueId: venue._id,
        ownerId,
        totalBookingAmount: totalAmount,
        platformFee,
        tdsAmount,
        ownerEarnings,
        status: SettlementStatus.PROCESSING,
        settledBy,
      } as any,
      session
    );

    // 5. Mark booking as PROCESSING
    await Booking.findByIdAndUpdate(
      bookingId,
      { settlementStatus: SettlementStatus.PROCESSING },
      { session }
    );

    await session.commitTransaction();

    // 6. Finalize to SETTLED and credit Owner Wallet (outside transaction for safety)
    try {
      await settlementRepo.updateSettlementStatus(settlement._id.toString(), SettlementStatus.SETTLED);
      await Booking.findByIdAndUpdate(bookingId, { settlementStatus: SettlementStatus.SETTLED });

      // Execute actual wallet credit to owner
      const ownerWallet = await walletRepository.getOrCreateByUserId(ownerId.toString());
      const balanceBefore = ownerWallet.balance;
      const balanceAfter = balanceBefore + ownerEarnings;
      await walletRepository.creditToWallet(ownerId.toString(), ownerEarnings);
      await walletRepository.createPayoutTransaction({
        walletId: ownerWallet._id as any,
        userId: ownerId as any,
        amount: ownerEarnings,
        balanceBefore,
        balanceAfter,
        bookingId: booking._id as any,
        description: `Settlement payout for booking ${booking.bookingId || booking._id}`,
      });

      logger.info(
        `[Settlement] Booking ${bookingId} settled by ${settledBy}. Owner wallet credited ₹${ownerEarnings}, Platform Fee: ₹${platformFee}`
      );

      return settlement;
    } catch (finalErr) {
      await settlementRepo.updateSettlementStatus(settlement._id.toString(), SettlementStatus.FAILED);
      await Booking.findByIdAndUpdate(bookingId, { settlementStatus: SettlementStatus.FAILED });
      logger.error(`[Settlement] Finalization failed for booking ${bookingId}`);
      throw new AppError('Settlement finalization failed', HTTP_STATUS.SERVER_ERROR);
    }
  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

export const getPendingSettlements = (page: number, limit: number) =>
  settlementRepo.findPendingSettlements(page, limit);

export const getOwnerSettlements = (ownerId: string, page: number, limit: number) =>
  settlementRepo.findSettlementsByOwner(ownerId, page, limit);

export const getOwnerRevenueStats = (ownerId: string) =>
  settlementRepo.getOwnerRevenueStats(ownerId);
