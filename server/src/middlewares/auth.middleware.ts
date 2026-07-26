import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import type { RefreshTokenPayload, TokenPayload } from '../types/express';
import { ResponseUtil } from '../utils/responseUtils';
import * as authRepo from '../modules/auth/auth.repository';
import { tokenVerifyOptions, revokeTokenFamily } from '../utils/tokenUtils';
import { TokenRevocationReason } from '../constants/auth.constants';
import crypto from 'crypto';
import { logWarn, logError } from '../utils/logger';

export const verifyAccessToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const accessToken = req.cookies.accessToken as string | undefined;

    if (!accessToken) {
      logWarn('Access token missing', { path: req.path, method: req.method });
      ResponseUtil.unauthorized(res, 'Access token required');
      return;
    }

    const accessSecret = process.env.JWT_ACCESS_SECRET;
    if (!accessSecret) {
      logError('JWT_ACCESS_SECRET not configured', {
        module: 'auth.middleware.ts/verifyAccessToken',
        path: req.path,
      });
      ResponseUtil.internalServerError(res, 'Server configuration error');
      return;
    }

    const decoded = jwt.verify(accessToken, accessSecret, tokenVerifyOptions) as TokenPayload;

    if (!decoded.id || !decoded.username || !decoded.email) {
      logWarn('Invalid access token payload', { path: req.path });
      ResponseUtil.unauthorized(res, 'Invalid access token');
      return;
    }

    req.user = {
      userId: decoded.id,
      username: decoded.username,
      email: decoded.email,
      role: {},
    };

    next();
  } catch (error) {
    const authError = error as Error;
    logWarn('Access token verification failed', {
      error: authError.message,
      path: req.path,
    });

    if (authError.name === 'TokenExpiredError') {
      ResponseUtil.unauthorized(res, 'Access token expired');
      return;
    }

    ResponseUtil.unauthorized(res, 'Invalid access token');
  }
};

export const verifyAccessTokenOptional = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const accessToken = req.cookies.accessToken as string | undefined;

    if (!accessToken) {
      next();
      return;
    }

    const accessSecret = process.env.JWT_ACCESS_SECRET;
    if (!accessSecret) {
      logError('JWT_ACCESS_SECRET not configured', {
        module: 'auth.middleware.ts/verifyAccessTokenOptional',
        path: req.path,
      });
      next();
      return;
    }

    const decoded = jwt.verify(accessToken, accessSecret, tokenVerifyOptions) as TokenPayload;

    if (decoded.id && decoded.username && decoded.email) {
      req.user = {
        userId: decoded.id,
        username: decoded.username,
        email: decoded.email,
        role: {},
      };
    }

    next();
  } catch (error) {
    const authError = error as Error;
    logWarn('Optional access token verification failed', {
      error: authError.message,
      path: req.path,
    });
    next();
  }
};

export const verifyRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken as string | undefined;

    if (!refreshToken) {
      logWarn('Refresh token missing', { path: req.path });
      ResponseUtil.unauthorized(res, 'Refresh token required');
      return;
    }

    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!refreshSecret) {
      logError('JWT_REFRESH_SECRET not configured', {
        module: 'auth.middleware.ts/verifyRefreshToken',
        path: req.path,
      });
      ResponseUtil.internalServerError(res, 'Server configuration error');
      return;
    }

    const decoded = jwt.verify(
      refreshToken,
      refreshSecret,
      tokenVerifyOptions
    ) as RefreshTokenPayload;

    if (!decoded.id || !decoded.jti) {
      logWarn('Invalid refresh token payload', { path: req.path });
      ResponseUtil.unauthorized(res, 'Invalid refresh token');
      return;
    }

    const tokenHash = crypto.createHash('sha256').update(decoded.jti).digest('hex');

    const storedToken = await authRepo.findRefreshTokenByHash(
      tokenHash,
      new mongoose.Types.ObjectId(decoded.id)
    );

    if (!storedToken) {
      logWarn('Refresh token not found', { path: req.path });
      ResponseUtil.unauthorized(res, 'Invalid refresh token');
      return;
    }

    if (storedToken.expiresAt < new Date()) {
      logWarn('Refresh token expired', { path: req.path });
      ResponseUtil.unauthorized(res, 'Refresh token expired, please login again');
      return;
    }

    // Reuse detection
    if (!storedToken.active) {
      logWarn('Refresh token reuse detected — revoking entire token family', {
        path: req.path,
        rootTokenId: storedToken.rootTokenId.toString(),
        userId: decoded.id,
      });

      await revokeTokenFamily(
        storedToken.rootTokenId,
        TokenRevocationReason.SUSPICIOUS_ACTIVITY
      ).catch((err: unknown) => {
        const error = err as Error;
        logError('Failed to revoke token family on reuse detection', {
          module: 'auth.middleware.ts/verifyRefreshToken',
          error: error.message,
          rootTokenId: storedToken.rootTokenId.toString(),
        });
      });

      await authRepo
        .deactivateSessionByRootTokenId(storedToken.rootTokenId.toString())
        .catch((err: unknown) => {
          const error = err as Error;
          logError('Failed to deactivate session on reuse detection', {
            module: 'auth.middleware.ts/verifyRefreshToken',
            error: error.message,
            rootTokenId: storedToken.rootTokenId.toString(),
          });
        });

      ResponseUtil.unauthorized(res, 'Invalid refresh token');
      return;
    }

    // Session validation
    const session = await authRepo.findSessionByRootTokenId(storedToken.rootTokenId);

    if (!session) {
      logWarn('Session not found for refresh token', { path: req.path });
      ResponseUtil.unauthorized(res, 'Invalid refresh token');
      return;
    }

    if (!session.active) {
      logWarn('Session is inactive', { path: req.path });
      ResponseUtil.unauthorized(res, 'Session has been terminated, please log in again');
      return;
    }

    if (session.absoluteExpiresAt < new Date()) {
      logWarn('Session absolute expiry reached', { path: req.path });
      ResponseUtil.unauthorized(res, 'Session expired, please log in again');
      return;
    }

    req.token = {
      decoded: {
        id: decoded.id,
        jti: decoded.jti,
      },
      stored: storedToken,
    };

    next();
  } catch (error) {
    const authError = error as Error;
    logWarn('Refresh token verification failed', {
      error: authError.message,
    });

    if (authError.name === 'TokenExpiredError') {
      ResponseUtil.unauthorized(res, 'Refresh token expired');
      return;
    }

    ResponseUtil.unauthorized(res, 'Invalid refresh token');
  }
};
