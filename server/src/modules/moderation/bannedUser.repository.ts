import { BannedUserModel, type IBannedUser, type BanScope } from './bannedUser.model';
import { UserModel } from '../user/user.models';
import mongoose from 'mongoose';

const toObjectId = (id: string): mongoose.Types.ObjectId => {
  return new mongoose.Types.ObjectId(id);
};

export async function createBan(
  userId: string,
  scope: BanScope,
  reason: string,
  bannedBy: string,
  options?: { venueId?: string | null; expiresAt?: Date | null }
): Promise<IBannedUser> {
  const banDoc = new BannedUserModel({
    userId: toObjectId(userId),
    scope,
    reason,
    bannedBy: toObjectId(bannedBy),
    venueId: options?.venueId ? toObjectId(options.venueId) : null,
    expiresAt: options?.expiresAt ?? null,
    status: 'active',
    bannedAt: new Date(),
  });

  await banDoc.save();

  // For full bans, also update User.isBanned
  if (scope === 'full') {
    await UserModel.findByIdAndUpdate(toObjectId(userId), {
      isBanned: true,
      active: false,
    }).exec();
  }

  return banDoc;
}

export async function liftAllBansForUser(userId: string, liftedBy: string): Promise<number> {
  const result = await BannedUserModel.updateMany(
    { userId: toObjectId(userId), status: 'active' },
    {
      $set: {
        status: 'lifted',
        liftedBy: toObjectId(liftedBy),
        liftedAt: new Date(),
      },
    }
  ).exec();

  // Restore user to active/unbanned since all bans are lifted
  await UserModel.findByIdAndUpdate(toObjectId(userId), {
    isBanned: false,
    active: true,
  }).exec();

  return result.modifiedCount;
}

export async function liftBan(banRecordId: string, liftedBy: string): Promise<IBannedUser | null> {
  const updated = await BannedUserModel.findByIdAndUpdate(
    toObjectId(banRecordId),
    {
      status: 'lifted',
      liftedBy: toObjectId(liftedBy),
      liftedAt: new Date(),
    },
    { new: true }
  ).exec();

  if (!updated) return null;

  // If lifting a full ban, check if user has any other active full bans
  if (updated.scope === 'full') {
    const otherFullBans = await BannedUserModel.findOne({
      userId: updated.userId,
      scope: 'full',
      status: 'active',
      _id: { $ne: toObjectId(banRecordId) },
    }).exec();

    // Only restore User.isBanned/active if no other active full bans exist
    if (!otherFullBans) {
      await UserModel.findByIdAndUpdate(updated.userId, {
        isBanned: false,
        active: true,
      }).exec();
    }
  }

  return updated;
}

export async function findActiveBan(
  userId: string,
  scope: BanScope,
  venueId?: string | null
): Promise<IBannedUser | null> {
  const query: Record<string, unknown> = {
    userId: toObjectId(userId),
    scope,
    status: 'active',
  };

  // For venue-scoped bans (commenting, owner_dashboard), match both global and venue-specific
  if (scope === 'commenting' || scope === 'owner_dashboard') {
    if (venueId) {
      // Match either: venueId is null (global) OR venueId matches
      query.$or = [{ venueId: null }, { venueId: toObjectId(venueId) }];
    } else {
      // No specific venue passed — just match global (venueId: null)
      query.venueId = null;
    }
  } else {
    // For 'full' and 'venue_creation', always global (venueId must be null/absent)
    query.venueId = null;
  }

  return BannedUserModel.findOne(query).exec();
}

export async function findUserBans(userId: string): Promise<IBannedUser[]> {
  return BannedUserModel.find({ userId: toObjectId(userId) })
    .sort({ bannedAt: -1 })
    .populate('bannedBy', 'username email')
    .populate('liftedBy', 'username email')
    .lean()
    .exec();
}

export async function findActiveFullBans(): Promise<IBannedUser[]> {
  return BannedUserModel.find({
    scope: 'full',
    status: 'active',
    expiresAt: { $lte: new Date() },
  }).exec();
}

export async function markAsExpired(banRecordId: string): Promise<IBannedUser | null> {
  const updated = await BannedUserModel.findByIdAndUpdate(
    toObjectId(banRecordId),
    { status: 'expired' },
    { new: true }
  ).exec();

  return updated;
}

export async function findExpiredFullBans(): Promise<IBannedUser[]> {
  return BannedUserModel.find({
    scope: 'full',
    status: 'active',
    expiresAt: { $ne: null, $lte: new Date() },
  }).exec();
}
