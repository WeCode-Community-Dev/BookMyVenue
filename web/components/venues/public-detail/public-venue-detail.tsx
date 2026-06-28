"use client";

import { useMemo, useState } from "react";
import { MapPin, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { VenueDetails } from "@/lib/data/venues";
import {
  getVenueRating,
  getVenueReviewCount,
} from "@/lib/data/venue-detail";
import {
  formatFullAddress,
  getActiveSpaces,
  isPremiumVenue,
} from "@/lib/data/public-venue-detail";

import { PublicSpaceList } from "./public-space-list";
import { VenueAboutSection } from "./venue-about-section";
import { VenueAmenitiesSection } from "./venue-amenities-section";
import { VenueBookingSidebar } from "./venue-booking-sidebar";
import { VenueDetailBreadcrumbs } from "./venue-detail-breadcrumbs";
import { VenueImageGallery } from "./venue-image-gallery";
import { VenueLocationSection } from "./venue-location-section";
import { VenueReviewsSection } from "./venue-reviews-section";

type PublicVenueDetailProps = {
  venue: VenueDetails;
};

export function PublicVenueDetail({ venue }: PublicVenueDetailProps) {
  const activeSpaces = useMemo(() => getActiveSpaces(venue), [venue]);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(
    activeSpaces[0]?.id ?? null,
  );

  const selectedSpace =
    activeSpaces.find((s) => s.id === selectedSpaceId) ?? null;

  const rating = getVenueRating();
  const reviewCount = getVenueReviewCount();
  const premium = isPremiumVenue();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-8">
      <VenueDetailBreadcrumbs venue={venue} />

      <VenueImageGallery venue={venue} />

      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3">
          {premium && (
            <Badge className="bg-surface-tint text-on-primary uppercase tracking-wide">
              Premium Venue
            </Badge>
          )}
          <span className="flex items-center gap-1 text-sm text-on-surface-variant">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            {rating} ({reviewCount} reviews)
          </span>
        </div>

        <h1 className="text-headline-md font-bold text-on-surface md:text-headline-lg">
          {venue.name}
        </h1>

        <div className="flex items-center gap-1.5 text-sm text-on-surface-variant">
          <MapPin className="size-4 shrink-0" />
          <span>{formatFullAddress(venue)}</span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
        <div className="flex flex-col gap-10 min-w-0">
          <VenueAboutSection venue={venue} />
          <VenueAmenitiesSection venue={venue} />
          <PublicSpaceList
            spaces={activeSpaces}
            selectedSpaceId={selectedSpaceId}
            onSelectSpace={setSelectedSpaceId}
          />
          <VenueLocationSection venue={venue} />
          <VenueReviewsSection />
        </div>

        <VenueBookingSidebar venue={venue} selectedSpace={selectedSpace} />
      </div>
    </div>
  );
}
