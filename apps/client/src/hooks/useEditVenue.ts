import { editVenueAPI } from "@/lib/api/venueApi";
import { EditVenueBody } from "@bookmyvenue/types";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useEditVenue() {
    const queryClient = useQueryClient();
    const { getToken } = useAuth();

    return useMutation({
        mutationFn: async ({ id, payload }: { id: number; payload: EditVenueBody }) => {
            const token = await getToken();
            if (!token) throw new Error("Not authenticated");

            return editVenueAPI(id, payload, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["owner-venues"],
            });
        },
    });
}
