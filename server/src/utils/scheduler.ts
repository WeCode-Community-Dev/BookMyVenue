import { startAutoCancellationJob } from '../jobs/autoCancellation.job';
import { startRefundRecoveryJob } from '../jobs/refundRecovery.job';
import { startAutoSettlementJob } from '../jobs/autoSettlement.job';
import { startAutoCompletionJob } from '../jobs/autoCompletion.job';
import logger from '@/libs/logger';

export const startScheduler = () => {
  startAutoCancellationJob();
  startRefundRecoveryJob();
  startAutoSettlementJob();
  startAutoCompletionJob();
  logger.info('Scheduler: Started auto-cancellation, refund-recovery, auto-settlement, and auto-completion jobs.');
};
