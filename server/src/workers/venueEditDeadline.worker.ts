import { VenueModel } from '../modules/venue/venue.model';
import { UserModel } from '../modules/user/user.models';
import { logModerationAction } from '../modules/moderation/moderationActivity.service';
import { RoleModel } from '../models/role.model';
import { UserRoleModel } from '../models/user-role.model';
import { enqueueEmailTask } from '../services/email.repository';
import { EmailIntent, EmailTaskStatus } from '../constants/email.constants';
import { logInfo, logError, logWarn } from '../utils/logger';
import { VENUE_CONSTANTS } from '../constants/venue.constants';
import mongoose from 'mongoose';

async function getSuperAdminId(): Promise<string> {
  const role = await RoleModel.findOne({ name: 'superAdmin', active: true, deleted: false })
    .select('_id')
    .lean();
  if (!role) throw new Error('SuperAdmin role not found for auto-suspend worker');

  const userRole = await UserRoleModel.findOne({ roleId: role._id, active: true, deleted: false })
    .select('userId')
    .lean();
  if (!userRole) throw new Error('No user assigned to SuperAdmin role for auto-suspend worker');

  return userRole.userId.toString();
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
      await logModerationAction('auto_suspend_venue', venue._id.toString(), 'venue', {
        actorRole: 'system',
        reason: `Auto-suspended after edit window expired on ${deadlineStr}`,
      });

      await session.commitTransaction();
      suspendedCount++;

      // Notify the owner (after commit — email failure must not roll back the suspension)
      const owner = await UserModel.findById(venue.ownerUserId).select('email').lean();
      if (owner?.email) {
        try {
          await enqueueEmailTask(
            owner.email,
            EmailIntent.VENUE_SUSPENDED,
            `Important: Your Venue "${venue.name}" has been Suspended`,
            EmailTaskStatus.PENDING,
            {
              venueName: venue.name,
              reason: VENUE_CONSTANTS.AUTO_SUSPEND_REASON,
            }
          );
        } catch (err) {
          logWarn('Failed to enqueue auto-suspend venue email', {
            module: 'venueEditDeadline.worker.ts/checkAndSuspendExpiredVenues',
            venueId: venue._id,
            error: (err as Error).message,
          });
        }
      }
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
