import { NotFoundError, ConflictError } from '../../utils/errors';
import { buildPaginationMeta } from '../../utils/paginationUtils';
import * as repo from './owner.repository';
import type { offlineBookingSchema } from './owner.validator';

import type { z } from 'zod';
import { fetchActiveConflicts } from '../booking/booking.repository';
import { checkOverlap } from '../../utils/timeUtils';
import * as venueRepo from '../venue/venue.repository';
import * as venueWorkflow from '../venue/venue.workflow';
import { requireOwnVenue } from '../venue/venue.ownership';
import { ReviewIntent } from '../../constants/venue.constants';
import { VenueModel } from '../venue/venue.model';
import { BookingModel } from '../booking/models/booking.model';
import { BookingStatus } from '../../constants/booking.constants';
import mongoose from 'mongoose';
import type { IVenue } from '../venue/venue.types';
import { RoleModel } from '../../models/role.model';
import { UserRoleModel } from '../../models/user-role.model';
import { UserModel } from '../user/user.models';
import { enqueueEmailTask } from '../../services/email.repository';
import { EmailIntent, EmailTaskStatus } from '../../constants/email.constants';
import { logWarn } from '../../utils/logger';

// Everyone who can act on a review queue item
async function findAdminRecipients(): Promise<string[]> {
  const roles = await RoleModel.find({
    name: { $in: ['admin', 'superAdmin'] },
    active: true,
    deleted: false,
  })
    .select('_id')
    .lean()
    .exec();
  if (roles.length === 0) return [];

  const userRoles = await UserRoleModel.find({
    roleId: { $in: roles.map((r) => r._id) },
    active: true,
    deleted: false,
  })
    .select('userId')
    .lean()
    .exec();
  if (userRoles.length === 0) return [];

  const users = await UserModel.find({
    _id: { $in: userRoles.map((ur) => ur.userId) },
    active: true,
    deleted: false,
  })
    .select('email')
    .lean()
    .exec();

  return users.map((u) => u.email).filter((email): email is string => Boolean(email));
}

