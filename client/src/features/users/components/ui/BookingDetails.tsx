import { MapPin, Calendar, Clock, Users, CreditCard } from 'lucide-react';
import type { Booking } from '../../types';

interface BookingDetailsProps {
  booking: Booking;
}

export const BookingDetails = ({ booking }: BookingDetailsProps) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      {/* Venue details */}
      <h3 className="text-lg font-bold text-foreground line-clamp-1">{booking.venue.name}</h3>
      <div className="flex items-center gap-1.5 text-xs text-foreground/60 mt-1">
        <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
        <span className="line-clamp-1">{booking.venue.location}</span>
      </div>

      <div className="border-t border-border/60 my-4" />

      {/* Time & Dates */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 text-xs text-foreground/80">
          <Calendar className="w-4 h-4 text-foreground/40" />
          <div>
            <span className="font-semibold">{formatDate(booking.startDateTime)}</span>
            {formatDate(booking.startDateTime) !== formatDate(booking.endDateTime) && (
              <>
                {' '}
                - <span className="font-semibold">{formatDate(booking.endDateTime)}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-foreground/80">
          <Clock className="w-4 h-4 text-foreground/40" />
          <span>
            {formatTime(booking.startDateTime)} - {formatTime(booking.endDateTime)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-foreground/80">
          <Users className="w-4 h-4 text-foreground/40" />
          <span>{booking.guests} guests</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-foreground/80">
          <CreditCard className="w-4 h-4 text-foreground/40" />
          <span className="capitalize">Payment: {booking.paymentMethod}</span>
        </div>
      </div>
    </div>
  );
};
