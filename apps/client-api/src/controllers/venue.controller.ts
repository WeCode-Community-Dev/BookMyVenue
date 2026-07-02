import { FastifyRequest, FastifyReply } from "fastify";
import { BookingStatus, prisma, VerificationStatus } from "@bookmyvenue/database";
import { CreateVenueBody, EditVenueBody, GetVenuesQuery, SessionInput } from "@bookmyvenue/types";
import { fetchVenues, formatVenue, OWNER_VENUE_LIST_SELECT, toSmallUnit } from "../services/venue.service";

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
        venue: formatVenue({
            ...rest,
            reviewCount: venue._count.reviews,
            averageRating: rating._avg.rating,
            bookedSessions: bookedSessionsByDate,
            disabledDates,
        }),
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
                              price: toSmallUnit(price),
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
        // Update venue
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

                ...(venue.verificationStatus === VerificationStatus.REJECTED && {
                    verificationStatus: VerificationStatus.PENDING,
                    verificationReason: null,
                }),
            },
        });

        const existingSessions = body.sessions.filter(
            (session): session is SessionInput & { id: number } => session.id !== undefined,
        );

        await Promise.all(
            existingSessions.map((session) =>
                tx.venueSession.update({
                    where: {
                        id: session.id,
                    },
                    data: {
                        isActive: session.isActive,
                    },
                }),
            ),
        );

        const newSessions = body.sessions.filter((session) => !session.id);

        if (newSessions.length > 0) {
            await tx.venueSession.createMany({
                data: newSessions.map((session) => ({
                    venueId,
                    label: session.label,
                    startTime: session.startTime,
                    endTime: session.endTime,
                    price: toSmallUnit(session.price),
                    isActive: true,
                })),
            });
        }
    });

    return reply.send({
        message: "Venue updated successfully",
    });
};
