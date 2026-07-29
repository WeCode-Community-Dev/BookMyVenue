import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Info } from 'lucide-react';
import type { AvailabilityConfig } from '@/features/venues/types/venues.types';
import { DateTimePicker } from '@/shared/components/ui';

type Props = {
  startDateTime: string | null;
  endDateTime: string | null;
  pricingUnit: 'hour' | 'day';
  availability?: AvailabilityConfig;
  existingBookings?: any[] | null;
  onChange: (start: string | null, end: string | null) => void;
};

const DateTimeSection: React.FC<Props> = ({
  startDateTime,
  endDateTime,
  pricingUnit,
  availability,
  existingBookings,
  onChange,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [durationText, setDurationText] = useState<string>('');

  useEffect(() => {
    if (!startDateTime || !endDateTime) {
      setDurationText('');
      setError(null);
      return;
    }

    const start = new Date(startDateTime).getTime();
    const end = new Date(endDateTime).getTime();

    if (isNaN(start) || isNaN(end)) {
      setError('Invalid dates selected.');
      setDurationText('');
      return;
    }

    if (end <= start) {
      setError('End date & time must be after start date & time.');
      setDurationText('');
      return;
    }

    const now = new Date().getTime();
    if (start < now) {
      setError('Start time cannot be in the past.');
      setDurationText('');
      return;
    }

    // Overlap checks
    if (existingBookings && existingBookings.length > 0) {
      const hasOverlap = existingBookings.some((booking) => {
        if (booking.bookingStatus === 'CANCELLED' || booking.bookingStatus === 'REFUNDED') {
          return false;
        }
        const bStart = new Date(booking.startDateTime).getTime();
        const bEnd = new Date(booking.endDateTime).getTime();
        return start < bEnd && end > bStart;
      });

      if (hasOverlap) {
        setError('The selected timeline overlaps with an existing booking.');
        setDurationText('');
        return;
      }
    }

    setError(null);
    const diffMs = end - start;

    if (pricingUnit === 'hour') {
      const hours = diffMs / (1000 * 60 * 60);

      // Check constraints
      if (availability) {
        const { minBookingDuration, maxBookingDuration } = availability;
        if (hours < minBookingDuration) {
          setError(
            `Minimum booking duration is ${minBookingDuration} hour${minBookingDuration > 1 ? 's' : ''}.`
          );
        } else if (maxBookingDuration && hours > maxBookingDuration) {
          setError(
            `Maximum booking duration is ${maxBookingDuration} hour${maxBookingDuration > 1 ? 's' : ''}.`
          );
        }
      }

      const formattedHours = hours % 1 === 0 ? hours.toFixed(0) : hours.toFixed(1);
      setDurationText(`${formattedHours} hour${hours !== 1 ? 's' : ''}`);
    } else {
      const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      setDurationText(`${days} day${days > 1 ? 's' : ''}`);
    }
  }, [startDateTime, endDateTime, pricingUnit, availability, existingBookings]);

  const formatDayOfWeek = (dayNum: number): string => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayNum];
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-5 transition-all hover:shadow-md">
      <div className="flex items-center gap-2.5 sm:gap-3 border-b border-border pb-3 sm:pb-4">
        <div className="bg-primary/10 text-primary p-1.5 sm:p-2 rounded-xl shrink-0">
          <Calendar size={18} className="sm:w-5 sm:h-5" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-foreground">Select Date & Time</h3>
          <p className="text-xs text-muted">Choose your event timeline</p>
        </div>
      </div>

      {availability && (
        <div className="bg-primary/5 border border-primary/20 text-foreground text-xs p-3 sm:p-3.5 rounded-xl flex items-start gap-2 sm:gap-2.5">
          <Info size={15} className="text-primary shrink-0 mt-0.5" />
          <div className="space-y-1 min-w-0">
            <span className="font-semibold text-primary block">Venue Operating Rules:</span>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-x-4 gap-y-1 text-muted">
              <span className="flex items-center gap-1">
                <Clock size={11} className="shrink-0" /> Hours: {availability.openingTime} -{' '}
                {availability.closingTime}
              </span>
              <span>Days: {availability.availableDays.map(formatDayOfWeek).join(', ')}</span>
              <span>
                Min Duration: {availability.minBookingDuration} hr
                {availability.minBookingDuration > 1 ? 's' : ''}
              </span>
              {availability.maxBookingDuration && (
                <span>Max Duration: {availability.maxBookingDuration} hrs</span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <DateTimePicker
          label="Start Date & Time"
          value={startDateTime}
          onChange={(val) => onChange(val, endDateTime)}
          disabledDays={availability?.availableDays}
          openingTime={availability?.openingTime}
          closingTime={availability?.closingTime}
          placeholder="Choose start date & time"
          existingBookings={existingBookings}
        />

        <DateTimePicker
          label="End Date & Time"
          value={endDateTime}
          onChange={(val) => onChange(startDateTime, val)}
          disabledDays={availability?.availableDays}
          openingTime={availability?.openingTime}
          closingTime={availability?.closingTime}
          placeholder="Choose end date & time"
          existingBookings={existingBookings}
          minDate={(() => {
            if (!startDateTime) return new Date();
            const minBookingDuration = availability?.minBookingDuration || 1;
            return new Date(
              new Date(startDateTime).getTime() + minBookingDuration * 60 * 60 * 1000
            );
          })()}
        />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-xl flex items-start gap-2">
          <span className="shrink-0">⚠️</span>
          <span className="font-medium">{error}</span>
        </div>
      )}

      {durationText && !error && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-600 text-xs p-3 rounded-xl flex justify-between items-center gap-2">
          <span className="font-medium">Selected Duration:</span>
          <span className="font-bold text-xs sm:text-sm bg-green-500 text-white px-2.5 py-0.5 rounded-full shrink-0">
            {durationText}
          </span>
        </div>
      )}
    </div>
  );
};

export default DateTimeSection;
