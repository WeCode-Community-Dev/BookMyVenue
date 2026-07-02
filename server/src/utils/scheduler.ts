import { startAutoCancellationJob } from '../jobs/autoCancellation.job';
import { startRefundRecoveryJob } from '../jobs/refundRecovery.job';
import logger from '@/libs/logger';

export const startScheduler = () => {
  startAutoCancellationJob();
  startRefundRecoveryJob();
  logger.info('Scheduler: Started auto-cancellation and refund-recovery jobs.');
};
