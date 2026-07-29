import React from 'react';
import { Wallet } from 'lucide-react';

const EmptyWallet: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="p-4 rounded-full bg-primary/10 text-primary/60 mb-4 border border-primary/5">
        <Wallet className="w-8 h-8 stroke-[1.5]" />
      </div>
      <h3 className="text-base font-bold text-foreground">No Transactions Yet</h3>
      <p className="text-sm text-foreground/60 mt-2 max-w-xs leading-relaxed">
        Your booking payments, refunds, and wallet activity will appear here once you start using
        BookMyVenue.
      </p>
    </div>
  );
};

export default EmptyWallet;
