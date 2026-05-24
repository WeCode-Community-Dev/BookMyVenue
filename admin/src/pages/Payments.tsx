import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { 
  Search, Download, TrendingUp, RefreshCw
} from 'lucide-react';
export const PaymentsView: React.FC = () => {
  const { bookings, owners, settings, stats, sendNotification } = useAdmin();
  const [activeSubTab, setActiveSubTab] = useState<'transactions' | 'payouts'>('transactions');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Simulated action states
  const [processingPayoutOwnerId, setProcessingPayoutOwnerId] = useState<string | null>(null);

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Filter Transactions
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.venueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Calculate stats for Owners in Payouts tab
  const getOwnerPayoutDetails = () => {
    return owners.map(owner => {
      // Find all bookings for this owner
      const ownerBookings = bookings.filter(b => b.ownerId === owner.id);
      
      // Pending payout: bookings that are upcoming and paid
      const pendingPayout = ownerBookings
        .filter(b => b.status === 'upcoming' && b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + (b.amount - b.commissionAmount), 0);

      // Completed payout: bookings that are completed
      const completedPayout = ownerBookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (b.amount - b.commissionAmount), 0);

      return {
        owner,
        pendingPayout,
        completedPayout,
        bookingsCount: ownerBookings.length
      };
    });
  };

  const handleProcessPayout = (ownerId: string, ownerName: string, amount: number) => {
    if (amount <= 0) return;
    setProcessingPayoutOwnerId(ownerId);
    
    // Simulate process delay
    setTimeout(() => {
      sendNotification(
        'Payout Disbursed Successfully',
        `Disbursed payout share of ${formatCurrency(amount)} to owner ${ownerName} (${ownerId}).`,
        'owners',
        'approval'
      );
      setProcessingPayoutOwnerId(null);
      alert(`Payout of ${formatCurrency(amount)} successfully disbursed to ${ownerName}!`);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Revenue & Payouts</h1>
          <p className="text-slate-400 mt-1">Audit cash flows, platform commission earnings, and outstanding venue payouts.</p>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-900">
          <button
            onClick={() => setActiveSubTab('transactions')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition ${
              activeSubTab === 'transactions' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Transaction Ledger ({bookings.length})
          </button>
          <button
            onClick={() => setActiveSubTab('payouts')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition ${
              activeSubTab === 'payouts' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Owner Payouts Summary
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="glass-panel rounded-xl p-5 border border-slate-800 relative overflow-hidden group">
          <div>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Total Platform Volume</span>
            <span className="text-2xl font-bold text-white mt-1.5 block">{formatCurrency(stats.revenueOverview.totalBookingRevenue)}</span>
            <span className="text-[10px] text-emerald-400 font-medium block mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              100% Secure transaction volume
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="glass-panel-glow rounded-xl p-5 relative overflow-hidden group">
          <div>
            <span className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider block">Net Platform Fee (Earnings)</span>
            <span className="text-2xl font-bold text-primary mt-1.5 block">{formatCurrency(stats.revenueOverview.totalCommissionRevenue)}</span>
            <span className="text-[10px] text-slate-400 font-medium block mt-1">
              Commission configured: {settings.commissionPercentage}%
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="glass-panel rounded-xl p-5 border border-slate-800 relative overflow-hidden group">
          <div>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Outstanding Owner Payouts</span>
            <span className="text-2xl font-bold text-amber-400 mt-1.5 block">{formatCurrency(stats.revenueOverview.pendingPayouts)}</span>
            <span className="text-[10px] text-slate-400 font-medium block mt-1">
              Locked in escrow for upcoming events
            </span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="glass-panel rounded-xl p-5 border border-slate-800 relative overflow-hidden group">
          <div>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Total Disbursed Payouts</span>
            <span className="text-2xl font-bold text-emerald-400 mt-1.5 block">{formatCurrency(stats.revenueOverview.completedPayouts)}</span>
            <span className="text-[10px] text-slate-400 font-medium block mt-1">
              Released payouts for finished events
            </span>
          </div>
        </div>
      </div>

      {/* SEARCH INPUT */}
      <div className="flex justify-between items-center gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-900">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-500" />
          <input
            type="text"
            placeholder={activeSubTab === 'transactions' ? "Search Transaction ID, Venue, Owner name..." : "Search owners by company name..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 focus:border-primary rounded-lg text-sm text-slate-200 placeholder-slate-500 outline-none transition"
          />
        </div>

        <button
          onClick={() => alert('Exporting spreadsheet reports to Excel/CSV...')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 px-4 py-2 border border-slate-800 hover:border-slate-700 rounded-lg transition"
        >
          <Download className="w-4 h-4" />
          Export Ledger
        </button>
      </div>

      {activeSubTab === 'transactions' ? (
        /* TRANSACTION LEDGER TABLE */
        <div className="glass-panel border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-900 uppercase font-semibold text-[10px] tracking-wider">
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Listing Space</th>
                  <th className="p-4">Venue Owner</th>
                  <th className="p-4">Booking Amount</th>
                  <th className="p-4">Platform commission</th>
                  <th className="p-4">Owner Split</th>
                  <th className="p-4">Transaction date</th>
                  <th className="p-4">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-slate-300">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500">
                      No financial transactions match criteria.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-900/30 transition">
                      <td className="p-4 font-mono font-bold text-slate-400">{b.id}</td>
                      <td className="p-4 font-semibold text-white">{b.venueName}</td>
                      <td className="p-4 text-slate-400">{b.ownerName}</td>
                      <td className="p-4 font-bold text-slate-200">{formatCurrency(b.amount)}</td>
                      <td className="p-4 font-semibold text-primary">+{formatCurrency(b.commissionAmount)}</td>
                      <td className="p-4 font-semibold text-emerald-400">{formatCurrency(b.amount - b.commissionAmount)}</td>
                      <td className="p-4 text-slate-500 font-mono">{b.bookingDate}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                          b.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          b.paymentStatus === 'refunded' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {b.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* OWNER PAYOUTS SUMMARY WORKSPACE */
        <div className="glass-panel border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-900 uppercase font-semibold text-[10px] tracking-wider">
                  <th className="p-4">Owner Name</th>
                  <th className="p-4">Company Name</th>
                  <th className="p-4 text-center">Event Counts</th>
                  <th className="p-4">Outstanding (Escrow)</th>
                  <th className="p-4">Completed Payouts</th>
                  <th className="p-4">KYC Compliance</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-slate-300">
                {getOwnerPayoutDetails()
                  .filter(o => o.owner.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(op => (
                    <tr key={op.owner.id} className="hover:bg-slate-900/30 transition">
                      <td className="p-4">
                        <div className="font-semibold text-white text-sm">{op.owner.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">ID: {op.owner.id}</div>
                      </td>
                      <td className="p-4 font-semibold text-slate-300">{op.owner.companyName}</td>
                      <td className="p-4 text-center font-bold text-slate-400">{op.bookingsCount}</td>
                      <td className="p-4 font-bold text-amber-400">{formatCurrency(op.pendingPayout)}</td>
                      <td className="p-4 font-bold text-emerald-400">{formatCurrency(op.completedPayout)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                          op.owner.kycStatus === 'verified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {op.owner.kycStatus === 'verified' ? 'KYC Verified' : 'KYC Blocked'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {op.pendingPayout > 0 ? (
                          <button
                            onClick={() => handleProcessPayout(op.owner.id, op.owner.name, op.pendingPayout)}
                            disabled={processingPayoutOwnerId !== null || op.owner.kycStatus !== 'verified'}
                            className={`px-3 py-1.5 font-bold text-xs rounded-lg transition ${
                              op.owner.kycStatus !== 'verified' 
                                ? 'bg-slate-950 text-slate-600 border border-slate-900 cursor-not-allowed' 
                                : 'bg-primary hover:bg-primary-hover text-white'
                            }`}
                          >
                            {processingPayoutOwnerId === op.owner.id ? (
                              <span className="flex items-center gap-1 justify-end">
                                <RefreshCw className="w-3 h-3 animate-spin" />
                                Processing...
                              </span>
                            ) : (
                              'Release Payout'
                            )}
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-semibold uppercase pr-3">Settled</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
