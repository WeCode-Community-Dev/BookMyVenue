import Image from "next/image";
import { Camera } from "lucide-react";

import type { Space, VenueDetails } from "@/lib/data/venues";
import { getImageUrl, getSpaceCoverImage, getVenueCoverImage } from "@/lib/data/venue-detail";

type SpaceBookingGalleryProps = {
  space: Space;
  venue: VenueDetails;
};

function getGalleryImages(space: Space, venue: VenueDetails) {
  const spaceImages = space.images.map((img) => ({
    url: img.image.url,
    alt: img.image.altText || space.name,
  }));

  if (spaceImages.length >= 3) {
    return spaceImages.slice(0, 3);
  }

  const venueImages = venue.images.map((img) => ({
    url: img.image.url,
    alt: img.image.altText || venue.name,
  }));

  return [...spaceImages, ...venueImages].slice(0, 3);
}

export function SpaceBookingGallery({ space, venue }: SpaceBookingGalleryProps) {
  const images = getGalleryImages(space, venue);
  const primary = images[0];
  const secondary = images.slice(1);

  if (!primary) {
    const cover = getSpaceCoverImage(space) ?? getVenueCoverImage(venue);
    if (!cover) {
      return (
        <div className="flex h-64 items-center justify-center rounded-xl bg-surface-container-low">
          <Camera className="size-10 text-on-surface-variant/40" />
        </div>
      );
    }
    return (
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
        <Image
          src={getImageUrl(cover.image.url)}
          alt={cover.image.altText || space.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-[2fr_1fr] sm:h-[320px]">
      <div className="relative aspect-4/3 sm:aspect-auto overflow-hidden rounded-xl">
        <Image
          src={getImageUrl(primary.url)}
          alt={primary.alt}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 640px) 100vw, 66vw"
        />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-1 sm:grid-rows-2">
        {secondary.map((img, i) => (
          <div
            key={i}
            className="relative aspect-4/3 sm:aspect-auto overflow-hidden rounded-xl"
          >
            <Image
              src={getImageUrl(img.url)}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="200px"
            />
          </div>
        ))}
        {secondary.length < 2 &&
          Array.from({ length: 2 - secondary.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="hidden sm:block rounded-xl bg-surface-container-low"
            />
          ))}
      </div>
    </div>
  );
}
