import { useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Loader2, Calendar } from 'lucide-react';
import { useAsyncFetch } from '@/shared/hooks/useAsyncFetch';
import { usersApi } from '../../services/users.api';
import BookingFilters from '../ui/BookingFilters';
import type { MyBookingsResponse } from '../../types';
import BookingCard from '../ui/BookingCard';
import { Pagination } from '@/shared/components/ui';

export default function UserBookings() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedFilter = searchParams.get('status') || 'ALL';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 8; // 8 per page for marketplace grid view

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

  const updateParams = (updates: Record<string, string | number | undefined>) => {
    setSearchParams(
      (prev) => {
        const newParams = new URLSearchParams(prev);
        Object.entries(updates).forEach(([key, value]) => {
          if (value === undefined || value === '') {
            newParams.delete(key);
          } else {
            newParams.set(key, String(value));
          }
        });
        return newParams;
      },
      { replace: true }
    );
  };

  const fetchBookings = useCallback(() => {
    let apiStatus: string | undefined;
    if (selectedFilter === 'PENDING_PAYMENT') {
      apiStatus = 'reserved';
    } else if (selectedFilter === 'CANCELLED') {
      apiStatus = 'cancelled';
    } else if (selectedFilter === 'COMPLETED') {
      apiStatus = 'completed';
    } else if (selectedFilter === 'UPCOMING') {
      apiStatus = 'confirmed';
    }

    execute(() => usersApi.getBookings(page, limit, apiStatus));
  }, [execute, page, limit, selectedFilter]);

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
      <div className="w-full max-w-[1600px] mx-auto py-10 px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-8 bg-surface border border-border/60 rounded-3xl shadow-sm">
          <p className="text-error font-semibold text-lg mb-2">Failed to load bookings</p>
          <p className="text-foreground/60 text-sm max-w-md mb-6">{error}</p>
          <button
            onClick={fetchBookings}
            className="px-6 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const bookings = response?.data?.bookings || [];

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
    <div className="w-full max-w-[1600px] mx-auto py-8 px-4 sm:px-6 lg:px-10 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
          My Bookings
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground font-medium">
          View your venue reservations and access full booking details & receipts.
        </p>
      </div>

      {/* Filters */}
      <div>
        <BookingFilters
          selected={selectedFilter}
          onChange={(newVal) => updateParams({ status: newVal, page: 1 })}
        />
      </div>

      {/* Bookings Grid — Minimal Open Cards */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} onCancelSuccess={fetchBookings} />
            ))}
          </div>
          {response?.data?.pagination && (
            <Pagination
              pagination={response.data.pagination}
              onPageChange={(newPage) => updateParams({ page: newPage })}
              itemName="booking"
            />
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-surface/50 border border-border/40 rounded-3xl shadow-sm space-y-4">
          <Calendar className="w-14 h-14 text-muted-foreground/30 stroke-[1.2]" />
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-foreground">No Bookings Found</h3>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed font-medium">
              {selectedFilter === 'ALL'
                ? "You haven't booked any venues yet. Explore available venues and reserve your first space!"
                : `No matching bookings found for the selected status filter.`}
            </p>
          </div>
          {selectedFilter === 'ALL' && (
            <Link
              to="/venues"
              className="mt-2 px-6 py-3 bg-primary hover:bg-primary/95 text-white font-extrabold rounded-2xl text-sm transition-all shadow-md"
            >
              Explore Venues
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
