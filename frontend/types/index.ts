export interface Venue {
  id: string;
  name: string;
  city: string;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  thumbnail: string;
  capacity: number;
  category: string;
  categories?: string[];

  // Detailed fields
  description?: string;
  address?: string;
  images?: string[];
  amenities?: string[];
  rules?: string[];
  similarVenueIds?: string[];
  owner?: {
    name: string;
    avatar: string;
    verified: boolean;
    hostingSince: string;
    responseTime: string;
    responseRate: string;
    languages: string[];
    bio: string;
  };
  reviews?: {
    id: string;
    userName: string;
    avatar: string;
    rating: number;
    date: string;
    text: string;
  }[];

  // Search fields
  area?: string;
  verified?: boolean;
  favorite?: boolean;
  latitude?: number;
  longitude?: number;
}
