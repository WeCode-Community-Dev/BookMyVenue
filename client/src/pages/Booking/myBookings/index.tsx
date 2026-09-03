import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { FiCalendar, FiSearch } from 'react-icons/fi';
import { useMyBookings } from '@/hooks/useMyBookings';
import ReviewModal from '@/components/common/ReviewModal';
import * as reviewService from '@/services/reviewService';
import { useToast } from '@/hooks/useToast';
import { BookingCard } from '@/components/bookings/BookingCard';
import { NextBookingBanner } from '@/components/bookings/NextBookingBanner';
import { BOOKING_UI_STATUS } from '@/constants/bookingConstants';

import type { BookingCardDTO } from '@/types/booking.types';

type TabType = 'upcoming' | 'completed' | 'cancelled';

const DEFAULT_BOOKINGS = { upcoming: [], completed: [], cancelled: [] };

const MyBookings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>(BOOKING_UI_STATUS.UPCOMING);
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewModal, setReviewModal] = useState<{ open: boolean; booking: BookingCardDTO | null }>(
    {
      open: false,
      booking: null,
    }
  );

  const { data, isLoading, isError, refetch } = useMyBookings();
  const bookingsData = useMemo(() => data?.data?.bookings || DEFAULT_BOOKINGS, [data]);
  const { success, error } = useToast();

  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (!reviewModal.booking) {
      error('Booking not found');
      return;
    }

    try {
      await reviewService.submitReview(reviewModal.booking.venueId, {
        rating,
        comment: comment || undefined,
      });
      success('Review submitted successfully!');
      setReviewModal({ open: false, booking: null });
      refetch();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to submit review';
      error(errorMsg);
      throw err;
    }
  };

  const tabs: { id: TabType; label: string; count: number }[] = [
    { id: BOOKING_UI_STATUS.UPCOMING, label: 'Upcoming', count: bookingsData.upcoming.length },
    { id: BOOKING_UI_STATUS.COMPLETED, label: 'Completed', count: bookingsData.completed.length },
    { id: BOOKING_UI_STATUS.CANCELLED, label: 'Cancelled', count: bookingsData.cancelled.length },
  ];

  const filteredBookings = useMemo(() => {
    const currentList = bookingsData[activeTab] || [];
    if (!searchQuery) return currentList;
    return currentList.filter(
      (b: BookingCardDTO) =>
        b.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.bookingRef.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [bookingsData, activeTab, searchQuery]);

  const activeBooking = useMemo(() => {
    return bookingsData.upcoming.find((b) => b.uiStatus === 'in_progress') ?? null;
  }, [bookingsData.upcoming]);

  const nextBooking = useMemo(() => {
    if (activeBooking) return activeBooking;
    if (bookingsData.upcoming.length === 0) return null;
    return [...bookingsData.upcoming].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )[0];
  }, [bookingsData.upcoming, activeBooking]);

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-[var(--bg-tertiary)] border border-[var(--bg-grey)] rounded-3xl overflow-hidden animate-pulse"
        >
          <div className="h-48 bg-[var(--bg-grey)] w-full"></div>
          <div className="p-6">
            <div className="h-6 bg-[var(--bg-grey)] w-3/4 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-[var(--bg-grey)] w-full rounded"></div>
              <div className="h-4 bg-[var(--bg-grey)] w-5/6 rounded"></div>
            </div>
            <div className="mt-6 pt-4 border-t border-[var(--bg-grey)] flex justify-between">
              <div className="h-5 bg-[var(--bg-grey)] w-1/3 rounded"></div>
              <div className="h-5 bg-[var(--bg-grey)] w-1/4 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">My Bookings</h1>
            <p className="text-[var(--text-secondary)] mt-2">
              Manage and view all your venue reservations.
            </p>
          </div>
        </div>

        {nextBooking &&
          (activeTab === BOOKING_UI_STATUS.UPCOMING || !!activeBooking) &&
          !isLoading && (
            <NextBookingBanner
              nextBooking={nextBooking}
              bannerType={activeBooking ? 'inProgress' : 'nextUp'}
            />
          )}

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex p-1 bg-[var(--bg-tertiary)] border border-[var(--bg-grey)] rounded-2xl w-full md:w-auto overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 md:flex-none whitespace-nowrap px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-[var(--bg-green)] text-white shadow-md'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-grey)]'
                }`}
              >
                {tab.label}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-white/20' : 'bg-[var(--bg-grey)]'}`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--bg-tertiary)] border border-[var(--bg-grey)] rounded-2xl pl-12 pr-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-green)] focus:ring-1 focus:ring-[var(--bg-green)] transition-all"
            />
          </div>
        </div>

        {isLoading ? (
          renderSkeleton()
        ) : isError ? (
          <div className="text-center py-20 bg-[var(--bg-tertiary)] rounded-3xl border border-[var(--bg-grey)]">
            <p className="text-red-500 dark:text-red-400 font-medium">
              Failed to load bookings. Please try again.
            </p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-24 bg-[var(--bg-tertiary)] rounded-3xl border border-[var(--bg-grey)]">
            <div className="w-24 h-24 bg-[var(--bg-grey)] rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCalendar className="text-4xl text-[var(--text-secondary)]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
              No {activeTab} bookings
            </h3>
            <p className="text-[var(--text-secondary)] max-w-md mx-auto">
              {searchQuery
                ? 'Try adjusting your search criteria.'
                : `You don't have any ${activeTab} bookings at the moment. Explore venues to make a reservation.`}
            </p>
            {!searchQuery && activeTab === BOOKING_UI_STATUS.UPCOMING && (
              <button
                onClick={() => navigate('/')}
                className="mt-6 px-6 py-3 bg-[var(--bg-green)] text-white font-bold rounded-xl hover:bg-green-600 transition"
              >
                Explore Venues
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking: BookingCardDTO) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                activeTab={activeTab}
                onReviewClick={(b, e) => {
                  e.stopPropagation();
                  setReviewModal({ open: true, booking: b });
                }}
              />
            ))}
          </div>
        )}
      </div>

      <ReviewModal
        open={reviewModal.open}
        onOpenChange={(open) => setReviewModal({ ...reviewModal, open })}
        venueName={reviewModal.booking?.venueName || ''}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
};

export default MyBookings;
