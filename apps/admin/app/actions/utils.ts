import { Prisma } from "@bookmyvenue/database";
import { Venue } from "./venue";
import { Owner, Customer } from "./user";
import { Booking } from "./booking";

export const SELECT_VENUE = {
    id: true,
    name: true,
    description: true,
    location: true,
    district: true,
    category: true,
    capacity: true,
    images: true,
    amenities: true,
    isActive: true,
    verificationStatus: true,
    createdAt: true,
    owner: { select: { email: true } },
    sessions: {
        select: {
            id: true,
            label: true,
            startTime: true,
            endTime: true,
            price: true,
            isActive: true,
        },
        orderBy: { price: "asc" as const },
    },
    reviews: { select: { rating: true } },
    _count: { select: { bookings: true } },
} as const;

export type MappedVenues = Prisma.VenueGetPayload<{
    select: typeof SELECT_VENUE;
}>;

export const mapVenue = (v: MappedVenues): Venue => {
    return {
        id: String(v.id),
        name: v.name,
        description: v.description,
        owner: v.owner.email,
        location: v.location,
        district: v.district,
        category: v.category,
        capacity: v.capacity,
        isActive: v.isActive,
        status: v.verificationStatus,
        submitted: v.createdAt.toISOString().split("T")[0]!,
        rating: v.reviews.length ? v.reviews.reduce((sum, r) => sum + r.rating, 0) / v.reviews.length : 0,
        bookings: v._count.bookings,
        images: v.images,
        amenities: v.amenities,
        sessions: v.sessions,
    };
};

export const SELECT_OWNER = {
    id: true,
    email: true,
    name: true,
    role: true,
    createdAt: true,
    _count: { select: { venues: true } },
} as const;

export type MappedOwner = Prisma.UserGetPayload<{
    select: typeof SELECT_OWNER;
}>;

export const mapOwner = (u: MappedOwner): Owner => {
    return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        joined: u.createdAt.toISOString().split("T")[0]!,
        venues: u._count.venues,
    };
};

export const SELECT_CUSTOMER = {
    id: true,
    email: true,
    name: true,
    role: true,
    createdAt: true,
    _count: { select: { bookings: true } },
} as const;

export type MappedCustomer = Prisma.UserGetPayload<{
    select: typeof SELECT_CUSTOMER;
}>;

export const mapCustomer = (u: MappedCustomer): Customer => {
    return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        joined: u.createdAt.toISOString().split("T")[0]!,
        bookings: u._count.bookings,
    };
};

export const SELECT_BOOKING = {
    id: true,
    purpose: true,
    status: true,
    user: {
        select: {
            name: true,
            email: true,
        },
    },
    venue: {
        select: {
            name: true,
            category: true,
            owner: {
                select: {
                    name: true,
                },
            },
        },
    },
    bookingSessions: {
        include: {
            session: true,
        },
    },
};

export type MappedBookings = Prisma.BookingGetPayload<{
    select: typeof SELECT_BOOKING;
}>;

export type BookingSession = MappedBookings["bookingSessions"][number];


export const mapBooking = (b: MappedBookings): Booking => {
    return {
        id: b.id,
        client: b.user.name ?? "",
        venue: b.venue.name,
        owner: b.venue.owner.name ?? "",
        date: b.bookingSessions[0]?.eventDate.toISOString().split("T")[0] ?? "",
        category: b.venue.category,
        purpose: b.purpose ?? "",
        amount: b.bookingSessions.reduce(
            (sum: number, session: BookingSession) => sum + session.pricePaid,
            0,
        ),
        status: b.status,
    };
};
