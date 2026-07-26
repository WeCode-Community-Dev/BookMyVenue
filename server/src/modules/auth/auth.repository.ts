import type mongoose from 'mongoose';
import { PasswordResetRequestModel } from './models/password-reset-request.model';
import { PasswordResetTokenModel } from './models/password-reset-token.model';
import { RefreshTokenModel } from './models/refresh-token.model';
import type { IRefreshToken } from './models/refresh-token.model';
import { SessionModel } from './models/session.model';
import type { ISession } from './models/session.model';
import { EmailTaskModel } from '../../models/email-task.model';
import { RoleModel } from '../../models/role.model';
import { UserRoleModel } from '../../models/user-role.model';
import type { TokenRevocationReasonType } from '../../constants/auth.constants';

export async function findDefaultRole(): Promise<mongoose.Document | null> {
  return RoleModel.findOne({ name: 'user', active: true, deleted: false }).lean().exec();
}

export async function assignRoleToUser(
  userId: mongoose.Types.ObjectId,
  roleId: mongoose.Types.ObjectId,
  session?: mongoose.ClientSession
): Promise<void> {
  await UserRoleModel.updateOne(
    { userId, roleId },
    {
      $set: {
        userId,
        roleId,
        active: true,
        deleted: false,
      },
    },
    { upsert: true, session }
  ).exec();
}

export async function revokePasswordResetTokensOnLogin(
  userId: mongoose.Types.ObjectId,
  revocationReason: TokenRevocationReasonType,
  session?: mongoose.ClientSession
): Promise<void> {
  await PasswordResetTokenModel.updateMany(
    { userId, active: true },
    {
      $set: {
        active: false,
        revokedAt: new Date(),
        revokedReason: revocationReason,
      },
    },
    { session }
  ).exec();
}

export async function createSession(
  userId: mongoose.Types.ObjectId,
  rootTokenId: string,
  absoluteExpiresAt: Date,
  ipAddress: string,
  userAgent: string,
  session?: mongoose.ClientSession
): Promise<void> {
  await SessionModel.create(
    [
      {
        userId,
        rootTokenId,
        absoluteExpiresAt,
        lastLogin: new Date(),
        ipAddress,
        userAgent,
      },
    ],
    { session }
  );
}

export async function deactivateSessionByRootTokenId(
  rootTokenId: string,
  session?: mongoose.ClientSession
): Promise<void> {
  await SessionModel.findOneAndUpdate(
    { rootTokenId },
    { $set: { active: false } },
    { session }
  ).exec();
}

export async function getRateLimitDataForPasswordReset(
  emailHash: string,
  oneHourAgo: Date
): Promise<{
  totalCount: number;
  emailCount: number;
  lastEmailAt: Date | null;
}> {
  const [rateLimitData] = await PasswordResetRequestModel.aggregate<{
    totalRequests: ({ n: number } | undefined)[];
    emailsSent: ({ n: number } | undefined)[];
    lastEmailSent: ({ createdAt: Date } | undefined)[];
  }>([
    { $match: { emailHash, createdAt: { $gte: oneHourAgo } } },
    {
      $facet: {
        totalRequests: [{ $count: 'n' }],
        emailsSent: [{ $match: { emailSent: true } }, { $count: 'n' }],
        lastEmailSent: [
          { $match: { emailSent: true } },
          { $sort: { createdAt: -1 } },
          { $limit: 1 },
          { $project: { createdAt: 1 } },
        ],
      },
    },
  ]).exec();

  const totalCount = rateLimitData.totalRequests[0]?.n ?? 0;
  const emailCount = rateLimitData.emailsSent[0]?.n ?? 0;
  const lastEmailAt = rateLimitData.lastEmailSent[0]?.createdAt ?? null;

  return { totalCount, emailCount, lastEmailAt };
}

export async function createPasswordResetRequest(
  data: {
    emailHash: string;
    ip: string;
    userAgent: string;
    emailSent: boolean;
  },
  session?: mongoose.ClientSession
): Promise<void> {
  await PasswordResetRequestModel.create([data], { session });
}

export async function cleanupExcessPasswordResetTokens(
  userId: mongoose.Types.ObjectId,
  maxActiveTokens: number,
  session?: mongoose.ClientSession
): Promise<void> {
  const activeTokens = await PasswordResetTokenModel.find(
    {
      userId,
      used: false,
      active: true,
      deleted: false,
      expiresAt: { $gt: new Date() },
    },
    { _id: 1 },
    { sort: { createdAt: 1 } }
  )
    .session(session ?? null)
    .exec();

  if (activeTokens.length >= maxActiveTokens) {
    const excess = activeTokens.slice(0, activeTokens.length - maxActiveTokens + 1);
    await PasswordResetTokenModel.updateMany(
      { _id: { $in: excess.map((t) => t._id) } },
      { $set: { active: false, deleted: true } },
      { session }
    ).exec();
  }
}

export async function createPasswordResetToken(
  data: {
    userId: mongoose.Types.ObjectId;
    tokenHash: string;
    expiresAt: Date;
    requestIp: string;
    userAgent: string;
  },
  session?: mongoose.ClientSession
): Promise<void> {
  await PasswordResetTokenModel.create([data], { session });
}

