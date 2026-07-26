import { FiMapPin, FiCalendar, FiClock } from 'react-icons/fi';
import { useNavigate } from 'react-router';
import { BOOKING_UI_STATUS } from '@/constants/bookingConstants';
import type { BookingCardDTO } from '@/types/booking.types';

interface BookingCardProps {
  booking: BookingCardDTO;
  activeTab: 'upcoming' | 'completed' | 'cancelled';
  onReviewClick: (booking: BookingCardDTO, e: React.MouseEvent) => void;
}

export function BookingCard({ booking, activeTab, onReviewClick }: BookingCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/booking/${booking.bookingRef}`)}
      className="group bg-[var(--bg-tertiary)] border border-[var(--bg-grey)] rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-[var(--bg-green)] cursor-pointer flex flex-col"
    >
      <div className="h-48 overflow-hidden relative">
        <img
          src={booking.coverImage}
          alt={booking.venueName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-[var(--bg-tertiary)]/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[var(--text-primary)] shadow-sm">
          {booking.bookingRef}
        </div>
        {activeTab === BOOKING_UI_STATUS.CANCELLED && (
          <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-red-500 text-white px-4 py-1.5 rounded-full font-bold text-sm">
              CANCELLED
            </span>
          </div>
        )}
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3
            className="text-lg font-bold text-[var(--text-primary)] line-clamp-1 hover:underline cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/venue/${booking.venueId}`);
            }}
            title={`View ${booking.venueName} details`}
          >
            {booking.venueName}
          </h3>
        </div>
        <p className="text-[var(--text-secondary)] text-sm mb-4 flex items-center gap-1.5">
          <FiMapPin className="text-[var(--bg-green)]" /> {booking.city}, {booking.district}
        </p>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-3 text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-primary)] px-3 py-2 rounded-lg">
            <FiCalendar className="text-[var(--bg-green)]" /> {booking.date}
          </div>
          <div className="flex items-center gap-3 text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-primary)] px-3 py-2 rounded-lg">
            <FiClock className="text-[var(--bg-green)]" /> {booking.timeRange}
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-[var(--bg-grey)] space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[var(--text-secondary)] font-medium">Total Paid</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[var(--text-primary)]">₹{booking.totalPrice}</span>
              {booking.paymentStatus && booking.paymentStatus !== 'paid' && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    booking.paymentStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {booking.paymentStatus === 'pending'
                    ? 'PAYMENT PENDING'
                    : booking.paymentStatus.toUpperCase()}
                </span>
              )}
            </div>
          </div>
          {activeTab === BOOKING_UI_STATUS.COMPLETED && !booking.hasReview && (
            <button
              onClick={(e) => onReviewClick(booking, e)}
              className="w-full bg-[var(--bg-green)] hover:bg-emerald-600 text-white py-2 rounded-lg font-medium text-sm transition"
            >
              Rate this Booking
            </button>
          )}
          {activeTab === BOOKING_UI_STATUS.COMPLETED && booking.hasReview && (
            <div className="text-center text-xs text-[var(--bg-green)] font-medium">
              ✓ Review submitted
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
