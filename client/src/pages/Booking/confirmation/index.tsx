import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { FiCheckCircle, FiCalendar, FiMapPin, FiCreditCard } from 'react-icons/fi';
import { MdOutlineMeetingRoom } from 'react-icons/md';
import { BOOKING_REDIRECT_COUNTDOWN_SECONDS } from '@/constants/bookingConstants';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(BOOKING_REDIRECT_COUNTDOWN_SECONDS);

  const state = location.state as {
    paymentId?: string;
    venueName?: string;
    date?: string;
    slotTime?: string;
    amountToPay?: number;
    bookingId?: string;
    bookingRef?: string;
  } | null;

  useEffect(() => {
    if (!state?.paymentId) {
      navigate('/', { replace: true });
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (state.bookingRef) {
            navigate(`/booking/${state.bookingRef}`, { replace: true });
          } else {
            navigate('/my-bookings', { replace: true });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state, navigate]);

  if (!state?.paymentId) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-[var(--bg-tertiary)] border border-[var(--bg-grey)] rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[var(--bg-green)]/10 to-transparent pointer-events-none"></div>

        {/* Success Icon */}
        <div className="mx-auto w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 relative z-10 animate-bounce">
          <FiCheckCircle className="text-[var(--bg-green)] text-5xl" />
        </div>

        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2 relative z-10">
          Booking Confirmed!
        </h1>
        <p className="text-[var(--text-secondary)] mb-8 relative z-10">
          Thank you for choosing BookMyVenue. Your payment was successful.
        </p>

        {/* Details Card */}
        <div className="bg-[var(--bg-primary)] rounded-2xl p-6 mb-8 text-left border border-[var(--bg-grey)] relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 text-[var(--text-secondary)]">
                <FiMapPin />
              </div>
              <div>
                <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold">
                  Venue
                </p>
                <p className="font-bold text-[var(--text-primary)]">{state.venueName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 text-[var(--text-secondary)]">
                <FiCalendar />
              </div>
              <div>
                <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold">
                  Date
                </p>
                <p className="font-bold text-[var(--text-primary)]">{state.date}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 text-[var(--text-secondary)]">
                <MdOutlineMeetingRoom />
              </div>
              <div>
                <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold">
                  Time Slot
                </p>
                <p className="font-bold text-[var(--text-primary)]">{state.slotTime}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 text-[var(--text-secondary)]">
                <FiCreditCard />
              </div>
              <div>
                <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold">
                  Amount Paid
                </p>
                <p className="font-bold text-[var(--bg-green)]">₹{state.amountToPay}</p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-[var(--bg-grey)] flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">Payment ID</span>
            <span className="font-mono text-sm text-[var(--text-primary)] bg-[var(--bg-grey)] px-3 py-1 rounded-lg">
              {state.paymentId}
            </span>
          </div>
        </div>

        {/* Redirect Message */}
        <div className="text-[var(--text-secondary)]">
          <p>
            Redirecting to your booking details in{' '}
            <span className="font-bold text-[var(--text-primary)]">{countdown}s</span>...
          </p>
        </div>

        {/* Manual Redirect Button */}
        <button
          onClick={() =>
            state.bookingRef
              ? navigate(`/booking/${state.bookingRef}`, { replace: true })
              : navigate('/my-bookings', { replace: true })
          }
          className="mt-6 font-bold text-[var(--bg-green)] hover:underline"
        >
          View Booking Now
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
