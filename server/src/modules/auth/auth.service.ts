import crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import type { z } from 'zod';
import { authEnvs } from '../../constants/env';
import { AuthConstants, TokenRevocationReason } from '../../constants/auth.constants';
import * as authRepo from './auth.repository';
import * as userRepo from '../user/user.repository';
import type * as authScheme from './auth.validator';
import { AppError, NotFoundError, ForbiddenError } from '../../utils/errors';
import { logError, logWarn, logInfo } from '../../utils/logger';
import { runInTransaction } from '../../utils/dbUtils';
import mongoose from 'mongoose';
import type * as validator from './auth.validator';
import {
  generateAccessToken,
  generateRefreshToken,
  revokeRefreshToken,
} from '../../utils/tokenUtils';
import type { DecodedToken, StoredToken } from '../../types/express';

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests. Please try again later') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request') {
    super(message, 400, 'BAD_REQUEST');
  }
}

export async function registerUser(
  dto: z.infer<typeof authScheme.registerSchema>
): Promise<string> {
  const { username, email, password } = dto;

  const existingUser = await userRepo.findUserByUsernameOrEmail(username, email);
  if (existingUser) {
    logWarn('Registration attempt with existing user', { username, email });
    throw new BadRequestError(
      'User already exists! please login instead, or choose a different username/email'
    );
  }

  const defaultRole = await authRepo.findDefaultRole();
  if (!defaultRole) {
    logError('register: default "user" role missing from system configs', {
      module: 'auth.service.ts/registerUser',
    });
    throw new AppError(
      'System initialization Error, Pls contact admin...',
      500,
      'INTERNAL_SERVER_ERROR'
    );
  }

  let createdUserId = '';

  await runInTransaction(async (session) => {
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await userRepo.createUser(
      { username, email, passwordHash: hashedPassword },
      session
    );

    createdUserId = newUser._id.toString();

    await authRepo.assignRoleToUser(newUser._id, defaultRole._id, session);
  });

  logInfo('New user registered successfully', { username, email });
  return createdUserId;
}

export async function loginUser(
  dto: z.infer<typeof authScheme.loginSchema>,
  ipAddress: string,
  userAgent: string
): Promise<{
  userId: string;
  username: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}> {
  const identifier = dto.username ?? dto.email;

  logInfo('Login attempt', { credential: identifier });

  if (!identifier || !dto.password) {
    logWarn('Login attempt with missing credentials');
    throw new BadRequestError('Username/Email and password required');
  }

  const user = await userRepo.findActiveUserByIdentifierWithPassword(identifier);

  if (!user) {
    logWarn('Login attempt with non-existent user', { credential: identifier });
    throw new UnauthorizedError('Invalid username or password');
  }

  const isPasswordValid = await bcrypt.compare(dto.password, user.password);

  if (!isPasswordValid) {
    logWarn('Login attempt with invalid password', { credential: identifier });
    throw new UnauthorizedError('Invalid username or password');
  }

  if (!authEnvs.accessTokenSecret || !authEnvs.refreshTokenSecret) {
    logError('JWT secrets not configured', { module: 'auth.service.ts/loginUser' });
    throw new AppError('Server configuration error', 500, 'INTERNAL_SERVER_ERROR');
  }

  const userId = user._id.toString();
  let refreshTokenStr = '';

  await runInTransaction(async (session) => {
    try {
      await authRepo.revokePasswordResetTokensOnLogin(
        user._id,
        TokenRevocationReason.USER_LOGIN,
        session
      );
    } catch (err: unknown) {
      logError('Failed to cleanup reset tokens on login', {
        module: 'auth.service.ts/loginUser',
        error: err instanceof Error ? err.message : String(err),
      });
    }

    const result = await generateRefreshToken(userId, undefined, undefined, session);
    refreshTokenStr = result.token;

    await authRepo.createSession(
      user._id,
      result.rootTokenId,
      new Date(Date.now() + AuthConstants.SESSION_ABSOLUTE_EXPIRY_MS),
      ipAddress,
      userAgent,
      session
    );
  });

  const accessTokenStr = generateAccessToken(userId, user.username, user.email);

  return {
    userId,
    username: user.username,
    email: user.email,
    accessToken: accessTokenStr,
    refreshToken: refreshTokenStr,
  };
}

