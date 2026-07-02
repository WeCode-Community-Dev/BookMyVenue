import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Calendar } from 'lucide-react';
import { useAsyncFetch } from '@/shared/hooks/useAsyncFetch';
import { usersApi } from '../../services/users.api';
import BookingFilters from '../ui/BookingFilters';
import type { MyBookingsResponse } from '../../types';
import BookingCard from '../ui/BookingCard';

export default function UserBookings() {
  const {
    data: response,
    loading,
    error,
    execute,
  } = useAsyncFetch<{
    success: boolean;
    message: string;
    data: MyBookingsResponse;
  }>();

  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const fetchBookings = useCallback(() => {
    execute(usersApi.getBookings);
  }, [execute]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-foreground/75 font-semibold animate-pulse">Loading your bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-8 bg-surface border border-border rounded-3xl shadow-sm">
          <p className="text-error font-semibold text-lg mb-2">Failed to load bookings</p>
          <p className="text-foreground/60 text-sm max-w-md mb-6">{error}</p>
          <button
            onClick={fetchBookings}
            className="px-6 py-2.5 bg-primary hover:bg-accent text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const bookings = response?.data?.bookings || [];

  // Filter bookings locally
  const filteredBookings = bookings.filter((b) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'PENDING_PAYMENT') {
      return (
        b.bookingStatus === 'reserved' &&
        (b.paymentStatus === 'pending' ||
          b.paymentStatus === 'partial' ||
          b.paymentStatus === 'overdue')
      );
    }
    if (selectedFilter === 'CANCELLED')
      return b.bookingStatus === 'cancelled' || b.bookingStatus === 'expired';
    if (selectedFilter === 'COMPLETED') return b.bookingStatus === 'completed';
    if (selectedFilter === 'UPCOMING') {
      const isSecured =
        b.bookingStatus === 'confirmed' ||
        (b.bookingStatus === 'reserved' &&
          (b.paymentStatus === 'partial' || b.paymentStatus === 'overdue'));
      return isSecured && new Date(b.startDateTime) > new Date();
    }
    return true;
  });

  return (
    <div className="w-full max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          My Bookings
        </h1>
        <p className="mt-2 text-sm sm:text-base text-foreground/60">
          View and manage your venue bookings, payments, and reservation history.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <BookingFilters selected={selectedFilter} onChange={setSelectedFilter} />
      </div>

      {/* Bookings Grid */}
      {filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} onCancelSuccess={fetchBookings} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-surface border border-border rounded-3xl shadow-sm">
          <Calendar className="w-12 h-12 text-foreground/30 stroke-[1.2] mb-4" />
          <h3 className="text-lg font-bold text-foreground">No Bookings Found</h3>
          <p className="text-sm text-foreground/60 mt-1 max-w-xs leading-relaxed">
            {selectedFilter === 'ALL'
              ? "You haven't booked any venues yet. Explore premium venues and make your first booking!"
              : `You don't have any matching result`}
          </p>
          {selectedFilter === 'ALL' && (
            <Link
              to="/venues"
              className="mt-6 px-6 py-3 bg-primary hover:bg-accent text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg"
            >
              Explore Venues
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
