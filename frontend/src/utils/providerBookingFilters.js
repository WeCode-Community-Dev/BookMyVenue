import { resolvePopulatedRef } from "./booking";
import {
  filterBookings,
  getBookingStats,
  getVenueTitle,
} from "./bookingFilters";

export { getBookingStats };

export const filterProviderBookings = (
  bookings,
  { statusFilter = "all", searchQuery = "" } = {}
) => {
  const query = searchQuery.trim().toLowerCase();

  if (!query) {
    return filterBookings(bookings, { statusFilter, searchQuery: "" });
  }

  return filterBookings(bookings, { statusFilter, searchQuery: "" }).filter(
    (booking) => {
      const customer = resolvePopulatedRef(booking?.userId);
      const haystack = [
        customer?.name,
        customer?.email,
        customer?.phone,
        getVenueTitle(booking),
        booking?.bookingReference,
        booking?._id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    }
  );
};
