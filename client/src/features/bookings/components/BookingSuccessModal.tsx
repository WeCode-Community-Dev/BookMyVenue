import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Printer, ExternalLink } from 'lucide-react';
import type { Venue } from '@/features/venues/types/venues.types';

interface BookingSuccessModalProps {
  successData: any;
  venue: Venue;
  startDateTime: string | null;
  endDateTime: string | null;
  onClose: () => void;
}

export default function BookingSuccessModal({
  successData,
  venue,
  onClose,
}: BookingSuccessModalProps) {
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-card border border-border w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-2xl space-y-5 sm:space-y-6 relative overflow-hidden sm:my-8 animate-in fade-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300">
        {/* Glowing top line */}
        <div className="absolute top-0 inset-x-0 h-1.5 sm:h-2 bg-gradient-to-r from-green-500 to-emerald-400" />

        {/* Drag handle on mobile */}
        <div className="flex justify-center sm:hidden pt-1">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        <div className="text-center space-y-2 sm:space-y-3 pt-1 sm:pt-2">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-500/10 text-green-500 mb-1 sm:mb-2">
            <CheckCircle2 size={36} className="sm:w-10 sm:h-10 animate-bounce" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
            {successData.bookingStatus === 'CONFIRMED' ? 'Booking Confirmed!' : 'Venue Reserved!'}
          </h2>
          <p className="text-xs text-muted max-w-sm mx-auto">
            {successData.bookingStatus === 'CONFIRMED'
              ? 'Your booking is confirmed with full payment received. We have sent a copy of the invoice to your registered email.'
              : `Your venue is reserved! You've paid the 20% deposit of ₹${successData.amountPaid?.toLocaleString('en-IN')}. Your remaining balance of ₹${successData.remainingBalance?.toLocaleString('en-IN')} is due by ${successData.remainingPaymentDueDate ? new Date(successData.remainingPaymentDueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }) + ' (EOD)' : 'the event date'}.`}
          </p>
        </div>

        {/* Receipt Summary Card */}
        <div className="bg-background border border-border rounded-xl sm:rounded-2xl p-3.5 sm:p-4 text-xs space-y-3">
          <div className="flex justify-between items-start border-b border-border/80 pb-2.5 gap-2">
            <span className="text-muted font-semibold shrink-0">CONFIRMATION ID</span>
            <span className="font-mono font-bold text-foreground text-xs sm:text-sm tracking-wider text-right break-all">
              {successData._id}
            </span>
          </div>

          <div className="space-y-1.5 py-1">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wide block">
              VENUE DETAILS
            </span>
            <span className="font-bold text-foreground block text-sm">{venue.name}</span>
            <span className="text-muted block">
              {venue.address.street}, {venue.address.city}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 border-t border-border/80 pt-2.5">
            <div>
              <span className="text-[9px] font-bold text-muted block uppercase">Check In</span>
              <span className="font-semibold text-foreground block mt-0.5">
                {formatDate(successData.startDateTime)}
              </span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-muted block uppercase">Guests</span>
              <span className="font-semibold text-foreground block mt-0.5">
                {successData.guests} Attendees
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-border/80 pt-2.5 gap-2">
            <span className="text-muted">Amount Paid Now</span>
            <span className="font-bold text-green-600 text-right">
              ₹{successData.amountPaid?.toLocaleString('en-IN')}
            </span>
          </div>

          {successData.remainingBalance > 0 && (
            <div className="flex justify-between items-center border-t border-border/80 pt-2.5 gap-2">
              <span className="text-muted">Balance Due</span>
              <span className="font-bold text-warning text-right">
                ₹{successData.remainingBalance?.toLocaleString('en-IN')}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center border-t border-border/80 pt-2.5 text-sm font-bold text-foreground">
            <span>Total Booking Amount</span>
            <span className="text-primary text-base font-extrabold">
              ₹{successData.totalAmount?.toLocaleString('en-IN')}
            </span>
          </div>
        </div>a

        {/* Actions Grid */}
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-1 sm:pt-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 inline-flex justify-center items-center gap-2 border border-border hover:border-foreground/30 bg-background text-foreground text-xs font-bold py-3 rounded-xl transition-all cursor-pointer"
          >
            <Printer size={14} /> Print Receipt
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              navigate(`/account/bookings/${successData?.id || successData?._id}`);
            }}
            className="flex-1 inline-flex justify-center items-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-bold py-3 rounded-xl transition-all cursor-pointer shadow-md shadow-primary/10"
          >
            Booking details
          </button>
        </div>

        <div className="text-center pt-0.5">
          <Link
            to="/account/bookings"
            className="text-[11px] font-semibold text-primary hover:underline inline-flex items-center gap-1"
            onClick={onClose}
          >
            View My Bookings Dashboard <ExternalLink size={10} />
          </Link>
        </div>
      </div>
    </div>
  );
}
