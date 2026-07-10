import cron from 'node-cron';
import { RefundStatus } from '../constants/booking';
import { processRefund } from '../services/refund.service';
import logger from '../libs/logger';
import { findFailedRefundBookings } from '@/repositories/booking.repository';

/**
 * Retries refunds for bookings that are:
 * - FAILED   : processRefund() ran but hit an unexpected error
 *
 * PROCESSING is intentionally excluded — an active transaction may still be running.
 */
export const startRefundRecoveryJob = () => {
  cron.schedule('0 * * * *', async () => {
    logger.info('Running Refund Recovery Job...');

    try {
      const failedBookingRefunds = await findFailedRefundBookings();

      if (failedBookingRefunds.length === 0) {
        return;
      }

      logger.info(`Refund Recovery: Found ${failedBookingRefunds.length} booking(s) to retry.`);

      for (const booking of failedBookingRefunds) {
        const bookingId = String(booking._id);
        try {


          await processRefund(bookingId, booking.refundStatus as RefundStatus);
          logger.info(`Refund Recovery: Successfully retried refund for booking ${bookingId}`);
        } catch (err) {

          const errorMsg = err instanceof Error ? err.message : 'Unknown error';
          logger.error(`Refund Recovery: Failed to retry refund for booking ${bookingId}: ${errorMsg}`);
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      logger.error(`Refund Recovery Job failed: ${errorMsg}`);
    }
  });

  logger.info('Scheduler: Started Refund Recovery Job (runs every hour).');
};
