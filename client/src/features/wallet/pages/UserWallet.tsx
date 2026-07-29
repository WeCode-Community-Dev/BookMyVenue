import React, { useEffect, useCallback, useState } from 'react';
import { Loader2, Wallet, Search, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';

import BalanceCard from '../components/BalanceCard';
import TransactionList from '../components/TransactionList';

import { walletApi } from '../services/userWallet.service';
import { useAsyncFetch } from '@/shared/hooks/useAsyncFetch';
import { useAppStore } from '@/store/app.store';

const UserWallet: React.FC = () => {
  const { data, loading, error, execute } = useAsyncFetch<any>();
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'CREDIT' | 'DEBIT'>('ALL');

  const fetchWallet = useCallback(() => {
    if (isAuthenticated) {
      execute(walletApi.getUserWallet);
    }
  }, [execute, isAuthenticated]);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-foreground/75 font-semibold animate-pulse">Loading wallet details...</p>
      </div>
    );
  }

  if (error || !isAuthenticated) {
    return (
      <div className="w-full max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-8 bg-surface border border-border rounded-3xl shadow-sm">
          <Wallet className="w-12 h-12 text-error mb-4" />
          <p className="text-error font-semibold text-lg mb-2">Failed to load wallet</p>
          <p className="text-foreground/60 text-sm max-w-md mb-6">
            {!isAuthenticated ? 'You must be logged in to view your wallet.' : error}
          </p>
          {isAuthenticated && (
            <button
              onClick={fetchWallet}
              className="px-6 py-2.5 bg-primary hover:bg-accent text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  const walletData = data?.data || data;
  const { wallet, transactions } = walletData || {};

  // Filter transactions locally based on search query and selected filter type
  const filteredTransactions = (transactions || []).filter((tx: any) => {
    const title = tx.title || '';
    const description = tx.description || '';
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'ALL' || tx.type === filterType;

    return matchesSearch && matchesType;
  });

  // Calculate stats dynamically from transactions
  const stats = (transactions || []).reduce(
    (acc: any, tx: any) => {
      if (tx.status === 'SUCCESS') {
        if (tx.type === 'CREDIT') {
          acc.totalCredits += tx.amount;
        } else if (tx.type === 'DEBIT') {
          acc.totalDebits += tx.amount;
        }
      } else if (tx.status === 'PENDING') {
        acc.totalPending += 1;
      }
      return acc;
    },
    { totalCredits: 0, totalDebits: 0, totalPending: 0 }
  );

  return (
    <div className="w-full max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          My Wallet
        </h1>
        <p className="mt-2 text-sm sm:text-base text-foreground/60">
          Monitor your account balance, refunds, and view your transaction history.
        </p>
      </div>

      {wallet ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Balance & Summary */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <BalanceCard wallet={wallet} />

            {/* Wallet Summary Card */}
            <div className="w-full rounded-3xl border border-border bg-surface p-6 shadow-sm">
              <h3 className="text-sm font-bold text-foreground mb-4">Wallet Summary</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-background border border-border">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-success/10 text-success border border-success/10">
                      <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider">
                        Total Credits
                      </p>
                      <h4 className="text-sm font-extrabold text-foreground mt-0.5">
                        ₹{stats.totalCredits.toLocaleString('en-IN')}
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-background border border-border">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-error/10 text-error border border-error/10">
                      <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider">
                        Total Spent
                      </p>
                      <h4 className="text-sm font-extrabold text-foreground mt-0.5">
                        ₹{stats.totalDebits.toLocaleString('en-IN')}
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-background border border-border">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-warning/10 text-warning border border-warning/10">
                      <Clock className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider">
                        Pending Actions
                      </p>
                      <h4 className="text-sm font-extrabold text-foreground mt-0.5">
                        {stats.totalPending}{' '}
                        {stats.totalPending === 1 ? 'Transaction' : 'Transactions'}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Search, Filter & List */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="w-full rounded-3xl border border-border bg-surface p-6 shadow-sm">
              {/* Card Header & Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
                <div>
                  <h2 className="text-base font-bold text-foreground">Transaction Activity</h2>
                  <p className="text-xs text-foreground/50 mt-0.5">
                    Showing {filteredTransactions.length} transactions
                  </p>
                </div>

                {/* Filter segments */}
                <div className="flex bg-muted/20 border border-border p-1 rounded-xl self-start sm:self-auto">
                  {(['ALL', 'CREDIT', 'DEBIT'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        filterType === type
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-foreground/60 hover:text-foreground hover:bg-muted/10'
                      }`}
                    >
                      {type === 'ALL' ? 'All' : type === 'CREDIT' ? 'Credits' : 'Debits'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Bar */}
              <div className="mt-4 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                <input
                  type="text"
                  placeholder="Search transactions by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-foreground/30"
                />
              </div>

              {/* Transactions List */}
              <TransactionList transactions={filteredTransactions} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-surface border border-border rounded-3xl shadow-sm">
          <Wallet className="w-12 h-12 text-foreground/30 stroke-[1.2] mb-4" />
          <h3 className="text-lg font-bold text-foreground">Wallet Unavailable</h3>
          <p className="text-sm text-foreground/60 mt-1 max-w-xs leading-relaxed">
            No wallet information is currently available for your account.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserWallet;
