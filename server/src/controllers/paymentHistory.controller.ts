import { Request, Response, NextFunction } from 'express';
import * as paymentHistoryService from '@/services/userPaymentHistory.service';
import success from '@/utils/response';
import { HTTP_STATUS } from '@/constants/http';
import { AppError } from '@/utils/AppError';

export const getPaymentHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('Unauthorized access', HTTP_STATUS.UNAUTHORIZED);
    }

    const { page, limit, search, paymentStatus, refundStatus, sort } = req.query;

    const result = await paymentHistoryService.getPaymentHistory(userId, {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      search: search as string,
      paymentStatus: paymentStatus as string,
      refundStatus: refundStatus as string,
      sort: sort as string,
    });

    return success(res, HTTP_STATUS.OK, result, 'Payment history fetched successfully');
  } catch (error) {
    next(error);
  }
};
