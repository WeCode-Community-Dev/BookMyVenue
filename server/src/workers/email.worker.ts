import { EmailTaskModel, type IEmailTask } from '../models/email-task.model';
import { emailService } from '../services/email.service';
import { EmailIntent, EmailTaskStatus, EmailConstants } from '../constants/email.constants';
import { logError, logWarn, logInfo } from '../utils/logger';

let isShuttingDown = false;
let pollingInterval: ReturnType<typeof setInterval> | null = null;
let activeTasks = 0;

const FIFTEEN_MIN_MS = 15 * 60 * 1000;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

async function dispatch(task: IEmailTask): Promise<void> {
  const { intent, recipient, metadata } = task;

  switch (intent) {
    case EmailIntent.PASSWORD_RESET: {
      const resetLink = metadata.resetLink;
      if (!resetLink) {
        throw new Error(`Missing resetLink in metadata for ${EmailIntent.PASSWORD_RESET} intent`);
      }
      const result = await emailService.sendPasswordResetEmail(recipient, resetLink);
      if (!result.success) {
        throw new Error('Failed to send password reset email via Resend');
      }
      break;
    }
    case EmailIntent.ADMIN_PASSWORD_RESET: {
      const { newPassword, username } = metadata;
      if (!newPassword || !username) {
        throw new Error(`Missing required metadata for ${EmailIntent.ADMIN_PASSWORD_RESET} intent`);
      }
      const result = await emailService.sendAdminPasswordResetEmail(
        recipient,
        newPassword,
        username
      );
      if (!result.success) {
        throw new Error('Failed to send admin password reset email via Resend');
      }
      break;
    }
    case EmailIntent.SECURITY_ALERT: {
      const result = await emailService.sendPasswordChangedEmail(recipient);
      if (!result.success) {
        throw new Error('Failed to send security alert email via Resend');
      }
      break;
    }
    case EmailIntent.BOOKING_CONFIRMATION: {
      const { venueName, date, startTime, endTime, amount, paymentReference } = metadata;
      if (!venueName || !date || !startTime || !endTime || !amount || !paymentReference) {
        throw new Error(
          `Missing required metadata fields for ${EmailIntent.BOOKING_CONFIRMATION} intent`
        );
      }
      const result = await emailService.sendBookingConfirmation(recipient, {
        venueName,
        date,
        startTime,
        endTime,
        amount: parseFloat(amount),
        paymentReference,
      });
      if (!result.success) {
        throw new Error('Failed to send booking confirmation email via Resend');
      }
      break;
    }
    case EmailIntent.BOOKING_REFUND: {
      const { venueName, date, startTime, endTime, amount, refundReference } = metadata;
      if (!venueName || !date || !startTime || !endTime || !amount || !refundReference) {
        throw new Error(
          `Missing required metadata fields for ${EmailIntent.BOOKING_REFUND} intent`
        );
      }
      const result = await emailService.sendRefundNotification(recipient, {
        venueName,
        date,
        startTime,
        endTime,
        amount: parseFloat(amount),
        refundReference,
      });
      if (!result.success) {
        throw new Error('Failed to send booking refund email via Resend');
      }
      break;
    }
    case EmailIntent.BOOKING_CANCELLATION: {
      const { venueName, date, timeRange, refundAmount, bookingRef } = metadata;
      if (!venueName || !date || !timeRange || !refundAmount || !bookingRef) {
        throw new Error(
          `Missing required metadata fields for ${EmailIntent.BOOKING_CANCELLATION} intent`
        );
      }
      const result = await emailService.sendBookingCancellationEmail(recipient, {
        venueName,
        date,
        timeRange,
        refundAmount: parseFloat(refundAmount),
        bookingRef,
      });
      if (!result.success) {
        throw new Error('Failed to send booking cancellation email via Resend');
      }
      break;
    }
    case EmailIntent.VENUE_APPROVED: {
      const { venueName } = metadata;
      if (!venueName) {
        throw new Error(`Missing venueName in metadata for ${EmailIntent.VENUE_APPROVED} intent`);
      }
      const result = await emailService.sendVenueApprovedEmail(recipient, venueName);
      if (!result.success) {
        throw new Error('Failed to send venue approved email via Resend');
      }
      break;
    }
    case EmailIntent.VENUE_REJECTED: {
      const { venueName, reason, editDeadline, submissionNumber } = metadata;
      if (!venueName || !reason || !editDeadline || !submissionNumber) {
        throw new Error(
          `Missing required metadata fields for ${EmailIntent.VENUE_REJECTED} intent`
        );
      }
      const result = await emailService.sendVenueRejectedEmail(
        recipient,
        venueName,
        reason,
        new Date(editDeadline),
        parseInt(submissionNumber, 10)
      );
      if (!result.success) {
        throw new Error('Failed to send venue rejected email via Resend');
      }
      break;
    }
    case EmailIntent.VENUE_SUSPENDED: {
      const { venueName, reason } = metadata;
      if (!venueName || !reason) {
        throw new Error(
          `Missing required metadata fields for ${EmailIntent.VENUE_SUSPENDED} intent`
        );
      }
      const result = await emailService.sendVenueSuspendedEmail(recipient, venueName, reason);
      if (!result.success) {
        throw new Error('Failed to send venue suspended email via Resend');
      }
      break;
    }
    case EmailIntent.VENUE_UNSUSPENDED: {
      const { venueName } = metadata;
      if (!venueName) {
        throw new Error(
          `Missing venueName in metadata for ${EmailIntent.VENUE_UNSUSPENDED} intent`
        );
      }
      const result = await emailService.sendVenueUnsuspendedEmail(recipient, venueName);
      if (!result.success) {
        throw new Error('Failed to send venue unsuspended email via Resend');
      }
      break;
    }
    case EmailIntent.VENUE_DEADLINE_EXTENDED: {
      const { venueName, newDeadline } = metadata;
      if (!venueName || !newDeadline) {
        throw new Error(
          `Missing required metadata fields for ${EmailIntent.VENUE_DEADLINE_EXTENDED} intent`
        );
      }
      const result = await emailService.sendVenueDeadlineExtendedEmail(
        recipient,
        venueName,
        new Date(newDeadline)
      );
      if (!result.success) {
        throw new Error('Failed to send venue deadline extended email via Resend');
      }
      break;
    }
    case EmailIntent.USER_BANNED: {
      const { scope, reason, expiresAt, venueName } = metadata;
      if (!scope || !reason) {
        throw new Error(`Missing required metadata fields for ${EmailIntent.USER_BANNED} intent`);
      }
      const result = await emailService.sendUserBannedEmail(recipient, {
        scope,
        reason,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        venueName: venueName || undefined,
      });
      if (!result.success) {
        throw new Error('Failed to send user banned email via Resend');
      }
      break;
    }
    case EmailIntent.USER_UNBANNED: {
      const result = await emailService.sendUserUnbannedEmail(recipient);
      if (!result.success) {
        throw new Error('Failed to send user unbanned email via Resend');
      }
      break;
    }
    case EmailIntent.REVIEW_REMOVED: {
      const { venueName, reason } = metadata;
      if (!venueName || !reason) {
        throw new Error(
          `Missing required metadata fields for ${EmailIntent.REVIEW_REMOVED} intent`
        );
      }
      const result = await emailService.sendReviewRemovedEmail(recipient, { venueName, reason });
      if (!result.success) {
        throw new Error('Failed to send review removed email via Resend');
      }
      break;
    }
    case EmailIntent.REVIEW_RESTORED: {
      const { venueName } = metadata;
      if (!venueName) {
        throw new Error(`Missing venueName in metadata for ${EmailIntent.REVIEW_RESTORED} intent`);
      }
      const result = await emailService.sendReviewRestoredEmail(recipient, venueName);
      if (!result.success) {
        throw new Error('Failed to send review restored email via Resend');
      }
      break;
    }
    default:
      throw new Error(`Unknown email intent: ${String(intent)}`);
  }
}

