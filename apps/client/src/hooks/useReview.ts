import { fetchVenueReviewStatus } from "@/lib/api/reviewApi";
import { useQuery } from "@tanstack/react-query";

export const useGetVenueReviewStatus = (venueId: string, token: string) => {
    return useQuery({
        queryKey: ["venue-review-status", venueId],
        queryFn: () => fetchVenueReviewStatus(venueId, token),
        enabled: !!token,
    });
};