export async function rotateRefreshToken(
  storedToken: StoredToken | undefined,
  decodedToken: DecodedToken | undefined
): Promise<{
  userId: string;
  username: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}> {
  if (!decodedToken || !storedToken) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  const userId = decodedToken.id;
  const user = await userRepo.findActiveUserById(userId);

  if (!user) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  const newAccessToken = generateAccessToken(userId, user.username, user.email);
  let newRefreshTokenStr = '';

  await runInTransaction(async (session) => {
    const result = await generateRefreshToken(
      userId,
      storedToken.rootTokenId.toString(),
      storedToken._id.toString(),
      session
    );
    newRefreshTokenStr = result.token;

    await revokeRefreshToken(storedToken.tokenHash, TokenRevocationReason.TOKEN_ROTATION, session);
  });

  return {
    userId,
    username: user.username,
    email: user.email,
    accessToken: newAccessToken,
    refreshToken: newRefreshTokenStr,
  };
}

export interface SessionSummary {
  id: string;
  ipAddress: string;
  userAgent: string;
  lastLogin: Date;
  createdAt: Date;
  isCurrent: boolean;
}

export async function listSessions(
  userId: string,
  currentRootTokenId: mongoose.Types.ObjectId
): Promise<SessionSummary[]> {
  const sessions = await authRepo.getActiveSessionsForUser(userId);

  return sessions.map((s) => ({
    id: s._id.toString(),
    ipAddress: s.ipAddress,
    userAgent: s.userAgent,
    lastLogin: s.lastLogin,
    createdAt: s.createdAt,
    isCurrent: s.rootTokenId.equals(currentRootTokenId),
  }));
}

function assertCanRevokeOlderSessions(
  currentSession: { createdAt: Date },
  targetCreatedAts: Date[]
): void {
  const currentAgeMs = Date.now() - currentSession.createdAt.getTime();
  const hasOlderTarget = targetCreatedAts.some((createdAt) => createdAt < currentSession.createdAt);

  if (currentAgeMs < AuthConstants.NEW_SESSION_REVOKE_LOCK_MS && hasOlderTarget) {
    throw new ForbiddenError(
      'This device is too new to sign out older devices. This unlocks 48 hours after you sign in here.'
    );
  }
}

export async function revokeSession(
  userId: string,
  currentRootTokenId: mongoose.Types.ObjectId,
  targetSessionId: string
): Promise<void> {
  const currentSession = await authRepo.findSessionByRootTokenId(currentRootTokenId);
  if (!currentSession) {
    throw new UnauthorizedError('Current session not found');
  }

  if (currentSession._id.toString() === targetSessionId) {
    throw new BadRequestError('Use logout to sign out of this device');
  }

  const targetSession = await authRepo.findActiveSessionByIdForUser(targetSessionId, userId);
  if (!targetSession) {
    throw new NotFoundError('Session not found');
  }

  assertCanRevokeOlderSessions(currentSession, [targetSession.createdAt]);

  await runInTransaction(async (session) => {
    await authRepo.revokeTokenFamily(
      targetSession.rootTokenId,
      TokenRevocationReason.USER_REVOKED,
      session
    );
    await authRepo.deactivateSessionById(targetSession._id, userId, session);
  });
}

