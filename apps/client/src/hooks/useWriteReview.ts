import { useMutation, useQueryClient } from "@tanstack/react-query";
import { WriteReviewBody } from "@bookmyvenue/types";
import { writeReview } from "@/lib/api/reviewApi";
import { useAuth } from "@clerk/nextjs";

export function useWriteReview() {
    const queryClient = useQueryClient();
    const { getToken } = useAuth();

    return useMutation({
        mutationFn: async (payload: WriteReviewBody) => {
            const token = await getToken();
            if (!token) throw new Error("Not authenticated");
            return writeReview(payload, token);
        },

        onSuccess: (_, payload) => {
            queryClient.invalidateQueries({ queryKey: ["review-status", String(payload.venueId)] });
            queryClient.invalidateQueries({ queryKey: ["venue", String(payload.venueId)] });
        },

        onError: (error: Error) => {
            console.log(error);
        },
    });
}
