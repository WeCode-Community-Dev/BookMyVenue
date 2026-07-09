import mongoose from 'mongoose';
import Booking from '@/models/booking.model';
import { BookingStatus, PaymentStatus } from '@/constants/booking';
import { SettlementStatus, PLATFORM_FEE_PERCENTAGE } from '@/constants/settlement';
import * as settlementRepo from '@/repositories/settlement.repository';
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

    // 3. Calculate amounts
    const totalAmount = booking.totalAmount;
    const platformFee = Math.round(totalAmount * PLATFORM_FEE_PERCENTAGE * 100) / 100;
    const ownerEarnings = Math.round((totalAmount - platformFee) * 100) / 100;

    const venue = booking.venue as any;
    const ownerId = venue?.ownerId;
    if (!ownerId) {
      throw new AppError('Cannot determine venue owner for settlement', HTTP_STATUS.SERVER_ERROR);
    }

    // 4. Create settlement record (PROCESSING)
    const settlement = await settlementRepo.createSettlement(
      {
        bookingId: booking._id,
        venueId: venue._id,
        ownerId,
        totalBookingAmount: totalAmount,
        platformFee,
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

    // 6. Finalize to SETTLED (outside transaction for safety)
    try {
      await settlementRepo.updateSettlementStatus(settlement._id.toString(), SettlementStatus.SETTLED);
      await Booking.findByIdAndUpdate(bookingId, { settlementStatus: SettlementStatus.SETTLED });

      logger.info(
        `[Settlement] Booking ${bookingId} settled by ${settledBy}. Owner: ₹${ownerEarnings}, Platform: ₹${platformFee}`
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
