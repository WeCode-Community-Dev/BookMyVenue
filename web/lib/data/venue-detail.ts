import { Car, Ruler, Users, type LucideIcon } from "lucide-react";

import type { Space, VenueDetails, VenueImage } from "@/lib/data/venues";
import { CapacityType } from "@/lib/data/venues";
import {
  formatSpaceArea,
  formatSpaceCapacity,
} from "@/lib/data/public-venue-detail";

export type VenueDetailTab =
  | "overview"
  | "spaces"
  | "amenities"
  | "images"
  | "pricing"
  | "availability"
  | "bookings";

export const VENUE_DETAIL_TABS: { id: VenueDetailTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "spaces", label: "Spaces" },
  { id: "amenities", label: "Amenities" },
  { id: "images", label: "Images" },
  { id: "pricing", label: "Pricing" },
  { id: "availability", label: "Availability" },
  { id: "bookings", label: "Bookings" },
];

export type SpaceDisplayStatus = "available" | "not available";

export type VenueDisplayStats = {
  totalSpaces: number;
  totalBookings: number;
};

const DUMMY_RATING = 0.0  ;
const DUMMY_REVIEW_COUNT = 0;

export function getVenueRating() {
  return DUMMY_RATING;
}

export function getVenueReviewCount() {
  return DUMMY_REVIEW_COUNT;
}

export function getVenueCoverImage(venue: VenueDetails): VenueImage | undefined {
  const cover = venue.images.find((img) => img.isCover);
  return cover ?? venue.images[0];
}

export function getImageUrl(url: string): string {
  return `${process.env.NEXT_PUBLIC_R2_APP_URL}/${url}`;
}

export function getVenueLocation(venue: VenueDetails): string {
  return [venue.city,venue.state, venue.country].filter(Boolean).join(", ");
}

export function getSpaceDisplayStatus(space: Space): SpaceDisplayStatus {
  return space.isActive ? "available" : "not available";
}

export function getUniqueCategories(spaces: Space[]): string[] {
  const categories = spaces.map((space) => space.category.name);
  return [...new Set(categories)];
}

export function getSpaceCoverImage(space: Space) {
  const cover = space.images.find((img) => img.isCover);
  return cover ?? space.images[0];
}

export function formatCapacity(space: Space): string {
  if (!space.capacityValue) {
    return "—";
  }

  const capacityLabel = formatSpaceCapacity(space);
  if (capacityLabel) {
    return capacityLabel;
  }

  const areaLabel = formatSpaceArea(space);
  if (areaLabel) {
    return areaLabel;
  }

  const value = parseFloat(space.capacityValue);
  if (Number.isNaN(value)) {
    return space.capacityValue;
  }

  if (!space.capacityType) {
    return `up to ${Math.round(value)}`;
  }

  return `${Math.round(value)}`;
}

export function getCapacityIcon(capacityType: CapacityType | null): LucideIcon {
  switch (capacityType) {
    case CapacityType.CARS:
      return Car;
    case CapacityType.SQFT:
    case CapacityType.SQM:
      return Ruler;
    default:
      return Users;
  }
}

export function filterSpacesByCategory(
  spaces: Space[],
  selectedCategory: string,
): Space[] {
  if (selectedCategory === "All") {
    return spaces;
  }
  return spaces.filter((space) => space.category.name === selectedCategory);
}
