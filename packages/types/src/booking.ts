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
        name: string | null;
        email: string;
    };

    venue: {
        name: string;
    };

    totalAmount: number;

    sessions: {
        eventDate: Date;
        pricePaid: number;
        session: {
            label: string;
        };
    }[];
};
export type UserBookingsResponse = {
    bookings: UserBooking[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
};

export type UserBooking = {
    id: string;
    status: BookingStatus;
    phone: string | null;
    purpose: string | null;
    createdAt: Date;

    venue: {
        name: string;
        district: District;
        location: string;
    };

    totalAmount: number;

    sessions: {
        eventDate: Date;
        pricePaid: number;
        session: {
            label: string;
            startTime: string;
            endTime: string;
        };
    }[];
};