export async function revokeAllOtherSessions(
  userId: string,
  currentRootTokenId: mongoose.Types.ObjectId
): Promise<{ revokedCount: number }> {
  const currentSession = await authRepo.findSessionByRootTokenId(currentRootTokenId);
  if (!currentSession) {
    throw new UnauthorizedError('Current session not found');
  }

  const otherSessions = (await authRepo.getActiveSessionsForUser(userId)).filter(
    (s) => !s._id.equals(currentSession._id)
  );

  assertCanRevokeOlderSessions(
    currentSession,
    otherSessions.map((s) => s.createdAt)
  );

  await runInTransaction(async (session) => {
    for (const s of otherSessions) {
      await authRepo.revokeTokenFamily(s.rootTokenId, TokenRevocationReason.USER_REVOKED, session);
      await authRepo.deactivateSessionById(s._id, userId, session);
    }
  });

  return { revokedCount: otherSessions.length };
}

export async function logoutUser(userId: string, storedToken?: StoredToken): Promise<void> {
  if (storedToken) {
    await runInTransaction(async (session) => {
      await revokeRefreshToken(storedToken.tokenHash, TokenRevocationReason.USER_LOGOUT, session);
      await authRepo.deactivateSessionByRootTokenId(storedToken.rootTokenId.toString(), session);
    });
  }
  logInfo('User logged out', { userId });
}

export async function processForgotPassword(
  dto: z.infer<typeof authScheme.forgotPasswordSchema>,
  ipAddress: string,
  userAgent: string
): Promise<void> {
  const normalizedEmail = dto.email.trim().toLowerCase();
  const emailHash = crypto.createHash('sha256').update(normalizedEmail).digest('hex');

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const { totalCount, emailCount, lastEmailAt } = await authRepo.getRateLimitDataForPasswordReset(
    emailHash,
    oneHourAgo
  );

  // Rate limit: max 20 requests per emailHash per hour
  if (totalCount >= AuthConstants.MAX_REQUESTS_PER_HR) {
    logWarn('forgot-password: request limit exceeded', { emailHash, ip: ipAddress, userAgent });
    throw new RateLimitError();
  }

  // Rate limit: max 5 emails per emailHash per hour
  if (emailCount >= AuthConstants.MAX_EMAILS_PER_HR) {
    logWarn('forgot-password: email send limit exceeded', { emailHash, ip: ipAddress, userAgent });
    throw new RateLimitError();
  }

  // Cooldown: 30 seconds between email sends for this emailHash
  if (lastEmailAt) {
    const msSinceLastEmail = Date.now() - lastEmailAt.getTime();
    if (msSinceLastEmail < AuthConstants.RESEND_COOLDOWN_MS) {
      const secondsRemaining = Math.ceil(
        (AuthConstants.RESEND_COOLDOWN_MS - msSinceLastEmail) / 1000
      );
      logWarn('forgot-password: cooldown active', {
        emailHash,
        ip: ipAddress,
        userAgent,
        secondsRemaining,
      });
      throw new RateLimitError(
        `Please wait ${secondsRemaining.toString()} seconds before resending reset link`
      );
    }
  }

  const user = await userRepo.findActiveUserByEmail(normalizedEmail);
  if (!user) {
    await authRepo.createPasswordResetRequest({
      emailHash,
      ip: ipAddress,
      userAgent,
      emailSent: false,
    });
    logWarn('forgot-password: user not found or inactive', { ip: ipAddress, userAgent });
    return;
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + AuthConstants.TOKEN_EXPIRY_MS);

  await runInTransaction(async (session) => {
    await authRepo.cleanupExcessPasswordResetTokens(
      user._id,
      AuthConstants.MAX_ACTIVE_TOKENS,
      session
    );

    await authRepo.createPasswordResetRequest(
      { emailHash, ip: ipAddress, userAgent, emailSent: true },
      session
    );

    await authRepo.createPasswordResetToken(
      {
        userId: user._id,
        tokenHash,
        expiresAt,
        requestIp: ipAddress,
        userAgent,
      },
      session
    );

    const frontendUrl = process.env.FRONTEND_URL ?? '';
    const resetLink = `${frontendUrl}/reset-password?token=${rawToken}`;
    const appName = process.env.APP_NAME ?? 'BookMyVenue';

    await authRepo.createEmailTask(
      {
        intent: 'password_reset',
        recipient: user.email,
        subject: `Reset your ${appName} password`,
        metadata: { resetLink },
      },
      session
    );
  });

  logInfo('forgot-password: reset email successfully synced & queued', {
    userId: user._id.toString(),
    ip: ipAddress,
    userAgent,
  });
}

