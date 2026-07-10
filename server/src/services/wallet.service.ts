import { walletRepository } from '@/repositories/wallet.repository';
import { IWallet } from '@/models/wallet.model';
import { IWalletTransaction } from '@/models/walletTransaction.model';

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
