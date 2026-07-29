import cron from 'node-cron';
import Booking from '../models/booking.model';
import { BookingStatus, PaymentStatus, validateBookingStateTransition } from '../constants/booking';
import { SettlementStatus } from '../constants/settlement';
import logger from '../libs/logger';

export const startAutoCompletionJob = () => {
  // Runs every hour at the top of the hour
  cron.schedule('0 * * * *', async () => {
    logger.info('[AutoCompletion] Running auto-completion job for past checkout bookings...');

    try {
      // Find CONFIRMED bookings whose endDateTime was more than 12 hours ago
      const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

      const eligibleBookings = await Booking.find({
        bookingStatus: BookingStatus.CONFIRMED,
        endDateTime: { $lt: twelveHoursAgo },
      });

      if (eligibleBookings.length === 0) {
        logger.info('[AutoCompletion] No eligible bookings for auto-completion.');
        return;
      }

      logger.info(`[AutoCompletion] Found ${eligibleBookings.length} bookings to auto-complete.`);

      for (const booking of eligibleBookings) {
        try {
          validateBookingStateTransition(booking.bookingStatus, BookingStatus.COMPLETED);
          booking.bookingStatus = BookingStatus.COMPLETED;
          booking.paymentStatus = PaymentStatus.PAID;
          booking.amountPaid = booking.totalAmount;
          booking.settlementStatus = SettlementStatus.PENDING;
          await booking.save();
          logger.info(`[AutoCompletion] Auto-completed booking ${booking._id} (${booking.bookingId})`);
        } catch (err) {
          logger.error(
            `[AutoCompletion] Failed to auto-complete booking ${booking._id}: ${err instanceof Error ? err.message : 'Unknown error'}`
          );
        }
      }
    } catch (err) {
      logger.error(
        `[AutoCompletion] Job failed: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    }
  });
};
