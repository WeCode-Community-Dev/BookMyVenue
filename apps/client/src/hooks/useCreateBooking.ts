import { createBooking } from "@/lib/api/bookingApi";
import { CreateBookingBody } from "@bookmyvenue/types";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";

export const useCreateBooking = () => {
    const { getToken } = useAuth();

    return useMutation({
        mutationFn: async (payload: CreateBookingBody) => {
            const token = await getToken();
            if (!token) throw new Error("Not authenticated");
            return createBooking(payload, token);
        },
    });
};
