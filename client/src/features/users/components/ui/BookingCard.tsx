import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Building2, ArrowUpRight } from 'lucide-react';
import type { Booking } from '../../types';

interface BookingCardProps {
  booking: Booking;
  onCancelSuccess?: () => void;
  role?: 'user' | 'owner';
}

const statusConfig: Record<string, { label: string; color: string }> = {
  'reserved+pending': { label: 'Pending Payment', color: 'bg-amber-500/10 text-amber-500 border-amber-500/30' },
  'reserved+partial': { label: 'Deposit Paid', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
  'reserved+deposit_paid': { label: 'Deposit Paid', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
  'reserved+overdue': { label: 'Overdue', color: 'bg-error/10 text-error border-error/30' },
  'confirmed+paid': { label: 'Confirmed', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' },
  'completed+paid': { label: 'Completed', color: 'bg-info/10 text-info border-info/30' },
  'cancelled+cancelled': { label: 'Cancelled', color: 'bg-error/10 text-error border-error/30' },
  'expired+cancelled': { label: 'Expired', color: 'bg-error/10 text-error border-error/30' },
};

const fmtDate = (dateStr: string) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const BookingCard = ({ booking, role = 'user' }: BookingCardProps) => {
  const navigate = useNavigate();

  const statusKey = `${booking.bookingStatus?.toLowerCase()}+${booking.paymentStatus?.toLowerCase()}`;
  const status = statusConfig[statusKey] ?? {
    label: booking.bookingStatus?.toUpperCase() || 'RESERVED',
    color: 'bg-surface text-foreground/80 border-border/50',
  };

  const detailUrl = role === 'owner' ? `/owner/bookings/${booking.id}` : `/account/bookings/${booking.id}`;

  const venue = booking.venue;
  const imageUrl = venue?.imageUrl || venue?.images?.[0] || null;

  const remainingBalance = booking.remainingBalance ?? Math.max(0, booking.totalAmount - booking.amountPaid);
  const locationText = venue?.location || (venue?.address ? `${venue.address.city}, ${venue.address.state}` : '');

  return (
    <div
      onClick={() => navigate(detailUrl)}
      className="group rounded-3xl border border-border/60 bg-card p-3.5 space-y-4 shadow-sm hover:shadow-2xl hover:border-primary/40 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
    >
      {/* Media Header */}
      <div className="relative h-48 sm:h-52 w-full rounded-2xl overflow-hidden bg-black/40">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={venue?.name || 'Venue'}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground/40">
            <Building2 size={48} className="stroke-[1.2]" />
          </div>
        )}

        {/* Status Badge Overlay */}
        <span
          className={`absolute top-3 right-3 inline-flex items-center rounded-full border backdrop-blur-md px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider shadow-md ${status.color}`}
        >
          {status.label}
        </span>

        {/* Price tag overlay at bottom-left */}
        <div className="absolute bottom-3 left-3 rounded-xl bg-black/60 backdrop-blur-md px-3 py-1.5 border border-white/10 flex items-baseline gap-1 text-white">
          <span className="text-xl font-black">₹{booking.totalAmount?.toLocaleString('en-IN')}</span>
          {booking.amountPaid > 0 && remainingBalance > 0 && (
            <span className="text-[11px] text-amber-400 font-bold"> (₹{remainingBalance.toLocaleString('en-IN')} due)</span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="px-1.5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors tracking-tight line-clamp-1">
              {venue?.name || 'Venue Booking'}
            </h3>
            <div className="w-8 h-8 rounded-full bg-surface border border-border/40 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
              <ArrowUpRight size={16} />
            </div>
          </div>

          {locationText && (
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground font-medium">
              <MapPin size={14} className="shrink-0 text-primary" />
              <span className="truncate">{locationText}</span>
            </div>
          )}
        </div>

        {/* Date & Guests Feature Row */}
        <div className="pt-3 border-t border-border/40 flex items-center justify-between gap-2 text-xs font-semibold text-muted-foreground">
          <div className="flex items-center gap-1.5 bg-surface/70 border border-border/40 px-3 py-1.5 rounded-xl">
            <Calendar size={14} className="text-primary" />
            <span>{fmtDate(booking.startDateTime)}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-surface/70 border border-border/40 px-3 py-1.5 rounded-xl">
            <Users size={14} className="text-primary" />
            <span>{booking.guests} Guests</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
