import Image from "next/image";
import Link from "next/link";
import { MapPin, Pencil, Plus, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { VenueStatusBadge } from "@/components/venues/venue-status-badge";
import type { VenueDetails } from "@/lib/data/venues";
import {
  getImageUrl,
  getVenueCoverImage,
  getVenueLocation,
  getVenueRating,
  getVenueReviewCount,
} from "@/lib/data/venue-detail";

type VenueDetailHeaderProps = {
  venue: VenueDetails;
};

export function VenueDetailHeader({ venue }: VenueDetailHeaderProps) {
  const coverImage = getVenueCoverImage(venue);
  const location = getVenueLocation(venue);
  const rating = getVenueRating();
  const reviewCount = getVenueReviewCount();

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="relative aspect-3/1 min-h-[200px] w-full sm:min-h-[240px]">
        {coverImage ? (
          <Image
            src={getImageUrl(coverImage.image.url)}
            alt={coverImage.image.altText || venue.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="h-full w-full bg-surface-container-high" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6 lg:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <VenueStatusBadge status="active" />
                <span className="flex items-center gap-1 text-sm text-white/90">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  {rating} ({reviewCount} reviews)
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                asChild
              >
                <Link href={`/my-venues/${venue.id}/edit`}>
                  <Pencil className="size-3.5" />
                  Edit Venue
                </Link>
              </Button>
              <Button size="sm" className="bg-surface-tint text-on-primary hover:bg-surface-tint/90" asChild>
                <Link href={`/my-venues/${venue.id}/spaces/create`}>
                  <Plus className="size-3.5" />
                  Add Space
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
              {venue.name}
            </h1>
            <div className="flex items-center gap-1.5 text-sm text-white/80">
              <MapPin className="size-4 shrink-0" />
              <span>{location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
