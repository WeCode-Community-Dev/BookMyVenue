import * as bannedUserService from '../modules/moderation/bannedUser.service';
import { logInfo, logError } from '../utils/logger';

const POLL_INTERVAL_MS = 60000; // 1 minute
let banExpiryInterval: ReturnType<typeof setInterval> | null = null;

async function processExpiredBans(): Promise<void> {
  try {
    const expiredCount = await bannedUserService.expireActiveBans();
    if (expiredCount > 0) {
      logInfo('Ban expiry worker', { message: `Expired ${String(expiredCount)} ban records` });
    }
  } catch (err) {
    const error = err as Error;
    logError('Ban expiry worker: failed to process expired bans', {
      module: 'banExpiry.worker.ts/processExpiredBans',
      error: error.message,
    });
  }
}

export function startBanExpiryWorker(): void {
  if (banExpiryInterval) {
    logInfo('Ban expiry worker already running');
    return;
  }

  logInfo('Starting ban expiry worker');
  banExpiryInterval = setInterval(() => {
    processExpiredBans().catch((err: unknown) => {
      logError('Unexpected error in ban expiry worker', {
        module: 'banExpiry.worker.ts',
        error: err instanceof Error ? err.message : String(err),
      });
    });
  }, POLL_INTERVAL_MS);
}

export function stopBanExpiryWorker(): void {
  if (banExpiryInterval) {
    clearInterval(banExpiryInterval);
    banExpiryInterval = null;
    logInfo('Ban expiry worker stopped');
  }
}
