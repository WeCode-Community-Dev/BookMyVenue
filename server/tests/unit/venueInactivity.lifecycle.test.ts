import { describe, it, expect, beforeEach } from 'vitest';
import type mongoose from 'mongoose';
import { UserModel } from '../../src/modules/user/user.models';
import { VenueModel } from '../../src/modules/venue/venue.model';
import * as ownerService from '../../src/modules/owner/owner.service';
import * as venueService from '../../src/modules/venue/venue.service';
import { BookingModel } from '../../src/modules/booking/models/booking.model';
import { BookingStatus } from '../../src/constants/booking.constants';
import { getBookableDates } from '../../src/modules/availability/availability.workflow';
import { getVenueActivityLogs } from '../../src/modules/moderation/moderationActivity.service';
import { closeVenuesPastWindDown } from '../../src/workers/venueInactivity.worker';
import { toLocalDateString } from '../../src/utils/timeUtils';
import { ReviewIntent } from '../../src/constants/venue.constants';

const USER_FIELDS = {
  password: 'hashed',
  active: true,
  deleted: false,
  isBanned: false,
};

async function seedVenue(
  ownerId: mongoose.Types.ObjectId,
  overrides: Record<string, unknown> = {}
): Promise<mongoose.Types.ObjectId> {
  const venue = await VenueModel.create({
    name: 'Original Name',
    description: 'desc',
    venueType: 'banquet',
    address: 'addr',
    city: 'city',
    district: 'district',
    pincode: '682001',
    bookingType: 'fixedBooking',
    coverImage: 'https://example.com/img.jpg',
    contact: { name: 'Owner', phone: '9999999999', email: 'owner@example.com' },
    cancellation: { policy: 'nonRefundable' },
    status: 'Approved',
    ownerUserId: ownerId,
    createdBy: ownerId,
    updatedBy: ownerId,
    active: true,
    deleted: false,
    ...overrides,
  });
  return venue._id;
}

