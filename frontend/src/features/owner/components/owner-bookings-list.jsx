import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { paths } from '@/config/paths';
import { useGetOwnerBookingsQuery } from '@/features/owner/api/owner-api';
import { getApiErrorMessage } from '@/lib/api';
import { cn } from '@/utils/cn';
import { formatBookingRangeForDisplay } from '@/utils/datetime';

function BookingRowSkeleton() {
  return (
    <div className="space-y-2 rounded-md border border-brand-border p-4">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export function OwnerBookingsList({ limit, showEmptyActions = true } = {}) {
  const { data: bookings = [], isLoading, isError, error } = useGetOwnerBookingsQuery();

  useEffect(() => {
    if (isError) {
      toast.error(getApiErrorMessage(error, 'Failed to load bookings'));
    }
  }, [isError, error]);

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
        <p className="mt-2 text-brand-muted">When customers book your venues, they show up here.</p>
        {showEmptyActions ? (
          <Button asChild className="mt-6" variant="outline">
            <Link to={paths.owner.dashboard.path}>Back to dashboard</Link>
          </Button>
        ) : null}
      </div>
    );
  }

  const visible = typeof limit === 'number' ? bookings.slice(0, limit) : bookings;

  return (
    <div className="space-y-4">
      {visible.map((booking) => {
        const isConfirmed = booking.status === 'CONFIRMED';

        return (
          <Card key={booking.id}>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-lg text-brand-text">{booking.venue?.name ?? `Venue #${booking.venueId}`}</CardTitle>
                  <p className="mt-1 text-sm text-brand-muted">
                    {booking.customer?.username ?? 'Customer'}
                    {booking.customer?.email ? ` · ${booking.customer.email}` : ''}
                  </p>
                </div>
                <span
                  className={cn('rounded-full px-2 py-0.5 text-xs', isConfirmed ? 'bg-brand-surface text-brand-text' : 'bg-muted text-brand-muted')}
                >
                  {booking.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-brand-text">{formatBookingRangeForDisplay(booking.bookingFrom, booking.bookingTo)}</p>
              <div className="flex flex-wrap justify-between gap-2 text-brand-muted">
                <span>₹{booking.totalPrice}</span>
                {isConfirmed && booking.customer?.mobileNumber ? <span>{booking.customer.mobileNumber}</span> : null}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
