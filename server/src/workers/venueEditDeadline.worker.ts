import { VenueModel } from '../modules/venue/venue.model';
import { UserModel } from '../modules/user/user.models';
import { logModerationAction } from '../modules/moderation/moderationActivity.service';
import { emailService } from '../services/email.service';
import { logInfo, logError } from '../utils/logger';
import { VENUE_CONSTANTS } from '../constants/venue.constants';
import mongoose from 'mongoose';

let superAdminId: string | null = null;

async function getSuperAdminId(): Promise<string> {
  if (superAdminId) return superAdminId;
  const admin = await UserModel.findOne({ role: 'superAdmin' }).select('_id').lean();
  if (!admin) throw new Error('SuperAdmin not found for auto-suspend worker');
  superAdminId = admin._id.toString();
  return superAdminId;
}

export async function checkAndSuspendExpiredVenues(): Promise<number> {
  const now = new Date();
  const systemId = await getSuperAdminId();

  const expiredVenues = await VenueModel.find({
    status: 'Rejected',
    currentEditDeadline: { $lt: now },
    deleted: false,
  })
    .select('_id name ownerUserId currentEditDeadline')
    .lean();

  let suspendedCount = 0;

  for (const venue of expiredVenues) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Double-check status hasn't changed (race condition protection)
      const freshVenue = await VenueModel.findById(venue._id).session(session);
      if (
        freshVenue?.status !== 'Rejected' ||
        !freshVenue.currentEditDeadline ||
        freshVenue.currentEditDeadline >= now
      ) {
        await session.abortTransaction();
        continue;
      }

      await VenueModel.findByIdAndUpdate(
        venue._id,
        {
          status: 'Suspended',
          suspensionReason: VENUE_CONSTANTS.AUTO_SUSPEND_REASON,
          currentEditDeadline: null,
          updatedBy: new mongoose.Types.ObjectId(systemId),
        },
        { session }
      ).exec();

      // Log activity with system actor
      const deadlineStr = venue.currentEditDeadline?.toISOString() ?? 'unknown';
      await logModerationAction(
        systemId,
        'auto_suspend_venue',
        venue._id.toString(),
        'venue',
        `Auto-suspended after edit window expired on ${deadlineStr}`,
        { actor: 'system (superadmin)' }
      );

      // Email owner
      const owner = await UserModel.findById(venue.ownerUserId).select('email').lean();
      if (owner?.email) {
        const daysStr = VENUE_CONSTANTS.EDIT_WINDOW_DAYS.toString();
        await emailService.sendVenueSuspendedEmail(
          owner.email,
          venue.name,
          `Your venue was auto-suspended because it was not resubmitted within ${daysStr} days of rejection.`
        );
      }

      await session.commitTransaction();
      suspendedCount++;
    } catch (err: unknown) {
      await session.abortTransaction();
      logError('Failed to auto-suspend venue', { venueId: venue._id, error: err });
    } finally {
      await session.endSession();
    }
  }

  if (suspendedCount > 0) {
    logInfo('Auto-suspended venues due to edit window expiry', { count: suspendedCount });
  }

  return suspendedCount;
}

export function startAutoSuspendWorker(): void {
  // Run every 6 hours
  setInterval(
    () => {
      void checkAndSuspendExpiredVenues().catch((err: unknown) => {
        logError('Auto-suspend worker error', { error: err });
      });
    },
    6 * 60 * 60 * 1000
  );
  // Also run once on startup after a short delay
  setTimeout(() => {
    void checkAndSuspendExpiredVenues().catch((err: unknown) => {
      logError('Auto-suspend worker startup error', { error: err });
    });
  }, 5000);
}
