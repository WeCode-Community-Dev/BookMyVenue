import { createClient } from '../client'

export interface Review {
  id: string
  venue_id: string
  booking_id: string
  user_id: string
  rating: number
  title: string | null
  comment: string
  is_hidden: boolean
  created_at: string
  updated_at: string
  user_name: string | null
  user_email: string | null
  venue_name: string | null
  hidden_reason: string | null
  hidden_by: string | null
  hidden_at: string | null
}

export interface ReviewStats {
  total: number
  visible: number
  hidden: number
  average_rating: number
}

export interface ReviewListResponse {
  items: Review[]
  total: number
  page: number
  per_page: number
  stats: ReviewStats | null
}

export interface EligibleBookingsResponse {
  booking_ids: string[]
}

export interface ReviewSummary {
  average_rating: number
  total_reviews: number
  rating_distribution: Record<string, number>
}

export interface ReviewCreate {
  rating: number
  title?: string | null
  comment: string
}

export interface ReviewUpdate {
  rating?: number
  title?: string | null
  comment?: string
}

export interface AdminReviewFilters {
  venue_id?: string
  user_id?: string
  rating?: number
  is_hidden?: boolean
  include_deleted?: boolean
}

export function reviewsEndpoints(client: ReturnType<typeof createClient>) {
  return {
    /**
     * Get public reviews for a venue (paginated)
     */
    getVenueReviews: async (
      venueId: string,
      page: number = 1,
      perPage: number = 10
    ): Promise<ReviewListResponse> => {
      return client.get(`/api/venues/${venueId}/reviews?page=${page}&per_page=${perPage}`)
    },

    /**
     * Get all reviews across all venues for the logged-in owner
     */
    getOwnerReviews: async (
      page: number = 1,
      perPage: number = 100
    ): Promise<ReviewListResponse> => {
      return client.get(`/api/owner/reviews?page=${page}&per_page=${perPage}`)
    },

    /**
     * Get rating summary (average, count, distribution) for a venue
     */
    getRatingSummary: async (venueId: string): Promise<ReviewSummary> => {
      return client.get(`/api/venues/${venueId}/reviews/summary`)
    },

    /**
     * Get booking IDs eligible for review at a venue
     */
    getEligibleBookingIds: async (venueId: string): Promise<EligibleBookingsResponse> => {
      return client.get(`/api/venues/${venueId}/reviews/eligible-bookings`)
    },

    /**
     * Get a single public review by ID
     */
    getReview: async (reviewId: string): Promise<Review> => {
      return client.get(`/api/reviews/${reviewId}`)
    },

    /**
     * Create a new review for a venue (requires completed booking)
     */
    createReview: async (venueId: string, payload: ReviewCreate): Promise<Review> => {
      return client.post(`/api/venues/${venueId}/reviews`, payload)
    },

    /**
     * Update your own review (rating, title, comment only)
     */
    updateReview: async (reviewId: string, payload: ReviewUpdate): Promise<Review> => {
      return client.patch(`/api/reviews/${reviewId}`, payload)
    },

    /**
     * Soft delete your own review
     */
    deleteReview: async (reviewId: string): Promise<void> => {
      return client.delete(`/api/reviews/${reviewId}`)
    },

    // ────────────────────────────────────────────────────────────
    // Admin endpoints
    // ────────────────────────────────────────────────────────────

    /**
     * List all reviews with optional filters (admin only)
     */
    listAllReviews: async (
      filters: AdminReviewFilters = {},
      page: number = 1,
      perPage: number = 10
    ): Promise<ReviewListResponse> => {
      const params = new URLSearchParams()
      params.append('page', String(page))
      params.append('per_page', String(perPage))

      if (filters.venue_id) params.append('venue_id', filters.venue_id)
      if (filters.user_id) params.append('user_id', filters.user_id)
      if (filters.rating !== undefined) params.append('rating', String(filters.rating))
      if (filters.is_hidden !== undefined) params.append('is_hidden', String(filters.is_hidden))
      if (filters.include_deleted) params.append('include_deleted', 'true')

      return client.get(`/api/admin/reviews?${params.toString()}`)
    },

    /**
     * Get a single review (admin can see hidden/deleted) (admin only)
     */
    getAdminReview: async (reviewId: string): Promise<Review> => {
      return client.get(`/api/admin/reviews/${reviewId}`)
    },

    /**
     * Hide a review (admin only)
     */
    hideReview: async (reviewId: string, hiddenReason?: string): Promise<Review> => {
      return client.patch(`/api/admin/reviews/${reviewId}/hide`, {
        hidden_reason: hiddenReason,
      })
    },

    /**
     * Restore a hidden review (admin only)
     */
    restoreReview: async (reviewId: string): Promise<Review> => {
      return client.patch(`/api/admin/reviews/${reviewId}/restore`, {})
    },

    /**
     * Hard delete a review (admin only, permanent)
     */
    deleteReviewAdmin: async (reviewId: string): Promise<void> => {
      return client.delete(`/api/admin/reviews/${reviewId}`)
    },
  }
}