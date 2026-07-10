export interface BookingDetails {
  venueId: string;
  startDateTime: string | null;
  endDateTime: string | null;
  guests: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  specialRequests: string;
}
