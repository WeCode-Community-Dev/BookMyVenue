import { fetchOwnerDashboard } from "@/lib/api/bookingApi";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

export const useOwnerDashboard = () => {
    const { getToken } = useAuth();

    return useQuery({
        queryKey: ["owner-dashboard"],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error("Unauthorized");
            return fetchOwnerDashboard(token);
        },
    });
};
