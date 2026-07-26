import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { FiMapPin, FiArrowRight } from 'react-icons/fi';
import { TbBuildingOff } from 'react-icons/tb';

import { useApiQuery, useApiMutation } from '@/hooks/useApi';
import { useVenueReviews } from '@/hooks/useVenueReviews';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { API_ENDPOINTS } from '@/constants';
import { BOOKING_TYPES, PRICING_TYPES } from '@/constants/venueConstants';
import type { VenueDetail } from '@/types/venue.types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import ReviewModal from '@/components/common/ReviewModal';
import type { AxiosError } from 'axios';

import { VenueGallery } from '@/components/venue/VenueGallery';
import { VenueAmenities } from '@/components/venue/VenueAmenities';
import { VenueInfo } from '@/components/venue/VenueInfo';

// Extracted components & hooks
import { useVenueBooking } from '@/hooks/useVenueBooking';
import { BookingSidebar } from './components/BookingSidebar';
import { ReviewList } from './components/ReviewList';

const VenueDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { success, error: showError } = useToast();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isReviewsExpanded, setIsReviewsExpanded] = useState(false);

  const { reviews, pagination, isLoading: isReviewsLoading, fetchReviews } = useVenueReviews();

  useEffect(() => {
    if (id) {
      fetchReviews(id);
    }
  }, [id, fetchReviews]);

  const {
    data: venue,
    isLoading,
    isError,
    refetch,
  } = useApiQuery<VenueDetail>(
    ['venue', id || ''],
    {
      url: API_ENDPOINTS.VENUE_BY_ID(id as string),
      method: 'GET',
    },
    {
      enabled: !!id,
    }
  );

  const booking = useVenueBooking(id, venue);

  const submitReviewMutation = useApiMutation<unknown, { rating?: number; comment?: string }>(
    {
      url: API_ENDPOINTS.VENUE_REVIEWS(id as string),
      method: 'POST',
    },
    {
      onSuccess: () => {
        success('Review submitted successfully');
        setShowReviewModal(false);
        fetchReviews(id || '');
      },
      onError: (err: Error) => {
        const axiosErr = err as AxiosError<{ message: string }>;
        showError(axiosErr?.response?.data?.message || 'Failed to submit review');
      },
    }
  );

  if (isLoading) {
    return (
      <section className="max-w-8xl mx-auto mt-24 px-16 pb-12 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:p-6 lg:p-8 relative">
          <div className="lg:col-span-9">
            <div className="mb-6">
              <Skeleton className="h-10 w-3/4 mb-4 rounded-xl" />
              <Skeleton className="h-6 w-1/2 rounded-lg" />
            </div>
            <Skeleton className="w-full h-[440px] rounded-3xl mb-10" />
            <Skeleton className="w-full h-40 rounded-3xl mb-8" />
            <Skeleton className="w-full h-64 rounded-3xl" />
          </div>
          <div className="lg:col-span-3">
            <Skeleton className="w-full h-[500px] rounded-3xl sticky top-48" />
          </div>
        </div>
      </section>
    );
  }

  if (isError || !venue) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div className="bg-[var(--bg-tertiary)] border border-[var(--bg-grey)] rounded-3xl p-10 max-w-md w-full text-center shadow-lg">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-950/30 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <TbBuildingOff size={40} />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Venue Not Found</h2>
          <p className="text-[var(--text-secondary)] mb-8">
            The venue you're looking for doesn't exist or may have been removed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => refetch()}
              className="px-6 py-3 rounded-xl border border-[var(--bg-grey)] font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-grey)] transition cursor-pointer"
            >
              ↺ Try Again
            </button>
            <Link
              to="/explore"
              className="px-6 py-3 rounded-xl bg-[var(--bg-green)] font-semibold text-white hover:opacity-90 transition"
            >
              ← Go to Explore
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = venue.coverImage ? [venue.coverImage, ...(venue.galleryImages || [])] : [];
  const amenities = venue.amenities || [];

  const getStartingPrice = () => {
    if (venue.bookingType === 'flexibleBooking' && venue.pricing) {
      return `₹${venue.pricing.basePrice}/${venue.pricing.pricingType === PRICING_TYPES.FIXED ? 'slot' : 'hr'}`;
    }
    if (venue.bookingType === BOOKING_TYPES.FIXED && venue.fixedPackages?.length > 0) {
      const minPrice = Math.min(...venue.fixedPackages.map((p) => p.price));
      return `₹${minPrice}`;
    }
    return '--';
  };

  return (
    <section className="max-w-8xl mx-auto mt-20 lg:mt-24 px-4 sm:px-6 lg:px-16 pb-2 lg:pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:p-4 lg:p-6 relative">
        <div className="lg:col-span-9">
          <div className="w-full lg:pr-6 z-10 font-sans">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-3">
                <Link to="/explore" className="hover:text-[var(--bg-green)] transition">
                  Explore
                </Link>
                <span>/</span>
                <span className="capitalize">{venue.city?.toLowerCase() || 'Unknown City'}</span>
                <span>/</span>
                <span className="text-[var(--text-primary)] font-medium capitalize">
                  {venue.name?.toLowerCase() || 'Unknown Venue'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--text-primary)] mb-2 capitalize leading-tight">
                {venue.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-[var(--text-secondary)] mt-3">
                <p className="text-base flex items-center gap-1.5 font-medium">
                  <FiMapPin className="text-[var(--bg-green)] shrink-0 text-lg" />
                  {venue.city}, {venue.district}
                </p>
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--bg-grey)] hidden sm:block"></div>
                <span className="px-3 py-1 bg-[var(--bg-green)]/10 text-[var(--bg-green)] border border-[var(--bg-green)]/20 text-xs font-semibold rounded-full capitalize">
                  {venue.venueType}
                </span>
              </div>
            </div>

            <VenueGallery venueName={venue.name} images={images} />
            <VenueInfo venue={venue} />
            <VenueAmenities amenities={amenities} />

            <div className="lg:hidden bg-[var(--bg-tertiary)] border border-[var(--bg-grey)] rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-[var(--bg-green)]/25 transition-all duration-300 mt-8 mb-10 overflow-hidden">
              <div
                className="flex items-center justify-between group cursor-pointer active:scale-[0.99]"
                onClick={() => setIsReviewsExpanded(!isReviewsExpanded)}
              >
                <div>
                  <h2 className="text-xl font-extrabold text-[var(--text-primary)] mb-1 flex items-center gap-2">
                    Reviews & Ratings
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-lg text-yellow-500">
                      {venue?.avgRating ? venue.avgRating.toFixed(1) : 'New'} ★
                    </span>
                    <span className="text-[var(--text-secondary)] font-medium">
                      ({pagination?.total ?? venue?.reviewCount ?? 0} reviews)
                    </span>
                  </div>
                </div>
                <div className="bg-[var(--bg-grey)]/40 text-[var(--text-primary)] px-4 py-2 rounded-full group-hover:bg-[var(--bg-green)]/10 group-hover:text-[var(--bg-green)] transition-colors font-bold text-sm">
                  {isReviewsExpanded ? 'Hide' : 'View all'}
                </div>
              </div>

              {isReviewsExpanded && (
                <div className="mt-6 pt-6 border-t border-[var(--bg-grey)] animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-[var(--text-primary)] text-lg">All Reviews</h3>
                    {user && (
                      <Button
                        onClick={() => setShowReviewModal(true)}
                        className="bg-[var(--bg-green)] text-white hover:opacity-90 font-semibold px-4 py-2 rounded-lg text-xs"
                      >
                        Add Review
                      </Button>
                    )}
                  </div>
                  <ReviewList
                    isReviewsLoading={isReviewsLoading}
                    reviews={reviews}
                    pagination={pagination}
                    fetchReviews={fetchReviews}
                    id={id}
                  />
                </div>
              )}
            </div>

            <div className="hidden lg:block bg-[var(--bg-tertiary)] border border-[var(--bg-grey)] rounded-3xl p-5 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-all duration-300 mt-8 mb-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-[var(--text-primary)] text-2xl">
                    Reviews & Ratings
                  </h3>
                  {venue?.avgRating && (
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500 text-lg">★</span>
                      <span className="font-bold text-[var(--text-primary)] text-lg">
                        {venue.avgRating.toFixed(1)}
                      </span>
                      <span className="text-sm text-[var(--text-secondary)]">
                        ({pagination?.total ?? venue.reviewCount ?? 0} reviews)
                      </span>
                    </div>
                  )}
                </div>
                {user && (
                  <Button
                    onClick={() => setShowReviewModal(true)}
                    className="bg-[var(--bg-green)] text-white hover:opacity-90 font-semibold px-4 py-2 rounded-lg"
                  >
                    Add Review
                  </Button>
                )}
              </div>
              <ReviewList
                isReviewsLoading={isReviewsLoading}
                reviews={reviews}
                pagination={pagination}
                fetchReviews={fetchReviews}
                id={id}
              />
            </div>
          </div>
        </div>

        <div className="hidden lg:block lg:col-span-3">
          <div className="sticky top-42 lg:mb-12 bg-[var(--bg-tertiary)] border border-[var(--bg-grey)]/85 backdrop-blur-md rounded-3xl p-4 sm:p-5 lg:p-4 sm:p-5 lg:p-6 shadow-xl relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]">
            <BookingSidebar venue={venue} {...booking} getStartingPrice={getStartingPrice} />
          </div>
        </div>
      </div>

      <div
        className={`fixed lg:hidden bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          booking.showFab && !booking.bookingOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-8 pointer-events-none'
        }`}
      >
        <Dialog open={booking.bookingOpen} onOpenChange={booking.setBookingOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-4 rounded-full px-5 py-3 bg-[var(--bg-tertiary)]/80 backdrop-blur-xl border border-[var(--bg-grey)]/40 shadow-[0_15px_40px_rgba(0,0,0,.18)] transition-all duration-500 hover:scale-[1.03] active:scale-95">
              <div className="text-left">
                <p className="text-[10px] uppercase text-[var(--text-secondary)]">
                  {booking.selectedSlots.length ? 'Total' : 'Starting'}
                </p>

                <p className="font-bold">
                  {booking.selectedSlots.length ? `₹${booking.totalPrice}` : getStartingPrice()}
                </p>
              </div>

              <div className="w-11 h-11 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl">
                <FiArrowRight size={20} />
              </div>
            </button>
          </DialogTrigger>

          <DialogContent
            className="
            w-[95vw]
            max-w-md
            rounded-3xl
            max-h-[92dvh]
            overflow-auto
            p-5
            "
          >
            <BookingSidebar venue={venue} {...booking} getStartingPrice={getStartingPrice} />
          </DialogContent>
        </Dialog>
      </div>

      <ReviewModal
        open={showReviewModal}
        onOpenChange={setShowReviewModal}
        venueName={venue?.name || 'Venue'}
        onSubmit={async (rating: number, comment: string) => {
          await submitReviewMutation.mutateAsync({ rating, comment });
        }}
      />
    </section>
  );
};

export default VenueDetails;