export async function createEmailTask(
  data: {
    intent:
      | 'password_reset'
      | 'account_notification'
      | 'email_verification'
      | 'security_alert'
      | 'welcome';
    recipient: string;
    subject: string;
    metadata: Record<string, string>;
  },
  session?: mongoose.ClientSession
): Promise<void> {
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  await EmailTaskModel.create(
    [{ ...data, retryAfter: new Date(), deleteAt: new Date(Date.now() + SEVEN_DAYS_MS) }],
    { session }
  );
}

export async function markPasswordResetTokenAsUsed(
  tokenHash: string,
  session?: mongoose.ClientSession
): Promise<(mongoose.Document & { userId: mongoose.Types.ObjectId; expiresAt: Date }) | null> {
  return PasswordResetTokenModel.findOneAndUpdate(
    { tokenHash, active: true, used: false, deleted: false, expiresAt: { $gt: new Date() } },
    { $set: { active: false, used: true, usedAt: new Date() } },
    { returnDocument: 'after', session: session ?? null }
  ).exec();
}

export async function revokeAllOtherPasswordResetTokens(
  userId: mongoose.Types.ObjectId,
  excludeTokenId: mongoose.Types.ObjectId,
  revocationReason: TokenRevocationReasonType,
  session?: mongoose.ClientSession
): Promise<void> {
  await PasswordResetTokenModel.updateMany(
    { userId, _id: { $ne: excludeTokenId }, active: true, used: false, deleted: false },
    {
      $set: {
        active: false,
        revokedAt: new Date(),
        revokedReason: revocationReason,
      },
    },
    { session }
  ).exec();
}

export async function revokeActivePasswordResetTokens(
  userId: mongoose.Types.ObjectId,
  excludeTokenId: mongoose.Types.ObjectId,
  revocationReason: TokenRevocationReasonType,
  session?: mongoose.ClientSession
): Promise<void> {
  await PasswordResetTokenModel.updateMany(
    { userId, _id: { $ne: excludeTokenId }, active: true },
    {
      $set: {
        active: false,
        revokedAt: new Date(),
        revokedReason: revocationReason,
      },
    },
    { session }
  ).exec();
}

export async function revokeAllRefreshTokensForUser(
  userId: mongoose.Types.ObjectId,
  revocationReason: TokenRevocationReasonType,
  session?: mongoose.ClientSession
): Promise<void> {
  await RefreshTokenModel.updateMany(
    { userId, active: true },
    {
      $set: {
        active: false,
        revokedAt: new Date(),
        revokedReason: revocationReason,
      },
    },
    { session }
  ).exec();
}

export async function deactivateAllSessionsForUser(
  userId: mongoose.Types.ObjectId,
  session?: mongoose.ClientSession
): Promise<void> {
  await SessionModel.updateMany(
    { userId, active: true },
    { $set: { active: false } },
    { session }
  ).exec();
}

export async function findRefreshTokenByHash(
  tokenHash: string,
  userId: mongoose.Types.ObjectId
): Promise<IRefreshToken | null> {
  return RefreshTokenModel.findOne({
    tokenHash,
    userId,
    deleted: false,
  }).exec();
}

export async function findSessionByRootTokenId(
  rootTokenId: mongoose.Types.ObjectId
): Promise<ISession | null> {
  return SessionModel.findOne({
    rootTokenId,
    deleted: false,
  }).exec();
}

export async function getActiveSessionsForUser(
  userId: mongoose.Types.ObjectId | string
): Promise<ISession[]> {
  return SessionModel.find({ userId, active: true, deleted: false }).sort({ createdAt: -1 }).exec();
}

export async function findActiveSessionByIdForUser(
  sessionId: mongoose.Types.ObjectId | string,
  userId: mongoose.Types.ObjectId | string
): Promise<ISession | null> {
  return SessionModel.findOne({
    _id: sessionId,
    userId,
    active: true,
    deleted: false,
  }).exec();
}

export async function deactivateSessionById(
  sessionId: mongoose.Types.ObjectId | string,
  userId: mongoose.Types.ObjectId | string,
  session?: mongoose.ClientSession
): Promise<void> {
  await SessionModel.updateOne(
    { _id: sessionId, userId, active: true },
    { $set: { active: false } },
    { session }
  ).exec();
}

export async function createRefreshToken(
  data: {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    tokenHash: string;
    rootTokenId: mongoose.Types.ObjectId;
    parentTokenId: mongoose.Types.ObjectId | null;
    expiresAt: Date;
  },
  session?: mongoose.ClientSession
): Promise<void> {
  await RefreshTokenModel.create([data], { session });
}

export async function revokeRefreshToken(
  tokenHash: string,
  reason: TokenRevocationReasonType,
  session?: mongoose.ClientSession
): Promise<void> {
  await RefreshTokenModel.updateOne(
    { tokenHash, active: true, isUsed: false },
    {
      $set: {
        active: false,
        isUsed: true,
        revokedAt: new Date(),
        revokedReason: reason,
      },
    },
    { session }
  ).exec();
}

export async function revokeTokenFamily(
  rootTokenId: mongoose.Types.ObjectId,
  reason: TokenRevocationReasonType,
  session?: mongoose.ClientSession
): Promise<void> {
  await RefreshTokenModel.updateMany(
    { rootTokenId, active: true },
    {
      $set: {
        active: false,
        revokedAt: new Date(),
        revokedReason: reason,
      },
    },
    { session }
  ).exec();
}
