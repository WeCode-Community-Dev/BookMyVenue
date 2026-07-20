'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/axios';
import { BookingCard } from '@/components/booking/booking-card';
import { BookingDetailsModal } from '@/components/booking/booking-details-modal';
import { CancelBookingModal } from '@/components/booking/cancel-booking-modal';
import { RescheduleModal } from '@/components/booking/reschedule-modal';

interface Booking {
  id: string;
  _id?: string;
  userId: string;
  venueId: {
    id: string;
    _id?: string;
    name: string;
    location: string;
    imageUrl?: string;
    pricePerHour: number;
  };
  date: string;
  hours: number;
  totalPrice: number;
  status: string;
  paymentStatus?: string;
  refundStatus?: string;
  cancellationReason?: string;
  rescheduleStatus?: string;
  pendingReschedule?: any;
}

export default function CustomerBookingsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled' | 'rejected'>('all');
  
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Details Modal state
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<Booking | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const openDetailsModal = (booking: Booking) => {
    setSelectedBookingDetails(booking);
    setIsDetailsModalOpen(true);
  };

  // Cancel Modal state
  const [selectedCancelBooking, setSelectedCancelBooking] = useState<Booking | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const openCancelModal = (booking: Booking) => {
    setSelectedCancelBooking(booking);
    setIsCancelModalOpen(true);
  };

  // Reschedule Modal state
  const [selectedRescheduleBooking, setSelectedRescheduleBooking] = useState<Booking | null>(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);

  const openRescheduleModal = (booking: Booking) => {
    setSelectedRescheduleBooking(booking);
    setIsRescheduleModalOpen(true);
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
      setCurrentUser(user);
      fetchUserBookings(user.id || user._id);
    } catch (e) {
      router.push('/login');
    }
  }, [router]);

  const fetchUserBookings = async (userId: string) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await api.get(`/bookings/user/${userId}`);
      const sorted = response.data.sort((a: any, b: any) => 
        new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime()
      );
      setBookings(sorted);
    } catch (err: any) {
      console.error('Failed to fetch user bookings:', err);
      setErrorMsg('Failed to load your bookings history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setActionLoadingId(bookingId);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status: 'CANCELLED_BY_CUSTOMER' });
      
      // Update local state
      setBookings((prev) =>
        prev.map((b) => 
          (b.id === bookingId || b._id === bookingId) 
            ? { ...b, status: 'CANCELLED_BY_CUSTOMER' } 
            : b
        )
      );
      setSuccessMsg('Booking cancelled successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error('Failed to cancel booking:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to cancel the booking. Please try again.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handlePayBooking = async (bookingId: string, amount: number) => {
    if (!confirm(`Are you sure you want to complete the mock payment of RS ${amount}?`)) {
      return;
    }

    setActionLoadingId(bookingId);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await api.post("/payments", {
        bookingId,
        amount,
        paymentMethod: "mock"
      });
      // Refresh local bookings list
      if (currentUser?.id || currentUser?._id) {
        await fetchUserBookings(currentUser.id || currentUser._id);
      }
      setSuccessMsg('Payment completed and booking confirmed successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error('Payment confirmation failed:', err);
      setErrorMsg(err.response?.data?.message || 'Payment processing failed. Please try again.');
    } finally {
      setActionLoadingId(null);
    }
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

  const filteredBookings = bookings.filter((b) => {
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
          <p className="text-slate-600 font-medium">Securing session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">BookMyVenue</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="text-slate-600 hover:text-indigo-600 font-semibold text-sm transition-colors duration-200 px-3 py-2 rounded-xl"
            >
              Dashboard
            </Link>
            <Link 
              href="/bookings" 
              className="text-indigo-600 font-semibold text-sm transition-colors duration-200 px-3 py-2 rounded-xl"
            >
              Bookings
            </Link>
            <Link 
              href="/profile" 
              className="text-slate-600 hover:text-indigo-600 font-semibold text-sm transition-colors duration-200 px-3 py-2 rounded-xl"
            >
              Profile
            </Link>
            
            
            {/* User welcome message */}
            <span className="hidden md:inline-block text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              👋 Hi, <span className="text-slate-800 font-bold">{currentUser.name}</span>
            </span>

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
            <h1 className="text-3xl font-extrabold text-slate-850 tracking-tight">My Bookings</h1>
            <p className="text-slate-550 text-sm mt-1">Review the status and manage your booked venue slots.</p>
          </div>
          <button
            onClick={() => fetchUserBookings(currentUser.id || currentUser._id)}
            className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl transition-all shadow-sm flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H12" />
            </svg>
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
                    : 'border-transparent text-slate-500 hover:text-indigo-650 hover:border-slate-305'
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
            <p className="mt-4 text-slate-505 font-medium text-sm">Fetching bookings history...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-base font-bold text-slate-705">No Bookings Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">There are no bookings listed matching this filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => {
              const bookingId = booking.id || booking._id || '';
              const isActioning = actionLoadingId === bookingId;
              const statusUpper = (booking.status || '').toUpperCase();
              
              const isCancellable = ['REQUESTED', 'PAYMENT_PENDING', 'CONFIRMED'].includes(statusUpper);
              const isReschedulable = !['COMPLETED', 'NO_SHOW', 'REJECTED', 'EXPIRED', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_OWNER', 'CANCELLED'].includes(statusUpper) && booking.rescheduleStatus !== 'PENDING';

              return (
                <BookingCard
                  key={bookingId}
                  booking={booking}
                  onViewDetails={openDetailsModal}
                >
                  <div className="flex flex-col gap-2 w-full pt-1">
                    {statusUpper === 'PAYMENT_PENDING' && (
                      <button
                        onClick={() => handlePayBooking(bookingId, booking.totalPrice)}
                        disabled={isActioning}
                        className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-550 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-100 cursor-pointer disabled:opacity-50 text-center font-sans"
                      >
                        {isActioning ? 'Paying...' : 'Pay & Confirm'}
                      </button>
                    )}

                    <div className="flex gap-2 w-full">
                      {isReschedulable && (
                        <button
                          onClick={() => openRescheduleModal(booking)}
                          disabled={isActioning}
                          className="w-1/2 py-2 px-3 border border-indigo-200 text-indigo-600 hover:bg-indigo-555 bg-white font-bold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50 text-center font-sans"
                        >
                          Reschedule
                        </button>
                      )}
                      
                      {isCancellable && (
                        <button
                          onClick={() => openCancelModal(booking)}
                          disabled={isActioning}
                          className={`${isReschedulable ? 'w-1/2' : 'w-full'} py-2 px-3 border border-rose-200 text-rose-600 hover:bg-rose-50 bg-white font-bold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50 text-center font-sans`}
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
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

      <CancelBookingModal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setSelectedCancelBooking(null);
        }}
        booking={selectedCancelBooking}
        onSuccess={() => {
          setSuccessMsg('Booking cancelled successfully.');
          if (currentUser?.id || currentUser?._id) {
            fetchUserBookings(currentUser.id || currentUser._id);
          }
        }}
      />

      <RescheduleModal
        isOpen={isRescheduleModalOpen}
        onClose={() => {
          setIsRescheduleModalOpen(false);
          setSelectedRescheduleBooking(null);
        }}
        booking={selectedRescheduleBooking}
        onSuccess={() => {
          setSuccessMsg('Reschedule request submitted successfully.');
          if (currentUser?.id || currentUser?._id) {
            fetchUserBookings(currentUser.id || currentUser._id);
          }
        }}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 mt-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-white font-bold text-sm">
              BookMyVenue
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}