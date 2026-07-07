import { Link } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Calendar, Users, CreditCard,
  XCircle, Loader2, CheckCircle2, Clock, AlertTriangle,
} from 'lucide-react';

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  'reserved+pending':    { label: 'Pending Payment', color: 'text-warning bg-warning/10 border-warning/20', icon: Clock },
  'reserved+partial':    { label: 'Deposit Paid',    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', icon: Clock },
  'reserved+deposit_paid':{ label: 'Deposit Paid',   color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', icon: Clock },
  'reserved+overdue':    { label: 'Overdue',         color: 'text-error bg-error/10 border-error/20', icon: AlertTriangle },
  'confirmed+paid':      { label: 'Confirmed',       color: 'text-success bg-success/10 border-success/20', icon: CheckCircle2 },
  'completed+paid':      { label: 'Completed',       color: 'text-info bg-info/10 border-info/20', icon: CheckCircle2 },
  'cancelled+cancelled': { label: 'Cancelled',       color: 'text-error bg-error/10 border-error/20', icon: XCircle },
  'expired+cancelled':   { label: 'Expired',         color: 'text-error bg-error/10 border-error/20', icon: XCircle },
};

const fmt = (date: string | null | undefined) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};
const fmtDate = (date: string | null | undefined) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
};

interface SharedBookingDetailsProps {
  booking: any;
  role: 'user' | 'owner';
  actionLoading?: boolean;
  onCancel?: () => void;
  onPayBalance?: () => void;
  backUrl: string;
  backText: string;
}

export default function SharedBookingDetails({
  booking,
  role,
  actionLoading = false,
  onCancel,
  onPayBalance,
  backUrl,
  backText,
}: SharedBookingDetailsProps) {
  const statusKey = `${booking.bookingStatus?.toLowerCase()}+${booking.paymentStatus?.toLowerCase()}`;
  const status = statusConfig[statusKey] ?? { label: booking.bookingStatus?.toUpperCase(), color: 'text-foreground/60 bg-muted/10 border-border', icon: Clock };
  const StatusIcon = status.icon;

  const isPending = booking.bookingStatus === 'pending' && booking.paymentStatus === 'pending';
  const isPartial = booking.bookingStatus === 'reserved' &&
    ['partial', 'deposit_paid', 'overdue'].includes(booking.paymentStatus?.toLowerCase());

  const venue = booking.venue;
  const imageUrl = venue?.images?.[0] || venue?.imageUrl || null;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Back nav */}
        <Link to={backUrl} className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground font-semibold transition-colors">
          <ArrowLeft className="w-4 h-4" /> {backText}
        </Link>

        {/* Venue banner */}
        <div className="rounded-3xl overflow-hidden border border-border bg-surface shadow-sm">
          {imageUrl ? (
            <img src={imageUrl} alt={venue?.name} className="w-full h-48 object-cover" />
          ) : (
            <div className="w-full h-48 bg-muted/20 flex items-center justify-center text-foreground/30 text-sm">No image</div>
          )}
          <div className="p-5 sm:p-6 space-y-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-extrabold text-foreground">{venue?.name}</h1>
                {venue?.address && (
                  <p className="text-sm text-foreground/60 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    {venue.address.street}, {venue.address.city}
                  </p>
                )}
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border flex-shrink-0 ${status.color}`}>
                <StatusIcon className="w-3 h-3" />
                {status.label}
              </span>
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-surface p-4 space-y-3">
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Booking Details</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-foreground/40 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-foreground/50 uppercase font-bold">Check In</p>
                  <p className="font-semibold text-foreground">{fmt(booking.startDateTime)}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-foreground/40 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-foreground/50 uppercase font-bold">Check Out</p>
                  <p className="font-semibold text-foreground">{fmt(booking.endDateTime)}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-foreground/40 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-foreground/50 uppercase font-bold">Guests</p>
                  <p className="font-semibold text-foreground">{booking.guests} Attendees</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-4 space-y-3">
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Payment Summary</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground/60">Total Amount</span>
                <span className="font-bold text-foreground">₹{booking.totalAmount?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">Amount Paid</span>
                <span className="font-bold text-success">₹{booking.amountPaid?.toLocaleString('en-IN')}</span>
              </div>
              {booking.remainingBalance > 0 && (
                <div className="flex justify-between border-t border-border/60 pt-2">
                  <span className="text-foreground/60">Balance Due</span>
                  <span className="font-bold text-warning">₹{booking.remainingBalance?.toLocaleString('en-IN')}</span>
                </div>
              )}
              {booking.remainingPaymentDueDate && isPartial && (
                <p className="text-[11px] text-foreground/50 pt-1">Due by {fmtDate(booking.remainingPaymentDueDate)} (EOD)</p>
              )}
            </div>
          </div>
        </div>

        {/* Customer Details section (Only for Owners) */}
        {role === 'owner' && (
          <div className="rounded-2xl border border-border bg-surface p-4 space-y-3">
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Customer Contact Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-[10px] text-foreground/50 uppercase font-bold">Full Name</p>
                <p className="font-semibold text-foreground">{booking.contactName || booking.user?.fullName}</p>
              </div>
              <div>
                <p className="text-[10px] text-foreground/50 uppercase font-bold">Email Address</p>
                <p className="font-semibold text-foreground">{booking.contactEmail || booking.user?.email}</p>
              </div>
              <div>
                <p className="text-[10px] text-foreground/50 uppercase font-bold">Phone Number</p>
                <p className="font-semibold text-foreground">{booking.contactPhone || 'N/A'}</p>
              </div>
            </div>
            {booking.specialRequests && (
              <div className="border-t border-border/60 pt-3 mt-3">
                <p className="text-[10px] text-foreground/50 uppercase font-bold">Special Requests</p>
                <p className="text-foreground/80 mt-1 italic">"{booking.specialRequests}"</p>
              </div>
            )}
          </div>
        )}

        {/* Confirmation ID */}
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-1">Confirmation ID</p>
          <p className="font-mono text-sm font-bold text-foreground break-all">{booking.bookingId || booking._id || booking.id}</p>
        </div>

        {/* Actions for User role */}
        {role === 'user' && (isPending || isPartial) && (
          <div className="flex flex-col sm:flex-row gap-3">
            {isPending && onCancel && (
              <button onClick={onCancel} disabled={actionLoading}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 border border-error/30 text-error hover:bg-error/5 disabled:opacity-60 text-sm font-bold rounded-xl transition-all cursor-pointer">
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                {actionLoading ? 'Cancelling…' : 'Cancel Booking'}
              </button>
            )}
            {isPartial && onPayBalance && (
              <button onClick={onPayBalance} disabled={actionLoading}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-all shadow-md cursor-pointer">
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                {actionLoading ? 'Opening…' : 'Pay Remaining Balance'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
