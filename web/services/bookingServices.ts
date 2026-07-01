import { apiFetch } from "./api";
import type { PricingType } from "./venueServices";

export type { PricingType };

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "REJECTED"
  | "CANCELLED"
  | "COMPLETED";

export type CreateBookingPayload = {
  spaceId: string;
  startAt: string;
  endAt: string;
  pricingType: PricingType;
  guests?: number;
  specialRequest?: string;
};

export type CreateBookingResponse = {
  success: true;
  data: {
    id: string;
    bookingNumber: string;
    status: BookingStatus;
    startAt: string;
    endAt: string;
    amount: string;
    currency: string;
    spaceId: string;
    venueId: string;
  };
};

function parseTimeParts(time: string): { hours: number; minutes: number } {
  const [hours, minutes] = time.split(":").map(Number);
  return { hours, minutes };
}

export function buildBookingIsoRange(
  selectedDate: Date,
  range: { start: string; end: string },
): { startAt: string; endAt: string } {
  const startAt = new Date(selectedDate);
  const endAt = new Date(selectedDate);

  const startParts = parseTimeParts(range.start);
  const endParts = parseTimeParts(range.end);

  startAt.setHours(startParts.hours, startParts.minutes, 0, 0);
  endAt.setHours(endParts.hours, endParts.minutes, 0, 0);

  return {
    startAt: startAt.toISOString(),
    endAt: endAt.toISOString(),
  };
}

function redirectToLogin(): never {
  const returnUrl = window.location.pathname + window.location.search;
  window.location.href = `/login?returnUrl=${encodeURIComponent(returnUrl)}`;
  throw new Error("Redirecting to login");
}

export async function createBooking(
  payload: CreateBookingPayload,
): Promise<CreateBookingResponse> {
  try {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    redirectToLogin();
  }

  return apiFetch("/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
