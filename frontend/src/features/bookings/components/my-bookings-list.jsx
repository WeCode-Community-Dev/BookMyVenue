import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { paths } from '@/config/paths';
import { useCancelBookingMutation, useGetMyBookingsQuery } from '@/features/bookings/api/bookings-api';
import { getApiErrorMessage } from '@/lib/api';
import { formatBookingRangeForDisplay } from '@/utils/datetime';

function BookingRowSkeleton() {
  return (
    <div className="space-y-2 rounded-md border border-brand-border p-4">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-9 w-24" />
    </div>
  );
}

export function MyBookingsList() {
  const { data: bookings = [], isLoading, isError, error } = useGetMyBookingsQuery();
  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();

  useEffect(() => {
    if (isError) {
      toast.error(getApiErrorMessage(error, 'Failed to load bookings'));
    }
  }, [isError, error]);

  async function handleCancel(id) {
    try {
      await cancelBooking(id).unwrap();
      toast.success('Booking cancelled');
    } catch (cancelError) {
      toast.error(getApiErrorMessage(cancelError, 'Could not cancel booking'));
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <BookingRowSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-brand-border bg-white p-10 text-center">
        <h2 className="text-lg font-semibold text-brand-text">No bookings yet</h2>
        <p className="mt-2 text-brand-muted">Find a venue and book your first slot.</p>
        <Button asChild className="mt-6">
          <Link to={paths.home.path}>Browse venues</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const isConfirmed = booking.status === 'CONFIRMED';

        return (
          <Card key={booking.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-brand-text">{booking.venue?.name ?? `Venue #${booking.venueId}`}</CardTitle>
              {booking.venue?.city ? <p className="text-sm text-brand-muted">{booking.venue.city}</p> : null}
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-brand-text">{formatBookingRangeForDisplay(booking.bookingFrom, booking.bookingTo)}</p>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm">
                  <span className="font-semibold text-brand-text">₹{booking.totalPrice}</span>
                  <span
                    className={
                      isConfirmed
                        ? 'ml-3 rounded-full bg-brand-surface px-2 py-0.5 text-xs text-brand-text'
                        : 'ml-3 rounded-full bg-muted px-2 py-0.5 text-xs text-brand-muted'
                    }
                  >
                    {booking.status}
                  </span>
                </div>
                {isConfirmed ? (
                  <Button variant="outline" size="sm" disabled={isCancelling} onClick={() => handleCancel(booking.id)}>
                    Cancel
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
