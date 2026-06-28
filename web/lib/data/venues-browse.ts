import type { Space, VenueDetails } from "@/lib/data/venues";
import {
  getSpaceDisplayStatus,
  getVenueRating,
} from "@/lib/data/venue-detail";

export const VENUES_PER_PAGE = 8;

export const CAPACITY_MIN = 10;
export const CAPACITY_MAX = 250;
export const PRICE_MIN = 0;
export const PRICE_MAX = 500;

export type BrowseSortOption =
  | "recommended"
  | "price-low"
  | "price-high"
  | "rating-high"
  | "rating-low";

export type BrowseViewMode = "grid" | "list";

export type BrowseFilters = {
  location: string;
  date: string;
  occasion: string;
  categoryId: string | null;
  amenityIds: string[];
  minCapacity: number;
  maxCapacity: number;
  minPrice: number;
  maxPrice: number;
  sort: BrowseSortOption;
  page: number;
  view: BrowseViewMode;
};

export const defaultBrowseFilters: BrowseFilters = {
  location: "",
  date: "",
  occasion: "",
  categoryId: null,
  amenityIds: [],
  minCapacity: CAPACITY_MIN,
  maxCapacity: CAPACITY_MAX,
  minPrice: PRICE_MIN,
  maxPrice: PRICE_MAX,
  sort: "recommended",
  page: 1,
  view: "grid",
};

export type VenueBrowseDisplay = {
  venue: VenueDetails;
  primarySpace: Space | undefined;
  categoryLabel: string;
  capacityValue: number | null;
  amenityLabels: string[];
  startingPrice: number;
  rating: number;
  isAvailableToday: boolean;
};

export function getPrimarySpace(venue: VenueDetails): Space | undefined {
  const active = venue.spaces.find((space) => space.isActive);
  return active ?? venue.spaces[0];
}

export function getPlaceholderStartingPrice(venueId: string): number {
  let hash = 0;
  for (let i = 0; i < venueId.length; i++) {
    hash = (hash + venueId.charCodeAt(i) * (i + 1)) % 451;
  }
  return 45 + hash;
}

export function toVenueBrowseDisplay(venue: VenueDetails): VenueBrowseDisplay {
  const primarySpace = getPrimarySpace(venue);
  const venueAmenities = venue.amenities.map((a) => a.amenity.name);
  const spaceAmenities =
    primarySpace?.amenities.map((a) => a.amenity.name) ?? [];
  const amenityLabels = (
    venueAmenities.length > 0 ? venueAmenities : spaceAmenities
  ).slice(0, 2);

  const capacityRaw = primarySpace?.capacityValue;
  const capacityValue =
    capacityRaw != null && !Number.isNaN(parseFloat(capacityRaw))
      ? parseFloat(capacityRaw)
      : null;

  return {
    venue,
    primarySpace,
    categoryLabel: primarySpace?.category.name ?? "Venue",
    capacityValue,
    amenityLabels,
    startingPrice: getPlaceholderStartingPrice(venue.id),
    rating: getVenueRating(),
    isAvailableToday: primarySpace
      ? getSpaceDisplayStatus(primarySpace.id) === "available"
      : false,
  };
}

function matchesLocation(venue: VenueDetails, location: string): boolean {
  if (!location.trim()) return true;
  const query = location.trim().toLowerCase();
  const fields = [
    venue.city,
    venue.state,
    venue.address,
    venue.country,
    venue.postalCode,
  ];
  return fields.some((field) => field?.toLowerCase().includes(query));
}

function matchesOccasion(venue: VenueDetails, occasion: string): boolean {
  if (!occasion.trim()) return true;
  const query = occasion.trim().toLowerCase();
  return (
    venue.name.toLowerCase().includes(query) ||
    venue.description?.toLowerCase().includes(query)
  );
}

function matchesCategory(venue: VenueDetails, categoryId: string | null): boolean {
  if (!categoryId) return true;
  return venue.spaces.some((space) => space.categoryId === categoryId);
}

function matchesAmenities(venue: VenueDetails, amenityIds: string[]): boolean {
  if (amenityIds.length === 0) return true;
  const venueIds = new Set(venue.amenities.map((a) => a.amenityId));
  const spaceIds = new Set(
    venue.spaces.flatMap((space) =>
      space.amenities.map((a) => a.amenityId),
    ),
  );
  return amenityIds.every(
    (id) => venueIds.has(id) || spaceIds.has(id),
  );
}

function matchesCapacity(
  display: VenueBrowseDisplay,
  min: number,
  max: number,
): boolean {
  if (display.capacityValue == null) return true;
  return display.capacityValue >= min && display.capacityValue <= max;
}

