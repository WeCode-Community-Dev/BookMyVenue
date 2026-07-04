import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicVenuesApi } from '../services/public-venues.api';
import { useAsyncFetch } from '@/shared/hooks/useAsyncFetch';
import type { Venue, ApiResponse } from '@/features/venues/types/venues.types';
import { ChevronLeft } from 'lucide-react';

import VenueDetailsLoading from '../components/Venue/details/VenueDetailsLoading';
import VenueNotFound from '../components/Venue/details/VenueNotFound';
import VenueBreadcrumb from '../components/Venue/details/VenueBreadcrumb';
import VenueImageGallery from '../components/Venue/details/VenueImageGallery';
import VenueTitleBlock from '../components/Venue/details/VenueTitleBlock';
import VenueDescription from '../components/Venue/details/VenueDescription';
import VenueAmenities from '../components/Venue/details/VenueAmenities';
import VenueLocation from '../components/Venue/details/VenueLocation';
import VenuePricingCard from '../components/Venue/details/VenuePricingCard';
import VenueAvailability from '../components/Venue/details/VenueAvailability';

export default function VenueDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const { data: fetchResponse, loading, execute: fetchVenue } = useAsyncFetch<ApiResponse<Venue>>();

  const venue = fetchResponse?.data;

  useEffect(() => {
    if (id) {
      fetchVenue(() => publicVenuesApi.getById(id));
    }
  }, [id]);

  if (loading) return <VenueDetailsLoading />;
  if (!venue) return <VenueNotFound />;
  const categoryName =
    typeof venue.categoryId === 'string'
      ? venue.categoryId
      : venue.categoryId?.name || 'Uncategorized';

  const formattedDate = venue.createdAt
    ? new Date(venue.createdAt).toLocaleString('en-IN', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'N/A';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <VenueBreadcrumb venueName={venue.name} />

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left Column */}
        <div className="space-y-6">
          <VenueImageGallery images={venue.images} venueName={venue.name} />

          {/* Title & Location — mobile only */}
          <div className="lg:hidden">
            <VenueTitleBlock
              categoryName={categoryName}
              venueName={venue.name}
              city={venue.address.city}
              state={venue.address.state}
            />
          </div>

          <VenueDescription description={venue.description} />
          <VenueAmenities amenities={venue.amenities} />
          <VenueAvailability
            isAvailabilityConfigured={venue.isAvailabilityConfigured}
            availability={venue.availability}
          />
          <VenueLocation
            address={venue.address}
            coordinates={venue.location?.coordinates || []}
            venueName={venue.name}
          />
        </div>

        {/* Right Column — Sticky Sidebar */}
        <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          {/* Title & Location — desktop only */}
          <div className="hidden lg:block rounded-2xl border border-border bg-card p-6 shadow-sm">
            <VenueTitleBlock
              categoryName={categoryName}
              venueName={venue.name}
              city={venue.address.city}
              state={venue.address.state}
            />
          </div>

          <VenuePricingCard
            venueId={venue._id}
            pricePerHour={venue.availability?.pricePerHour || 0}
            capacity={venue.capacity}
            categoryName={categoryName}
            formattedDate={formattedDate}
          />

          <Link
            to="/venues"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground hover:bg-surface transition-all"
          >
            <ChevronLeft size={16} /> Back to All Venues
          </Link>
        </div>
      </div>
    </div>
  );
}