export async function processNextTask(): Promise<void> {
  if (isShuttingDown) return;

  const now = new Date();
  const staleCutoff = new Date(Date.now() - EmailConstants.STALE_CUTOFF_MS);
  const pid = process.pid.toString();

  try {
    const task = await EmailTaskModel.findOneAndUpdate(
      {
        status: EmailTaskStatus.PENDING,
        $or: [{ lockedAt: null }, { lockedAt: { $lt: staleCutoff } }],
        retryAfter: { $lte: now },
      },
      {
        $set: {
          status: EmailTaskStatus.QUEUED,
          workerId: pid,
          lockedAt: now,
        },
      },
      { returnDocument: 'after', writeConcern: { w: 'majority' } }
    );

    if (!task) return;

    activeTasks++;

    try {
      await dispatch(task);
      task.status = EmailTaskStatus.COMPLETED;
      // Completed tasks expire after 15 minutes
      task.lockedAt = null;
      task.deleteAt = new Date(Date.now() + FIFTEEN_MIN_MS);
      await task.save();
      logInfo(`Email task completed`, { taskId: task._id.toString() });
    } catch (e) {
      const error = e as Error;
      task.retries += 1;
      task.lastError = error.message;
      task.lockedAt = null; // Release lock so polling can re-acquire

      if (task.retries >= EmailConstants.MAX_RETRIES) {
        task.status = EmailTaskStatus.FAILED;
        // Failed tasks persist for 7 days for debugging
        task.deleteAt = new Date(Date.now() + SEVEN_DAYS_MS);
        logError(`Email task failed permanently`, {
          module: 'email.worker.ts/processNextTask',
          taskId: task._id.toString(),
          error: error.message,
        });
      } else {
        task.status = EmailTaskStatus.PENDING;
        // Fix: schedule retry via retryAfter, not lockedAt
        const backoffMs = 2 ** task.retries * 30000; // 30s, 60s, 120s...
        task.retryAfter = new Date(Date.now() + backoffMs);
        // Failed retry tasks keep the 7-day deleteAt from creation
        logWarn(`Email task failed, scheduling retry`, {
          taskId: task._id.toString(),
          retryInSeconds: backoffMs / 1000,
          error: error.message,
        });
      }

      await task.save();
    } finally {
      activeTasks--;
    }
  } catch (err) {
    logError('Email worker polling loop encountered an error', {
      module: 'email.worker.ts/processNextTask',
      error: (err as Error).message,
    });
  }
}

export function startEmailWorker(): void {
  if (pollingInterval) return;
  logInfo('Email worker started', { pollIntervalSeconds: EmailConstants.POLL_INTERVAL_MS / 1000 });
  pollingInterval = setInterval(() => void processNextTask(), EmailConstants.POLL_INTERVAL_MS);
}

export async function stopEmailWorker(): Promise<void> {
  logInfo('Email worker shutdown initiated');
  isShuttingDown = true;

  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }

  // Wait for in-flight tasks to complete (max 30 seconds)
  const waitInterval = 500;
  let waited = 0;
  const maxWait = 30000;

  while (activeTasks > 0 && waited < maxWait) {
    await new Promise((resolve) => setTimeout(resolve, waitInterval));
    waited += waitInterval;
  }

  if (activeTasks > 0) {
    logWarn('Email worker shutdown complete with incomplete tasks', { activeTasks });
  } else {
    logInfo('Email worker shutdown complete gracefully');
  }
}
