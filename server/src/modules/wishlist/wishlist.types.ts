export interface IWishlistItem {
  _id: string;
  userId: string;
  venueId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WishlistResponse {
  wishlisted: boolean;
}

export type WishlistStatusResponse = Record<string, boolean>;
