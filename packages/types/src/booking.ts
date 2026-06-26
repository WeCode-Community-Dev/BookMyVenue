import { BookingStatus, District } from "@bookmyvenue/database";

export interface CreateBookingBody {
    venueId: number;
    sessionIds: number[];
    eventDate: string;
    phone: string;
    purpose?: string;
}

export interface GetBookingQuery {
    status?: BookingStatus;
    page?: number;
    limit?: number;
}

export type OwnerBookingResponse = {
    bookings: OwnerBooking[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
};

export type OwnerBooking = {
    id: string;
    status: BookingStatus;
    phone: string | null;
    purpose: string | null;
    createdAt: Date;

    customer: {
        id: string;
        name: string | null;
        email: string;
    };

    venue: {
        id: number;
        name: string;
        location: string;
        district: District;
    };

    totalAmount: number;

    sessions: {
        eventDate: Date;
        pricePaid: number;
        session: {
            id: number;
            label: string;
            startTime: string;
            endTime: string;
        };
    }[];
};
