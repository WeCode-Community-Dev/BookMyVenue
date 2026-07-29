import env from '@/configs/env.config';
import { HTTP_STATUS } from '@/constants/http';
import { JwtPayload } from '@/constants/types';
import logger from '@/libs/logger';
import { userRepository } from '@/repositories/user.repository';
import { AppError } from '@/utils/AppError';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      throw new AppError('Unauthorized access', HTTP_STATUS.UNAUTHORIZED);
    }

    const decoded = jwt.verify(accessToken, env.JWT_ACCESS_SECRET) as JwtPayload;
    const userId = decoded.id;

    // Always fetch user from DB to get live role/block status (CVE-BMV-013)
    // Prevents stale JWT payload from bypassing role changes or unblock events
    const user = await userRepository.findById(userId);

    if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);

    if (user.isBlocked) {
      res.clearCookie('accessToken', { httpOnly: true, sameSite: 'lax' });
      res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'lax' });
      throw new AppError(
        'Access denied. Your account is currently blocked.',
        HTTP_STATUS.FORBIDDEN
      );
    }

    // Set req.user from live DB data — not the JWT payload — to always reflect
    // the current role and account status rather than a stale snapshot
    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    next();
  } catch (error) {
    next(error);
  }
};
