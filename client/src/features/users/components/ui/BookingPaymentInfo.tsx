import { Clock, ShieldCheck } from 'lucide-react';
import type { Booking } from '../../types';

interface BookingPaymentInfoProps {
  booking: Booking;
}

export const BookingPaymentInfo = ({ booking }: BookingPaymentInfoProps) => {
  const getDaysLeft = () => {
    if (!booking.remainingPaymentDueDate) return null;
    const due = new Date(booking.remainingPaymentDueDate);
    const now = new Date();
    const dueTime = Date.UTC(due.getUTCFullYear(), due.getUTCMonth(), due.getUTCDate());
    const nowTime = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const diffMs = dueTime - nowTime;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  };

  // 1. Paid State
  if (booking.paymentStatus === 'paid') {
    return (
      <div className="flex items-center gap-2 text-xs text-success bg-success/5 border border-success/10 rounded-2xl p-3 mt-4">
        <ShieldCheck className="w-4 h-4 text-success shrink-0" />
        <div className="text-[11px] leading-snug font-bold">Fully Paid</div>
      </div>
    );
  }

  // 2. Cancelled or Expired
  if (booking.bookingStatus === 'cancelled' || booking.bookingStatus === 'expired') {
    return null;
  }

  // 3. Short notice / Immediate Payment Required State
  if (booking.isImmediatePaymentRequired) {
    const remainingBalance = booking.totalAmount - booking.amountPaid;
    return (
      <div className="flex items-start gap-2 text-xs text-error bg-error/5 border border-error/10 rounded-2xl p-3 mt-4 animate-pulse">
        <Clock className="w-4 h-4 text-error shrink-0 mt-0.5" />
        <div className="text-[11px] leading-snug">
          <div className="mb-1 text-foreground/80">
            Full amount of{' '}
            <span className="font-bold text-foreground">
              ₹{remainingBalance.toLocaleString('en-IN')}
            </span>{' '}
            must be paid immediately.
          </div>
          <span className="font-semibold text-error block">Immediate payment required</span>
          <span className="text-foreground/75">Complete payment now to confirm booking</span>
        </div>
      </div>
    );
  }

  // 4. Overdue State
  const isOverdue =
    booking.paymentStatus === 'overdue' ||
    (booking.remainingPaymentDueDate && new Date() > new Date(booking.remainingPaymentDueDate));
  if (isOverdue) {
    const remainingBalance = booking.totalAmount - booking.amountPaid;
    return (
      <div className="flex items-start gap-2 text-xs text-error bg-error/5 border border-error/10 rounded-2xl p-3 mt-4">
        <Clock className="w-4 h-4 text-error shrink-0 mt-0.5 animate-bounce" />
        <div className="text-[11px] leading-snug">
          <div className="mb-1 text-foreground/80">
            Remaining Balance of{' '}
            <span className="font-bold text-foreground">
              ₹{remainingBalance.toLocaleString('en-IN')}
            </span>{' '}
            was due on{' '}
            <span className="font-semibold text-foreground">
              {booking.remainingPaymentDueDate
                ? new Date(booking.remainingPaymentDueDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    timeZone: 'UTC',
                  }) + ' (EOD)'
                : 'event start'}
            </span>
            .
          </div>
          <span className="font-semibold text-error block">Payment Overdue</span>
          <span className="text-error font-medium block mt-0.5">
            Booking will be auto-cancelled and the advance payment will not be refunded.
          </span>
        </div>
      </div>
    );
  }

  // 5. Countdown logic for normal booking
  const daysLeft = getDaysLeft();
  if (daysLeft !== null) {
    let colorClass = 'text-primary bg-primary/5 border-primary/10';
    let iconColor = 'text-primary';
    let badgeClass = 'font-semibold text-primary';

    if (daysLeft <= 3) {
      colorClass = 'text-error bg-error/5 border-error/10';
      iconColor = 'text-error';
      badgeClass = 'font-semibold text-error';
    } else if (daysLeft <= 7) {
      colorClass = 'text-warning bg-warning/5 border-warning/10';
      iconColor = 'text-warning';
      badgeClass = 'font-semibold text-warning';
    }

    const remainingBalance = booking.totalAmount - booking.amountPaid;

    return (
      <div className={`flex flex-col gap-2 rounded-2xl p-3 mt-4 border ${colorClass}`}>
        <div className="flex items-start gap-2 text-xs">
          <Clock className={`w-4 h-4 ${iconColor} shrink-0 mt-0.5`} />
          <div className="text-[11px] leading-snug">
            <div className="mb-1 text-foreground/80">
              Remaining Balance of{' '}
              <span className="font-bold text-foreground">
                ₹{remainingBalance.toLocaleString('en-IN')}
              </span>{' '}
              is due before{' '}
              <span className="font-semibold text-foreground">
                {booking.remainingPaymentDueDate
                  ? new Date(booking.remainingPaymentDueDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      timeZone: 'UTC',
                    }) + ' (EOD)'
                  : 'event start'}
              </span>
              .
            </div>
            <div className="mt-1">
              <span className={badgeClass}>{daysLeft} days left to complete payment</span>
              <span className="block text-[10px] text-error font-medium mt-0.5">
                Booking auto-cancels in {daysLeft} days if unpaid (advance payment is
                non-refundable).
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
