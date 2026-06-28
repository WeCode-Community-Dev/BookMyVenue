import type { Space, VenueDetails } from "@/lib/data/venues";
import { CapacityType } from "@/lib/data/venues";
import { getVenueRating } from "@/lib/data/venue-detail";

export type PublicReview = {
  id: string;
  author: string;
  date: string;
  eventType: string;
  text: string;
};

export const DUMMY_REVIEWS: PublicReview[] = [
  {
    id: "1",
    author: "Sarah Mitchell",
    date: "September 2024",
    eventType: "Corporate Conference",
    text:
      "An absolutely stunning venue. The glass atrium created the perfect atmosphere for our annual summit. Staff were incredibly professional and the AV setup was seamless.",
  },
  {
    id: "2",
    author: "James Chen",
    date: "August 2024",
    eventType: "Product Launch",
    text:
      "We hosted our product launch in the Grand Atrium and it exceeded expectations. Great natural light, flexible layout, and excellent catering options on-site.",
  },
  {
    id: "3",
    author: "Emily Rodriguez",
    date: "July 2024",
    eventType: "Networking Event",
    text:
      "Perfect location in Kensington with easy transport links. The rooftop terrace was a highlight for our evening reception. Would book again without hesitation.",
  },
];

export const PREMIUM_RATING_THRESHOLD = 4.8;

export const BOOKING_DEFAULT_HOURS = 4;
export const CLEANING_FEE = 75;
export const SERVICE_FEE_RATE = 0.08;

export function getPlaceholderHourlyPrice(entityId: string): number {
  let hash = 0;
  for (let i = 0; i < entityId.length; i++) {
    hash = (hash + entityId.charCodeAt(i) * (i + 1)) % 451;
  }
  return 45 + hash;
}

export function getSpaceHourlyPrice(spaceId: string): number {
  return getPlaceholderHourlyPrice(spaceId);
}

export function getVenueAverageHourlyPrice(venue: VenueDetails): number {
  const activeSpaces = venue.spaces.filter((s) => s.isActive);
  const spaces = activeSpaces.length > 0 ? activeSpaces : venue.spaces;
  if (spaces.length === 0) {
    return getPlaceholderHourlyPrice(venue.id);
  }
  const total = spaces.reduce(
    (sum, space) => sum + getSpaceHourlyPrice(space.id),
    0,
  );
  return Math.round(total / spaces.length);
}

export function isPremiumVenue(): boolean {
  return getVenueRating() >= PREMIUM_RATING_THRESHOLD;
}

export function formatFullAddress(venue: VenueDetails): string {
  const parts = [
    venue.address,
    venue.city,
    venue.postalCode,
  ].filter(Boolean);
  return parts.join(", ");
}

export function formatSpaceCapacity(space: Space): string | null {
  if (!space.capacityValue) return null;
  const value = parseFloat(space.capacityValue);
  if (Number.isNaN(value)) return space.capacityValue;

  const type = space.capacityType;
  if (
    type === CapacityType.PEOPLE ||
    type === CapacityType.SEATS ||
    type === CapacityType.PLAYERS
  ) {
    return `up to ${Math.round(value)}`;
  }
  return null;
}

export function formatSpaceArea(space: Space): string | null {
  if (!space.capacityValue) return null;
  const value = parseFloat(space.capacityValue);
  if (Number.isNaN(value)) return null;

  const type = space.capacityType;
  if (type === CapacityType.SQFT) {
    return `${Math.round(value).toLocaleString()} sq ft`;
  }
  if (type === CapacityType.SQM) {
    return `${Math.round(value).toLocaleString()} sq m`;
  }
  return null;
}

export function getActiveSpaces(venue: VenueDetails): Space[] {
  const active = venue.spaces.filter((s) => s.isActive);
  return active.length > 0 ? active : venue.spaces;
}

export function computeBookingBreakdown(
  spaceName: string,
  hourlyRate: number,
  hours = BOOKING_DEFAULT_HOURS,
): {
  spaceLine: string;
  spaceAmount: number;
  cleaningFee: number;
  serviceFee: number;
  total: number;
} {
  const spaceAmount = hourlyRate * hours;
  const serviceFee = Math.round(spaceAmount * SERVICE_FEE_RATE);
  const total = spaceAmount + CLEANING_FEE + serviceFee;

  return {
    spaceLine: `${spaceName} x ${hours} hrs`,
    spaceAmount,
    cleaningFee: CLEANING_FEE,
    serviceFee,
    total,
  };
}

export function getNeighborhoodDescription(city: string): string {
  return `${city} is a vibrant neighborhood known for its cultural landmarks, excellent dining, and convenient transport connections. The area offers a mix of historic charm and modern amenities, making it ideal for corporate events and special occasions.`;
}

export function getTransportDescription(city: string): string {
  return `Located in ${city}, this venue is well connected by public transport with nearby tube and bus links, plus on-street parking options in the surrounding area.`;
}
