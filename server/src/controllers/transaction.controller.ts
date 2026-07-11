import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '@/constants/http';
import success from '@/utils/response';
import * as transactionService from '@/services/transaction.service';

export const getAdminTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const options = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      search: req.query.search as string,
      type: req.query.type as string,
      status: req.query.status as string,
      sort: req.query.sort as string,
    };

    const result = await transactionService.getAdminTransactions(options);
    success(res, HTTP_STATUS.OK, result, 'Admin transactions fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const getAdminTransactionStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await transactionService.getAdminTransactionStats();
    success(res, HTTP_STATUS.OK, stats, 'Admin transaction stats fetched successfully');
  } catch (error) {
    next(error);
  }
};
