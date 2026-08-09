import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import mongoose from 'mongoose';
import { UserModel } from '../../src/modules/user/user.models';
import { VenueModel } from '../../src/modules/venue/venue.model';
import { RoleModel } from '../../src/models/role.model';
import { UserRoleModel } from '../../src/models/user-role.model';
import { EmailTaskModel } from '../../src/models/email-task.model';
import { EmailIntent, EmailTaskStatus } from '../../src/constants/email.constants';
import { checkAndSuspendExpiredVenues } from '../../src/workers/venueEditDeadline.worker';

const USER_FIELDS = {
  username: 'owner1',
  email: 'owner@example.com',
  password: 'hashed',
  active: true,
  deleted: false,
  isBanned: false,
};

async function seedSuperAdmin(): Promise<mongoose.Types.ObjectId> {
  const role = await RoleModel.create({
    name: 'superAdmin',
    displayName: 'Super Admin',
    description: '',
    isSystem: true,
    parentRole: null,
    priority: 1,
    active: true,
    deleted: false,
  });
  const admin = await UserModel.create({ ...USER_FIELDS, username: 'superadmin', email: 'sa@example.com' });
  await UserRoleModel.create({ userId: admin._id, roleId: role._id, active: true, deleted: false });
  return admin._id;
}

async function seedExpiredRejectedVenue(ownerId: mongoose.Types.ObjectId): Promise<mongoose.Types.ObjectId> {
  const venue = await VenueModel.create({
    name: 'Expired Venue',
    description: 'desc',
    venueType: 'banquet',
    address: 'addr',
    city: 'city',
    district: 'district',
    pincode: '682001',
    bookingType: 'fixedBooking',
    coverImage: 'https://x.com/img.jpg',
    contact: { name: 'Owner', phone: '9999999999', email: 'owner@example.com' },
    cancellation: { policy: 'nonRefundable' },
    status: 'Rejected',
    ownerUserId: ownerId,
    createdBy: ownerId,
    updatedBy: ownerId,
    active: true,
    deleted: false,
    currentEditDeadline: new Date(Date.now() - 60 * 60 * 1000),
    submissionCount: 1,
  });
  return venue._id;
}

describe('checkAndSuspendExpiredVenues', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      throw new Error('Mongoose not connected; ensure tests/setup.ts ran');
    }
    await VenueModel.createIndexes();
  });

  beforeEach(async () => {
    await Promise.all([
      EmailTaskModel.deleteMany({}),
      VenueModel.deleteMany({}),
      UserRoleModel.deleteMany({}),
      RoleModel.deleteMany({}),
      UserModel.deleteMany({}),
    ]);
  });

  it('suspends an expired rejected venue and enqueues an owner email', async () => {
    await seedSuperAdmin();
    const owner = await UserModel.create(USER_FIELDS);
    const venueId = await seedExpiredRejectedVenue(owner._id);

    const count = await checkAndSuspendExpiredVenues();

    expect(count).toBe(1);

    const suspended = await VenueModel.findById(venueId).lean();
    expect(suspended?.status).toBe('Suspended');
    expect(suspended?.currentEditDeadline).toBeNull();

    const task = await EmailTaskModel.findOne({ intent: EmailIntent.VENUE_SUSPENDED }).lean();
    expect(task).not.toBeNull();
    expect(task?.recipient).toBe('owner@example.com');
    expect(task?.status).toBe(EmailTaskStatus.PENDING);
  });

  it('still suspends the venue when enqueuing the email fails', async () => {
    await seedSuperAdmin();
    const owner = await UserModel.create(USER_FIELDS);
    const venueId = await seedExpiredRejectedVenue(owner._id);

    vi.spyOn(EmailTaskModel, 'create').mockRejectedValueOnce(new Error('db down'));

    const count = await checkAndSuspendExpiredVenues();

    expect(count).toBe(1);
    const suspended = await VenueModel.findById(venueId).lean();
    expect(suspended?.status).toBe('Suspended');
  });

  it('throws when no superAdmin is seeded', async () => {
    const owner = await UserModel.create(USER_FIELDS);
    await seedExpiredRejectedVenue(owner._id);

    await expect(checkAndSuspendExpiredVenues()).rejects.toThrow(/SuperAdmin/);
  });
});
