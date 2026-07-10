import cron from 'node-cron';
import mongoose from 'mongoose';
import Booking from '../models/booking.model';
import { BookingStatus, CancellationType, RefundStatus } from '../constants/booking';
import logger from '../libs/logger';

export const startAutoCancellationJob = () => {
  cron.schedule('*/15 * * * *', async () => {
    logger.info('Running Auto Cancellation Scheduler...');

    try {
      const now = new Date();

      // Find bookings that are RESERVED and payment deadline has passed
      const expiredBookings = await Booking.find({
        bookingStatus: BookingStatus.RESERVED,
        remainingPaymentDueDate: { $lt: now, $ne: null },
      });

      if (expiredBookings.length === 0) {
        return;
      }

      logger.info(`Found ${expiredBookings.length} bookings for auto-cancellation.`);

      for (const booking of expiredBookings) {
        const session = await mongoose.startSession();
        try {
          session.startTransaction();

          // Revalidate booking
          const activeBooking = await Booking.findOne({
            _id: booking._id,
            bookingStatus: BookingStatus.RESERVED,
            remainingPaymentDueDate: { $lt: new Date(), $ne: null },
          }).session(session);

          if (!activeBooking) {
            logger.warn(`Booking ${booking._id} is no longer eligible for auto-cancellation (maybe paid or already cancelled).`);
            await session.abortTransaction();
            continue;
          }

          // Cancel the booking
          activeBooking.bookingStatus = BookingStatus.CANCELLED;
          activeBooking.cancellationType = CancellationType.SYSTEM;
          activeBooking.refundStatus = RefundStatus.NOT_ELIGIBLE; // System cancellation = no refund
          activeBooking.cancelledAt = new Date();
          activeBooking.cancellationReason = 'System Auto-cancellation: Payment deadline expired';

          await activeBooking.save({ session });

          // Commit transaction
          await session.commitTransaction();
          logger.info(`Successfully auto-cancelled booking ${booking._id}`);

        } catch (error) {
          await session.abortTransaction();
          logger.error(`Failed to auto-cancel booking ${booking._id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
          session.endSession();
        }
      }
    } catch (error) {
      logger.error(`Auto Cancellation Scheduler failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });
};
