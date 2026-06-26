export interface CreateBookingBody {
    venueId: number;
    sessionIds: number[];
    eventDate: string;
    phone: string;
    purpose?: string;
}
