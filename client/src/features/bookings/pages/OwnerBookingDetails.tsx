import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Mail,
  Phone,
  User,
  CheckCircle,
  FileText,
  DollarSign,
  AlertCircle,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { toast } from 'sonner';
import { bookingsApi } from '../services/bookings.api';
import { Loading } from '@/shared/components/ui';

export default function OwnerBookingDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchBooking = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await bookingsApi.getOwnerBookingById(id);
      if (res.success && res.data) {
        setBooking(res.data);
      } else {
        toast.error(res.message || 'Could not load booking details.');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to fetch booking.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const handleStatusUpdate = async (updates: { bookingStatus?: string; paymentStatus?: string }) => {
    if (!id) return;
    try {
      setUpdating(true);
      const res = await bookingsApi.updateOwnerBookingStatus(id, updates);
      if (res.success && res.data) {
        setBooking(res.data);
        toast.success(res.message || 'Booking status updated successfully!');
      } else {
        toast.error(res.message || 'Failed to update booking status.');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Status change rejected.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loading text="Loading dashboard details…" fullPage />;

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-center p-6">
        <AlertTriangle className="w-12 h-12 text-error/70" />
        <h2 className="text-xl font-bold text-foreground">Booking Not Found</h2>
        <p className="text-sm text-foreground/60 max-w-xs">
          This booking does not exist or you do not have permission to manage it.
        </p>
        <Link
          to="/owner/bookings"
          className="px-6 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary/90 transition-all cursor-pointer"
        >
          Back to Bookings
        </Link>
      </div>
    );
  }

  const bookingStatusStr = (booking.bookingStatus || '').toLowerCase();
  const paymentStatusStr = (booking.paymentStatus || '').toLowerCase();

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success/10 text-success border-success/30';
      case 'completed':
        return 'bg-info/10 text-info border-info/30';
      case 'cancelled':
      case 'expired':
        return 'bg-error/10 text-error border-error/30';
      case 'reserved':
      default:
        return 'bg-warning/10 text-warning border-warning/30';
    }
  };

  const getPaymentStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-success/10 text-success border-success/30';
      case 'partial':
        return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30';
      case 'refunded':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
      case 'overdue':
      case 'failed':
        return 'bg-error/10 text-error border-error/30';
      case 'pending':
      default:
        return 'bg-warning/10 text-warning border-warning/30';
    }
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate event duration in hours
  const start = new Date(booking.startDateTime);
  const end = new Date(booking.endDateTime);
  const durationHours = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60)));

  const now = new Date();
  const isCheckoutPassed = now.getTime() >= end.getTime();

  return (
    <div className="w-full max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-6">
        <div className="space-y-1">
          <button
            onClick={() => navigate('/owner/bookings')}
            className="flex items-center gap-2 text-xs font-bold text-foreground/50 hover:text-foreground uppercase tracking-wider mb-2 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4.5 h-4.5" /> Back to listings
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
              Booking Details
            </h1>
            <span className="font-mono text-xs font-semibold px-2 py-1 rounded bg-muted text-foreground/75 border border-border/80">
              {booking.bookingId || booking.id.substring(0, 8).toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-foreground/60">
            Reserved on {new Date(booking.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
          </p>
        </div>

        {/* Live Badges */}
        <div className="flex gap-2.5">
          <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${getStatusBadgeClass(bookingStatusStr)}`}>
            Status: {bookingStatusStr.toUpperCase()}
          </div>
          <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${getPaymentStatusBadgeClass(paymentStatusStr)}`}>
            Payment: {paymentStatusStr.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Settlement Status Banner */}
      {bookingStatusStr === 'completed' && booking.settlementStatus && (
        <div
          className={`flex items-start gap-3 rounded-2xl border p-4 ${
            booking.settlementStatus === 'SETTLED'
              ? 'border-success/20 bg-success/5'
              : booking.settlementStatus === 'FAILED'
                ? 'border-error/20 bg-error/5'
                : 'border-warning/20 bg-warning/5'
          }`}
        >
          {booking.settlementStatus === 'SETTLED' ? (
            <CheckCircle size={18} className="text-success shrink-0 mt-0.5" />
          ) : (
            <AlertCircle
              size={18}
              className={`shrink-0 mt-0.5 ${booking.settlementStatus === 'FAILED' ? 'text-error' : 'text-warning'}`}
            />
          )}
          <p className="text-sm text-foreground/80">
            {booking.settlementStatus === 'PENDING' && (
              <>
                <span className="font-bold text-warning">Settlement Processing:</span> Your
                payment is being processed and will be credited to your account within 24 hours.
              </>
            )}
            {booking.settlementStatus === 'PROCESSING' && (
              <>
                <span className="font-bold text-warning">Settlement In Progress:</span> Your
                settlement is currently being processed.
              </>
            )}
            {booking.settlementStatus === 'SETTLED' && (
              <>
                <span className="font-bold text-success">Settlement Completed:</span> Your
                earnings for this booking have been successfully settled.
              </>
            )}
            {booking.settlementStatus === 'FAILED' && (
              <>
                <span className="font-bold text-error">Settlement Failed:</span> There was an
                issue processing your settlement. Please contact support.
              </>
            )}
          </p>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Itinerary and Client Info (Cols 1-7) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Venue Card */}
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border border-border/80 flex-shrink-0 bg-muted">
                {booking.venue?.imageUrl ? (
                  <img
                    src={booking.venue.imageUrl}
                    alt={booking.venue.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-foreground/30">
                    N/A
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-lg text-foreground hover:text-primary transition-colors">
                  {booking.venue?.name}
                </h3>
                <p className="text-sm text-foreground/60">
                  {booking.venue?.address?.city}, {booking.venue?.address?.state}
                </p>
                <div className="pt-1.5">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-full">
                    Owned Venue
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule & Event Info */}
          <div className="rounded-3xl border border-border bg-card shadow-sm p-6 space-y-6">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" /> Schedule Info
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-border/60 bg-background/50 p-4 space-y-1">
                <p className="text-[10px] font-bold text-foreground/45 uppercase tracking-wider">
                  Check-In
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {formatDateTime(booking.startDateTime)}
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-background/50 p-4 space-y-1">
                <p className="text-[10px] font-bold text-foreground/45 uppercase tracking-wider">
                  Check-Out
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {formatDateTime(booking.endDateTime)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border/60 pt-6">
              <div>
                <p className="text-xs text-foreground/45">Total Duration</p>
                <p className="text-lg font-bold text-foreground mt-0.5">{durationHours} Hours</p>
              </div>
              <div>
                <p className="text-xs text-foreground/45">Number of Guests</p>
                <p className="text-lg font-bold text-foreground mt-0.5">
                  {booking.numberOfGuests || 0} Pax
                </p>
              </div>
            </div>
          </div>

          {/* Customer Profile & Demands */}
          <div className="rounded-3xl border border-border bg-card shadow-sm p-6 space-y-6">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Customer Info
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-muted rounded-xl text-foreground/60 border border-border/60">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-foreground/45">Name</p>
                  <p className="text-sm font-bold text-foreground">{booking.contactName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-muted rounded-xl text-foreground/60 border border-border/60">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-foreground/45">Email Address</p>
                  <p className="text-sm font-bold text-foreground">{booking.contactEmail}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-muted rounded-xl text-foreground/60 border border-border/60">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-foreground/45">Phone Number</p>
                  <p className="text-sm font-bold text-foreground">{booking.contactPhone || 'N/A'}</p>
                </div>
              </div>
            </div>

            {booking.specialRequests && (
              <div className="border-t border-border/60 pt-5 mt-2 space-y-1.5">
                <p className="text-xs font-bold text-foreground/45 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-warning" /> Customer Demands / Remarks
                </p>
                <div className="bg-warning/5 border border-warning/15 p-4 rounded-2xl">
                  <p className="text-sm text-foreground/80 italic leading-relaxed">
                    "{booking.specialRequests}"
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Ledger, Stats and Admin Actions (Cols 8-12) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Financial Ledger Card */}
          <div className="rounded-3xl border border-border bg-card shadow-sm p-6 space-y-6">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" /> Billing Ledger
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-foreground/65">Reservation Deposit</span>
                <span className="font-semibold text-foreground">
                  ₹{(booking.reservationDeposit || 0).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-foreground/65">Remaining Balance</span>
                <span className="font-semibold text-foreground">
                  ₹{(booking.remainingBalance || 0).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="border-t border-border/80 pt-4 flex justify-between items-center">
                <span className="text-sm font-bold text-foreground/75">Total Booking Price</span>
                <span className="text-2xl font-extrabold text-primary">
                  ₹{booking.totalAmount?.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="bg-primary/5 rounded-2xl border border-primary/10 p-4 space-y-1">
                <p className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  Amount Received So Far
                </p>
                <p className="text-lg font-extrabold text-foreground">
                  ₹{(booking.amountPaid || 0).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          {/* Admin Management Panel */}
          <div className="rounded-3xl border border-border bg-card shadow-sm p-6 space-y-6">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-primary" /> Administrative Override
            </h3>

            <div className="space-y-5">
              {/* bookingStatus override */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-foreground/50 uppercase tracking-wider">
                  Update Booking State
                </label>
                <div className="flex flex-col gap-2">
                  <div>
                    <button
                      disabled={updating || bookingStatusStr !== 'confirmed' || !isCheckoutPassed}
                      onClick={() => handleStatusUpdate({ bookingStatus: 'completed' })}
                      className="w-full flex items-center justify-between px-4 py-3 border border-info/20 hover:border-info bg-info/5 hover:bg-info/15 text-info text-xs font-bold rounded-2xl transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <span>Mark as Completed</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    {bookingStatusStr === 'confirmed' && !isCheckoutPassed && (
                      <p className="text-[10px] text-info font-medium italic mt-1 leading-normal flex items-start gap-1">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> Can only be completed after checkout time.
                      </p>
                    )}
                  </div>


                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
