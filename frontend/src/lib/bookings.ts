// ── Booking types & localStorage persistence ──────────────────

export type BookingStatus = "confirmed" | "pending" | "cancelled";

export interface Booking {
  id: string;
  venueId: string;
  venueName: string;
  venueLocation: string;
  venueImage: string;
  date: string; // ISO date string YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  guestCount: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
}

export interface CreateBookingInput {
  venueId: string;
  venueName: string;
  venueLocation: string;
  venueImage: string;
  date: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  pricePerHour: number;
}

const BOOKINGS_KEY = "bmv_bookings";

function loadBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(BOOKINGS_KEY) ?? "[]") as Booking[];
  } catch {
    return [];
  }
}

function saveBookings(bookings: Booking[]): void {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

function calcHours(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const diff = (eh * 60 + em - (sh * 60 + sm)) / 60;
  return Math.max(diff, 1);
}

export function createBooking(input: CreateBookingInput): Booking {
  const hours = calcHours(input.startTime, input.endTime);
  const totalPrice = Math.round(hours * input.pricePerHour);

  const booking: Booking = {
    id: `bk_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    venueId: input.venueId,
    venueName: input.venueName,
    venueLocation: input.venueLocation,
    venueImage: input.venueImage,
    date: input.date,
    startTime: input.startTime,
    endTime: input.endTime,
    guestCount: input.guestCount,
    totalPrice,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  const bookings = loadBookings();
  bookings.unshift(booking);
  saveBookings(bookings);
  return booking;
}

export function getMyBookings(): Booking[] {
  return loadBookings();
}

export function cancelBooking(id: string): void {
  const bookings = loadBookings().map((b) =>
    b.id === id ? { ...b, status: "cancelled" as BookingStatus } : b
  );
  saveBookings(bookings);
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
