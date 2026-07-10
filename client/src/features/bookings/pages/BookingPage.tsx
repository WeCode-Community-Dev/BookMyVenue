import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppStore } from '@/store/app.store';
import { publicVenuesApi } from '@/features/public/services/public-venues.api';
import type { Venue } from '@/features/venues/types/venues.types';
import { bookingsApi } from '../services/bookings.api';
import type { BookingDetails } from '../types/bookings.types';
import DateTimeSection from '../components/DateTimeSection';
import GuestSection from '../components/GuestSection';
import PricingSection from '../components/PricingSection';
import BookingHeader from '../components/BookingHeader';
import SelectedVenueSummary from '../components/SelectedVenueSummary';
import BookingSuccessModal from '../components/BookingSuccessModal';
import { Loading } from '@/shared/components/ui';
import { useAsyncFetch } from '@/shared/hooks/useAsyncFetch';

const BookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAppStore();

  // Venue state
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [venueLoading, setVenueLoading] = useState(false);

  // Existing bookings state
  const { data: existingBookings, execute } = useAsyncFetch<any[]>();

  // Form fields state
  const [startDateTime, setStartDateTime] = useState<string | null>(null);
  const [endDateTime, setEndDateTime] = useState<string | null>(null);
  const [guests, setGuests] = useState<number>(1);
  // Contact details
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Quote state calculated by the backend
  const [quote, setQuote] = useState<any | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);

  // Action states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any | null>(null);

  // Fetch quote from backend when dates change
  useEffect(() => {
    const fetchQuote = async () => {
      if (!id || !startDateTime || !endDateTime) {
        setQuote(null);
        return;
      }

      const start = new Date(startDateTime).getTime();
      const end = new Date(endDateTime).getTime();
      if (isNaN(start) || isNaN(end) || end <= start) {
        setQuote(null);
        return;
      }

      try {
        setQuoteLoading(true);
        const res = await bookingsApi.calculateQuote({
          venueId: id,
          startDateTime,
          endDateTime,
        });
        if (res.success && res.data) {
          setQuote(res.data);
        } else {
          setQuote(null);
        }
      } catch (err) {
        console.error('Error fetching booking quote:', err);
        setQuote(null);
      } finally {
        setQuoteLoading(false);
      }
    };

    fetchQuote();
  }, [id, startDateTime, endDateTime]);

  // Auto fill logged in user
  useEffect(() => {
    if (user) {
      setContactName(user.fullName || '');
      setContactEmail(user.email || '');
    }
  }, [user]);

  // Load Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch specific venue from route param
  useEffect(() => {
    const fetchSelected = async () => {
      if (!id) return;
      try {
        execute(() => bookingsApi.getByVenueId(id));
        setVenueLoading(true);
        const res = await publicVenuesApi.getById(id);
        if (res.success && res.data) {
          setSelectedVenue(res.data);
          setGuests(1);
        }
      } catch (err) {
        console.error('Error fetching selected venue', err);
        toast.error('Could not fetch the specified venue details.');
      } finally {
        setVenueLoading(false);
      }
    };
    fetchSelected();
  }, [id]);

  const handleContactDetailsChange = (data: any) => {
    if (data.guests !== undefined) setGuests(data.guests);
    if (data.contactName !== undefined) setContactName(data.contactName);
    if (data.contactEmail !== undefined) setContactEmail(data.contactEmail);
    if (data.contactPhone !== undefined) setContactPhone(data.contactPhone);
    if (data.specialRequests !== undefined) setSpecialRequests(data.specialRequests);
  };

  const handleSubmitBooking = async () => {
    if (!selectedVenue) return;

    if (!contactName.trim()) {
      toast.error('Contact Name is required.');
      return;
    }
    if (!contactEmail.trim()) {
      toast.error('Contact Email is required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (!contactPhone.trim()) {
      toast.error('Contact Phone number is required.');
      return;
    }

    setIsSubmitting(true);

    const bookingPayload: BookingDetails = {
      venueId: selectedVenue._id,
      startDateTime,
      endDateTime,
      guests,
      contactName,
      contactEmail,
      contactPhone,
      specialRequests,
    };

    try {
      // 1. Create booking — backend returns booking record + Razorpay order details
      const res = await bookingsApi.createBooking(bookingPayload);
      if (!res.success || !res.data) {
        throw new Error(res.message || 'Booking creation failed.');
      }

      const { booking, payment } = res.data;

      if (!payment) throw new Error('Payment details were not generated by the server.');
      if (!(window as any).Razorpay) throw new Error('Razorpay is not loaded. Please refresh.');

      // Local flag to distinguish between "payment attempted" and "just closed modal"
      let localPaymentHandled = false;

      // 2. Open Razorpay modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: payment.amount,
        currency: payment.currency,
        name: 'BookMyVenue',
        description: `Booking for ${selectedVenue.name}`,
        order_id: payment.orderId,
        handler: async (response: any) => {
          // Payment collected — verify on backend
          localPaymentHandled = true;
          try {
            setIsSubmitting(true);
            const verifyRes = await bookingsApi.verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking._id,
            });
            if (verifyRes.success) {
              toast.success(verifyRes.message || 'Payment verified!');
              setSuccessData(verifyRes.data);
            } else {
              toast.error(verifyRes.message || 'Signature verification failed.');
            }
          } catch (err: any) {
            toast.error(
              err?.response?.data?.message || err?.message || 'Failed to verify payment.'
            );
            toast.error(err?.response?.data?.message || err?.message || 'Failed to verify payment.');
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: contactName,
          email: contactEmail,
          contact: contactPhone,
        },
        theme: {
          color: '#4f46e5',
        },
        modal: {
          // ondismiss fires on all modal closes (success, failure, and user dismiss).
          // Delete the booking only if no payment was attempted.
          ondismiss: async () => {
            if (localPaymentHandled) return;
            toast.info('Payment cancelled. Freeing reserved slot…');
            toast.info('Payment cancelled. Releasing reserved slots...');
            try {
              await bookingsApi.deleteBooking(booking._id);
            } catch (err) {
              console.error('Failed to delete booking on dismiss:', err);
              console.error('Failed to cancel pending booking', err);
            }
            setIsSubmitting(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);

      // payment.failed fires BEFORE ondismiss when Razorpay reports a failure.
      // Delete the booking immediately to free the slot.
      rzp.on('payment.failed', async (response: any) => {
        localPaymentHandled = true; // prevent ondismiss from double-deleting
        toast.error(
          `Payment failed: ${response.error?.description || 'Unknown error'}. The booking has been released.`
        );
        try {
          await bookingsApi.deleteBooking(booking._id);
        } catch (err) {
          console.error('Failed to delete booking after payment failure:', err);
        }
        setIsSubmitting(false);
      });

      rzp.open();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err?.message || 'An error occurred during checkout.'
      );
      setIsSubmitting(false);
    }
  };

  if (venueLoading && !selectedVenue) {
    return <Loading text="Retrieving checkout session…" fullPage={true} />;
  }

  if (!selectedVenue) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center space-y-4 text-card-foreground">
        <h2 className="text-xl font-bold text-foreground">Booking Session Expired</h2>
        <p className="text-sm text-muted max-w-sm">
          No valid venue details were loaded. Please return to the venue search page and select a
          venue.
        </p>
        <Link
          to="/venues"
          className="bg-primary text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-primary/95 transition-all"
        >
          Explore Venues
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 text-card-foreground">
      {/* 1. Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <BookingHeader />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* LEFT COLUMN: Venue Details and Forms */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-5 sm:space-y-8">
            {/* Venue Brief Summary Header */}
            <SelectedVenueSummary venue={selectedVenue} />

            {/* 2. Date and Time Configuration slots picker */}
            <DateTimeSection
              startDateTime={startDateTime}
              endDateTime={endDateTime}
              pricingUnit="hour"
              availability={selectedVenue.availability}
              existingBookings={existingBookings}
              onChange={(start, end) => {
                setStartDateTime(start);
                setEndDateTime(end);
              }}
            />

            {/* 3. Guests and Contact fields */}
            <GuestSection
              guests={guests}
              maxCapacity={selectedVenue.capacity}
              contactName={contactName}
              contactEmail={contactEmail}
              contactPhone={contactPhone}
              specialRequests={specialRequests}
              onChange={handleContactDetailsChange}
            />
          </div>

          {/* RIGHT COLUMN: Summary and Reservation */}
          <div className="lg:col-span-5 xl:col-span-4">
            <PricingSection
              venue={selectedVenue}
              startDateTime={startDateTime}
              endDateTime={endDateTime}
              onSubmit={handleSubmitBooking}
              isSubmitting={isSubmitting}
              existingBookings={existingBookings}
              quote={quote}
              quoteLoading={quoteLoading}
            />
          </div>
        </div>
      </div>

      {/* SUCCESS POPUP MODAL */}
      {successData && (
        <BookingSuccessModal
          successData={successData}
          venue={selectedVenue}
          startDateTime={startDateTime}
          endDateTime={endDateTime}
          onClose={() => setSuccessData(null)}
        />
      )}
    </div>
  );
};

export default BookingPage;