describe('Venue inactivity lifecycle', () => {
  let ownerId: mongoose.Types.ObjectId;
  let adminId: mongoose.Types.ObjectId;
  let venueId: mongoose.Types.ObjectId;

  beforeEach(async () => {
    const owner = await UserModel.create({
      ...USER_FIELDS,
      username: 'owner1',
      email: 'owner@example.com',
    });
    const admin = await UserModel.create({
      ...USER_FIELDS,
      username: 'admin1',
      email: 'admin@example.com',
    });
    ownerId = owner._id;
    adminId = admin._id;
    venueId = await seedVenue(ownerId);
  });

  describe('requesting inactivity', () => {
    it('queues the request for admin review while leaving the venue open', async () => {
      const updated = await ownerService.requestInactivityService(
        venueId.toString(),
        ownerId.toString(),
        'Closing for renovation work'
      );

      expect(updated.status).toBe('Approved');
      expect(updated.pendingReview?.intent).toBe(ReviewIntent.INACTIVITY_REQUEST);
      expect(updated.inactivity?.requestedAt).toBeInstanceOf(Date);

      const queue = await venueService.getReviewsList();
      expect(queue).toHaveLength(1);
      expect(queue[0].pendingReview?.intent).toBe(ReviewIntent.INACTIVITY_REQUEST);
    });

    it('refuses a duplicate request while one is already awaiting review', async () => {
      await ownerService.requestInactivityService(venueId.toString(), ownerId.toString());

      await expect(
        ownerService.requestInactivityService(venueId.toString(), ownerId.toString())
      ).rejects.toThrow(/already has a request awaiting admin review/i);

      const queue = await venueService.getReviewsList();
      expect(queue).toHaveLength(1);
    });

    it('cannot overwrite a pending venue_edit and strand its rollback snapshot', async () => {
      // previousSnapshot is how a rejection rolls the edit back; flipping the intent orphans it
      await VenueModel.findByIdAndUpdate(venueId, {
        $set: {
          name: 'Changed Name',
          'pendingReview.intent': ReviewIntent.VENUE_EDIT,
          'pendingReview.requestedAt': new Date(),
          'pendingReview.details.changedFields': ['name'],
          'pendingReview.details.previousSnapshot': { name: 'Original Name' },
        },
      });

      await expect(
        ownerService.requestInactivityService(venueId.toString(), ownerId.toString())
      ).rejects.toThrow(/already has a request awaiting admin review/i);

      const untouched = await VenueModel.findById(venueId).lean();
      expect(untouched?.pendingReview?.intent).toBe(ReviewIntent.VENUE_EDIT);

      // The rollback still works because the intent survived.
      const rejected = await venueService.rejectReview(
        venueId.toString(),
        adminId.toString(),
        'Not approved'
      );
      expect(rejected.name).toBe('Original Name');
    });

    it('cannot overwrite a pending deletion request', async () => {
      await ownerService.requestDeleteVenueService(
        venueId.toString(),
        ownerId.toString(),
        'Shutting down permanently'
      );

      await expect(
        ownerService.requestInactivityService(venueId.toString(), ownerId.toString())
      ).rejects.toThrow(/already has a request awaiting admin review/i);

      const venue = await VenueModel.findById(venueId).lean();
      expect(venue?.pendingReview?.intent).toBe(ReviewIntent.DELETION_REQUEST);
      expect(venue?.pendingReview?.details?.reason).toBe('Shutting down permanently');
    });
  });

  describe('cancelling a request before review', () => {
    it('clears the request and empties the admin queue', async () => {
      await ownerService.requestInactivityService(venueId.toString(), ownerId.toString());

      const updated = await ownerService.withdrawInactivityService(
        venueId.toString(),
        ownerId.toString()
      );

      expect(updated.status).toBe('Approved');
      expect(updated.pendingReview).toBeUndefined();
      expect(updated.inactivity?.requestedAt).toBeUndefined();
      expect(await venueService.getReviewsList()).toHaveLength(0);
    });

    it('lets the owner request again after cancelling', async () => {
      await ownerService.requestInactivityService(venueId.toString(), ownerId.toString());
      await ownerService.withdrawInactivityService(venueId.toString(), ownerId.toString());

      const again = await ownerService.requestInactivityService(
        venueId.toString(),
        ownerId.toString()
      );
      expect(again.pendingReview?.intent).toBe(ReviewIntent.INACTIVITY_REQUEST);
    });
  });

  describe('admin rejection', () => {
    it('leaves no stale inactivity state that would strand the owner', async () => {
      await ownerService.requestInactivityService(venueId.toString(), ownerId.toString());

      const rejected = await venueService.rejectReview(
        venueId.toString(),
        adminId.toString(),
        'Too soon'
      );

      expect(rejected.status).toBe('Approved');
      expect(rejected.pendingReview).toBeUndefined();
      // Lingering requestedAt used to leave the owner unable to cancel or re-request
      expect(rejected.inactivity?.requestedAt).toBeUndefined();
    });

    it('allows a fresh request straight after a rejection', async () => {
      await ownerService.requestInactivityService(venueId.toString(), ownerId.toString());
      await venueService.rejectReview(venueId.toString(), adminId.toString(), 'Too soon');

      const again = await ownerService.requestInactivityService(
        venueId.toString(),
        ownerId.toString()
      );
      expect(again.pendingReview?.intent).toBe(ReviewIntent.INACTIVITY_REQUEST);
    });
  });

  describe('admin approval', () => {
    it('schedules the closure instead of closing the venue outright', async () => {
      await ownerService.requestInactivityService(venueId.toString(), ownerId.toString());

      const approved = await venueService.approveReview(venueId.toString(), adminId.toString());

      // The venue stays open and bookable until blockedAfterDate; only the worker closes it.
      expect(approved.status).toBe('Approved');
      expect(approved.inactivity?.approvedAt).toBeInstanceOf(Date);
      expect(approved.inactivity?.blockedAfterDate).toBeInstanceOf(Date);
      expect(approved.inactivity?.inactiveAt).toBeUndefined();
      expect(approved.pendingReview).toBeUndefined();
      expect(await venueService.getReviewsList()).toHaveLength(0);
    });

    it('sets the closing date to the day after the last confirmed booking', async () => {
      const inFiveDays = new Date();
      inFiveDays.setHours(0, 0, 0, 0);
      inFiveDays.setDate(inFiveDays.getDate() + 5);
      const bookingDate = toLocalDateString(inFiveDays);

      await BookingModel.create({
        venueId,
        userId: ownerId,
        date: bookingDate,
        startTime: 600,
        endTime: 660,
        status: BookingStatus.CONFIRMED,
        price: 1000,
        totalAmount: 1000,
        paymentStatus: 'paid',
        paymentReference: 'test_ref_1',
      });

      await ownerService.requestInactivityService(venueId.toString(), ownerId.toString());
      const approved = await venueService.approveReview(venueId.toString(), adminId.toString());

      const expected = new Date(inFiveDays);
      expected.setDate(expected.getDate() + 1);
      const blockedAfter = approved.inactivity?.blockedAfterDate;
      expect(blockedAfter).toBeInstanceOf(Date);
      expect(toLocalDateString(blockedAfter as Date)).toBe(toLocalDateString(expected));
    });
  });

  describe('cancelling during the wind-down', () => {
    it('restores full availability after approval but before closing', async () => {
      await ownerService.requestInactivityService(venueId.toString(), ownerId.toString());
      await venueService.approveReview(venueId.toString(), adminId.toString());

      const cancelled = await ownerService.withdrawInactivityService(
        venueId.toString(),
        ownerId.toString()
      );

      expect(cancelled.status).toBe('Approved');
      expect(cancelled.inactivity?.approvedAt).toBeUndefined();
      expect(cancelled.inactivity?.blockedAfterDate).toBeUndefined();
      expect(cancelled.inactivity?.requestedAt).toBeUndefined();
    });

    it('leaves no cooldown behind, since the venue never actually closed', async () => {
      await ownerService.requestInactivityService(venueId.toString(), ownerId.toString());
      await venueService.approveReview(venueId.toString(), adminId.toString());
      await ownerService.withdrawInactivityService(venueId.toString(), ownerId.toString());

      const again = await ownerService.requestInactivityService(
        venueId.toString(),
        ownerId.toString()
      );
      expect(again.pendingReview?.intent).toBe(ReviewIntent.INACTIVITY_REQUEST);
    });

    it('refuses to cancel when there is no closure in flight', async () => {
      await expect(
        ownerService.withdrawInactivityService(venueId.toString(), ownerId.toString())
      ).rejects.toThrow(/no inactivity request to cancel/i);
    });
  });

  describe('availability during the wind-down', () => {
    it('stops offering dates on or after the closing date', async () => {
      const closesIn = new Date();
      closesIn.setHours(0, 0, 0, 0);
      closesIn.setDate(closesIn.getDate() + 5);

      const venue = await VenueModel.findByIdAndUpdate(
        venueId,
        {
          $set: {
            'inactivity.approvedAt': new Date(),
            'inactivity.blockedAfterDate': closesIn,
            workingDays: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
          },
        },
        { new: true }
      ).lean();

      const { bookableDates, disabledDates } = getBookableDates(venue as never);
      const offered = [...bookableDates, ...disabledDates];
      const closingDateStr = toLocalDateString(closesIn);

      // Offering the closing date would let a customer pick a date that fails at checkout
      expect(offered).not.toContain(closingDateStr);

      const dayBefore = new Date(closesIn);
      dayBefore.setDate(dayBefore.getDate() - 1);
      expect(offered).toContain(toLocalDateString(dayBefore));
    });
  });

  describe('activity log', () => {
    it('records the full lifecycle with the right actor on each step', async () => {
      await ownerService.requestInactivityService(
        venueId.toString(),
        ownerId.toString(),
        'Closing for renovation work'
      );
      await venueService.approveReview(venueId.toString(), adminId.toString());
      await ownerService.withdrawInactivityService(venueId.toString(), ownerId.toString());

      const { logs } = await getVenueActivityLogs(venueId.toString(), 1, 20);
      const byAction = new Map(logs.map((l) => [l.action, l]));

      expect(byAction.get('request_inactivity')?.actorRole).toBe('owner');
      expect(byAction.get('request_inactivity')?.reason).toBe('Closing for renovation work');
      expect(byAction.get('approve_inactivity')?.actorRole).toBe('admin');
      expect(byAction.get('cancel_inactivity')?.actorRole).toBe('owner');
      expect(byAction.get('cancel_inactivity')?.metadata?.cancelledDuring).toBe('wind_down');
    });

    it('records a rejection against the admin who made it', async () => {
      await ownerService.requestInactivityService(venueId.toString(), ownerId.toString());
      await venueService.rejectReview(venueId.toString(), adminId.toString(), 'Peak season');

      const { logs } = await getVenueActivityLogs(venueId.toString(), 1, 20);
      const rejection = logs.find((l) => l.action === 'reject_inactivity');

      expect(rejection).toBeDefined();
      expect(rejection?.actorRole).toBe('admin');
      expect(rejection?.reason).toBe('Peak season');
    });

    it('attributes an automatic closure to the system, with no human actor', async () => {
      await VenueModel.findByIdAndUpdate(venueId, {
        $set: {
          'inactivity.approvedAt': new Date(),
          'inactivity.blockedAfterDate': new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      });

      await closeVenuesPastWindDown();

      const { logs } = await getVenueActivityLogs(venueId.toString(), 1, 20);
      const closure = logs.find((l) => l.action === 'venue_closed');

      expect(closure).toBeDefined();
      expect(closure?.actorRole).toBe('system');
      // A worker has no human actor
      expect(closure?.actorId ?? null).toBeNull();
    });

    it('scopes the owner view to one venue', async () => {
      const otherVenue = await seedVenue(ownerId, { name: 'Second Venue' });
      await ownerService.requestInactivityService(venueId.toString(), ownerId.toString());
      await ownerService.requestInactivityService(otherVenue.toString(), ownerId.toString());

      const { logs, total } = await getVenueActivityLogs(venueId.toString(), 1, 20);
      expect(total).toBe(1);
      expect(logs[0].targetId).toBe(venueId.toString());
    });
  });

  describe('reopening', () => {
    it('preserves a temporary booking block set independently by the owner', async () => {
      const blockDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      await VenueModel.findByIdAndUpdate(venueId, {
        $set: {
          status: 'Inactive',
          'inactivity.inactiveAt': new Date(),
          temporaryBlockAfterDate: blockDate,
        },
      });

      const reopened = await ownerService.activateVenueService(
        venueId.toString(),
        ownerId.toString()
      );

      expect(reopened.status).toBe('Approved');
      expect(reopened.inactivity?.inactiveAt).toBeUndefined();
      // block-bookings is separate and must survive reopening
      expect(reopened.temporaryBlockAfterDate?.getTime()).toBe(blockDate.getTime());
    });

    it('enforces the cooldown after a recent closure', async () => {
      const closedAt = new Date();
      await VenueModel.findByIdAndUpdate(venueId, {
        $set: {
          status: 'Inactive',
          'inactivity.inactiveAt': closedAt,
          'inactivity.lastInactiveAt': closedAt,
        },
      });
      await ownerService.activateVenueService(venueId.toString(), ownerId.toString());

      await expect(
        ownerService.requestInactivityService(venueId.toString(), ownerId.toString())
      ).rejects.toThrow(/cooldown/i);
    });

    it('counts dormancy toward the cooldown instead of restarting it on reopening', async () => {
      // Cooldown runs from the closure, so six months dormant means no wait on reopening
      const longAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
      await VenueModel.findByIdAndUpdate(venueId, {
        $set: {
          status: 'Inactive',
          'inactivity.inactiveAt': longAgo,
          'inactivity.lastInactiveAt': longAgo,
        },
      });

      const reopened = await ownerService.activateVenueService(
        venueId.toString(),
        ownerId.toString()
      );
      expect(reopened.inactivity?.lastInactiveAt?.getTime()).toBe(longAgo.getTime());

      const again = await ownerService.requestInactivityService(
        venueId.toString(),
        ownerId.toString()
      );
      expect(again.pendingReview?.intent).toBe(ReviewIntent.INACTIVITY_REQUEST);
    });
  });
});
