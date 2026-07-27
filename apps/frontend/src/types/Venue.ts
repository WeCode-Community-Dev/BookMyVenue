export interface Venue {
  id: string;
  name: string;
  description: string;
  venueType: string;
  capacityMin: number;
  capacityMax: number;
  addressLine: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  status: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  categories?: Array<{ id: string; venueId: string; category: string }>;
  amenities?: Array<{
    id: string;
    venueId: string;
    amenityId: string;
    amenity: { id: string; name: string };
  }>;
  images?: Array<{
    id: string;
    venueId: string;
    url: string;
    isPrimary: boolean;
    sortOrder: number;
    createdAt: string;
  }>;
  slotTemplates?: Array<{
    id: string;
    venueId: string;
    label: string;
    startDayOffset: number;
    startTime: string;
    endDayOffset: number;
    endTime: string;
    isCustom: boolean;
    customRatePerGuestPerHour: string | null;
    isActive: boolean;
    pricingTiers?: Array<{
      id: string;
      slotTemplateId: string;
      minGuests: number;
      maxGuests: number;
      price: string | number;
    }>;
    bookedSlots?: Array<{
      id: string;
      bookingId: string;
      slotTemplateId: string;
      slotPricingTierId: string;
      eventDate: string;
      occupiedFrom: string;
      occupiedTo: string;
      slotPrice: string;
      createdAt: string;
    }>;
  }>;
  blockedDates?: Array<{
    id: string;
    venueId: string;
    fromDate: string;
    toDate: string;
    note: string | null;
  }>;
  owner?: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
    createdAt: string;
  };
}

export interface VenueCardProps {
  imageUrl: string;
  venueName: string;
  venueLocation: string;
  guests: number;
  price: number;
  venueStatus: string;
}

export interface PendingVenueCardProps {
  id: string;
  imageUrl: string;
  venueName: string;
  venueLocation: string;
  capacity: number;
  price: number;
  owner: string;
  submittedOn: string;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}
