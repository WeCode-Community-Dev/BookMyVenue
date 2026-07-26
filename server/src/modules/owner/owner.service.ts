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
  return updated;
}

export async function withdrawInactivityService(venueId: string, userId: string): Promise<IVenue> {
  const venue = await requireOwnVenue(venueId, userId);

  if (venue.pendingReview?.intent !== ReviewIntent.INACTIVITY_REQUEST) {
    throw new ConflictError('No pending inactivity request to withdraw');
  }

  const updated = await VenueModel.findByIdAndUpdate(
    venueId,
    { $unset: { pendingReview: '', 'inactivity.requestedAt': '' } },
    { new: true }
  ).exec();
  if (!updated) throw new NotFoundError('Venue not found');
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
      $set: { status: 'Approved', 'inactivity.lastInactiveAt': new Date() },
      $unset: {
        pendingReview: '',
        'inactivity.requestedAt': '',
        'inactivity.approvedAt': '',
        'inactivity.inactiveAt': '',
        'inactivity.blockedAfterDate': '',
        temporaryBlockAfterDate: '',
      },
    },
    { new: true }
  ).exec();
  if (!updated) throw new NotFoundError('Venue not found');
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
  return updated;
}
