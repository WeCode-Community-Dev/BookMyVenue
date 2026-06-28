import { isPastDate, isSlotExpired } from "./formatDate";
import { getDisplayLabelForSlot } from "./predefinedSlots";

export const isCustomerBookableSlot = (slot) =>
  Boolean(slot?.isActive) &&
  !slot?.isBooked &&
  !isPastDate(slot.date) &&
  !isSlotExpired(slot);

export const filterCustomerBookableSlots = (slots) =>
  (slots ?? []).filter(isCustomerBookableSlot);

export const getCustomerAvailabilityEmptyState = (slots) => {
  const list = slots ?? [];

  if (list.length === 0) {
    return {
      title: "No availability yet",
      description:
        "This venue has not published any booking slots yet. Please check back later.",
    };
  }

  const futureSlots = list.filter((slot) => !isPastDate(slot.date));

  if (futureSlots.length === 0) {
    return {
      title: "No upcoming slots",
      description:
        "All listed slots are in the past. New dates may be added soon.",
    };
  }

  const openSlots = futureSlots.filter(
    (slot) => slot.isActive && !slot.isBooked && !isSlotExpired(slot)
  );

  if (openSlots.length === 0) {
    const allBooked = futureSlots.every((slot) => slot.isBooked);
    if (allBooked) {
      return {
        title: "Fully booked",
        description:
          "All upcoming slots are already reserved. Try another date or venue.",
      };
    }

    return {
      title: "No bookable slots",
      description:
        "Upcoming slots are inactive or unavailable right now. Please check back later.",
    };
  }

  return null;
};

export const formatSlotSummary = (slot) => {
  if (!slot) return null;

  return {
    date: slot.date,
    label: getDisplayLabelForSlot(slot),
    timeRange: [slot.startTime, slot.endTime].filter(Boolean).join(" – "),
    slotId: slot._id,
  };
};

export const findSlotById = (slots, slotId) =>
  (slots ?? []).find((slot) => slot._id === slotId);

export const isSlotStillBookable = (slots, selectedSlot) => {
  if (!selectedSlot?._id) return false;
  const current = findSlotById(slots, selectedSlot._id);
  return current && isCustomerBookableSlot(current);
};

const BOOKING_CONTEXT_KEY = "bmv_booking_context";

export const saveBookingContext = (venueId, slotId) => {
  if (!venueId || !slotId) return;
  try {
    sessionStorage.setItem(
      BOOKING_CONTEXT_KEY,
      JSON.stringify({ venueId, slotId, savedAt: Date.now() })
    );
  } catch {
    // Ignore storage errors
  }
};

export const loadBookingContext = (venueId) => {
  try {
    const raw = sessionStorage.getItem(BOOKING_CONTEXT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.venueId !== venueId) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const clearBookingContext = () => {
  try {
    sessionStorage.removeItem(BOOKING_CONTEXT_KEY);
  } catch {
    // Ignore
  }
};
