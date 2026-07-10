import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { bookingsApi } from '../services/bookings.api';
import { Loading } from '@/shared/components/ui';
import SharedBookingDetails from '../components/SharedBookingDetails';

const loadRazorpay = (): Promise<boolean> =>
  new Promise((resolve) => {
    if ((window as any).Razorpay) { resolve(true); return; }
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBooking = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await bookingsApi.getBookingById(id);
      if (res.success && res.data) {
        setBooking(res.data);
      } else {
        toast.error(res.message || 'Could not load booking.');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to fetch booking.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooking(); }, [id]);

  const openRazorpay = async (
    apiCall: () => Promise<any>,
    verifyCall: (response: any) => Promise<any>
  ) => {
    const loaded = await loadRazorpay();
    if (!loaded) { toast.error('Razorpay SDK failed to load. Please refresh.'); return; }
    const res = await apiCall();
    if (!res.success || !res.data) throw new Error(res.message || 'Failed to create payment order.');
    const { payment, booking: updatedBooking } = res.data;
    let localHandled = false;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: payment.amount,
      currency: payment.currency,
      name: 'BookMyVenue',
      description: `Payment for ${updatedBooking?.venue?.name || 'Venue'}`,
      order_id: payment.orderId,
      handler: async (response: any) => {
        localHandled = true;
        try {
          setActionLoading(true);
          const vRes = await verifyCall(response);
          if (vRes.success) {
            toast.success('Payment confirmed!');
            fetchBooking();
          } else {
            toast.error(vRes.message || 'Verification failed.');
          }
        } catch (err: any) {
          toast.error(err?.response?.data?.message || err?.message || 'Verification failed.');
        } finally {
          setActionLoading(false);
        }
      },
      prefill: { name: booking?.contactName, email: booking?.contactEmail, contact: booking?.contactPhone },
      theme: { color: '#4f46e5' },
      modal: {
        ondismiss: () => {
          if (!localHandled) { toast.info('Payment cancelled.'); setActionLoading(false); }
        },
      },
    };
    const rzp = new (window as any).Razorpay(options);
    rzp.on('payment.failed', (r: any) => {
      localHandled = true;
      toast.error(`Payment failed: ${r.error?.description || 'Unknown error'}. You can retry.`);
      setActionLoading(false);
    });
    rzp.open();
  };

  const handlePayBalance = async () => {
    if (!booking) return;
    setActionLoading(true);
    try {
      await openRazorpay(
        () => bookingsApi.payBalance(booking._id),
        (r) => bookingsApi.verifyBalancePayment({
          razorpay_payment_id: r.razorpay_payment_id,
          razorpay_order_id: r.razorpay_order_id,
          razorpay_signature: r.razorpay_signature,
          bookingId: booking._id,
        })
      );
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Could not open payment.');
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!booking || !window.confirm('Cancel this booking and release the slot?')) return;
    setActionLoading(true);
    try {
      const res = await bookingsApi.deleteBooking(booking._id);
      if (res.success) {
        toast.success('Booking cancelled.');
        navigate('/account/bookings');
      } else {
        toast.error(res.message || 'Could not cancel booking.');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Cancel failed.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loading text="Loading booking details…" fullPage />;

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-center p-6">
        <AlertTriangle className="w-12 h-12 text-error/70" />
        <h2 className="text-xl font-bold text-foreground">Booking Not Found</h2>
        <p className="text-sm text-foreground/60 max-w-xs">This booking does not exist or you don't have access to it.</p>
        <Link to="/account/bookings" className="px-6 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary/90 transition-all">
          My Bookings
        </Link>
      </div>
    );
  }

  return (
    <SharedBookingDetails
      booking={booking}
      role="user"
      actionLoading={actionLoading}
      onCancel={handleCancel}
      onPayBalance={handlePayBalance}
      backUrl="/account/bookings"
      backText="Back to My Bookings"
    />
  );
}
