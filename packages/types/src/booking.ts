import { BookingStatus, District, VerificationStatus } from "@bookmyvenue/database";

export type CreateBookingBody = {
    venueId: number;
    sessionIds: number[];
    eventDate: string;
    phone: string;
    purpose?: string;
};

export type TypeOfBooking = "UPCOMING" | "HISTORY";

export type GetOwnerBookingQuery = {
    status?: BookingStatus;
    page?: number;
    limit?: number;
    type?: TypeOfBooking;
};

export type GetUserBookingQuery = GetOwnerBookingQuery & { today: string };

export type OwnerBookingResponse = {
    bookings: OwnerBooking[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
};

export type OwnerDashboardVenue = {
    id: number;
    name: string;
    images: string;
    location: string;
    isActive: boolean;
    verificationStatus: VerificationStatus;
    bookingCount: number;
};

export type OwnerDashboardBooking = {
    id: string;
    status: BookingStatus;
    user: { name: string };
    venue: { name: string };
    eventDate: Date;
    totalAmount: number;
};

export type OwnerDashboardStats = {
    totalRevenue: number;
    totalBookings: number;
    confirmedBookings: number;
    activeVenues: number;
    totalVenues: number;
};

export type OwnerDashboardResponse = {
    stats: OwnerDashboardStats;
    venues: OwnerDashboardVenue[];
    recentBookings: OwnerDashboardBooking[];
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

export interface BookingCreatedEvent {
    bookingId: number;
    eventDate: string;
    purpose: string;
    phone: string;

    venue: {
        id: number;
        name: string;
    };

    user: {
        id: string;
        email: string;
        name: string;
    };

    owner: {
        id: string;
        email: string;
        name: string;
    };

    sessions: Array<{
        sessionId: number;
        pricePaid: number;
    }>;
}
