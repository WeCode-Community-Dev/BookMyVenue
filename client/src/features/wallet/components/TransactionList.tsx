import React from 'react';
import type { WalletTransaction } from '../types';
import TransactionItem from './TransactionItems';
import EmptyWallet from './EmptyWallet';

interface TransactionListProps {
  transactions: WalletTransaction[];
  loading?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, loading = false }) => {
  if (loading) {
    return (
      <div className="w-full space-y-3 mt-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-16 w-full rounded-2xl bg-muted/20 animate-pulse border border-border"
          />
        ))}
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return <EmptyWallet />;
  }

  return (
    <div className="w-full mt-4 space-y-3">
      {transactions.map((tx) => (
        <TransactionItem key={tx.id || (tx as any)._id} transaction={tx} />
      ))}
    </div>
  );
};

export default TransactionList;
