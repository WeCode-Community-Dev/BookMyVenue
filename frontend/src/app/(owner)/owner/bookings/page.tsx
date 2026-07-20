'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/axios';
import { BookingCard } from '@/components/booking/booking-card';
import { BookingDetailsModal } from '@/components/booking/booking-details-modal';
import { RotateCw } from 'lucide-react';

export default function OwnerBookingsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'rejected' | 'cancelled'>('all');
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Cancellation Modal State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');

  // Details Modal State
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const openDetailsModal = (booking: any) => {
    setSelectedBookingDetails(booking);
    setIsDetailsModalOpen(true);
  };

  const openCancelModal = (bookingId: string) => {
    setCancelBookingId(bookingId);
    setCancellationReason('');
    setShowCancelModal(true);
  };

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellationReason.trim()) {
      alert('Cancellation reason is required.');
      return;
    }
    if (cancelBookingId) {
      handleUpdateStatus(cancelBookingId, 'CANCELLED_BY_OWNER', cancellationReason);
    }
    setShowCancelModal(false);
    setCancelBookingId(null);
  };

  const getStatusBadgeClass = (status: string) => {
    const s = (status || '').toUpperCase();
    switch (s) {
      case 'CONFIRMED':
        return 'bg-emerald-50 border-emerald-150 text-emerald-700';
      case 'COMPLETED':
        return 'bg-blue-50 border-blue-150 text-blue-700';
      case 'NO_SHOW':
        return 'bg-orange-50 border-orange-150 text-orange-700';
      case 'REQUESTED':
      case 'PAYMENT_PENDING':
      case 'LOCKED':
      case 'PENDING':
        return 'bg-amber-50 border-amber-150 text-amber-700 animate-pulse';
      case 'REJECTED':
      case 'EXPIRED':
      case 'CANCELLED':
      case 'CANCELLED_BY_OWNER':
      case 'CANCELLED_BY_CUSTOMER':
      default:
        return 'bg-rose-50 border-rose-150 text-rose-700';
    }
  };

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) {
      router.push('/login');
      return;
    }
    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'Venue owner') {
        router.push('/');
      } else {
        setCurrentUser(user);
        fetchOwnerBookings(user.id || user._id);
      }
    } catch (e) {
      router.push('/login');
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const vId = params.get('venueId');
      if (vId) {
        setSelectedVenueId(vId);
      }
    }
  }, [router]);

  const fetchOwnerBookings = async (userId: string) => {
    setLoading(true);
    setErrorMsg('');
    try {
      // Fetch bookings of corresponding owner
      const bookingsRes = await api.get(`/bookings/owner/${userId}`);
      const ownerBookings = bookingsRes.data || [];

      // Sort by date (descending)
      const sorted = [...ownerBookings].sort((a: any, b: any) => {
        return new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime();
      });

      setBookings(sorted);
    } catch (err: any) {
      console.error('Failed to fetch bookings:', err);
      setErrorMsg('Failed to load incoming bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: string, reason?: string) => {
    setActionLoadingId(bookingId);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await api.patch(`/bookings/${bookingId}/status`, { 
        status: newStatus,
        cancellationReason: reason
      });
      
      // Update local state dynamically
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId || b._id === bookingId
            ? { 
                ...b, 
                status: newStatus,
                cancellationReason: reason,
                cancelledAt: new Date().toISOString(),
                refundStatus: b.paymentStatus === 'PAID' && newStatus === 'CANCELLED_BY_OWNER' ? 'PENDING' : b.refundStatus
              }
            : b
        )
      );
      setSuccessMsg(`Booking status updated to ${newStatus} successfully!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error('Failed to update status:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to update booking status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!isClient || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading panel...</p>
        </div>
      </div>
    );
  }

  const filteredBookings = bookings.filter((b) => {
    if (selectedVenueId) {
      const bVenueId = b.venueId || b.venue?._id || b.venue?.id;
      if (bVenueId !== selectedVenueId) {
        return false;
      }
    }
    if (filter === 'all') return true;
    const bStatusUpper = (b.status || '').toUpperCase();
    if (filter === 'pending') {
      return ['PENDING', 'REQUESTED', 'PAYMENT_PENDING', 'LOCKED'].includes(bStatusUpper);
    }
    if (filter === 'confirmed') {
      return ['CONFIRMED', 'COMPLETED', 'NO_SHOW'].includes(bStatusUpper);
    }
    if (filter === 'rejected') {
      return ['REJECTED', 'EXPIRED'].includes(bStatusUpper);
    }
    if (filter === 'cancelled') {
      return ['CANCELLED', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_OWNER'].includes(bStatusUpper);
    }
    return bStatusUpper === (filter as string).toUpperCase();
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              BookMyVenue
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/owner/dashboard" className="text-slate-600 hover:text-indigo-600 font-semibold text-sm transition-colors duration-200">
                Dashboard
              </Link>
              <Link href="/owner/venues" className="text-slate-600 hover:text-indigo-600 font-semibold text-sm transition-colors duration-200">
                My Venues
              </Link>
              <Link href="/owner/bookings" className="text-indigo-600 font-semibold text-sm">
                Bookings
              </Link>
              <Link href="/owner/profile" className="text-slate-600 hover:text-indigo-600 font-semibold text-sm transition-colors duration-200">
                Profile
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-700">{currentUser.name}</span>
              <span className="text-xs text-slate-500 font-medium capitalize">{currentUser.role}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-inner uppercase">
              {currentUser.name.charAt(0)}
            </div>
            <button
              onClick={handleLogout}
              className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-sm transition-all duration-200 px-4 py-2 rounded-xl border border-rose-200 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-850 tracking-tight">Incoming Bookings</h1>
            <p className="text-slate-550 text-sm mt-1">Review, confirm, or decline booking schedules for all your venues.</p>
          </div>
          <button
            onClick={() => fetchOwnerBookings(currentUser.id || currentUser._id)}
            className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl transition-all shadow-sm flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <RotateCw className={`w-4 h-4 text-slate-550 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Messaging Feedback Banner */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold flex items-center gap-2 animate-bounce">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-750 text-sm font-semibold">
            {errorMsg}
          </div>
        )}

        {selectedVenueId && (
          <div className="mb-6 p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Showing bookings only for the selected venue.</span>
            </div>
            <button 
              onClick={() => setSelectedVenueId(null)}
              className="text-indigo-650 hover:text-indigo-850 underline font-extrabold cursor-pointer border-none bg-transparent"
            >
              Clear Filter
            </button>
          </div>
        )}

        {/* Filter Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-6 mb-8 overflow-x-auto shrink-0 pb-1">
          {(['all', 'pending', 'confirmed', 'rejected', 'cancelled'] as const).map((tab) => {
            const count = bookings.filter((b) => {
              if (tab === 'all') return true;
              const bStatusUpper = (b.status || '').toUpperCase();
              if (tab === 'pending') {
                return ['PENDING', 'REQUESTED', 'PAYMENT_PENDING', 'LOCKED'].includes(bStatusUpper);
              }
              if (tab === 'confirmed') {
                return ['CONFIRMED', 'COMPLETED', 'NO_SHOW'].includes(bStatusUpper);
              }
              if (tab === 'rejected') {
                return ['REJECTED', 'EXPIRED'].includes(bStatusUpper);
              }
              if (tab === 'cancelled') {
                return ['CANCELLED', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_OWNER'].includes(bStatusUpper);
              }
              return bStatusUpper === (tab as string).toUpperCase();
            }).length;
            const isSelected = filter === tab;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`py-3 px-1 border-b-2 text-xs sm:text-sm font-bold capitalize transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 text-indigo-600 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-indigo-655 hover:border-slate-305'
                }`}
              >
                {tab} <span className={`ml-1 px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                  isSelected ? 'bg-indigo-150 text-indigo-755' : 'bg-slate-150 text-slate-555'
                }`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Loading / Lists Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500 font-medium text-sm">Fetching booking records...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-base font-bold text-slate-705">No Bookings Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">There are no bookings listed matching the select criteria filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => {
              const bookingId = booking.id || booking._id;
              const isActioning = actionLoadingId === bookingId;

              return (
                <BookingCard
                  key={bookingId}
                  booking={booking}
                  onViewDetails={openDetailsModal}
                >
                  <div className="flex flex-col gap-2 w-full">
                    {(booking.status || '').toUpperCase() === 'REQUESTED' && (
                      <div className="flex gap-2 w-full">
                        <button
                          onClick={() => handleUpdateStatus(bookingId, 'REJECTED')}
                          disabled={isActioning}
                          className="w-1/2 py-2 px-3 border border-rose-200 text-rose-600 hover:bg-rose-50 bg-white font-bold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isActioning ? 'Working...' : 'Decline'}
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(bookingId, 'PAYMENT_PENDING')}
                          disabled={isActioning}
                          className="w-1/2 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-100 cursor-pointer disabled:opacity-50"
                        >
                          {isActioning ? 'Working...' : 'Approve'}
                        </button>
                      </div>
                    )}
                    {(booking.status || '').toUpperCase() === 'PAYMENT_PENDING' && (
                      <button
                        onClick={() => openCancelModal(bookingId)}
                        disabled={isActioning}
                        className="w-full py-2 px-3 border border-rose-250 text-rose-650 hover:bg-rose-50 bg-white font-bold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50 text-center"
                      >
                        {isActioning ? 'Working...' : 'Cancel Booking'}
                      </button>
                    )}
                    {(booking.status || '').toUpperCase() === 'CONFIRMED' && (
                      <div className="flex flex-col gap-2 w-full">
                        {/* <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateStatus(bookingId, 'COMPLETED')}
                            disabled={isActioning}
                            className="w-1/2 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
                          >
                            {isActioning ? 'Working...' : 'Mark Completed'}
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(bookingId, 'NO_SHOW')}
                            disabled={isActioning}
                            className="w-1/2 py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
                          >
                            {isActioning ? 'Working...' : 'Mark No Show'}
                          </button>
                        </div> */}
                        <button
                          onClick={() => openCancelModal(bookingId)}
                          disabled={isActioning}
                          className="w-full py-2 px-3 border border-rose-250 text-rose-650 hover:bg-rose-50 bg-white font-bold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50 text-center"
                        >
                          {isActioning ? 'Working...' : 'Cancel Booking'}
                        </button>
                      </div>
                    )}
                  </div>
                </BookingCard>
              );
            })}
          </div>
        )}
      </main>

      <BookingDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedBookingDetails(null);
        }}
        booking={selectedBookingDetails}
        onBookingUpdated={(updatedBooking) => {
          setBookings((prev) =>
            prev.map((b) =>
              b.id === updatedBooking.id || b._id === updatedBooking._id
                ? updatedBooking
                : b
            )
          );
        }}
      />

      {/* Cancellation Reason Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900">Cancel Booking</h3>
            <p className="text-xs text-slate-500">Please provide a reason for cancelling this venue booking. This is required.</p>
            <form onSubmit={handleCancelSubmit} className="space-y-4">
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Enter cancellation reason..."
                className="w-full min-h-[100px] p-3 border border-slate-200 rounded-2xl text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
              <div className="flex gap-3 justify-end text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelBookingId(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            BookMyVenue
          </p>
        </div>
      </footer>
    </div>
  );
}