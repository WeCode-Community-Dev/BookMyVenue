export type BookingStatus = "CONFIRMED" | "CANCELED" | "PENDING" | "REFUNDED";

export interface VenueBooking {
  _id: string;
  venue: string;
  customer: { _id: string; name: string } | null;
  startTime: string;
  endTime: string;
  totalAmount: number;
  bookingStatus: BookingStatus;
  createdAt: string;
  updatedAt: string;
}
