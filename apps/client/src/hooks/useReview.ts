import { fetchVenueReviewStatus, getReviews } from "@/lib/api/reviewApi";
import { useQuery } from "@tanstack/react-query";

export const useGetVenueReviewStatus = (venueId: string, token: string) => {
    return useQuery({
        queryKey: ["review-status", venueId],
        queryFn: () => fetchVenueReviewStatus(venueId, token),
        enabled: !!token,
    });
};

export const useGetReviews = (venueId: number, page = 1, limit = 10) => {
    return useQuery({
        queryKey: ["reviews", venueId, page, limit],
        queryFn: () => getReviews(venueId, page, limit),
        enabled: !!venueId,
    });
};
