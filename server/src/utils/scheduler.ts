import { startAutoCancellationJob } from '../jobs/autoCancellation.job';
import { startRefundRecoveryJob } from '../jobs/refundRecovery.job';
import { startAutoSettlementJob } from '../jobs/autoSettlement.job';
import logger from '@/libs/logger';

export const startScheduler = () => {
  startAutoCancellationJob();
  startRefundRecoveryJob();
  startAutoSettlementJob();
  logger.info('Scheduler: Started auto-cancellation, refund-recovery, and auto-settlement jobs.');
};
