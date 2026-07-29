import type { Space, VenueDetails, VenueImage } from "@/lib/data/venues";

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
  const value = parseFloat(space.capacityValue);
  if (Number.isNaN(value)) {
    return space.capacityValue;
  }
  return `${Math.round(value)} Max`;
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
