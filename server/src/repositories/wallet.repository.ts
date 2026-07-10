import mongoose from 'mongoose';
import { Wallet, IWallet } from '../models/wallet.model';
import { WalletTransaction, IWalletTransaction } from '../models/walletTransaction.model';

export const walletRepository = {
  async findByUserId(userId: string): Promise<IWallet | null> {
    return await Wallet.findOne({ userId });
  },

  async create(walletData: Partial<IWallet>): Promise<IWallet> {
    const wallet = new Wallet(walletData);
    return await wallet.save();
  },

  async getOrCreateByUserId(userId: string): Promise<IWallet> {
    return await Wallet.findOneAndUpdate(
      { userId },
      {
        $setOnInsert: {
          userId,
          balance: 0,
          currency: 'INR',
          status: 'ACTIVE',
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );
  },

  async findTransactionsByWalletId(walletId: string, limit = 50): Promise<IWalletTransaction[]> {
    return await WalletTransaction.find({ walletId }).sort({ createdAt: -1 }).limit(limit);
  },

  async getPaginatedTransactions(
    walletId: string,
    options: {
      page?: number;
      limit?: number;
      search?: string;
      type?: string;
      status?: string;
      source?: string;
      sort?: string;
    }
  ): Promise<{ data: IWalletTransaction[]; total: number; page: number; totalPages: number }> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const query: any = { walletId };

    if (options.type) query.type = options.type;
    if (options.status) query.status = options.status;
    if (options.source) query.source = options.source;
    if (options.search) {
      query.$or = [
        { description: { $regex: options.search, $options: 'i' } },
        // Try searching by exact ID if it's a valid ObjectId
        ...(mongoose.Types.ObjectId.isValid(options.search) 
          ? [{ _id: new mongoose.Types.ObjectId(options.search) }, { bookingId: new mongoose.Types.ObjectId(options.search) }] 
          : [])
      ];
    }

    let sortOption: any = { createdAt: -1 };
    if (options.sort) {
      if (options.sort === 'oldest') sortOption = { createdAt: 1 };
      else if (options.sort === 'highestAmount') sortOption = { amount: -1 };
      else if (options.sort === 'lowestAmount') sortOption = { amount: 1 };
    }

    const [data, total] = await Promise.all([
      WalletTransaction.find(query).sort(sortOption).skip(skip).limit(limit),
      WalletTransaction.countDocuments(query),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  /**
   * Finds an existing REFUND transaction for a booking — used to prevent duplication.
   */
  async findRefundTransaction(
    bookingId: string,
    session?: mongoose.ClientSession
  ): Promise<IWalletTransaction | null> {
    return WalletTransaction.findOne(
      { bookingId: new mongoose.Types.ObjectId(bookingId), source: 'REFUND' },
      null,
      { session }
    );
  },

  /**
   * Atomically credits a refund amount to the user's wallet and returns the updated wallet.
   */
  async creditRefundToWallet(
    userId: string,
    amount: number,
    session: mongoose.ClientSession
  ): Promise<IWallet | null> {
    return Wallet.findOneAndUpdate(
      { userId },
      { $inc: { balance: amount } },
      { session, new: true }
    );
  },

  /**
   * Creates a CREDIT wallet transaction record for a refund inside a session.
   */
  async createRefundTransaction(
    data: {
      walletId: mongoose.Types.ObjectId;
      userId: mongoose.Types.ObjectId;
      amount: number;
      balanceBefore: number;
      balanceAfter: number;
      bookingId: mongoose.Types.ObjectId;
    },
    session: mongoose.ClientSession
  ): Promise<IWalletTransaction> {
    const [doc] = await WalletTransaction.create(
      [
        {
          walletId: data.walletId,
          userId: data.userId,
          type: 'CREDIT',
          amount: data.amount,
          balanceBefore: data.balanceBefore,
          balanceAfter: data.balanceAfter,
          status: 'SUCCESS',
          source: 'REFUND',
          bookingId: data.bookingId,
          description: 'Refund for cancelled booking',
        },
      ],
      { session }
    );
    return doc;
  },
};
