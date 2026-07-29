import React from 'react';

interface WalletCardProps {
  children: React.ReactNode;
}

const WalletCard: React.FC<WalletCardProps> = ({ children }) => {
  return (
    <div className="w-full rounded-3xl border border-border bg-surface p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/50">
        <h2 className="text-base font-bold text-foreground">Recent Transactions</h2>

        <button className="text-xs font-semibold text-primary hover:text-accent transition-colors cursor-pointer">
          View All
        </button>
      </div>

      {/* Content */}
      {children}
    </div>
  );
};

export default WalletCard;
