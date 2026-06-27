export type VenueStatus = "active" | "inactive";

// export type Venue = {
//   id: string;
//   name: string;
//   address: string;
//   spaces?: number;
//   bookings?: number;
//   status?: VenueStatus;
//   image: {id: string, url: string, altText: string};
// };

export const venuesSummary = {
  totalVenues: 12,
  activeBookings: 48,
  totalSpaces: 34,
};

export type Amenity = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type VenueAmenity = {
  venueId: string;
  amenityId: string;
  amenity: Amenity;
};

export type Image = {
  id: string;
  url: string;
  altText: string;
  width: number | null;
  height: number | null;
  createdAt: string;
};

export type VenueImage = {
  venueId: string;
  imageId: string;
  sortOrder: number;
  isCover: boolean;
  image: Image;
};

export type Space = {
  id: string;
  venueId: string;
  categoryId: string;
  name: string;
  description: string | null;
  capacityValue: string | null;
  capacityType: CapacityType | null;
  isActive: boolean;
  rules: string | null;
  createdAt: string;
  updatedAt: string;
  category: Category;
  amenities: SpaceAmenity[];
  images: SpaceImage[];
}

export type Category = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export type SpaceAmenity = {
  spaceId: string;
  amenityId: string;
  amenity: Amenity;
}


export type SpaceImage = {
  spaceId: string;
  imageId: string;
  sortOrder: number;
  isCover: boolean;
  image: Image;
}


export enum CapacityType {
  PEOPLE = 'PEOPLE',
  // Add other values from your backend enum
  // SEATS = 'SEATS',
  // TABLES = 'TABLES',
}

export type VenueDetails = {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: string;
  longitude: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
  amenities: VenueAmenity[];
  images: VenueImage[];
  spaces: Space[];
};