export async function processResetPassword(
  dto: z.infer<typeof authScheme.resetPasswordSchema>,
  ipAddress: string,
  userAgent: string
): Promise<void> {
  const { token, password } = dto;
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  await runInTransaction(async (session) => {
    const tokenRecord = await authRepo.markPasswordResetTokenAsUsed(tokenHash, session);

    if (!tokenRecord) {
      logWarn('reset-password: token not found or already used', { ip: ipAddress, userAgent });
      throw new BadRequestError('Invalid or expired reset token');
    }

    const user = await userRepo.findActiveUserByIdWithPassword(
      tokenRecord.userId.toString(),
      session
    );

    if (!user) {
      logWarn('reset-password: user not found or inactive', {
        userId: tokenRecord.userId.toString(),
        ip: ipAddress,
        userAgent,
      });
      throw new BadRequestError('Invalid or expired reset token');
    }

    const userId = user._id;
    const isSamePassword = await bcrypt.compare(password, user.password);

    if (isSamePassword) {
      await authRepo.revokeAllOtherPasswordResetTokens(
        userId,
        tokenRecord._id,
        TokenRevocationReason.PASSWORD_REUSE_ATTEMPT,
        session
      );
      logWarn('reset-password: password reuse attempt', {
        userId: userId.toString(),
        ip: ipAddress,
        userAgent,
      });
      throw new BadRequestError('New password cannot be the same as your old password');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await userRepo.updateUserPassword(userId, hashedPassword, session);

    await authRepo.revokeActivePasswordResetTokens(
      userId,
      tokenRecord._id,
      TokenRevocationReason.PASSWORD_CHANGED,
      session
    );

    await authRepo.revokeAllRefreshTokensForUser(
      userId,
      TokenRevocationReason.PASSWORD_CHANGED,
      session
    );

    await authRepo.deactivateAllSessionsForUser(userId, session);

    const appName = process.env.APP_NAME ?? 'BookMyVenue';
    await authRepo.createEmailTask(
      {
        intent: 'security_alert',
        recipient: user.email,
        subject: `Your ${appName} password was changed`,
        metadata: {},
      },
      session
    );

    logInfo('reset-password: password reset successful', {
      userId: userId.toString(),
      ip: ipAddress,
      userAgent,
    });
  });
}

export async function changePassword(
  userId: string,
  dto: z.infer<typeof validator.changePasswordSchema>,
  ipAddress: string,
  userAgent: string
): Promise<void> {
  const session = await mongoose.startSession();

  await session.withTransaction(async () => {
    const user = await userRepo.findActiveUserByIdWithPassword(userId, session);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isOldPasswordValid = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new BadRequestError('Incorrect old password');
    }

    const isSamePassword = await bcrypt.compare(dto.newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestError('New password cannot be the same as your old password');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 12);
    await userRepo.updateUserPassword(userId, hashedPassword, session);

    await authRepo.revokeAllRefreshTokensForUser(
      new mongoose.Types.ObjectId(userId),
      TokenRevocationReason.PASSWORD_CHANGED,
      session
    );

    await authRepo.deactivateAllSessionsForUser(new mongoose.Types.ObjectId(userId), session);

    const appName = process.env.APP_NAME ?? 'BookMyVenue';
    await authRepo.createEmailTask(
      {
        intent: 'security_alert',
        recipient: user.email,
        subject: `Your ${appName} password was changed`,
        metadata: {},
      },
      session
    );

    logInfo('change-password: password changed successfully', {
      userId,
      ip: ipAddress,
      userAgent,
    });
  });
  await session.endSession();
}
