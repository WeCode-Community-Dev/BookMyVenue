export interface WishlistResponse {
  wishlisted: boolean;
}

export interface WishlistStatusResponse {
  [venueId: string]: boolean;
}

export interface WishlistVenue {
  _id: string;
  name: string;
  city: string;
  district: string;
  coverImage: string;
  maxCapacity?: number;
  avgRating: number;
  reviewCount: number;
}

export interface WishlistPagination {
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface WishlistListResponse {
  venues: WishlistVenue[];
  pagination: WishlistPagination;
}
