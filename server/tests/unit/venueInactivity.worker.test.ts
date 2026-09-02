import { describe, it, expect, beforeEach } from 'vitest';
import type mongoose from 'mongoose';
import { UserModel } from '../../src/modules/user/user.models';
import { VenueModel } from '../../src/modules/venue/venue.model';
import { closeVenuesPastWindDown } from '../../src/workers/venueInactivity.worker';

const USER_FIELDS = {
  password: 'hashed',
  active: true,
  deleted: false,
  isBanned: false,
};

const DAY_MS = 24 * 60 * 60 * 1000;

// (ownerUserId, name) is uniquely indexed, so each venue needs its own name
let venueSeq = 0;

async function seedVenue(
  ownerId: mongoose.Types.ObjectId,
  overrides: Record<string, unknown> = {}
): Promise<mongoose.Types.ObjectId> {
  venueSeq += 1;
  const venue = await VenueModel.create({
    name: `Venue ${String(venueSeq)}`,
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

describe('closeVenuesPastWindDown', () => {
  let ownerId: mongoose.Types.ObjectId;

  beforeEach(async () => {
    const owner = await UserModel.create({
      ...USER_FIELDS,
      username: 'owner1',
      email: 'owner@example.com',
    });
    ownerId = owner._id;
  });

  it('closes a venue once its closing date has arrived', async () => {
    const venueId = await seedVenue(ownerId, {
      inactivity: {
        requestedAt: new Date(Date.now() - 10 * DAY_MS),
        approvedAt: new Date(Date.now() - 8 * DAY_MS),
        blockedAfterDate: new Date(Date.now() - DAY_MS),
      },
    });

    expect(await closeVenuesPastWindDown()).toBe(1);

    const closed = await VenueModel.findById(venueId).lean();
    expect(closed?.status).toBe('Inactive');
    expect(closed?.inactivity?.inactiveAt).toBeInstanceOf(Date);
    // The cooldown measures from here, not from a later reopening
    expect(closed?.inactivity?.lastInactiveAt).toBeInstanceOf(Date);
    expect(closed?.inactivity?.blockedAfterDate).toBeUndefined();
  });

  it('leaves a venue open while its closing date is still ahead', async () => {
    const venueId = await seedVenue(ownerId, {
      inactivity: {
        approvedAt: new Date(),
        blockedAfterDate: new Date(Date.now() + 5 * DAY_MS),
      },
    });

    expect(await closeVenuesPastWindDown()).toBe(0);

    const stillOpen = await VenueModel.findById(venueId).lean();
    expect(stillOpen?.status).toBe('Approved');
    expect(stillOpen?.inactivity?.inactiveAt).toBeUndefined();
  });

  it('ignores venues with no approved closure', async () => {
    await seedVenue(ownerId);
    await seedVenue(ownerId, {
      inactivity: { requestedAt: new Date() },
    });

    expect(await closeVenuesPastWindDown()).toBe(0);
  });

  it('does not touch a venue whose closure was cancelled', async () => {
    const venueId = await seedVenue(ownerId, {
      inactivity: {
        approvedAt: new Date(Date.now() - 2 * DAY_MS),
        blockedAfterDate: new Date(Date.now() - DAY_MS),
      },
    });
    // Owner cancels: approvedAt and blockedAfterDate are cleared
    await VenueModel.findByIdAndUpdate(venueId, {
      $unset: { 'inactivity.approvedAt': '', 'inactivity.blockedAfterDate': '' },
    });

    expect(await closeVenuesPastWindDown()).toBe(0);
    expect((await VenueModel.findById(venueId).lean())?.status).toBe('Approved');
  });

  it('skips deleted venues and is safe to run twice', async () => {
    await seedVenue(ownerId, {
      deleted: true,
      inactivity: { approvedAt: new Date(), blockedAfterDate: new Date(Date.now() - DAY_MS) },
    });
    const liveId = await seedVenue(ownerId, {
      inactivity: { approvedAt: new Date(), blockedAfterDate: new Date(Date.now() - DAY_MS) },
    });

    expect(await closeVenuesPastWindDown()).toBe(1);
    expect(await closeVenuesPastWindDown()).toBe(0);
    expect((await VenueModel.findById(liveId).lean())?.status).toBe('Inactive');
  });
});
