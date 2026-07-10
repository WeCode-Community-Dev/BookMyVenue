import React from 'react';
import type { WalletTransaction } from '../types';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface TransactionItemProps {
  transaction: WalletTransaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const isCredit = transaction.type === 'CREDIT';

  const amountColor = isCredit ? 'text-success font-extrabold' : 'text-error font-extrabold';
  const sign = isCredit ? '+' : '-';

  return (
    <div className="w-full flex items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-surface/40 hover:bg-muted/10 transition-all duration-200 hover:border-border/80">
      {/* Left side: Icon & Title/Details */}
      <div className="flex items-center gap-4">
        <div
          className={`p-2.5 rounded-xl border ${
            isCredit
              ? 'bg-success/10 text-success border-success/15'
              : 'bg-error/10 text-error border-error/15'
          }`}
        >
          {isCredit ? (
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          ) : (
            <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
          )}
        </div>

        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-bold text-foreground leading-tight">{transaction.title}</p>
          {transaction.description && (
            <p className="text-xs text-foreground/60 max-w-sm line-clamp-1">
              {transaction.description}
            </p>
          )}
          <p className="text-[10px] text-foreground/40 font-medium">
            {new Date(transaction.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>

      {/* Right side: Amount & Badge */}
      <div className="flex flex-col items-end gap-1.5">
        <p className={`text-sm tracking-tight ${amountColor}`}>
          {sign} ₹{transaction.amount.toLocaleString('en-IN')}
        </p>

        <span
          className={`text-[9px] px-2.5 py-0.5 rounded-full border font-bold uppercase tracking-wider ${
            transaction.status === 'SUCCESS'
              ? 'border-success/20 bg-success/10 text-success'
              : transaction.status === 'PENDING'
                ? 'border-warning/20 bg-warning/10 text-warning'
                : 'border-error/20 bg-error/10 text-error'
          }`}
        >
          {transaction.status}
        </span>
      </div>
    </div>
  );
};

export default TransactionItem;
