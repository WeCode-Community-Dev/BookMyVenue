import { FastifyRequest, FastifyReply } from "fastify";
import { BookingStatus, prisma, VerificationStatus } from "@bookmyvenue/database";
import { CreateVenueBody, EditVenueBody, GetVenuesQuery, SessionInput } from "@bookmyvenue/types";
import {
    fetchVenues,
    formatVenue,
    OWNER_VENUE_LIST_SELECT,
    timeToMinutes,
    toSmallUnit,
} from "../services/venue.service";
import { BadRequestError, ForbiddenError, NotFoundError } from "../utils/errors";
// import { producer } from "../utils/kafka";

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

    if (isNaN(id)) throw new BadRequestError("Invalid venue id");

    const venue = await prisma.venue.findFirst({
        where: { id, isActive: true, verificationStatus: VerificationStatus.APPROVED },
        include: {
            sessions: { where: { isActive: true } },
            owner: { select: { id: true, email: true, name: true } },
            _count: { select: { reviews: true } },
        },
    });

    if (!venue) throw new NotFoundError("Venue not found");

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
        throw new NotFoundError("Owner account not found");
    }

    const sessionLabels = sessions.map((session) => session.label.trim().toLowerCase());

    const hasDuplicateSessionLabels = new Set(sessionLabels).size !== sessionLabels.length;

    if (hasDuplicateSessionLabels) {
        throw new BadRequestError("Duplicate session labels are not allowed");
    }

    const invalidSession = sessions.find(
        (session) => timeToMinutes(session.endTime) <= timeToMinutes(session.startTime),
    );

    if (invalidSession) {
        throw new BadRequestError(`"${invalidSession.label}" end time must be after start time`);
    }

    const sortedSessions = [...sessions].sort(
        (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime),
    );

    for (let index = 1; index < sortedSessions.length; index++) {
        const previousSession = sortedSessions[index - 1]!;
        const currentSession = sortedSessions[index]!;

        const previousEndTime = timeToMinutes(previousSession.endTime);
        const currentStartTime = timeToMinutes(currentSession.startTime);

        if (currentStartTime < previousEndTime) {
            throw new BadRequestError(
                `"${currentSession.label}'s" time overlaps with "${previousSession.label}'s time"`,
            );
        }
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
        throw new NotFoundError("Venue not found");
    }

    if (venue.ownerId !== userId) {
        throw new ForbiddenError();
    }

    const existingSessions = body.sessions.filter(
        (session): session is SessionInput & { id: number } => session.id !== undefined,
    );

    const newSessions = body.sessions.filter((session) => session.id === undefined);

    const existingSessionIds = new Set(venue.sessions.map((session) => session.id));

    const hasInvalidSessionId = existingSessions.some((session) => !existingSessionIds.has(session.id));

    if (hasInvalidSessionId) {
        throw new BadRequestError("Invalid venue session");
    }

    const sessionActiveState = new Map(existingSessions.map((session) => [session.id, session.isActive]));

    const sessionsToValidate = [
        ...venue.sessions
            .filter((session) => sessionActiveState.get(session.id) ?? session.isActive)
            .map((session) => ({
                label: session.label,
                startTime: session.startTime,
                endTime: session.endTime,
            })),
        ...newSessions.map((session) => ({
            label: session.label,
            startTime: session.startTime,
            endTime: session.endTime,
        })),
    ];

    const sessionLabels = sessionsToValidate.map((session) => session.label.trim().toLowerCase());

    const hasDuplicateSessionLabels = new Set(sessionLabels).size !== sessionLabels.length;

    if (hasDuplicateSessionLabels) {
        throw new BadRequestError("Duplicate session labels are not allowed");
    }

    const invalidSession = sessionsToValidate.find(
        (session) => timeToMinutes(session.endTime) <= timeToMinutes(session.startTime),
    );

    if (invalidSession) {
        throw new BadRequestError(`"${invalidSession.label}" end time must be after start time`);
    }

    const sortedSessions = [...sessionsToValidate].sort(
        (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime),
    );

    for (let index = 1; index < sortedSessions.length; index++) {
        const previousSession = sortedSessions[index - 1]!;
        const currentSession = sortedSessions[index]!;

        const previousEndTime = timeToMinutes(previousSession.endTime);

        const currentStartTime = timeToMinutes(currentSession.startTime);

        if (currentStartTime < previousEndTime) {
            throw new BadRequestError(
                `"${currentSession.label}'s" time overlaps with "${previousSession.label}'s" time`,
            );
        }
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

                ...(venue.verificationStatus === VerificationStatus.REJECTED && {
                    verificationStatus: VerificationStatus.PENDING,
                    verificationReason: null,
                }),
            },
        });

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

        if (newSessions.length > 0) {
            await tx.venueSession.createMany({
                data: newSessions.map((session) => ({
                    venueId,
                    label: session.label.trim(),
                    startTime: session.startTime,
                    endTime: session.endTime,
                    price: toSmallUnit(session.price),
                    isActive: true,
                })),
            });
        }
    });

    return reply.status(201).send({
        message: "Venue updated successfully",
    });
};

export const deleteVenue = async (
    request: FastifyRequest<{ Params: { venueId: string } }>,
    reply: FastifyReply,
) => {
    const userId = request.userId;
    const venueId = Number(request.params.venueId);

    if (isNaN(venueId) || venueId <= 0) throw new BadRequestError("Invalid venue id");

    const result = await prisma.venue.updateMany({
        where: { id: venueId, ownerId: userId, isActive: true },
        data: { isActive: false },
    });

    if (result.count === 0) {
        throw new NotFoundError("Venue not found");
    }

    return reply.status(204).send();
};
