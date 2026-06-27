import { useQuery } from "@tanstack/react-query";
import { getMyBookings, getVenueBookings } from "@/api/booking-api";

export const useVenueBookings = (venueId: string) =>
  useQuery({
    queryKey: ["venue-bookings", venueId],
    queryFn: () => getVenueBookings(venueId),
    enabled: Boolean(venueId),
  });

export const useMyBookings = () =>
  useQuery({
    queryKey: ["my-bookings"],
    queryFn: getMyBookings,
  });
