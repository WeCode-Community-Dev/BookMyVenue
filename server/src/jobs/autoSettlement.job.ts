import cron from 'node-cron';
import Booking from '../models/booking.model';
import { BookingStatus, PaymentStatus } from '../constants/booking';
import { SettlementStatus } from '../constants/settlement';
import { processSettlement } from '../services/settlement.service';
import logger from '../libs/logger';

export const startAutoSettlementJob = () => {
  // Runs every hour at the top of the hour
  cron.schedule('0 * * * *', async () => {
    logger.info('[AutoSettlement] Running auto-settlement job...');

    try {
      // Settle bookings COMPLETED + PAID + PENDING that have been waiting > 1 hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

      const eligibleBookings = await Booking.find({
        bookingStatus: BookingStatus.COMPLETED,
        paymentStatus: PaymentStatus.PAID,
        settlementStatus: SettlementStatus.PENDING,
        updatedAt: { $lt: oneHourAgo },
      }).select('_id');

      if (eligibleBookings.length === 0) {
        logger.info('[AutoSettlement] No eligible bookings for settlement.');
        return;
      }

      logger.info(`[AutoSettlement] Found ${eligibleBookings.length} bookings to settle.`);

      for (const booking of eligibleBookings) {
        try {
          await processSettlement(booking._id.toString(), 'SYSTEM');
          logger.info(`[AutoSettlement] Settled booking ${booking._id}`);
        } catch (err) {
          logger.error(
            `[AutoSettlement] Failed to settle booking ${booking._id}: ${err instanceof Error ? err.message : 'Unknown error'}`
          );
        }
      }
    } catch (err) {
      logger.error(
        `[AutoSettlement] Job failed: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    }
  });
};
