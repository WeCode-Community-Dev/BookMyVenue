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
