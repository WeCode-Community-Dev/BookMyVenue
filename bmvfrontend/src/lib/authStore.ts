"use client";

export interface UserSession {
  name: string;
  email: string;
  phone?: string;
  role: "customer" | "venue_owner" | "admin";
  isProfileCompleted?: boolean;
}

export interface Booking {
  id: string;
  venueId: string;
  venueName: string;
  venueImage: string;
  date: string;
  slot: "Morning" | "Evening" | "Full Day";
  guests: number;
  totalPrice: number;
  status: "Confirmed" | "Pending" | "Cancelled";
  bookingDate: string;
}

export const getSession = (): UserSession | null => {
  if (typeof window === "undefined") return null;
  const session = localStorage.getItem("bmv_session");
  return session ? JSON.parse(session) : null;
};

export const setSession = (user: UserSession) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("bmv_session", JSON.stringify(user));
};

export const clearSession = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("bmv_session");
};

export const getWishlist = (): string[] => {
  if (typeof window === "undefined") return [];
  const wishlist = localStorage.getItem("bmv_wishlist");
  return wishlist ? JSON.parse(wishlist) : [];
};

export const toggleWishlist = (venueId: string): string[] => {
  if (typeof window === "undefined") return [];
  const wishlist = getWishlist();
  const index = wishlist.indexOf(venueId);
  if (index > -1) {
    wishlist.splice(index, 1);
  } else {
    wishlist.push(venueId);
  }
  localStorage.setItem("bmv_wishlist", JSON.stringify(wishlist));
  return wishlist;
};

export const getBookings = (): Booking[] => {
  if (typeof window === "undefined") return [];
  const bookings = localStorage.getItem("bmv_bookings");
  return bookings ? JSON.parse(bookings) : [];
};

export const addBooking = (booking: Omit<Booking, "id" | "bookingDate" | "status">): Booking => {
  const bookings = getBookings();
  const newBooking: Booking = {
    ...booking,
    id: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
    bookingDate: new Date().toLocaleDateString(),
    status: "Confirmed"
  };
  bookings.push(newBooking);
  if (typeof window !== "undefined") {
    localStorage.setItem("bmv_bookings", JSON.stringify(bookings));
  }
  return newBooking;
};
