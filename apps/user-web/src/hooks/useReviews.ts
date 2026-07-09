import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient, reviewsEndpoints } from '@venue404/api-client'
import { Review, ReviewListResponse, ReviewSummary } from '../types'

const client = createClient()
const reviews = reviewsEndpoints(client)

export function useVenueReviews(venueId: string | undefined) {
  const [page, setPage] = useState(1)
  const perPage = 10

  const {
    data: reviewsData,
    isLoading,
    isError,
    refetch,
  } = useQuery<ReviewListResponse>({
    queryKey: ['venue-reviews', venueId, page],
    queryFn: () => reviews.getVenueReviews(venueId!, page, perPage),
    enabled: !!venueId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return {
    reviews: reviewsData?.items || [],
    total: reviewsData?.total || 0,
    page,
    perPage,
    isLoading,
    isError,
    setPage,
    refetch,
  }
}

export function useReviewSummary(venueId: string | undefined) {
  const {
    data: summary,
    isLoading,
    isError,
  } = useQuery<ReviewSummary>({
    queryKey: ['review-summary', venueId],
    queryFn: () => reviews.getRatingSummary(venueId!),
    enabled: !!venueId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  return {
    summary,
    isLoading,
    isError,
  }
}

export function useEligibleBookings(venueId: string | undefined) {
  const {
    data: eligibleData,
    isLoading,
    isError,
  } = useQuery<string[]>({
    queryKey: ['eligible-bookings', venueId],
    queryFn: () => reviews.getEligibleBookingIds(venueId!).then((res) => res.booking_ids),
    enabled: !!venueId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  return {
    eligibleBookingIds: eligibleData || [],
    isLoading,
    isError,
  }
}

export function useCreateReview(venueId: string | undefined) {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: ({
      rating,
      title,
      comment,
    }: {
      rating: number
      title: string | null
      comment: string
    }) => reviews.createReview(venueId!, { rating, title, comment }),
    onSuccess: () => {
      // Invalidate both reviews list and summary
      queryClient.invalidateQueries({ queryKey: ['venue-reviews', venueId] })
      queryClient.invalidateQueries({ queryKey: ['review-summary', venueId] })
      queryClient.invalidateQueries({ queryKey: ['eligible-bookings', venueId] })
    },
  })

  return {
    createReview: mutateAsync,
    isPending,
    error: error?.message || null,
  }
}

// `reviewId` used to be a *hook* argument here, bound once when the
// component mounted. That only works if there's a single fixed review
// being edited for the lifetime of the hook — but VenueReviews renders a
// whole list, and any row's Edit button can be clicked. There's no value
// to bind at hook-call time, which is exactly why callers were passing
// `undefined`. The id now travels with each `mutateAsync` call instead,
// where it's actually known.
export function useUpdateReview() {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: ({
      reviewId,
      rating,
      title,
      comment,
    }: {
      reviewId: string
      rating?: number
      title?: string | null
      comment?: string
    }) => reviews.updateReview(reviewId, { rating, title, comment }),
    onSuccess: (updated) => {
      // Invalidate reviews and summary
      if (updated.venue_id) {
        queryClient.invalidateQueries({ queryKey: ['venue-reviews', updated.venue_id] })
        queryClient.invalidateQueries({ queryKey: ['review-summary', updated.venue_id] })
        queryClient.invalidateQueries({ queryKey: ['eligible-bookings', updated.venue_id] })
      }
    },
  })

  return {
    updateReview: mutateAsync,
    isPending,
    error: error?.message || null,
  }
}

// Same fix as useUpdateReview — reviewId now travels with the call.
export function useDeleteReview() {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (reviewId: string) => reviews.deleteReview(reviewId),
    onSuccess: () => {
      // Clear cache of all reviews
      queryClient.invalidateQueries({ queryKey: ['venue-reviews'] })
      queryClient.invalidateQueries({ queryKey: ['review-summary'] })
      queryClient.invalidateQueries({ queryKey: ['eligible-bookings'] })
    },
  })

  return {
    deleteReview: mutateAsync,
    isPending,
    error: error?.message || null,
  }
}
