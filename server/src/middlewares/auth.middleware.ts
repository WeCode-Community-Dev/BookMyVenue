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
    logger.info(`Access_token: ${accessToken}`);

    if (!accessToken) {
      throw new AppError('Unauthorized access', HTTP_STATUS.UNAUTHORIZED);
    }

    const decoded = jwt.verify(accessToken, env.JWT_ACCESS_SECRET) as JwtPayload;
    const userId = decoded.id;

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

    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};
