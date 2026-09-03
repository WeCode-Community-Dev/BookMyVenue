import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { FiMapPin, FiChevronLeft, FiInfo, FiFileText } from 'react-icons/fi';
import { useBookingById } from '@/hooks/useBookingById';
import CancelBookingModal from '@/components/common/CancelBookingModal';
import { BOOKING_UI_STATUS, CANCELLATION_POLICIES } from '@/constants/bookingConstants';

// Subcomponents
import { BookingInfo } from './components/BookingInfo';
import { BookingSidebarDetails } from './components/BookingSidebarDetails';

const BookingDetails = () => {
  const { bookingRefId } = useParams<{ bookingRefId: string }>();
  const navigate = useNavigate();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const { data, isLoading, isError } = useBookingById(bookingRefId);
  const booking = data?.data;
  const uiStatus = booking?.uiStatus ?? 'unknown';
  const statusLabel = uiStatus === 'unknown' ? 'Unknown' : uiStatus.toUpperCase();

  const renderSkeleton = () => (
    <div className="animate-pulse space-y-8">
      <div className="h-64 bg-[var(--bg-grey)] rounded-3xl w-full"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-48 bg-[var(--bg-grey)] rounded-3xl w-full"></div>
          <div className="h-48 bg-[var(--bg-grey)] rounded-3xl w-full"></div>
        </div>
        <div className="space-y-6">
          <div className="h-64 bg-[var(--bg-grey)] rounded-3xl w-full"></div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">{renderSkeleton()}</div>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-12 px-4 flex flex-col items-center justify-center">
        <div className="bg-[var(--bg-tertiary)] p-8 rounded-3xl border border-[var(--bg-grey)] text-center max-w-md w-full">
          <FiInfo className="text-4xl text-[var(--text-secondary)] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Booking Not Found</h2>
          <p className="text-[var(--text-secondary)] mb-6">
            The requested booking could not be found. It may no longer exist or is not associated
            with the current account.
          </p>
          <button
            onClick={() => navigate('/my-bookings')}
            className="px-6 py-3 bg-[var(--bg-green)] text-white font-bold rounded-xl w-full hover:bg-green-600 transition"
          >
            Back to My Bookings
          </button>
        </div>
      </div>
    );
  }

  const isCancelable =
    uiStatus === BOOKING_UI_STATUS.UPCOMING &&
    booking.cancellationPolicy !== CANCELLATION_POLICIES.NON_REFUNDABLE;

  let cancelTooltip = '';
  if (uiStatus === BOOKING_UI_STATUS.COMPLETED)
    cancelTooltip = 'Cancellation is not available for past bookings';
  else if (uiStatus === BOOKING_UI_STATUS.CANCELLED)
    cancelTooltip = 'This booking is already cancelled';
  else if (uiStatus === BOOKING_UI_STATUS.IN_PROGRESS)
    cancelTooltip = 'This booking is currently active';
  else if (booking.cancellationPolicy === CANCELLATION_POLICIES.NON_REFUNDABLE)
    cancelTooltip = 'This venue has a non-refundable policy';
  else if (booking.cancellationRefundPct === 0) cancelTooltip = 'Cancellation window has passed';

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/my-bookings')}
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition mb-6 font-medium"
        >
          <FiChevronLeft /> Back to My Bookings
        </button>

        {/* Header Section */}
        <div className="bg-[var(--bg-tertiary)] border border-[var(--bg-grey)] rounded-3xl p-6 md:p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--bg-green)]/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-[var(--bg-primary)] text-[var(--text-secondary)] px-3 py-1 rounded-full text-xs font-bold border border-[var(--bg-grey)]">
                {booking.bookingRef}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  uiStatus === BOOKING_UI_STATUS.UPCOMING
                    ? 'bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900/50'
                    : uiStatus === BOOKING_UI_STATUS.IN_PROGRESS
                      ? 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50'
                      : uiStatus === BOOKING_UI_STATUS.COMPLETED
                        ? 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/50'
                        : 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50'
                }`}
              >
                {statusLabel}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">
              {booking.venueName}
            </h1>
            <p className="text-[var(--text-secondary)] mt-1 flex items-center gap-2">
              <FiMapPin className="text-[var(--bg-green)]" /> {booking.city}, {booking.district}
            </p>
          </div>

          <div className="flex flex-col md:items-end w-full md:w-auto">
            <div className="relative group w-full md:w-auto">
              <button
                onClick={() =>
                  isCancelable && booking.cancellationRefundPct! > 0 && setIsCancelModalOpen(true)
                }
                disabled={!isCancelable || booking.cancellationRefundPct === 0}
                className="w-full md:w-auto px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-red-50 text-red-600 hover:bg-red-500/10 border border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30"
              >
                Cancel Booking
              </button>
              {(!isCancelable || booking.cancellationRefundPct === 0) && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-[var(--bg-secondary)] text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none z-10 hidden md:block">
                  {cancelTooltip || 'Cancellation window passed'}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <BookingInfo booking={booking} />

            {booking.bookerInfo && (
              <div className="bg-[var(--bg-tertiary)] border border-[var(--bg-grey)] rounded-3xl p-6 md:p-8 shadow-sm">
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                  <FiFileText className="text-[var(--bg-green)]" /> Guest Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                  <div>
                    <p className="text-sm text-[var(--text-secondary)] mb-1">Full Name</p>
                    <p className="font-medium text-[var(--text-primary)]">
                      {booking.bookerInfo.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-secondary)] mb-1">Email</p>
                    <p className="font-medium text-[var(--text-primary)]">
                      {booking.bookerInfo.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-secondary)] mb-1">Phone</p>
                    <p className="font-medium text-[var(--text-primary)]">
                      {booking.bookerInfo.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-secondary)] mb-1">Place / City</p>
                    <p className="font-medium text-[var(--text-primary)]">
                      {booking.bookerInfo.place}
                    </p>
                  </div>
                  {booking.bookerInfo.note && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-[var(--text-secondary)] mb-1">Additional Note</p>
                      <p className="font-medium text-[var(--text-primary)] bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--bg-grey)] text-sm">
                        {booking.bookerInfo.note}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <BookingSidebarDetails booking={booking} />
        </div>
      </div>

      {booking && (
        <CancelBookingModal
          open={isCancelModalOpen}
          onOpenChange={setIsCancelModalOpen}
          booking={booking}
        />
      )}
    </div>
  );
};

export default BookingDetails;
