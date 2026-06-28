import { resolvePopulatedRef } from "./booking";
import { isPastDate } from "./formatDate";

export const BOOKING_FILTERS = [
  { id: "all", label: "All" },
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

const parseTimeOnDate = (date, time) => {
  if (!date || !time) return null;

  const base = new Date(date);
  if (Number.isNaN(base.getTime())) return null;

  const match = String(time).trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/i);

  if (match) {
    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const meridiem = match[3]?.toLowerCase();

    if (meridiem === "pm" && hours < 12) hours += 12;
    if (meridiem === "am" && hours === 12) hours = 0;

    base.setHours(hours, minutes, 0, 0);
    return base;
  }

  base.setHours(23, 59, 59, 999);
  return base;
};

export const getBookingCategory = (booking) => {
  if (booking?.bookingStatus === "cancelled") return "cancelled";

  const slot = resolvePopulatedRef(booking?.availabilityId);

  if (!slot?.date) return "upcoming";

  const endAt = parseTimeOnDate(slot.date, slot.endTime);
  const compareAt = endAt ?? new Date(slot.date);

  if (endAt) {
    return compareAt < new Date() ? "completed" : "upcoming";
  }

  return isPastDate(slot.date) ? "completed" : "upcoming";
};

export const getBookingStats = (bookings) => {
  const stats = {
    total: bookings.length,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
  };

  bookings.forEach((booking) => {
    const category = getBookingCategory(booking);
    stats[category] += 1;
  });

  return stats;
};

export const getVenueTitle = (booking) => {
  const venue = resolvePopulatedRef(booking?.venueId);
  return venue?.title?.trim() || "";
};

export const filterBookings = (bookings, { statusFilter = "all", searchQuery = "" } = {}) => {
  const query = searchQuery.trim().toLowerCase();

  return bookings.filter((booking) => {
    const category = getBookingCategory(booking);

    if (statusFilter !== "all" && category !== statusFilter) {
      return false;
    }

    if (!query) return true;

    return getVenueTitle(booking).toLowerCase().includes(query);
  });
};

export const getBookingDisplayStatus = (booking) => {
  const category = getBookingCategory(booking);

  if (category === "cancelled") {
    return { label: "Cancelled", tone: "cancelled" };
  }

  if (category === "completed") {
    return { label: "Completed", tone: "completed" };
  }

  return { label: "Upcoming", tone: "upcoming" };
};
