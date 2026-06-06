import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { 
  Search, ShieldAlert, CheckCircle, XCircle, Eye, 
  Trash2, FileText, Calendar, Building, DollarSign, X, RefreshCw, Database
} from 'lucide-react';
import type { Customer, VenueOwner, Venue, Booking } from '../data/mockStore';

interface UsersViewProps {
  initialTab?: 'customers' | 'owners';
  onSelectVenue: (venue: Venue) => void;
  onSelectBooking: (booking: Booking) => void;
}

export const UsersView: React.FC<UsersViewProps> = ({ initialTab = 'customers', onSelectVenue, onSelectBooking }) => {
  const { 
    customers, owners, venues, bookings, reports, apiState, refreshUsers,
    blockCustomer, unblockCustomer, deleteCustomer,
    approveOwnerKYC, rejectOwnerKYC, blockOwner, unblockOwner
  } = useAdmin();

  const activeTab = initialTab;
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [kycFilter, setKycFilter] = useState<string>('all');

  // Modal details state
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedOwner, setSelectedOwner] = useState<VenueOwner | null>(null);

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Filter Customers
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Filter Owners
  const filteredOwners = owners.filter(o => {
    const matchesSearch = 
      o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesKyc = kycFilter === 'all' || o.kycStatus === kycFilter;
    
    return matchesSearch && matchesStatus && matchesKyc;
  });

  // Get Customer Booking History
  const getCustomerBookings = (customerId: string) => {
    return bookings.filter(b => b.customerId === customerId);
  };

  // Get Owner Venues
  const getOwnerVenues = (ownerId: string) => {
    return venues.filter(v => v.ownerId === ownerId);
  };

  const shimmerCell = (width = 'w-24') => (
    <div className={`h-3 ${width} rounded-full shimmer-surface`} />
  );

  const renderCustomerSkeletonRows = () => (
    Array.from({ length: 5 }).map((_, idx) => (
      <tr key={`customer-loading-${idx}`}>
        <td className="p-4">{shimmerCell('w-24')}</td>
        <td className="p-4 space-y-2">
          {shimmerCell('w-32')}
          {shimmerCell('w-20')}
        </td>
        <td className="p-4 space-y-2">
          {shimmerCell('w-40')}
          {shimmerCell('w-28')}
        </td>
        <td className="p-4">{shimmerCell('w-24')}</td>
        <td className="p-4">
          <div className="flex justify-center">{shimmerCell('w-8')}</div>
        </td>
        <td className="p-4">{shimmerCell('w-20')}</td>
        <td className="p-4">{shimmerCell('w-16')}</td>
        <td className="p-4">
          <div className="flex justify-end gap-1.5">
            <div className="h-7 w-7 rounded shimmer-surface" />
            <div className="h-7 w-7 rounded shimmer-surface" />
            <div className="h-7 w-7 rounded shimmer-surface" />
          </div>
        </td>
      </tr>
    ))
  );

  const renderOwnerSkeletonRows = () => (
    Array.from({ length: 5 }).map((_, idx) => (
      <tr key={`owner-loading-${idx}`}>
        <td className="p-4">{shimmerCell('w-24')}</td>
        <td className="p-4 space-y-2">
          {shimmerCell('w-32')}
          {shimmerCell('w-40')}
          {shimmerCell('w-28')}
        </td>
        <td className="p-4">{shimmerCell('w-36')}</td>
        <td className="p-4">{shimmerCell('w-16')}</td>
        <td className="p-4">
          <div className="flex justify-center">{shimmerCell('w-8')}</div>
        </td>
        <td className="p-4">
          <div className="flex justify-center">{shimmerCell('w-8')}</div>
        </td>
        <td className="p-4">{shimmerCell('w-20')}</td>
        <td className="p-4">{shimmerCell('w-16')}</td>
        <td className="p-4">
          <div className="flex justify-end gap-1.5">
            <div className="h-7 w-7 rounded shimmer-surface" />
            <div className="h-7 w-7 rounded shimmer-surface" />
          </div>
        </td>
      </tr>
    ))
  );

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Users Moderation</h1>
          <p className="text-slate-400 mt-1">Manage event planners, customers, and commercial space owners.</p>
        </div>

      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-900">
        <div className="flex items-start gap-2 text-xs">
          <Database className={`w-4 h-4 mt-0.5 ${apiState.users.error ? 'text-amber-400' : 'text-primary'}`} />
          <div>
            <p className="font-semibold text-slate-200">
              {apiState.users.loading
                ? 'Loading user directory...'
                : apiState.users.usingMockData
                  ? 'Using local mock directory data'
                  : 'Connected to user directory API'}
            </p>
            <p className="text-slate-500 mt-0.5">
              {apiState.users.error
                ? `API sync failed: ${apiState.users.error}`
                : apiState.users.usingMockData
                  ? 'Add the base URL and endpoints when ready to switch this screen to live data.'
                  : 'Customer and venue owner lists are coming from the configured endpoints.'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void refreshUsers()}
          disabled={apiState.users.loading}
          className="inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 disabled:hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 font-bold text-xs px-3 py-2 rounded-lg transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${apiState.users.loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-900">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-500" />
          <input
            type="text"
            placeholder={activeTab === 'customers' ? "Search customers by name, email, phone..." : "Search owners by name, company, email..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 focus:border-primary rounded-lg text-sm text-slate-200 placeholder-slate-500 outline-none transition"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 focus:border-primary text-slate-300 text-xs rounded-lg px-3 py-2 outline-none transition"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>

          {/* KYC Filter (Owners Only) */}
          {activeTab === 'owners' && (
            <select
              value={kycFilter}
              onChange={(e) => setKycFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 focus:border-primary text-slate-300 text-xs rounded-lg px-3 py-2 outline-none transition"
            >
              <option value="all">All KYC Statuses</option>
              <option value="pending">KYC Pending</option>
              <option value="verified">KYC Verified</option>
              <option value="rejected">KYC Rejected</option>
            </select>
          )}
        </div>
      </div>

      {/* Main Lists */}
      {activeTab === 'customers' ? (
        /* CUSTOMERS TABLE */
        <div className="glass-panel border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-900 uppercase font-semibold text-[10px] tracking-wider">
                  <th className="p-4">Customer ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4 text-center">Bookings</th>
                  <th className="p-4">Total Spent</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-slate-300">
                {apiState.users.loading ? (
                  renderCustomerSkeletonRows()
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500">
                      No customer accounts found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map(cust => (
                    <tr key={cust.id} className="hover:bg-slate-900/30 transition">
                      <td className="p-4 font-mono font-bold text-slate-400">{cust.id}</td>
                      <td className="p-4">
                        <div className="font-semibold text-white text-sm">{cust.name}</div>
                        {cust.complaintsCount > 0 && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded mt-0.5 border border-rose-500/10 font-medium">
                            <ShieldAlert className="w-3 h-3" />
                            {cust.complaintsCount} complaints
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="text-slate-300">{cust.email}</div>
                        <div className="text-slate-500">{cust.phone}</div>
                      </td>
                      <td className="p-4 text-slate-400">{cust.joinedDate}</td>
                      <td className="p-4 text-center font-semibold text-white">{cust.bookingsCount}</td>
                      <td className="p-4 font-semibold text-white">{formatCurrency(cust.totalSpent)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full font-medium ${
                          cust.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {cust.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedCustomer(cust)}
                          className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {cust.status === 'active' ? (
                          <button
                            onClick={() => blockCustomer(cust.id)}
                            className="p-1.5 rounded bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 transition"
                            title="Block Customer"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => unblockCustomer(cust.id)}
                            className="p-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 transition"
                            title="Unblock Customer"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteCustomer(cust.id)}
                          className="p-1.5 rounded bg-slate-900 hover:bg-red-950 text-slate-500 hover:text-red-400 border border-slate-800 hover:border-red-900 transition"
                          title="Delete Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* VENUE OWNERS TABLE */
        <div className="glass-panel border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-900 uppercase font-semibold text-[10px] tracking-wider">
                  <th className="p-4">Owner ID</th>
                  <th className="p-4">Profile</th>
                  <th className="p-4">Company</th>
                  <th className="p-4">KYC Status</th>
                  <th className="p-4 text-center">Venues</th>
                  <th className="p-4 text-center">Bookings</th>
                  <th className="p-4">Revenue</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-slate-300">
                {apiState.users.loading ? (
                  renderOwnerSkeletonRows()
                ) : filteredOwners.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-500">
                      No venue owner accounts found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOwners.map(owner => (
                    <tr key={owner.id} className="hover:bg-slate-900/30 transition">
                      <td className="p-4 font-mono font-bold text-slate-400">{owner.id}</td>
                      <td className="p-4">
                        <div className="font-semibold text-white text-sm">{owner.name}</div>
                        <div className="text-slate-400 mt-0.5">{owner.email}</div>
                        <div className="text-slate-500 text-[10px]">{owner.phone}</div>
                      </td>
                      <td className="p-4 font-medium text-slate-300">{owner.companyName}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full font-medium ${
                          owner.kycStatus === 'verified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          owner.kycStatus === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse' :
                          'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {owner.kycStatus}
                        </span>
                      </td>
                      <td className="p-4 text-center font-semibold text-white">{owner.venuesCount}</td>
                      <td className="p-4 text-center font-semibold text-slate-400">{owner.totalBookings}</td>
                      <td className="p-4 font-semibold text-white">{formatCurrency(owner.revenueGenerated)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full font-medium ${
                          owner.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {owner.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedOwner(owner)}
                          className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
                          title="View Owner Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {owner.status === 'active' ? (
                          <button
                            onClick={() => blockOwner(owner.id)}
                            className="p-1.5 rounded bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 transition"
                            title="Suspend Owner"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => unblockOwner(owner.id)}
                            className="p-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 transition"
                            title="Activate Owner"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CUSTOMER DETAILS MODAL */}
      {selectedCustomer && (
        <div className="modal-overlay">
          <div className="glass-panel border border-slate-800 rounded-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto space-y-6 p-6 relative">
            <button 
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white p-1 hover:bg-slate-950 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Summary */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-900 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-slate-500">{selectedCustomer.id}</span>
                <h2 className="text-2xl font-bold text-white mt-1">{selectedCustomer.name}</h2>
                <p className="text-slate-400 text-sm mt-0.5">{selectedCustomer.email} | {selectedCustomer.phone}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 text-xs rounded-full font-bold uppercase tracking-wider ${
                  selectedCustomer.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {selectedCustomer.status}
                </span>
                <span className="bg-slate-900 border border-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-md font-semibold">
                  Member Since: {selectedCustomer.joinedDate}
                </span>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-900 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Total Spent</span>
                  <span className="text-xl font-bold text-white mt-1 block">{formatCurrency(selectedCustomer.totalSpent)}</span>
                </div>
                <DollarSign className="w-8 h-8 text-primary opacity-30" />
              </div>
              <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-900 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Events Booked</span>
                  <span className="text-xl font-bold text-white mt-1 block">{selectedCustomer.bookingsCount} Bookings</span>
                </div>
                <Calendar className="w-8 h-8 text-accent opacity-30" />
              </div>
              <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-900 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Active Complaints</span>
                  <span className="text-xl font-bold text-white mt-1 block">{selectedCustomer.complaintsCount} Reports</span>
                </div>
                <ShieldAlert className="w-8 h-8 text-rose-500 opacity-30" />
              </div>
            </div>

            {/* Booking history table inside Modal */}
            <div className="space-y-3">
              <h3 className="font-bold text-white text-base">Booking History</h3>
              <div className="overflow-x-auto border border-slate-900 rounded-lg">
                <table className="w-full text-left text-[11px]">
                  <tr className="bg-slate-950 text-slate-500 uppercase font-semibold text-[9px] tracking-wider border-b border-slate-900">
                    <th className="p-3">Booking ID</th>
                    <th className="p-3">Venue</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                  </tr>
                  {getCustomerBookings(selectedCustomer.id).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-slate-500">No booking records found.</td>
                    </tr>
                  ) : (
                    getCustomerBookings(selectedCustomer.id).map(b => (
                      <tr 
                        key={b.id} 
                        className="border-b border-slate-900 hover:bg-slate-900/40 transition cursor-pointer"
                        onClick={() => { onSelectBooking(b); setSelectedCustomer(null); }}
                      >
                        <td className="p-3 font-mono font-bold text-slate-400">{b.id}</td>
                        <td className="p-3 font-semibold text-white line-clamp-1">{b.venueName}</td>
                        <td className="p-3 text-slate-400">{b.eventDate}</td>
                        <td className="p-3 font-bold text-slate-200">{formatCurrency(b.amount)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            b.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            b.status === 'upcoming' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </table>
              </div>
            </div>

            {/* Complaints row inside customer */}
            {reports.filter(r => r.reporterName === selectedCustomer.name || (r.targetType === 'user' && r.targetId === selectedCustomer.id)).length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-white text-base">Linked Complaints / Moderation Reports</h3>
                <div className="space-y-2">
                  {reports.filter(r => r.reporterName === selectedCustomer.name || (r.targetType === 'user' && r.targetId === selectedCustomer.id)).map(r => (
                    <div key={r.id} className="p-3 bg-slate-950/40 border border-slate-900 rounded-lg text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-rose-400 uppercase tracking-wide text-[9px]">{r.reason}</span>
                        <span className="text-slate-500 font-mono text-[9px]">{r.date}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed font-medium">{r.details}</p>
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-900/60 text-[10px] text-slate-500">
                        <span>Reporter: {r.reporterName} ({r.reporterType})</span>
                        <span className={`px-1.5 py-0.2 rounded font-bold ${
                          r.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400' :
                          r.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>{r.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Control Panel */}
            <div className="flex justify-end gap-2 border-t border-slate-900 pt-4">
              {selectedCustomer.status === 'active' ? (
                <button
                  onClick={() => { blockCustomer(selectedCustomer.id); setSelectedCustomer(null); }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition"
                >
                  Block Customer Account
                </button>
              ) : (
                <button
                  onClick={() => { unblockCustomer(selectedCustomer.id); setSelectedCustomer(null); }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition"
                >
                  Activate & Restore Account
                </button>
              )}
              <button
                onClick={() => { deleteCustomer(selectedCustomer.id); setSelectedCustomer(null); }}
                className="px-4 py-2 bg-slate-950 hover:bg-red-950 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-900 font-medium text-xs rounded-lg transition"
              >
                Permanently Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OWNER DETAILS MODAL */}
      {selectedOwner && (
        <div className="modal-overlay">
          <div className="glass-panel border border-slate-800 rounded-xl max-w-4xl w-full max-h-[85vh] overflow-y-auto space-y-6 p-6 relative">
            <button 
              onClick={() => setSelectedOwner(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white p-1 hover:bg-slate-950 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-slate-500">{selectedOwner.id}</span>
                <h2 className="text-2xl font-bold text-white mt-1">{selectedOwner.name}</h2>
                <p className="text-slate-400 text-sm mt-0.5">{selectedOwner.companyName}</p>
                <p className="text-slate-500 text-xs mt-0.5">{selectedOwner.email} | {selectedOwner.phone}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-1 text-xs rounded-full font-bold uppercase tracking-wider ${
                  selectedOwner.kycStatus === 'verified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  selectedOwner.kycStatus === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse' :
                  'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  KYC: {selectedOwner.kycStatus}
                </span>
                <span className={`px-2.5 py-1 text-xs rounded-full font-bold uppercase tracking-wider ${
                  selectedOwner.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {selectedOwner.status}
                </span>
              </div>
            </div>

            {/* Financials Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-900 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Revenues Generated</span>
                  <span className="text-xl font-bold text-white mt-1 block">{formatCurrency(selectedOwner.revenueGenerated)}</span>
                </div>
                <DollarSign className="w-8 h-8 text-primary opacity-30" />
              </div>
              <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-900 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Venues Owned</span>
                  <span className="text-xl font-bold text-white mt-1 block">{selectedOwner.venuesCount} Listings</span>
                </div>
                <Building className="w-8 h-8 text-accent opacity-30" />
              </div>
              <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-900 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Aggregated Bookings</span>
                  <span className="text-xl font-bold text-white mt-1 block">{selectedOwner.totalBookings} Completed</span>
                </div>
                <Calendar className="w-8 h-8 text-emerald-500 opacity-30" />
              </div>
            </div>

            {/* Multi-Section Grid (KYC Audit vs Venue Listings) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* KYC Document Verification */}
              <div className="glass-panel border border-slate-900 p-4 rounded-xl space-y-4">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span>KYC Compliance Check</span>
                </h3>
                
                <div className="bg-slate-950/80 rounded-lg p-4 border border-slate-900 flex flex-col justify-center items-center text-center py-8">
                  <FileText className="w-12 h-12 text-slate-600 mb-2" />
                  <span className="text-xs font-mono font-bold text-slate-300 block">{selectedOwner.businessProofUrl}</span>
                  <span className="text-[10px] text-slate-500 uppercase mt-0.5">Government Business Registry GSTIN</span>
                  <div className="mt-4 flex gap-2 w-full max-w-[200px]">
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="flex-1 text-center font-bold text-[10px] text-slate-400 bg-slate-900 hover:bg-slate-800 py-1.5 border border-slate-850 rounded"
                    >
                      Download PDF
                    </a>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="flex-1 text-center font-bold text-[10px] text-primary bg-primary/10 hover:bg-primary/20 py-1.5 border border-primary/20 rounded"
                    >
                      View Full Doc
                    </a>
                  </div>
                </div>

                {selectedOwner.kycStatus === 'pending' && (
                  <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded text-xs text-amber-400 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>Review the submitted business proof. Verify business name is <strong>{selectedOwner.companyName}</strong> and representative name matches exactly.</p>
                  </div>
                )}

                {selectedOwner.kycStatus === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => { rejectOwnerKYC(selectedOwner.id); setSelectedOwner(null); }}
                      className="flex-1 py-2 font-bold text-xs bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 hover:border-red-500 rounded-lg transition"
                    >
                      Reject Documents
                    </button>
                    <button
                      onClick={() => { approveOwnerKYC(selectedOwner.id); setSelectedOwner(null); }}
                      className="flex-1 py-2 font-bold text-xs bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 hover:border-emerald-500 rounded-lg transition"
                    >
                      Approve & Verify KYC
                    </button>
                  </div>
                )}
              </div>

              {/* Owner's Listed Venues */}
              <div className="glass-panel border border-slate-900 p-4 rounded-xl space-y-4">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Building className="w-4 h-4 text-accent" />
                  <span>Linked Venues ({getOwnerVenues(selectedOwner.id).length})</span>
                </h3>

                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                  {getOwnerVenues(selectedOwner.id).length === 0 ? (
                    <p className="text-xs text-slate-500 py-8 text-center bg-slate-950/30 rounded-lg border border-slate-900 border-dashed">No listed spaces available.</p>
                  ) : (
                    getOwnerVenues(selectedOwner.id).map(venue => (
                      <div 
                        key={venue.id} 
                        className="flex justify-between items-center p-2 bg-slate-950/40 border border-slate-900 hover:border-slate-800 rounded-lg transition cursor-pointer"
                        onClick={() => { onSelectVenue(venue); setSelectedOwner(null); }}
                      >
                        <div className="flex items-center gap-2">
                          <img src={venue.photos[0]} alt={venue.name} className="w-8 h-8 rounded object-cover border border-slate-900" />
                          <div>
                            <h4 className="text-xs font-bold text-white line-clamp-1">{venue.name}</h4>
                            <p className="text-[10px] text-slate-400">{venue.location} | Max: {venue.capacity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-primary block">{formatCurrency(venue.pricePerDay)}</span>
                          <span className={`text-[9px] font-bold uppercase ${venue.status === 'approved' ? 'text-emerald-400' : 'text-amber-400'}`}>{venue.status}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end gap-2 border-t border-slate-900 pt-4">
              {selectedOwner.status === 'active' ? (
                <button
                  onClick={() => { blockOwner(selectedOwner.id); setSelectedOwner(null); }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition"
                >
                  Block Owner & Suspend Listings
                </button>
              ) : (
                <button
                  onClick={() => { unblockOwner(selectedOwner.id); setSelectedOwner(null); }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition"
                >
                  Unblock & Restore Listings
                </button>
              )}
              <button
                onClick={() => setSelectedOwner(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 font-semibold text-xs rounded-lg transition"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
