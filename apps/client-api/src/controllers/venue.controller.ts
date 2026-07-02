import { FastifyRequest, FastifyReply } from "fastify";
import { BookingStatus, Prisma, prisma, VerificationStatus } from "@bookmyvenue/database";
import { CreateVenueBody, EditVenueBody, GetVenuesQuery, SessionInput } from "@bookmyvenue/types";

const VENUE_LIST_SELECT = {
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

const OWNER_VENUE_LIST_SELECT = {
    ...VENUE_LIST_SELECT,
    verificationStatus: true,
    verificationReason: true,
    isActive: true,
    _count: {
        select: {
            bookings: true,
        },
    },
} satisfies Prisma.VenueSelect;

const getPagination = (page = 1, limit = 10) => {
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

const fetchVenues = async (
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
        venues: venues.map(withRating),
        pagination: {
            total,
            page,
            limit: take,
            totalPages: Math.ceil(total / take),
        },
    };
};

// Get all approved venues
export const getVenues = async (
    request: FastifyRequest<{ Querystring: GetVenuesQuery }>,
    reply: FastifyReply,
) => {
    const { district, category, page = 1, limit = 10 } = request.query;
    return reply.send(
        await fetchVenues(
            {
                isActive: true,
                verificationStatus: VerificationStatus.APPROVED,
                ...(district && { district }),
                ...(category && { category }),
            },
            Number(page),
            Number(limit),
        ),
    );
};

// Get all venues of owner
export const getVenuesByOwnerId = async (
    request: FastifyRequest<{ Querystring: GetVenuesQuery }>,
    reply: FastifyReply,
) => {
    const { page = 1, limit = 20 } = request.query;

    const result = await fetchVenues(
        {
            isActive: true,
            ownerId: request.userId,
        },
        Number(page),
        Number(limit),
        OWNER_VENUE_LIST_SELECT,
    );

    return reply.send({
        ...result,
        venues: result.venues.map((venue) => {
            const { _count, ...rest } = venue;

            return {
                ...rest,
                bookingCount: _count.bookings,
            };
        }),
    });
};

// Single venue details
export const getVenueById = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
) => {
    const id = Number(request.params.id);

    if (isNaN(id)) return reply.status(400).send({ message: "Invalid venue id" });

    const venue = await prisma.venue.findFirst({
        where: { id, isActive: true, verificationStatus: VerificationStatus.APPROVED },
        include: {
            sessions: { where: { isActive: true } },
            owner: { select: { id: true, email: true, name: true } },
            _count: { select: { reviews: true } },
        },
    });

    if (!venue) return reply.status(404).send({ message: "Venue not found" });

    const sessionIds = venue.sessions.map((s) => s.id);
    const totalSessions = sessionIds.length;

    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const bookingSessions = await prisma.bookingSession.findMany({
        where: {
            sessionId: {
                in: sessionIds,
            },
            eventDate: {
                gte: tomorrow,
            },
            booking: {
                status: BookingStatus.CONFIRMED,
            },
        },
        select: {
            eventDate: true,
            sessionId: true,
        },
    });

    const bookedSessionsByDate: Record<string, number[]> = {};

    for (const booking of bookingSessions) {
        const date = booking.eventDate.toISOString().split("T")[0]!;

        if (!bookedSessionsByDate[date]) {
            bookedSessionsByDate[date] = [];
        }
        bookedSessionsByDate[date].push(booking.sessionId);
    }

    const disabledDates = Object.entries(bookedSessionsByDate)
        .filter(([, sessionIds]) => sessionIds.length === totalSessions)
        .map(([date]) => date);

    const rating = await prisma.review.aggregate({
        where: { venueId: id },
        _avg: { rating: true },
    });

    const { _count, ...rest } = venue;
    return reply.send({
        venue: {
            ...rest,
            reviewCount: venue._count.reviews,
            averageRating: rating._avg.rating,
            bookedSessions: bookedSessionsByDate,
            disabledDates,
        },
    });
};

export const createVenue = async (
    request: FastifyRequest<{ Body: CreateVenueBody }>,
    reply: FastifyReply,
) => {
    const { name, description, capacity, category, location, district, images, amenities, sessions } =
        request.body;

    const owner = await prisma.user.findUnique({
        where: { id: request.userId! },
        select: { id: true },
    });

    if (!owner) {
        return reply.status(404).send({ message: "Owner account not found" });
    }

    const venue = await prisma.venue.create({
        data: {
            name,
            description,
            capacity,
            category,
            location,
            district,
            images,
            amenities,
            ownerId: owner.id,
            sessions:
                sessions.length > 0
                    ? {
                          create: sessions.map(({ label, startTime, endTime, price }) => ({
                              label,
                              startTime,
                              endTime,
                              price,
                          })),
                      }
                    : undefined,
        },
        include: { sessions: true },
    });

    return reply.status(201).send({ venue });
};

export const editVenue = async (
    request: FastifyRequest<{ Params: { id: string }; Body: EditVenueBody }>,
    reply: FastifyReply,
) => {
    const venueId = Number(request.params.id);
    const body = request.body;
    const userId = request.userId;

    const venue = await prisma.venue.findUnique({
        where: {
            id: venueId,
        },
        include: {
            sessions: true,
        },
    });

    if (!venue) {
        return reply.status(404).send({
            message: "Venue not found",
        });
    }

    if (venue.ownerId !== userId) {
        return reply.status(403).send({
            message: "Forbidden",
        });
    }

    await prisma.$transaction(async (tx) => {
        await tx.venue.update({
            where: { id: venueId },
            data: {
                name: body.name,
                description: body.description,
                capacity: body.capacity,
                images: body.images,
                amenities: body.amenities,
                category: body.category,
                location: body.location,
                district: body.district,
            },
        });

        const existingIds = venue.sessions.map((s) => s.id);

        const incomingIds = body.sessions.filter((s) => s.id).map((s) => s.id!);

        // Deactivate removed sessions
        await tx.venueSession.updateMany({
            where: {
                id: {
                    in: existingIds.filter((id) => !incomingIds.includes(id)),
                },
            },
            data: {
                isActive: false,
            },
        });

        if (incomingIds.length) {
            await tx.venueSession.updateMany({
                where: {
                    id: {
                        in: incomingIds,
                    },
                },
                data: {
                    isActive: true,
                },
            });
        }

        // Create  new sessions
        const newSessions = body.sessions.filter((s) => !s.id);

        if (newSessions.length) {
            await tx.venueSession.createMany({
                data: newSessions.map((s) => ({
                    venueId,
                    label: s.label,
                    startTime: s.startTime,
                    endTime: s.endTime,
                    price: s.price,
                })),
            });
        }
    });

    return reply.send({
        message: "Venue updated successfully",
    });
};
