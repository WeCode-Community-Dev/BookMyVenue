import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useCreateBookingMutation, useGetVenueAvailabilityQuery } from '@/features/bookings/api/bookings-api';
import { BookingCalendar } from '@/features/bookings/components/booking-calendar';
import { TimeSlotGrid } from '@/features/bookings/components/time-slot-grid';
import { getApiErrorMessage } from '@/lib/api';
import { getDayUtcRangeForAvailabilityQuery, getMonthUtcRangeForAvailabilityQuery, convertIstDateHourToUtcIso } from '@/utils/datetime';
import { countHoursBetween, getCurrentMonthYearInIst } from '@/utils/slots';

export function BookingPanel({ venueId, venue, venueLoading, isAuthenticated, role, onRequireLogin, onBookSuccess }) {
  const defaults = getCurrentMonthYearInIst();

  const [visibleMonth, setVisibleMonth] = useState(defaults);
  const [selectedDate, setSelectedDate] = useState(null);
  const [startHour, setStartHour] = useState(null);
  const [endHour, setEndHour] = useState(null);

  const monthRange = useMemo(() => getMonthUtcRangeForAvailabilityQuery(visibleMonth.year, visibleMonth.month), [visibleMonth]);

  const { data: monthAvailability, isFetching: monthFetching } = useGetVenueAvailabilityQuery(
    {
      venueId,
      from: monthRange.from,
      to: monthRange.to,
    },
    { skip: !venueId },
  );

  const dayRange = selectedDate ? getDayUtcRangeForAvailabilityQuery(selectedDate) : null;

  const { data: dayAvailability, isFetching: dayFetching } = useGetVenueAvailabilityQuery(
    dayRange
      ? {
          venueId,
          from: dayRange.from,
          to: dayRange.to,
        }
      : { venueId, from: '', to: '' },
    { skip: !selectedDate },
  );

  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();

  const monthBusySlots = monthAvailability?.busySlots ?? [];
  const dayBusySlots = dayAvailability?.busySlots ?? [];

  const hours = startHour != null && endHour != null ? countHoursBetween(startHour, endHour) : 0;
  const totalPrice = venue ? hours * venue.pricePerHour : 0;
  const canBook = selectedDate && startHour != null && endHour != null && hours > 0;

  useEffect(() => {
    setStartHour(null);
    setEndHour(null);
  }, [selectedDate]);

  async function handleBook() {
    if (!canBook) return;

    if (!isAuthenticated) {
      onRequireLogin();
      return;
    }

    if (role !== 'CUSTOMER') {
      toast.error('Only customer accounts can book venues');
      return;
    }

    try {
      await createBooking({
        venueId,
        bookingFrom: convertIstDateHourToUtcIso(selectedDate, startHour),
        bookingTo: convertIstDateHourToUtcIso(selectedDate, endHour),
      }).unwrap();

      toast.success('Booking confirmed!');
      onBookSuccess?.();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Booking failed'));
    }
  }

  if (venueLoading) {
    return (
      <Card className="sticky top-24">
        <CardHeader>
          <Skeleton className="h-8 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!venue) return null;

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="text-brand-text">
          ₹{venue.pricePerHour}
          <span className="text-base font-normal text-brand-muted"> / hour</span>
        </CardTitle>
        <CardDescription>Select a date and hourly slot (8 AM – 10 PM IST).</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <BookingCalendar
          year={visibleMonth.year}
          month={visibleMonth.month}
          onMonthChange={setVisibleMonth}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          busySlots={monthBusySlots}
        />

        {monthFetching ? <p className="text-xs text-brand-muted">Updating calendar…</p> : null}

        {selectedDate ? (
          <div className="space-y-3 border-t border-brand-border pt-4">
            <p className="text-sm font-medium text-brand-text">Pick your hours</p>
            {dayFetching ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <TimeSlotGrid
                dateStr={selectedDate}
                busySlots={dayBusySlots}
                startHour={startHour}
                endHour={endHour}
                onSelectStart={setStartHour}
                onSelectEnd={setEndHour}
              />
            )}
          </div>
        ) : null}

        {canBook ? (
          <div className="rounded-md border border-brand-border bg-brand-surface p-3 text-sm">
            <div className="flex justify-between text-brand-text">
              <span>
                {hours} hour{hours === 1 ? '' : 's'}
              </span>
              <span className="font-semibold">₹{totalPrice}</span>
            </div>
          </div>
        ) : null}

        <Button className="w-full" disabled={!canBook || isBooking} onClick={handleBook}>
          {isBooking ? 'Booking…' : 'Book now'}
        </Button>
      </CardContent>
    </Card>
  );
}