function matchesPrice(
  display: VenueBrowseDisplay,
  min: number,
  max: number,
): boolean {
  return display.startingPrice >= min && display.startingPrice <= max;
}

export function filterVenues(
  venues: VenueDetails[],
  filters: BrowseFilters,
): VenueBrowseDisplay[] {
  const displays = venues.map(toVenueBrowseDisplay);

  return displays.filter((display) => {
    const { venue } = display;
    return (
      matchesLocation(venue, filters.location) &&
      matchesOccasion(venue, filters.occasion) &&
      matchesCategory(venue, filters.categoryId) &&
      matchesAmenities(venue, filters.amenityIds) &&
      matchesCapacity(display, filters.minCapacity, filters.maxCapacity) &&
      matchesPrice(display, filters.minPrice, filters.maxPrice)
    );
  });
}

export function sortVenues(
  displays: VenueBrowseDisplay[],
  sort: BrowseSortOption,
): VenueBrowseDisplay[] {
  const sorted = [...displays];
  switch (sort) {
    case "price-low":
      return sorted.sort((a, b) => a.startingPrice - b.startingPrice);
    case "price-high":
      return sorted.sort((a, b) => b.startingPrice - a.startingPrice);
    case "rating-high":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "rating-low":
      return sorted.sort((a, b) => a.rating - b.rating);
    default:
      return sorted;
  }
}

export function paginateVenues(
  displays: VenueBrowseDisplay[],
  page: number,
  perPage = VENUES_PER_PAGE,
): { items: VenueBrowseDisplay[]; totalPages: number } {
  const totalPages = Math.max(1, Math.ceil(displays.length / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  return {
    items: displays.slice(start, start + perPage),
    totalPages,
  };
}

export function buildResultsSubtitle(
  filters: BrowseFilters,
  categoryName?: string,
): string {
  const parts: string[] = [];
  if (categoryName) {
    parts.push(categoryName.toLowerCase());
  } else if (filters.occasion.trim()) {
    parts.push(filters.occasion.trim().toLowerCase());
  }
  if (filters.location.trim()) {
    parts.push(`in ${filters.location.trim()}`);
  }
  if (parts.length === 0) {
    return "Showing all available venues";
  }
  return `Showing results for ${parts.join(" ")}`;
}

export function parseBrowseFiltersFromSearchParams(
  params: Record<string, string | undefined>,
): BrowseFilters {
  const amenityIds = params.amenities
    ? params.amenities.split(",").filter(Boolean)
    : [];

  const sort = params.sort as BrowseSortOption;
  const view = params.view as BrowseViewMode;

  return {
    location: params.location ?? "",
    date: params.date ?? "",
    occasion: params.occasion ?? "",
    categoryId: params.category ?? null,
    amenityIds,
    minCapacity: parseInt(params.minCapacity ?? String(CAPACITY_MIN), 10),
    maxCapacity: parseInt(params.maxCapacity ?? String(CAPACITY_MAX), 10),
    minPrice: parseInt(params.minPrice ?? String(PRICE_MIN), 10),
    maxPrice: parseInt(params.maxPrice ?? String(PRICE_MAX), 10),
    sort:
      sort === "price-low" ||
      sort === "price-high" ||
      sort === "rating-high" ||
      sort === "rating-low"
        ? sort
        : "recommended",
    page: Math.max(1, parseInt(params.page ?? "1", 10)),
    view: view === "list" ? "list" : "grid",
  };
}

export function browseFiltersToSearchParams(
  filters: BrowseFilters,
): Record<string, string> {
  const params: Record<string, string> = {};
  if (filters.location) params.location = filters.location;
  if (filters.date) params.date = filters.date;
  if (filters.occasion) params.occasion = filters.occasion;
  if (filters.categoryId) params.category = filters.categoryId;
  if (filters.amenityIds.length > 0) {
    params.amenities = filters.amenityIds.join(",");
  }
  if (filters.minCapacity !== CAPACITY_MIN) {
    params.minCapacity = String(filters.minCapacity);
  }
  if (filters.maxCapacity !== CAPACITY_MAX) {
    params.maxCapacity = String(filters.maxCapacity);
  }
  if (filters.minPrice !== PRICE_MIN) {
    params.minPrice = String(filters.minPrice);
  }
  if (filters.maxPrice !== PRICE_MAX) {
    params.maxPrice = String(filters.maxPrice);
  }
  if (filters.sort !== "recommended") params.sort = filters.sort;
  if (filters.page > 1) params.page = String(filters.page);
  if (filters.view !== "grid") params.view = filters.view;
  return params;
}

export function getPaginationRange(
  currentPage: number,
  totalPages: number,
): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [1];

  if (currentPage > 3) {
    pages.push("ellipsis");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) {
    pages.push("ellipsis");
  }

  pages.push(totalPages);
  return pages;
}
