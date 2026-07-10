import React from 'react';
import { ShieldCheck, Loader2, CalendarCheck, Zap, Info } from 'lucide-react';
import type { Venue } from '@/features/venues/types/venues.types';

type Props = {
  venue: Venue | null;
  startDateTime: string | null;
  endDateTime: string | null;
  onSubmit: () => void;
  isSubmitting: boolean;
  existingBookings?: any[] | null;
  quote: {
    durationInHours: number;
    baseAmount: number;
    gst: number;
    platformFee: number;
    totalAmount: number;
    bookingScenario: 'ADVANCE' | 'IMMEDIATE';
    reservationDeposit: number;
    remainingBalance: number;
    remainingPaymentDueDate: string | null;
    autoCancellationDate: string | null;
    isImmediatePaymentRequired: boolean;
  } | null;
  quoteLoading?: boolean;
};

const PricingSection: React.FC<Props> = ({
  venue,
  startDateTime,
  endDateTime,
  onSubmit,
  isSubmitting,
  existingBookings,
  quote,
  quoteLoading = false,
}) => {
  const pricingUnit = 'hour';
  const priceRate = venue?.availability?.pricePerHour || 0;

  // ── Overlap Detection ─────────────────────────────────────
  const hasOverlap = (() => {
    if (!startDateTime || !endDateTime || !existingBookings) return false;
    const start = new Date(startDateTime).getTime();
    const end = new Date(endDateTime).getTime();
    return existingBookings.some((booking) => {
      if (booking.bookingStatus === 'CANCELLED' || booking.bookingStatus === 'EXPIRED') {
        return false;
      }
      const bStart = new Date(booking.startDateTime).getTime();
      const bEnd = new Date(booking.endDateTime).getTime();
      return start < bEnd && end > bStart;
    });
  })();

  // ── Validation ────────────────────────────────────────────
  const handleBookingSubmit = () => {
    if (!venue || !quote) return;
    if (!startDateTime || !endDateTime) {
      alert('Please select dates first.');
      return;
    }
    if (hasOverlap) {
      alert(
        'The selected timeline overlaps with an existing booking. Please pick another date/time.'
      );
      return;
    }
    if (venue.availability) {
      const { minBookingDuration, maxBookingDuration } = venue.availability;
      const duration = quote.durationInHours;
      if (duration < minBookingDuration) {
        alert(
          `Minimum booking duration is ${minBookingDuration} hour${minBookingDuration > 1 ? 's' : ''}.`
        );
        return;
      }
      if (maxBookingDuration && duration > maxBookingDuration) {
        alert(
          `Maximum booking duration is ${maxBookingDuration} hour${maxBookingDuration > 1 ? 's' : ''}.`
        );
        return;
      }
    }
    onSubmit();
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Not selected';
    return new Date(dateStr).toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDeadline = (dateStr: string | null) => {
    if (!dateStr) return '';
    const dateFormatted = new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    });
    return `${dateFormatted} (EOD)`;
  };

  // ── Scenario UI Config ────────────────────────────────────
  const scenarioConfig = {
    ADVANCE: {
      icon: <CalendarCheck size={16} className="text-success" />,
      label: 'Advance Booking',
      tagColor: 'bg-success/10 text-success border-success/20',
      description: quote
        ? `Pay reservation deposit now. Remaining balance is due before ${formatDeadline(quote.remainingPaymentDueDate)}.`
        : 'Pay reservation deposit now. Remaining balance is due later.',
      ctaText: quote
        ? `PAY ₹${quote.reservationDeposit.toLocaleString('en-IN')} DEPOSIT`
        : 'PAY DEPOSIT',
    },
    IMMEDIATE: {
      icon: <Zap size={16} className="text-primary" />,
      label: 'Immediate Booking',
      tagColor: 'bg-primary/10 text-primary border-primary/20',
      description:
        'Event is 7 days away or less. Full payment is required now to confirm your booking.',
      ctaText: quote
        ? `PAY ₹${quote.totalAmount.toLocaleString('en-IN')} FULL AMOUNT`
        : 'PAY FULL AMOUNT',
    },
  };

  const currentScenario = quote ? scenarioConfig[quote.bookingScenario] : null;

  return (
    <div className="space-y-6 lg:sticky lg:top-24 text-card-foreground">
      {/* Summary Card */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-foreground border-b border-border pb-3">
          Booking Summary
        </h3>

        {!venue ? (
          <p className="text-xs text-muted text-center py-6">
            Select a venue on the left to review your pricing breakdown.
          </p>
        ) : (
          <div className="space-y-4">
            {/* Venue Preview */}
            <div className="flex gap-3">
              {venue.images && venue.images[0] ? (
                <img
                  src={venue.images[0]}
                  alt={venue.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-xl border border-border shrink-0"
                />
              ) : (
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 text-primary flex items-center justify-center rounded-xl border border-border font-bold shrink-0">
                  {venue.name.charAt(0)}
                </div>
              )}
              <div className="space-y-0.5 min-w-0">
                <span className="text-xs font-semibold text-primary block uppercase tracking-wide">
                  {venue.categoryId && typeof venue.categoryId === 'object'
                    ? venue.categoryId.name
                    : 'Venue'}
                </span>
                <span className="text-sm font-bold text-foreground block truncate">
                  {venue.name}
                </span>
                <span className="text-xs text-muted block truncate">
                  {venue.address.city}, {venue.address.state}
                </span>
              </div>
            </div>

            {/* Dates & Duration Summary */}
            <div className="bg-background p-3 sm:p-3.5 rounded-xl border border-border text-xs space-y-2">
              <div className="flex justify-between gap-2">
                <span className="text-muted font-medium shrink-0">Check-In:</span>
                <span className="font-semibold text-foreground text-right">
                  {formatDate(startDateTime)}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted font-medium shrink-0">Check-Out:</span>
                <span className="font-semibold text-foreground text-right">
                  {formatDate(endDateTime)}
                </span>
              </div>
              <div className="border-t border-border/60 pt-2 flex justify-between items-center gap-2">
                <span className="text-muted font-medium">Total Duration:</span>
                <span className="font-bold text-primary">
                  {quote
                    ? `${quote.durationInHours % 1 === 0 ? quote.durationInHours.toFixed(0) : quote.durationInHours.toFixed(1)} ${pricingUnit}${quote.durationInHours !== 1 ? 's' : ''}`
                    : '—'}
                </span>
              </div>
            </div>

            {/* Price Calculations */}
            {quoteLoading ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <Loader2 size={24} className="animate-spin text-primary" />
                <span className="text-xs text-muted">Calculating quote...</span>
              </div>
            ) : quote ? (
              <div className="space-y-4">
                <div className="space-y-2 text-xs border-b border-border pb-3">
                  <div className="flex justify-between gap-2">
                    <span className="text-muted">
                      Base Price ({quote.durationInHours > 0 ? `${quote.durationInHours} × ` : ''}₹
                      {priceRate.toLocaleString('en-IN')}/{pricingUnit})
                    </span>
                    <span className="font-semibold text-foreground shrink-0">
                      ₹{quote.baseAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>GST (18%)</span>
                    <span>₹{quote.gst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Platform Fee (12%)</span>
                    <span className="shrink-0">₹{quote.platformFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between items-baseline gap-2">
                    <span className="text-sm font-bold text-foreground">Total Amount</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-primary shrink-0">
                      ₹{quote.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* ── Reservation Breakdown ──────────────────────── */}
                {currentScenario && (
                  <div className="space-y-3">
                    {/* Scenario Tag */}
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${currentScenario.tagColor}`}
                    >
                      {currentScenario.icon}
                      {currentScenario.label}
                    </div>

                    {/* Deposit / Balance Split */}
                    {quote.bookingScenario !== 'IMMEDIATE' && (
                      <div className="bg-background rounded-xl border border-border p-3 sm:p-4 space-y-2.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-muted font-medium">Reservation Deposit</span>
                          <span className="font-extrabold text-foreground text-sm">
                            ₹{quote.reservationDeposit.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center border-t border-border/60 pt-2">
                          <span className="text-muted font-medium">Remaining Balance</span>
                          <span className="font-semibold text-muted">
                            ₹{quote.remainingBalance.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Scenario Info Banner */}
                    <div className="flex gap-2 bg-surface/60 border border-border/60 rounded-xl p-3 text-[11px] text-muted leading-relaxed">
                      <Info size={14} className="shrink-0 mt-0.5 text-primary" />
                      <span>{currentScenario.description}</span>
                    </div>

                    {/* CTA Button */}
                    <button
                      type="button"
                      disabled={hasOverlap || isSubmitting}
                      onClick={handleBookingSubmit}
                      className={`w-full font-extrabold text-xs sm:text-sm py-3.5 rounded-xl shadow-lg flex items-center justify-center transition-all select-none uppercase tracking-wider
                        ${
                          hasOverlap
                            ? 'bg-red-500/10 text-red-500 border border-red-500/20 cursor-not-allowed shadow-none'
                            : isSubmitting
                              ? 'bg-primary/70 text-white cursor-wait'
                              : 'bg-primary hover:bg-primary/90 text-white shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                        }
                      `}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin mr-2" />
                          PROCESSING…
                        </>
                      ) : hasOverlap ? (
                        'Time Slot Overlapped'
                      ) : (
                        currentScenario.ctaText
                      )}
                    </button>

                    {/* Trust Seal */}
                    <div className="flex flex-col items-center gap-1 text-[9px] text-muted font-bold uppercase tracking-wider pt-1">
                      <span className="flex items-center gap-1">
                        <ShieldCheck size={12} className="text-green-600 shrink-0" />
                        256-Bit SSL Secured Checkout
                      </span>
                      <span>Razorpay Partner Encryption</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted text-center py-6">
                Please select valid dates and times to view quote.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingSection;
