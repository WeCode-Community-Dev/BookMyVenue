import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createReviewRequest,
  deleteReviewRequest,
  getVenueReviews,
  updateReviewRequest,
} from "@/api/review-api";

export const venueReviewsKey = (venueId: string) => ["venue-reviews", venueId];

export const useVenueReviews = (venueId: string) =>
  useQuery({
    queryKey: venueReviewsKey(venueId),
    queryFn: () => getVenueReviews(venueId),
    enabled: Boolean(venueId),
  });

export const useCreateReview = () => useMutation({ mutationFn: createReviewRequest });

export const useUpdateReview = () => useMutation({ mutationFn: updateReviewRequest });

export const useDeleteReview = () => useMutation({ mutationFn: deleteReviewRequest });
