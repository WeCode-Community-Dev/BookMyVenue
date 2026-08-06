import { deleteVenue } from "@/lib/api/venueApi";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteVenue() {
    const queryClient = useQueryClient();
    const { getToken } = useAuth();

    return useMutation({
        mutationFn: async (venueId: number) => {
            const token = await getToken();
            if (!token) throw new Error("Not authenticated");

            return deleteVenue(venueId, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["owner-venues"],
            });
        },
    });
}
