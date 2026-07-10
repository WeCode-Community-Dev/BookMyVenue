import { HTTP_STATUS } from '@/constants/http';
import { AppError } from '@/utils/AppError';
import { NextFunction, Request, Response } from 'express';
import Owner from '@/models/owner.model';

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('User not authenticated', HTTP_STATUS.UNAUTHORIZED));
    }

    if (!allowedRoles.includes(req.user.role as string)) {
      return next(
        new AppError(
          'Access denied. You do not have the required permissions.',
          HTTP_STATUS.FORBIDDEN
        )
      );
    }

    next();
  };
};

export const requireOwnerVerification = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new AppError('User not authenticated', HTTP_STATUS.UNAUTHORIZED));
  }

  if (req.user.role !== 'owner') {
    return next();
  }

  try {
    const owner = await Owner.findOne({ userId: req.user.id });
    if (!owner || owner.verificationStatus !== 'approved') {
      return next(
        new AppError(
          'Access denied. Your venue owner account is not verified yet.',
          HTTP_STATUS.FORBIDDEN
        )
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};
