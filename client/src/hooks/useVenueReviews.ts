import { useState, useCallback } from 'react';
import * as reviewService from '@/services/reviewService';
import type { Review, ReviewsResponse } from '@/services/reviewService';

export interface UseVenueReviewsReturn {
  reviews: Review[];
  pagination: ReviewsResponse['pagination'] | null;
  isLoading: boolean;
  error: string | null;
  fetchReviews: (venueId: string, page?: number) => Promise<void>;
}

export function useVenueReviews(): UseVenueReviewsReturn {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pagination, setPagination] = useState<ReviewsResponse['pagination'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async (venueId: string, page: number = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await reviewService.getVenueReviews(venueId, page);
      setReviews(response.reviews);
      setPagination(response.pagination);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch reviews';
      setError(errorMsg);
      console.error('useVenueReviews error:', errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    reviews,
    pagination,
    isLoading,
    error,
    fetchReviews,
  };
}
