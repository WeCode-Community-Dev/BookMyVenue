import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import mongoose from 'mongoose';
import type { Response } from 'express';
import { parseDurationToMs } from './timeUtils';
import * as authRepo from '../modules/auth/auth.repository';
import { authEnvs, jwtConfig } from '../constants/env';
import type { TokenRevocationReasonType } from '../constants/auth.constants';
import type { RefreshTokenPayload, TokenPayload } from '../types/express';

export const tokenVerifyOptions: jwt.VerifyOptions = {
  issuer: jwtConfig.issuer,
  audience: jwtConfig.audience,
  algorithms: [jwtConfig.algorithm],
};

export const generateAccessToken = (userId: string, username: string, email: string): string => {
  try {
    const payload: TokenPayload = {
      id: userId,
      username,
      email,
      iat: Math.floor(Date.now() / 1000),
    };

    const jwtOptions: jwt.SignOptions = {
      expiresIn: authEnvs.accessTokenExpiry as jwt.SignOptions['expiresIn'],
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
      algorithm: jwtConfig.algorithm,
      subject: userId,
    };

    if (!authEnvs.accessTokenSecret) {
      throw new Error('Access token secret not defined');
    }

    return jwt.sign(payload, authEnvs.accessTokenSecret, jwtOptions);
  } catch (error) {
    throw new Error(`Failed to generate access token: ${(error as Error).message}`, {
      cause: error,
    });
  }
};

export interface GenerateRefreshTokenResult {
  token: string;
  rootTokenId: string;
}

/**
 * Generates a signed refresh token JWT and persists a hashed record to MongoDB.
 * @param userId       - Owner of the token.
 * @param rootTokenId  - ObjectId string of the family root. Omit for a new session (login).
 * @param parentTokenId - ObjectId string of the token being replaced. Omit for login.
 * @param session      - Optional Mongoose ClientSession for transactional writes.
 */
export const generateRefreshToken = async (
  userId: string,
  rootTokenId?: string,
  parentTokenId?: string,
  session?: mongoose.ClientSession
): Promise<GenerateRefreshTokenResult> => {
  try {
    const jti = crypto.randomUUID();

    const payload: RefreshTokenPayload = {
      id: userId,
      iat: Math.floor(Date.now() / 1000),
      jti,
    };

    const jwtOptions: jwt.SignOptions = {
      expiresIn: authEnvs.refreshTokenExpiry as jwt.SignOptions['expiresIn'],
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
      algorithm: jwtConfig.algorithm,
      subject: userId,
    };

    if (!authEnvs.refreshTokenSecret) {
      throw new Error('Refresh token secret not defined');
    }

    const tokenId = new mongoose.Types.ObjectId();
    const effectiveRootTokenId = rootTokenId ? new mongoose.Types.ObjectId(rootTokenId) : tokenId;
    const effectiveParentTokenId = parentTokenId
      ? new mongoose.Types.ObjectId(parentTokenId)
      : null;

    const token = jwt.sign(payload, authEnvs.refreshTokenSecret, jwtOptions);
    const tokenHash = crypto.createHash('sha256').update(jti).digest('hex');
    const expiresAt = new Date(Date.now() + parseDurationToMs(authEnvs.refreshTokenExpiry));

    await authRepo.createRefreshToken(
      {
        _id: tokenId,
        userId: new mongoose.Types.ObjectId(userId),
        tokenHash,
        rootTokenId: effectiveRootTokenId,
        parentTokenId: effectiveParentTokenId,
        expiresAt,
      },
      session
    );

    return {
      token,
      rootTokenId: effectiveRootTokenId.toString(),
    };
  } catch (error) {
    throw new Error(`Failed to generate refresh token: ${(error as Error).message}`, {
      cause: error,
    });
  }
};

// Revoke a single refresh token
export const revokeRefreshToken = async (
  tokenHash: string,
  reason: TokenRevocationReasonType,
  session?: mongoose.ClientSession
): Promise<void> => {
  try {
    await authRepo.revokeRefreshToken(tokenHash, reason, session);
  } catch (error) {
    throw new Error(`Failed to revoke refresh token: ${(error as Error).message}`, {
      cause: error,
    });
  }
};

// Revoke a token family (same rootTokenId).
export const revokeTokenFamily = async (
  rootTokenId: mongoose.Types.ObjectId,
  reason: TokenRevocationReasonType,
  session?: mongoose.ClientSession
): Promise<void> => {
  try {
    await authRepo.revokeTokenFamily(rootTokenId, reason, session);
  } catch (error) {
    throw new Error(`Failed to revoke token family: ${(error as Error).message}`, {
      cause: error,
    });
  }
};

// Cookie helpers
export const setTokenCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
): Response => {
  const isProduction = process.env.NODE_ENV === 'production';
  const accessTokenMaxAge = parseDurationToMs(authEnvs.accessTokenExpiry);
  const refreshTokenMaxAge = parseDurationToMs(authEnvs.refreshTokenExpiry);

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: isProduction ? 'strict' : ('none' as const),
    maxAge: accessTokenMaxAge,
    path: '/',
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: isProduction ? 'strict' : ('none' as const),
    maxAge: refreshTokenMaxAge,
    path: '/api/v1/auth',
  });

  return res;
};

export const clearTokenCookies = (res: Response): Response => {
  res.clearCookie('accessToken', { path: '/' });
  res.clearCookie('refreshToken', { path: '/' });
  return res;
};
