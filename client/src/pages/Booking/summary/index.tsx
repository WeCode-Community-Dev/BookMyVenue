import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { useLockTimer } from '@/hooks/useLockTimer';
import { useApiMutation } from '@/hooks/useApi';
import { API_ENDPOINTS } from '@/constants';
import { useToast } from '@/hooks/useToast';
import { FiClock, FiUsers, FiInfo, FiCheckCircle } from 'react-icons/fi';
import { saveBookerDetails } from '@/services/bookingService';
import { useRazorpayPayment } from '@/hooks/useRazorpayPayment';
import { BookingSummaryCard } from '@/components/booking/BookingSummaryCard';

const BookingCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { error: showError } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTimerVisible, setIsTimerVisible] = useState(true);
  const timerBannerRef = useRef<HTMLDivElement>(null);

  const [guestCount, setGuestCount] = useState<string>('');
  const [eventType, setEventType] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [place, setPlace] = useState('');
  const [note, setNote] = useState('');

  const state = location.state as {
    lockData?: {
      lockId: string;
      expiresAt: string;
      amountToPay: number;
    };
    venueName?: string;
    date?: string;
    slotTime?: string;
    venueImage?: string;
    venueCity?: string;
  } | null;

  useEffect(() => {
    if (!state?.lockData) {
      showError('Booking session not found. Please try again.');
      navigate(-1);
    }
  }, [state, navigate, showError]);

  useEffect(() => {
    const el = timerBannerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsTimerVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { lockId, expiresAt, amountToPay } = state?.lockData || {};

  const handleExpire = () => {
    showError('Your session has expired. Please select the slot again.');
    navigate(-1);
  };

  const { formattedTime, isExpired, remainingMs } = useLockTimer(expiresAt, handleExpire);

  const { mutate: releaseLock } = useApiMutation({
    url: API_ENDPOINTS.RELEASE_LOCK,
    method: 'DELETE',
  });

  const { initCheckout } = useRazorpayPayment({
    venueName: state?.venueName,
    date: state?.date,
    slotTime: state?.slotTime,
    amountToPay,
    name,
    email,
    phone,
    onProcessingChange: setIsProcessing,
  });

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isExpired) return;

    if (remainingMs < 60000) {
      showError('Not enough time to complete payment. Please re-select the slot.');
      navigate(-1);
      return;
    }

    if (!guestCount || !eventType || !name || !email || !phone || !place) {
      showError('Please fill in all required fields.');
      return;
    }

    setIsProcessing(true);
    try {
      await saveBookerDetails({
        lockId: lockId!,
        guestCount: Number(guestCount),
        eventType,
        name,
        email,
        phone,
        place,
        note,
      });
      initCheckout({ lockId });
    } catch {
      showError('Failed to save details. Please try again.');
      setIsProcessing(false);
    }
  };

  if (!state?.lockData) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div
          ref={timerBannerRef}
          className="md:hidden mb-6 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50 p-4 rounded-2xl flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center gap-3">
            <FiClock className="text-orange-600 text-xl animate-pulse" />
            <span className="text-orange-800 dark:text-orange-400 font-medium">
              Session Expires In:
            </span>
          </div>
          <span className="text-orange-700 dark:text-orange-300 font-mono text-xl font-bold">
            {formattedTime}
          </span>
        </div>

        <motion.div
          className="md:hidden fixed top-20 left-1/2 -translate-x-1/2 z-50
                     flex items-center gap-2 px-4 py-2 rounded-full
                     bg-orange-50/10 dark:bg-orange-950/10
                     border border-orange-300/30 dark:border-orange-700/30
                     backdrop-blur-sm shadow-sm"
          animate={{
            opacity: isTimerVisible ? 0 : 1,
            scale: isTimerVisible ? 0.6 : 1,
            y: isTimerVisible ? -10 : 0,
          }}
          initial={false}
          style={{ pointerEvents: isTimerVisible ? 'none' : 'auto' }}
          transition={{ type: 'spring', stiffness: 480, damping: 32, mass: 0.6 }}
        >
          <FiClock className="text-orange-500 text-sm animate-pulse" />
          <span className="text-orange-600 dark:text-orange-400 font-mono text-sm font-bold">
            {formattedTime}
          </span>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-[70%]">
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                Checkout
              </h1>
              <p className="text-[var(--text-secondary)] mt-2">
                Provide your details to confirm the booking.
              </p>
            </div>

            <form
              id="checkout-form"
              onSubmit={handleProceedToPayment}
              className="space-y-8 bg-[var(--bg-tertiary)] p-6 md:p-8 rounded-3xl border border-[var(--bg-grey)] shadow-sm"
            >
              <div className="space-y-4 border-b border-[var(--bg-grey)] pb-8">
                <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <FiCheckCircle className="text-[var(--bg-green)]" /> Event Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Event Type *
                    </label>
                    <input
                      type="text"
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      placeholder="e.g. Wedding, Birthday"
                      className="w-full bg-[var(--bg-primary)] border border-[var(--bg-grey)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--bg-green)] focus:border-transparent transition-all outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Number of Guests *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiUsers className="text-[var(--text-secondary)]" />
                      </div>
                      <input
                        type="number"
                        min="1"
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        placeholder="Estimated count"
                        className="w-full bg-[var(--bg-primary)] border border-[var(--bg-grey)] rounded-xl pl-12 pr-4 py-3 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--bg-green)] focus:border-transparent transition-all outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-b border-[var(--bg-grey)] pb-8">
                <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <FiCheckCircle className="text-[var(--bg-green)]" /> Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-[var(--bg-primary)] border border-[var(--bg-grey)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--bg-green)] outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full bg-[var(--bg-primary)] border border-[var(--bg-grey)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--bg-green)] outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full bg-[var(--bg-primary)] border border-[var(--bg-grey)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--bg-green)] outline-none"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Place / City *
                    </label>
                    <input
                      type="text"
                      value={place}
                      onChange={(e) => setPlace(e.target.value)}
                      placeholder="E.g. Kochi"
                      className="w-full bg-[var(--bg-primary)] border border-[var(--bg-grey)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--bg-green)] outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <FiInfo className="text-blue-500" /> Additional Notes (Optional)
                </h2>
                <div className="mt-4">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Any special requests or instructions for the venue manager?"
                    rows={4}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--bg-grey)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none"
                  ></textarea>
                </div>
              </div>
            </form>
          </div>

          <div className="md:w-[30%]">
            <BookingSummaryCard
              formattedTime={formattedTime}
              state={state}
              amountToPay={amountToPay}
              isProcessing={isProcessing}
              isExpired={isExpired}
              onCancel={() => {
                releaseLock({});
                navigate(-1);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCheckout;
