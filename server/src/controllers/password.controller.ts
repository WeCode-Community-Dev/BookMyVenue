import { Request, Response, NextFunction } from 'express';
import { passwordService } from '../services/password.service';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/http';
import success from '../utils/response';

export const requestPasswordChangeOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('Unauthorized access', HTTP_STATUS.UNAUTHORIZED);
    }

    await passwordService.requestChangeOtp(userId);

    success(res, HTTP_STATUS.OK, null, 'OTP sent to your registered email.');
  } catch (error) {
    next(error);
  }
};

export const verifyAndChangePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('Unauthorized access', HTTP_STATUS.UNAUTHORIZED);
    }

    const { otp, newPassword } = req.body;
    if (!otp || !newPassword) {
      throw new AppError('OTP and new password are required', HTTP_STATUS.BAD_REQUEST);
    }

    await passwordService.changePassword(userId, otp, newPassword);

    success(res, HTTP_STATUS.OK, null, 'Password successfully changed.');
  } catch (error) {
    next(error);
  }
};
