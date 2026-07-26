import { walletRepository } from '@/repositories/wallet.repository';
import { IWallet } from '@/models/wallet.model';
import { IWalletTransaction, WalletTransaction } from '@/models/walletTransaction.model';
import { AppError } from '@/utils/AppError';
import { HTTP_STATUS } from '@/constants/http';

/**
 * Get the user's wallet (creating one if it doesn't exist) and its transactions.
 * Uses an upsert to avoid duplicate wallet creation under concurrent requests.
 */
export const getOrCreateUserWallet = async (
  userId: string
): Promise<{ wallet: IWallet; transactions: IWalletTransaction[] }> => {
  const wallet = await walletRepository.getOrCreateByUserId(userId);
  const transactions = await walletRepository.findTransactionsByWalletId(wallet._id.toString());

  return { wallet, transactions };
};

export const getPaginatedWalletTransactions = async (
  userId: string,
  options: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    status?: string;
    source?: string;
    sort?: string;
  }
) => {
  const wallet = await walletRepository.getOrCreateByUserId(userId);
  return await walletRepository.getPaginatedTransactions(wallet._id.toString(), options);
};

import Owner from '@/models/owner.model';

export const requestWithdrawalService = async (
  userId: string,
  amount: number,
  bankDetails: { accountNumber: string; ifscCode: string; accountHolderName: string }
) => {
  const ownerDoc = await Owner.findOne({ userId });
  if (ownerDoc && ownerDoc.isPayoutFrozen) {
    throw new AppError(
      'Wallet withdrawals are currently frozen for your account under administrative investigation',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  if (!amount || amount <= 0) {
    throw new AppError('Withdrawal amount must be greater than zero', HTTP_STATUS.BAD_REQUEST);
  }
  if (!bankDetails?.accountNumber || !bankDetails?.ifscCode || !bankDetails?.accountHolderName) {
    throw new AppError(
      'Complete bank details (account number, IFSC, holder name) are required for withdrawal',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const wallet = await walletRepository.getOrCreateByUserId(userId);
  if (wallet.balance < amount) {
    throw new AppError(
      `Insufficient wallet balance for withdrawal. Requested: ₹${amount}, Available: ₹${wallet.balance}`,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const balanceBefore = wallet.balance;
  const balanceAfter = balanceBefore - amount;

  // Deduct balance
  await walletRepository.creditRefundToWallet(userId, -amount);

  // Record WITHDRAWAL transaction
  const transaction = await WalletTransaction.create({
    walletId: wallet._id,
    userId,
    type: 'DEBIT',
    amount,
    balanceBefore,
    balanceAfter,
    status: 'PENDING',
    source: 'WITHDRAWAL',
    description: `Bank withdrawal request to ${bankDetails.accountNumber} (IFSC: ${bankDetails.ifscCode})`,
    metadata: { bankDetails },
  });

  return { transaction, remainingBalance: balanceAfter };
};
