import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Loader2, XCircle, WalletMinimal, Clock, CheckCircle2, Ban } from 'lucide-react';
import { toast } from 'sonner';
import { bookingsApi } from '@/features/bookings/services/bookings.api';
import type { Booking } from '../../types';
import { BookingDetails } from './BookingDetails';
import { BookingPaymentInfo } from './BookingPaymentInfo';

interface BookingCardProps {
  booking: Booking;
  onCancelSuccess: () => void;
  role?: 'user' | 'owner';
}

const BookingCard = ({ booking, onCancelSuccess, role = 'user' }: BookingCardProps) => {
  const [cancelling, setCancelling] = useState(false);
  const [payingBalance, setPayingBalance] = useState(false);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const isCancellable = booking.isCancellable ?? false;

  const handleCancelBooking = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation.');
      return;
    }

    try {
      setCancelling(true);
      const res = await bookingsApi.cancelBooking(booking.id, cancelReason);
      if (res.success) {
        toast.success('Booking cancelled successfully.');
        setShowCancelModal(false);
        setCancelReason('');
        onCancelSuccess();
      } else {
        toast.error(res.message || 'Failed to cancel booking.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to cancel booking.');
    } finally {
      setCancelling(false);
    }
  };

  const handleDeleteBooking = async () => {
    try {
      setCancelling(true);
      const res = await bookingsApi.deleteBooking(booking.id);
      if (res.success) {
        toast.success('Booking deleted successfully.');
        onCancelSuccess();
      } else {
        toast.error(res.message || 'Failed to delete booking.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete booking.');
    } finally {
      setCancelling(false);
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayBalance = async () => {
    try {
      setPayingBalance(true);
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        toast.error('Failed to load Razorpay SDK. Please refresh and try again.');
        setPayingBalance(false);
        return;
      }

      // Create balance payment order
      const res = await bookingsApi.payBalance(booking.id);
      if (!res.success || !res.data) {
        throw new Error(res.message || 'Failed to initiate balance payment.');
      }

      const { payment } = res.data;
      const { orderId, amount, currency } = payment;

      // Local flag to prevent ondismiss from interfering after payment.failed or success
      let localPaymentHandled = false;

      // Open Razorpay checkout modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: 'BookMyVenue',
        description: `Remaining Balance for ${booking.venue.name}`,
        order_id: orderId,
        handler: async (response: any) => {
          // Mark handled so ondismiss won't interfere
          localPaymentHandled = true;
          try {
            setPayingBalance(true);
            const verifyRes = await bookingsApi.verifyBalancePayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking.id,
            });

            if (verifyRes.success) {
              toast.success('Remaining balance paid and booking fully confirmed!');
              onCancelSuccess();
            } else {
              toast.error(verifyRes.message || 'Payment signature verification failed.');
            }
          } catch (err: any) {
            toast.error(
              err?.response?.data?.message || err?.message || 'Failed to verify payment.'
            );
          } finally {
            setPayingBalance(false);
          }
        },
        prefill: {
          name: booking.contactName,
          email: booking.contactEmail,
          contact: booking.contactPhone,
        },
        theme: {
          color: '#4f46e5',
        },
        modal: {
          // ondismiss fires on modal close — even after a successful payment.
          // Only reset state if payment was not already handled.
          ondismiss: () => {
            if (localPaymentHandled) return;
            toast.info('Balance payment cancelled.');
            setPayingBalance(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', async (response: any) => {
        // Mark handled so ondismiss won't fire duplicate cancellation
        localPaymentHandled = true;
        toast.error(
          `Balance payment failed: ${response.error?.description || 'Unknown error'}. Please try again.`
        );
        setPayingBalance(false);
      });

      // Open modal — state is resolved via callbacks above, not in finally
      rzp.open();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err?.message || 'Failed to checkout remaining balance.'
      );
    } finally {
      setPayingBalance(false);
    }
  };

  const getStatusStyle = (status: string, paymentStatus: string) => {
    if (status === 'reserved' && paymentStatus === 'pending') {
      return 'bg-warning/10 text-warning border-warning/20';
    }
    if (status === 'reserved' && paymentStatus === 'partial') {
      return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
    }
    if (paymentStatus === 'overdue') {
      return 'bg-error/10 text-error border-error/20';
    }
    switch (status) {
      case 'confirmed':
        return 'bg-success/10 text-success border-success/20';
      case 'completed':
        return 'bg-info/10 text-info border-info/20';
      case 'cancelled':
        return 'bg-error/10 text-error border-error/20';
      case 'expired':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted/10 text-foreground/75 border-border';
    }
  };

  const getRefundBadge = () => {
    if (booking.bookingStatus !== 'cancelled') return null;
    const { refundStatus, cancellationType } = booking;
    if (cancellationType === 'SYSTEM' || refundStatus === 'NOT_ELIGIBLE') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border bg-zinc-500/10 text-zinc-400 border-zinc-500/20">
          <Ban className="w-2.5 h-2.5" />
          No Refund
        </span>
      );
    }
    if (refundStatus === 'PENDING') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border bg-warning/10 text-warning border-warning/20">
          <Clock className="w-2.5 h-2.5" />
          Refund Pending
        </span>
      );
    }
    if (refundStatus === 'PROCESSING') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
          <Loader2 className="w-2.5 h-2.5 animate-spin" />
          Refund Processing
        </span>
      );
    }
    if (refundStatus === 'FAILED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border bg-error/10 text-error border-error/20">
          <XCircle className="w-2.5 h-2.5" />
          Refund Failed
        </span>
      );
    }
    if (refundStatus === 'COMPLETED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border bg-success/10 text-success border-success/20">
          <CheckCircle2 className="w-2.5 h-2.5" />
          Refunded ₹{booking.refundAmount.toLocaleString('en-IN')}
        </span>
      );
    }
    return null;
  };

  const refundBadge = getRefundBadge();

  const formatStatus = (status: string, paymentStatus: string) => {
    if (status === 'reserved' && paymentStatus === 'pending') {
      return 'PENDING PAYMENT';
    }
    if (status === 'reserved' && paymentStatus === 'partial') {
      return 'RESERVED (DEPOSIT PAID)';
    }
    if (paymentStatus === 'overdue') {
      return 'OVERDUE';
    }
    return status.replace('_', ' ').toUpperCase();
  };

  return (
    <div className="rounded-3xl border border-border bg-surface shadow-md overflow-hidden flex flex-col justify-between h-full transition-all duration-300 hover:shadow-lg hover:border-primary/20">
      {/* Top Image / Status */}
      <div className="relative h-44 bg-zinc-900 overflow-hidden">
        {booking.venue.imageUrl ? (
          <img
            src={booking.venue.imageUrl}
            alt={booking.venue.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted/20 text-foreground/45">
            No image available
          </div>
        )}
          <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(booking.bookingStatus, booking.paymentStatus)}`}
            >
              {formatStatus(booking.bookingStatus, booking.paymentStatus)}
            </span>
            {refundBadge}
          </div>
      </div>

      {/* Main Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Venue & Date Details */}
          <BookingDetails booking={booking} />

          {role === 'owner' && (
            <div className="mt-4 p-3 bg-muted/25 border border-border/50 rounded-2xl text-xs space-y-1 text-foreground/85">
              <p className="text-[10px] font-bold text-foreground/45 uppercase tracking-wide">Customer Details</p>
              <p className="font-bold text-foreground">{booking.contactName}</p>
              <p>{booking.contactEmail}</p>
              <p>{booking.contactPhone}</p>
            </div>
          )}

          {/* Payment Info / Countdown banner */}
          {role !== 'owner' && <BookingPaymentInfo booking={booking} />}
        </div>

        {/* Pricing & Footer Actions */}
        <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider">
              Total Price
            </p>
            <p className="text-base font-black text-primary">
              ₹{booking.totalAmount.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            {booking.amountPaid > 0 && (
              <span className="text-[11px] font-semibold text-success bg-success/5 border border-success/15 px-2.5 py-1 rounded-lg">
                Paid: ₹{booking.amountPaid.toLocaleString('en-IN')}
              </span>
            )}
            {/* Show wallet credit chip when refund is completed */}
            {booking.refundStatus === 'COMPLETED' && booking.bookingStatus === 'cancelled' && (
              <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-500/5 border border-indigo-500/15 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <WalletMinimal className="w-3 h-3" />
                Wallet credited
              </span>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              {role === 'owner' ? (
                <Link
                  to={`/owner/bookings/${booking.id}`}
                  className="px-4 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-semibold rounded-xl transition-all shadow-sm hover:shadow cursor-pointer"
                >
                  View Details
                </Link>
              ) : (
                <>
                  {/* ── Case 1: PENDING booking (slot held, deposit never paid) ── */}
                  {/* Payment failed or modal was dismissed — only action is to free the slot */}
                  {booking.bookingStatus === 'pending' && booking.paymentStatus === 'pending' && (
                    <button
                      onClick={handleDeleteBooking}
                      disabled={cancelling}
                      className="px-4 py-2 bg-error/10 border border-error/30 text-error hover:bg-error/20 text-xs font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                    >
                      {cancelling ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          Delete Booking
                        </>
                      )}
                    </button>
                  )}

                  {/* ── Case 2: RESERVED booking with deposit paid (partial/overdue) ── */}
                  {/* User can view details, pay remaining balance via Razorpay, or cancel */}
                  {booking.bookingStatus === 'reserved' && (booking.paymentStatus === 'partial' || booking.paymentStatus === 'overdue') && (
                    <>
                      <Link
                        to={`/account/bookings/${booking.id}`}
                        className="px-3 py-2 border border-border/70 text-foreground/75 hover:bg-muted/10 text-[11px] font-semibold rounded-xl transition-all"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={handlePayBalance}
                        disabled={payingBalance}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {payingBalance ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-3.5 h-3.5" />
                            Pay Balance
                          </>
                        )}
                      </button>
                    </>
                  )}

                  {/* ── Case 3: Cancel button — shown whenever booking is within cancellation window ── */}
                  {isCancellable && (
                    <button
                      onClick={() => setShowCancelModal(true)}
                      disabled={cancelling}
                      className="px-4 py-2 border border-error/30 text-error hover:bg-error/5 text-xs font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                    >
                      {cancelling ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          Cancel Booking
                        </>
                      )}
                    </button>
                  )}

                  {!isCancellable && booking.bookingStatus !== 'reserved' && booking.bookingStatus !== 'pending' && booking.amountPaid === 0 && (
                    <span className="text-[11px] font-medium text-foreground/40">Unpaid</span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface border border-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border/60">
              <h3 className="text-lg font-bold text-foreground">Cancel Booking</h3>
              <p className="text-sm text-foreground/60 mt-1">
                Please provide a reason for cancelling your booking at {booking.venue.name}.
              </p>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Cancellation Reason
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="E.g., Event was postponed, found another venue..."
                className="w-full min-h-[100px] p-3 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-foreground"
              />
            </div>
            <div className="p-6 pt-0 flex items-center justify-end gap-3 bg-muted/10">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                }}
                disabled={cancelling}
                className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors disabled:opacity-50"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={cancelling || !cancelReason.trim()}
                className="px-4 py-2 bg-error hover:bg-error/90 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                {cancelling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  'Confirm Cancel'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCard;