export function getDateThreshold(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

export async function getVenueAnalyticsService(
  venueId: string
): Promise<{ months: Record<string, unknown>[] }> {
  const months = await repo.getVenueAnalyticsData(venueId);
  return { months };
}

export async function getVenueBookingsService(
  venueId: string,
  page: number,
  limit: number
): Promise<{ bookings: Record<string, unknown>[]; pagination: unknown }> {
  const skip = (page - 1) * limit;

  const [bookings, totalCount] = await Promise.all([
    repo.getVenueBookingsPaginated(venueId, skip, limit),
    repo.countVenueBookings(venueId),
  ]);

  return {
    bookings,
    pagination: buildPaginationMeta(totalCount, { page, limit, skip, sort: '-date' }),
  };
}

export async function createOfflineBookingService(
  userId: string,
  dto: z.infer<typeof offlineBookingSchema>
): Promise<{ bookingId: string }> {
  const venue = await requireOwnVenue(dto.venueId, userId);
  if (venue.status === 'Inactive') {
    throw new ConflictError('Cannot create offline booking: venue is currently inactive');
  }

  const conflicts = await fetchActiveConflicts(dto.venueId, dto.date);
  if (checkOverlap(dto.startTime, dto.endTime, conflicts)) {
    throw new ConflictError(
      'This slot overlaps with an existing booking or hold for the selected date.'
    );
  }

  const booking = await repo.createOfflineBookingRecord(
    dto.venueId,
    userId,
    dto.date,
    dto.startTime,
    dto.endTime,
    dto.amountPaid,
    dto.customerName,
    dto.phone
  );
  return { bookingId: String(booking._id) };
}

export async function blockDatesService(venueId: string, dates: string[]): Promise<Date[]> {
  const conflictingBooking = await repo.findConflictingBookingForDates(venueId, dates);

  if (conflictingBooking) {
    throw new ConflictError(
      `Cannot block date ${conflictingBooking.date} because it has a confirmed booking.`
    );
  }

  const dateObjects = dates.map((d) => new Date(`${d}T00:00:00Z`));
  const updatedVenue = await repo.addBlockedDatesToVenue(venueId, dateObjects);
  return updatedVenue ? updatedVenue.blockedDates : [];
}

export async function unblockDatesService(venueId: string, dates: string[]): Promise<Date[]> {
  const dateObjects = dates.map((d) => new Date(`${d}T00:00:00Z`));
  const updatedVenue = await repo.removeBlockedDatesFromVenue(venueId, dateObjects);
  return updatedVenue ? updatedVenue.blockedDates : [];
}

export async function getVenueSettingsService(venueId: string): Promise<IVenue> {
  const venue = await venueRepo.findVenueById(venueId);
  if (!venue) throw new NotFoundError('Venue not found');
  return venue;
}

export async function requestInactivityService(
  venueId: string,
  userId: string,
  reason?: string
): Promise<IVenue> {
  const venue = await requireOwnVenue(venueId, userId);
  venueWorkflow.canRequestInactivity(venue);

  const $set: Record<string, unknown> = {
    'inactivity.requestedAt': new Date(),
    'pendingReview.intent': ReviewIntent.INACTIVITY_REQUEST,
    'pendingReview.requestedAt': new Date(),
  };
  if (reason) $set['pendingReview.details.reason'] = reason;

  const updated = await VenueModel.findByIdAndUpdate(venueId, { $set }, { new: true }).exec();
  if (!updated) throw new NotFoundError('Venue not found');

  const { logModerationAction } = await import('../moderation/moderationActivity.service.js');
  await logModerationAction('request_inactivity', venueId, 'venue', {
    actorId: userId,
    actorRole: 'owner',
    reason,
  });

  try {
    const [recipients, owner] = await Promise.all([
      findAdminRecipients(),
      UserModel.findById(userId).select('username').lean().exec(),
    ]);
    const ownerName = owner?.username ?? 'A venue owner';

    await Promise.all(
      recipients.map((email) =>
        enqueueEmailTask(
          email,
          EmailIntent.INACTIVITY_REQUESTED,
          `Closure requested for "${updated.name}"`,
          EmailTaskStatus.PENDING,
          // metadata is Record<string, string>, so omit reason rather than pass undefined
          reason
            ? { venueName: updated.name, ownerName, reason }
            : { venueName: updated.name, ownerName }
        )
      )
    );
  } catch (err) {
    // Never let a notification failure undo the request
    logWarn('Failed to queue inactivity request emails', {
      module: 'owner.service.ts/requestInactivityService',
      venueId,
      error: (err as Error).message,
    });
  }

  return updated;
}

// Cancels a closure before review or mid wind-down; reopening a closed venue is activateVenueService
export async function withdrawInactivityService(venueId: string, userId: string): Promise<IVenue> {
  const venue = await requireOwnVenue(venueId, userId);

  const isAwaitingReview = venue.pendingReview?.intent === ReviewIntent.INACTIVITY_REQUEST;
  // Mid wind-down pendingReview is gone, so approvedAt on an Approved venue is the only trace
  const isWindingDown = venue.status === 'Approved' && !!venue.inactivity?.approvedAt;

  if (!isAwaitingReview && !isWindingDown) {
    throw new ConflictError('No inactivity request to cancel');
  }

  const updated = await VenueModel.findByIdAndUpdate(
    venueId,
    {
      $unset: {
        pendingReview: '',
        'inactivity.requestedAt': '',
        'inactivity.approvedAt': '',
        'inactivity.blockedAfterDate': '',
      },
    },
    { new: true }
  ).exec();
  if (!updated) throw new NotFoundError('Venue not found');

  const { logModerationAction } = await import('../moderation/moderationActivity.service.js');
  await logModerationAction('cancel_inactivity', venueId, 'venue', {
    actorId: userId,
    actorRole: 'owner',
    metadata: { cancelledDuring: isWindingDown ? 'wind_down' : 'awaiting_review' },
  });

  return updated;
}

export async function blockBookingsService(venueId: string, userId: string): Promise<IVenue> {
  await requireOwnVenue(venueId, userId);

  const today = new Date().toISOString().split('T')[0];
  const latestBooking = await BookingModel.findOne({
    venueId: new mongoose.Types.ObjectId(venueId),
    status: BookingStatus.CONFIRMED,
    date: { $gte: today },
  })
    .sort({ date: -1 })
    .lean()
    .exec();

  let blockedAfterDate: Date;
  if (latestBooking) {
    const bookingDate = new Date(latestBooking.date + 'T00:00:00Z');
    blockedAfterDate = new Date(bookingDate.getTime() + 24 * 60 * 60 * 1000);
  } else {
    blockedAfterDate = new Date(today + 'T00:00:00Z');
  }

  const updated = await VenueModel.findByIdAndUpdate(
    venueId,
    { $set: { temporaryBlockAfterDate: blockedAfterDate } },
    { new: true }
  ).exec();
  if (!updated) throw new NotFoundError('Venue not found');
  return updated;
}

export async function unblockBookingsService(venueId: string, userId: string): Promise<IVenue> {
  await requireOwnVenue(venueId, userId);

  const updated = await VenueModel.findByIdAndUpdate(
    venueId,
    { $unset: { temporaryBlockAfterDate: '' } },
    { new: true }
  ).exec();
  if (!updated) throw new NotFoundError('Venue not found');
  return updated;
}

export async function activateVenueService(venueId: string, userId: string): Promise<IVenue> {
  const venue = await requireOwnVenue(venueId, userId);
  venueWorkflow.canReactivate(venue);

  const updated = await VenueModel.findByIdAndUpdate(
    venueId,
    {
      // lastInactiveAt is stamped on close, not here, so the cooldown runs from the closure
      $set: { status: 'Approved' },
      // temporaryBlockAfterDate is a separate feature and should survive reopening
      $unset: {
        pendingReview: '',
        'inactivity.requestedAt': '',
        'inactivity.approvedAt': '',
        'inactivity.inactiveAt': '',
        'inactivity.blockedAfterDate': '',
      },
    },
    { new: true }
  ).exec();
  if (!updated) throw new NotFoundError('Venue not found');

  const { logModerationAction } = await import('../moderation/moderationActivity.service.js');
  await logModerationAction('reopen_venue', venueId, 'venue', {
    actorId: userId,
    actorRole: 'owner',
  });

  return updated;
}

export async function markBookingAsPaidService(bookingId: string): Promise<void> {
  const updated = await repo.markBookingAsPaid(bookingId);
  if (!updated) {
    throw new NotFoundError('Booking not found or already paid');
  }
}

export async function cancelPendingOfflineBookingService(bookingId: string): Promise<void> {
  const updated = await repo.cancelPendingOfflineBooking(bookingId);
  if (!updated) {
    throw new NotFoundError('Booking not found or already processed');
  }
}

export async function requestDeleteVenueService(
  venueId: string,
  userId: string,
  reason: string
): Promise<IVenue> {
  const venue = await requireOwnVenue(venueId, userId);
  venueWorkflow.canRequestDelete(venue);

  const today = new Date().toISOString().split('T')[0];
  const futureBookingCount = await BookingModel.countDocuments({
    venueId: new mongoose.Types.ObjectId(venueId),
    status: BookingStatus.CONFIRMED,
    date: { $gte: today },
  });

  if (futureBookingCount > 0) {
    throw new ConflictError('Cannot request deletion: venue has future confirmed bookings');
  }

  const updateObj: Record<string, unknown> = {
    $set: {
      'pendingReview.intent': ReviewIntent.DELETION_REQUEST,
      'pendingReview.requestedAt': new Date(),
      'pendingReview.details.reason': reason,
    },
  };

  if (venue.pendingReview?.intent === ReviewIntent.INACTIVITY_REQUEST) {
    updateObj.$unset = { 'inactivity.requestedAt': '' };
  }

  const updated = await VenueModel.findByIdAndUpdate(venueId, updateObj, { new: true }).exec();
  if (!updated) throw new NotFoundError('Venue not found');

  const { logModerationAction } = await import('../moderation/moderationActivity.service.js');
  await logModerationAction('request_venue_deletion', venueId, 'venue', {
    actorId: userId,
    actorRole: 'owner',
    reason,
  });

  return updated;
}
