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

export type BookingListItem = {
  id: string;
  bookingNumber: string;
  startAt: string;
  endAt: string;
  status: BookingStatus;
  guests: number | null;
  amount: string;
  currency: string;
  pricingType: PricingType;
  customer: {
    firstName: string;
    lastName: string | null;
  };
  venue: {
    id: string;
    name: string;
  };
  space: {
    id: string;
    name: string;
  };
};

export type BookingSortField =
  | "bookingNumber"
  | "startAt"
  | "amount"
  | "guests"
  | "status"
  | "createdAt";

export type OwnerBookingsQuery = {
  sortBy?: BookingSortField;
  sortOrder?: "asc" | "desc";
  status?: BookingStatus;
  upcoming?: boolean;
  page?: number;
  limit?: number;
};

function buildBookingsQueryString(query: OwnerBookingsQuery = {}): string {
  const params = new URLSearchParams();

  if (query.sortBy) params.set("sortBy", query.sortBy);
  if (query.sortOrder) params.set("sortOrder", query.sortOrder);
  if (query.status) params.set("status", query.status);
  if (query.upcoming) params.set("upcoming", "true");
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

function redirectToLogin(): never {
  const returnUrl = window.location.pathname + window.location.search;
  window.location.href = `/login?returnUrl=${encodeURIComponent(returnUrl)}`;
  throw new Error("Redirecting to login");
}

function getAccessToken(): string {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    redirectToLogin();
  }
  return accessToken;
}

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

export async function createBooking(
  payload: CreateBookingPayload,
): Promise<CreateBookingResponse> {
  try {
    const accessToken = getAccessToken();

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

export async function getBookings(): Promise<BookingListItem[]> {
  return getOwnerBookings({ upcoming: true });
}

export async function getOwnerBookings(
  query: OwnerBookingsQuery = {},
): Promise<BookingListItem[]> {
  try {
    const accessToken = getAccessToken();
    const queryString = buildBookingsQueryString(query);

    return apiFetch(`/bookings${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
