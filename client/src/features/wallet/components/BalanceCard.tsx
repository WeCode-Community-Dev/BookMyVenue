import React from 'react';
import type { Wallet as WalletType } from '../types';
import { Wallet, RefreshCw } from 'lucide-react';

interface BalanceCardProps {
  wallet: WalletType;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ wallet }) => {
  return (
    <div className="w-full rounded-3xl border border-border bg-surface p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20">
      <div className="flex flex-col h-full justify-between gap-6">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/10">
              <Wallet className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div>
              <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider">
                My Wallet
              </p>
              <h2 className="text-sm font-semibold text-foreground">Available Balance</h2>
            </div>
          </div>
        </div>

        {/* Balance Display */}
        <div className="my-2">
          <h1 className="text-5xl font-black text-foreground tracking-tight flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-foreground/60">₹</span>
            {wallet.balance.toLocaleString('en-IN')}
          </h1>
          <p className="text-xs text-foreground/50 font-medium mt-1">
            Default Currency: {wallet.currency}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="pt-4 border-t border-border/50 flex items-center justify-between text-[11px] text-foreground/50">
          <div className="flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-foreground/35" />
            <span>
              Updated:{' '}
              {new Date(wallet.updatedAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
