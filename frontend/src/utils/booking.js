export const resolvePopulatedRef = (ref) =>
  ref && typeof ref === "object" && !Array.isArray(ref) ? ref : null;

const hasValue = (value) =>
  value !== undefined && value !== null && String(value).trim() !== "";

/**
 * Builds a client-side booking snapshot from loaded venue + selected slot.
 * Returns null when required data is missing or invalid.
 */
export const buildBookingPayload = (venue, selectedSlot) => {
  if (!venue || !selectedSlot) return null;

  const venueId = venue._id;
  const slotId = selectedSlot._id;
  const price = Number(venue.price);

  if (!hasValue(venueId) || !hasValue(slotId)) return null;
  if (!Number.isFinite(price) || price < 0) return null;

  return {
    venueId,
    slotId,
    date: selectedSlot.date ?? null,
    startTime: selectedSlot.startTime ?? null,
    endTime: selectedSlot.endTime ?? null,
    price,
    pricingUnit: venue.pricingUnit ?? "",
  };
};

/**
 * Validates a booking payload before it reaches the payment layer.
 */
export const validateBookingPayload = (payload) => {
  if (!payload) {
    return { valid: false, error: "Please select a slot to continue." };
  }

  if (!hasValue(payload.venueId)) {
    return {
      valid: false,
      error: "Venue information is missing. Please refresh and try again.",
    };
  }

  if (!hasValue(payload.slotId)) {
    return {
      valid: false,
      error: "Please select a valid time slot.",
    };
  }

  const price = Number(payload.price);

  if (!Number.isFinite(price) || price < 0) {
    return {
      valid: false,
      error:
        "This venue has invalid pricing and cannot be booked right now.",
    };
  }

  return { valid: true, error: "" };
};

/**
 * Maps booking payload to create-order / verify-payment body shape.
 * Throws if payload is invalid — callers should validate first for UI errors.
 */
export const toPaymentRequestBody = (payload) => {
  const validation = validateBookingPayload(payload);

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return {
    venueId: payload.venueId,
    availabilityId: payload.slotId,
  };
};
