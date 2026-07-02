import {  Prisma, prisma } from "@bookmyvenue/database";


export const VENUE_LIST_SELECT = {
    id: true,
    name: true,
    description: true,
    capacity: true,
    images: true,
    amenities: true,
    category: true,
    location: true,
    district: true,
    createdAt: true,
    sessions: {
        where: { isActive: true },
        select: {
            id: true,
            label: true,
            startTime: true,
            endTime: true,
            price: true,
        },
    },
    reviews: {
        select: { rating: true },
    },
} satisfies Prisma.VenueSelect;

export const OWNER_VENUE_LIST_SELECT = {
    ...VENUE_LIST_SELECT,
    verificationStatus: true,
    verificationReason: true,
    isActive: true,
    sessions: {
        select: {
            id: true,
            label: true,
            startTime: true,
            endTime: true,
            price: true,
            isActive: true,
        },
    },
    _count: {
        select: {
            bookings: true,
        },
    },
} satisfies Prisma.VenueSelect;

export const getPagination = (page = 1, limit = 10) => {
    const take = Math.min(Number(limit), 50);
    return {
        take,
        skip: (Number(page) - 1) * take,
    };
};

const withRating = <T extends { reviews: { rating: number }[] }>(venue: T) => {
    const { reviews, ...rest } = venue;

    return {
        ...rest,
        averageRating: reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null,
        reviewCount: reviews.length,
    };
};

export const fromSmallUnit = (amount: number) => amount / 100;

export const toSmallUnit = (amount: number) => Math.round(amount * 100);

export const formatSession = <T extends { price: number }>(session: T) => ({
    ...session,
    price: fromSmallUnit(session.price),
});

export const formatVenue = <T extends { sessions: { price: number }[] }>(venue: T) => ({
    ...venue,
    sessions: venue.sessions.map(formatSession),
});

export const fetchVenues = async (
    where: Prisma.VenueWhereInput,
    page: number,
    limit: number,
    select: Prisma.VenueSelect = VENUE_LIST_SELECT,
) => {
    const { take, skip } = getPagination(page, limit);

    const [venues, total] = await prisma.$transaction([
        prisma.venue.findMany({
            where,
            skip,
            take,
            select,
            orderBy: { createdAt: "desc" },
        }),
        prisma.venue.count({ where }),
    ]);

    return {
        venues: venues.map((venue) => formatVenue(withRating(venue))),
        pagination: {
            total,
            page,
            limit: take,
            totalPages: Math.ceil(total / take),
        },
    };
};
