import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { 
  Search, Calendar, Users, X, Clock, AlertTriangle
} from 'lucide-react';
import type { Booking } from '../data/mockStore';

interface BookingsViewProps {
  initialTab?: 'all' | 'upcoming' | 'completed' | 'cancelled';
  selectedBookingId?: string | null;
  onClearSelectedBooking?: () => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({ 
  initialTab = 'all', 
  selectedBookingId = null,
  onClearSelectedBooking
}) => {
  const { 
    bookings, venues, settings,
    cancelBooking, updateBookingStatus 
  } = useAdmin();

  const activeTab = initialTab;
  
  // Search & Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [venueFilter, setVenueFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // Modal details state
  const [viewingBooking, setViewingBooking] = useState<Booking | null>(
    selectedBookingId ? bookings.find(b => b.id === selectedBookingId) || null : null
  );

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Get active list based on tab
  const getTabFilteredBookings = () => {
    let list = bookings;
    if (activeTab === 'upcoming') {
      list = bookings.filter(b => b.status === 'upcoming');
    } else if (activeTab === 'completed') {
      list = bookings.filter(b => b.status === 'completed');
    } else if (activeTab === 'cancelled') {
      list = bookings.filter(b => b.status === 'cancelled');
    }
    return list;
  };

  // Apply search and filters
  const filteredBookings = getTabFilteredBookings().filter(b => {
    const matchesSearch = 
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.venueName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVenue = venueFilter === 'all' || b.venueId === venueFilter;
    const matchesPayment = paymentFilter === 'all' || b.paymentStatus === paymentFilter;
    const matchesDate = !dateFilter || b.eventDate === dateFilter || b.bookingDate === dateFilter;

    return matchesSearch && matchesVenue && matchesPayment && matchesDate;
  });

  const handleInspect = (booking: Booking) => {
    setViewingBooking(booking);
  };

  const handleCloseModal = () => {
    setViewingBooking(null);
    if (onClearSelectedBooking) onClearSelectedBooking();
  };

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Booking Management</h1>
          <p className="text-slate-400 mt-1">Audit guest bookings, verify transaction statuses, and handle cancellation requests.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-900">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search Booking ID, Client, Venue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 focus:border-primary rounded-lg text-sm text-slate-200 placeholder-slate-500 outline-none transition"
          />
        </div>

        {/* Venue filter */}
        <div>
          <select
            value={venueFilter}
            onChange={(e) => setVenueFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-primary text-slate-300 text-sm rounded-lg px-3 py-2 outline-none transition"
          >
            <option value="all">All Venues</option>
            {venues.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>

        {/* Payment filter */}
        <div>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-primary text-slate-300 text-sm rounded-lg px-3 py-2 outline-none transition"
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Date filter */}
        <div>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-primary text-slate-300 text-sm rounded-lg px-3 py-1.5 outline-none transition"
          />
        </div>
      </div>

      {/* Booking Ledger Table */}
      <div className="glass-panel border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-900 uppercase font-semibold text-[10px] tracking-wider">
                <th className="p-4">Booking ID</th>
                <th className="p-4">Client Name</th>
                <th className="p-4">Space Listing</th>
                <th className="p-4">Event Date</th>
                <th className="p-4">Guest Count</th>
                <th className="p-4">Status</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-300">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500">
                    No booking transactions match filter selections.
                  </td>
                </tr>
              ) : (
                filteredBookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-slate-900/30 transition">
                    <td className="p-4 font-mono font-bold text-slate-400">{booking.id}</td>
                    <td className="p-4 font-semibold text-white">{booking.customerName}</td>
                    <td className="p-4 font-medium text-slate-300">{booking.venueName}</td>
                    <td className="p-4 font-semibold text-slate-400">{booking.eventDate}</td>
                    <td className="p-4 text-slate-400">{booking.guestCount} Pax</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider text-[9px] ${
                        booking.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        booking.status === 'upcoming' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        booking.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-1.5 py-0.2 rounded font-bold text-[9px] uppercase ${
                        booking.paymentStatus === 'paid' ? 'text-emerald-400 bg-emerald-500/10' :
                        booking.paymentStatus === 'refunded' ? 'text-amber-400 bg-amber-500/10' :
                        'text-red-400 bg-red-500/10'
                      }`}>{booking.paymentStatus}</span>
                    </td>
                    <td className="p-4 font-bold text-white">{formatCurrency(booking.amount)}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleInspect(booking)}
                        className="px-3 py-1 rounded bg-slate-900 hover:bg-slate-800 text-primary hover:text-white font-bold border border-slate-850 transition"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* BOOKING DETAILS MODAL */}
      {viewingBooking && (
        <div className="modal-overlay">
          <div className="glass-panel border border-slate-800 rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-6 p-6 relative">
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-slate-500 hover:text-white p-1 hover:bg-slate-950 rounded-full transition z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-slate-500">Transaction ID: {viewingBooking.id}</span>
                <h2 className="text-xl font-bold text-white mt-0.5">Booking Details Audit</h2>
                <span className="text-[10px] text-slate-400">Created: {viewingBooking.bookingDate}</span>
              </div>
              <div className="flex gap-2">
                <span className={`px-2.5 py-1 text-xs rounded-full font-bold uppercase tracking-wider ${
                  viewingBooking.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  viewingBooking.status === 'upcoming' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                  'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {viewingBooking.status}
                </span>
                <span className={`px-2.5 py-1 text-xs rounded-full font-bold uppercase tracking-wider ${
                  viewingBooking.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  viewingBooking.paymentStatus === 'refunded' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  Pay: {viewingBooking.paymentStatus}
                </span>
              </div>
            </div>

            {/* Core profiles grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900 space-y-2">
                <h4 className="font-bold text-white text-[10px] uppercase tracking-wider text-slate-500">Customer Details</h4>
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-200 block text-sm">{viewingBooking.customerName}</span>
                  <span className="text-slate-400 block">{viewingBooking.customerEmail}</span>
                  <span className="text-slate-500 block">ID: {viewingBooking.customerId}</span>
                </div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900 space-y-2">
                <h4 className="font-bold text-white text-[10px] uppercase tracking-wider text-slate-500">Venue & Owner Details</h4>
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-200 block text-sm">{viewingBooking.venueName}</span>
                  <span className="text-slate-400 block">Owner: {viewingBooking.ownerName}</span>
                  <span className="text-slate-500 block">Venue ID: {viewingBooking.venueId}</span>
                </div>
              </div>
            </div>

            {/* Event configuration stats */}
            <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-4 rounded-xl border border-slate-900 text-xs">
              <div>
                <span className="text-slate-500 block uppercase font-semibold text-[8px]">Event Date</span>
                <span className="text-white block font-bold text-sm mt-0.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-accent" />
                  {viewingBooking.eventDate}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase font-semibold text-[8px]">Guest Attendance</span>
                <span className="text-white block font-bold text-sm mt-0.5 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  {viewingBooking.guestCount} guests
                </span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase font-semibold text-[8px]">Rent Duration</span>
                <span className="text-white block font-bold text-sm mt-0.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  1 Full Day
                </span>
              </div>
            </div>

            {/* Financial ledger breakdown */}
            <div className="space-y-2 border-t border-slate-900 pt-4">
              <h3 className="font-bold text-white text-sm">Financial Split Audit</h3>
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Event Booking Value:</span>
                  <span className="text-slate-200 font-bold">{formatCurrency(viewingBooking.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Platform Commission ({settings.commissionPercentage}%):</span>
                  <span className="text-primary font-bold">+{formatCurrency(viewingBooking.commissionAmount)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-900/60 pt-2 font-bold text-sm">
                  <span className="text-white">Venue Owner Payout Share:</span>
                  <span className="text-emerald-400">{formatCurrency(viewingBooking.amount - viewingBooking.commissionAmount)}</span>
                </div>
              </div>
            </div>

            {/* Special Instructions / Notes */}
            {viewingBooking.notes && (
              <div className="space-y-2">
                <h4 className="text-xs text-slate-400 font-bold uppercase tracking-wider">Planner Special Instructions</h4>
                <div className="bg-slate-950/30 p-3 rounded-lg border border-slate-900 text-xs italic text-slate-300">
                  "{viewingBooking.notes}"
                </div>
              </div>
            )}

            {/* Operational Management controls inside modal */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 border-t border-slate-900 pt-4">
              
              {/* Change Status dropdown */}
              {viewingBooking.status === 'upcoming' && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-semibold uppercase">Move Status:</span>
                  <select
                    onChange={(e) => {
                      updateBookingStatus(viewingBooking.id, e.target.value as Booking['status']);
                      // Update active modal state
                      setViewingBooking(prev => prev ? { ...prev, status: e.target.value as Booking['status'], paymentStatus: e.target.value === 'completed' ? 'paid' : prev.paymentStatus } as Booking : null);
                    }}
                    className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-3 py-1.5 outline-none transition"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed (Mark Event Done)</option>
                    <option value="failed">Failed / No-Show</option>
                  </select>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 ml-auto w-full sm:w-auto">
                {viewingBooking.status === 'upcoming' && (
                  <button
                    onClick={() => {
                      cancelBooking(viewingBooking.id);
                      handleCloseModal();
                    }}
                    className="flex-1 sm:flex-none px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 font-bold text-xs rounded-lg transition flex items-center justify-center gap-1"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Cancel Booking & Refund
                  </button>
                )}
                <button
                  onClick={handleCloseModal}
                  className="flex-1 sm:flex-none px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-850 font-bold text-xs rounded-lg transition"
                >
                  Close Audit
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
