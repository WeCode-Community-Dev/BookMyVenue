import { useQuery } from "@tanstack/react-query";
import { getVenueBookings } from "@/api/booking-api";

export const useVenueBookings = (venueId: string) =>
  useQuery({
    queryKey: ["venue-bookings", venueId],
    queryFn: () => getVenueBookings(venueId),
    enabled: Boolean(venueId),
  });
