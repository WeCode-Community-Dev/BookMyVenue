// Domain layer — Reviews
// Pure entity + business rule (eligibility).

export interface Review {
  id: string;
  user_id: string;
  venue_id: string;
  rating: number;
  feedback: string | null;
  created_at: string;
  updated_at: string;
}

/** Rating must be a 1–5 integer. */
export function isValidRating(rating: number): boolean {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

/** A user may review a venue only after a confirmed booking on it. */
export function canReviewVenue(hasConfirmedBooking: boolean): boolean {
  return hasConfirmedBooking;
}
