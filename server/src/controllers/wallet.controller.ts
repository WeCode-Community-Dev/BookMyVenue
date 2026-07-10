import { Request, Response, NextFunction } from 'express';
import * as walletService from '@/services/wallet.service';
import success from '@/utils/response';
import { HTTP_STATUS } from '@/constants/http';
import { AppError } from '@/utils/AppError';

/**
 * Get user wallet and transactions
 */
export const getUserWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('Unauthorized access', HTTP_STATUS.UNAUTHORIZED);
    }

    const { wallet, transactions } = await walletService.getOrCreateUserWallet(userId);

    return success(res, HTTP_STATUS.OK, { wallet, transactions }, 'Wallet fetched successfully');
  } catch (error) {
    next(error);
  }
};
