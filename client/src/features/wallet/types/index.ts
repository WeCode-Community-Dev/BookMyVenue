export interface Wallet {
  balance: number;
  currency: string;
  updatedAt: string;
}

export type TransactionType = 'CREDIT' | 'DEBIT';

export type TransactionStatus = 'SUCCESS' | 'PENDING' | 'FAILED';

export interface WalletTransaction {
  id: string;
  title: string;
  description?: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  createdAt: string;

  // optional booking linkage
  bookingId?: string;
}
