import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@bookmyvenue/database";
import { VerificationStatus } from "@bookmyvenue/database/enums";
import type { CreateBookingBody, GetOwnerBookingQuery, GetUserBookingQuery } from "@bookmyvenue/types";
import { producer } from "../utils/kafka";
import { fromSmallUnit } from "../services/venue.service";
import { BadRequestError, NotFoundError } from "../utils/errors";

export const createBooking = async (
    request: FastifyRequest<{ Body: CreateBookingBody }>,
    reply: FastifyReply,
) => {
    const { venueId, sessionIds, eventDate, phone, purpose } = request.body;

    const bookingTx = await prisma.$transaction(async (tx) => {
        const venue = await tx.venue.findFirst({
            where: {
                id: venueId,
                isActive: true,
                verificationStatus: VerificationStatus.APPROVED,
            },
            select: {
                id: true,
                name: true,
                owner: { select: { id: true, email: true, name: true } },
                sessions: {
                    where: { id: { in: sessionIds }, isActive: true },
                    select: { id: true, price: true },
                },
            },
        });

        if (!venue || venue.sessions.length !== sessionIds.length) {
            throw new BadRequestError("Venue or session not found");
        }

        const user = await tx.user.findUnique({
            where: { id: request.userId! },
            select: { id: true, email: true, name: true },
        });

        if (!user) throw new NotFoundError("User not found");

        const booking = await tx.booking.create({
            data: {
                userId: user.id,
                venueId: venue.id,
                phone,
                purpose,
                bookingSessions: {
                    create: venue.sessions.map((session) => ({
                        sessionId: session.id,
                        eventDate: new Date(eventDate),
                        pricePaid: session.price,
                    })),
                },
            },
            include: { bookingSessions: true },
        });

        return {
            booking,
            venue,
            user,
        };
    });

    await producer.send("booking-created", {
        bookingId: bookingTx.booking.id,
        eventDate,
        purpose,
        phone,

        venue: {
            id: bookingTx.venue.id,
            name: bookingTx.venue.name,
        },

        user: {
            id: bookingTx.user.id,
            email: bookingTx.user.email,
            name: bookingTx.user.name,
        },

        owner: {
            id: bookingTx.venue.owner.id,
            email: bookingTx.venue.owner.email,
            name: bookingTx.venue.owner.name,
        },

        sessions: bookingTx.booking.bookingSessions.map((session) => ({
            sessionId: session.sessionId,
            pricePaid: fromSmallUnit(Number(session.pricePaid)),
        })),
    });

    return reply.status(201).send({ booking: bookingTx.booking });
};

export const getBookingsByOwnerId = async (
    request: FastifyRequest<{ Querystring: GetOwnerBookingQuery }>,
    reply: FastifyReply,
) => {
    const { status, page = 1, limit = 10 } = request.query;
    const skip = (Number(page) - 1) * limit;

    const where = { venue: { ownerId: request.userId }, ...(status && { status }) };

    const [bookings, total] = await Promise.all([
        prisma.booking.findMany({
            where,
            skip,
            take: limit,
            include: {
                user: { select: { name: true, email: true } },
                venue: { select: { name: true } },
                bookingSessions: {
                    include: { session: { select: { label: true } } },
                    orderBy: { eventDate: "asc" },
                },
            },
            orderBy: { createdAt: "desc" },
        }),
        prisma.booking.count({ where }),
    ]);

    const formattedBookings = bookings.map((booking) => ({
        id: booking.id,
        status: booking.status,
        phone: booking.phone,
        purpose: booking.purpose,
        createdAt: booking.createdAt,
        customer: booking.user,
        venue: booking.venue,
        totalAmount: fromSmallUnit(
            booking.bookingSessions.reduce((sum, session) => sum + session.pricePaid, 0),
        ),
        sessions: booking.bookingSessions.map((session) => ({
            eventDate: session.eventDate,
            pricePaid: fromSmallUnit(session.pricePaid),
            session: session.session,
        })),
    }));

    return reply.send({
        bookings: formattedBookings,
        pagination: {
            total,
            page: Number(page),
            limit: limit,
            totalPages: Math.ceil(total / limit),
        },
    });
};

export const getBookingByUserId = async (
    request: FastifyRequest<{ Querystring: GetUserBookingQuery & { today: string } }>,
    reply: FastifyReply,
) => {
    const { status, page = 1, limit = 10, type, today } = request.query;
    const skip = (Number(page) - 1) * limit;

    const todayDate = new Date(today);
    if (Number.isNaN(todayDate.getTime())) {
        throw new BadRequestError("Invalid today date");
    }
    todayDate.setHours(0, 0, 0, 0);

    const where =
        type === "UPCOMING"
            ? {
                  userId: request.userId,
                  bookingSessions: { some: { eventDate: { gte: todayDate } } },
              }
            : {
                  userId: request.userId,
                  bookingSessions: { every: { eventDate: { lt: todayDate } } },
              };

    const [bookings, total] = await Promise.all([
        prisma.booking.findMany({
            where,
            skip,
            take: limit,
            include: {
                venue: { select: { name: true, district: true, location: true } },
                bookingSessions: {
                    include: { session: { select: { label: true, startTime: true, endTime: true } } },
                    orderBy: { eventDate: "asc" },
                },
            },
            orderBy: { createdAt: "desc" },
        }),
        prisma.booking.count({ where }),
    ]);

    const formattedBookings = bookings.map((booking) => ({
        id: booking.id,
        status: booking.status,
        phone: booking.phone,
        purpose: booking.purpose,
        createdAt: booking.createdAt,
        venue: booking.venue,
        totalAmount: fromSmallUnit(
            booking.bookingSessions.reduce((sum, session) => sum + session.pricePaid, 0),
        ),
        sessions: booking.bookingSessions.map((session) => ({
            eventDate: session.eventDate,
            pricePaid: fromSmallUnit(session.pricePaid),
            session: session.session,
        })),
    }));

    return reply.send({
        bookings: formattedBookings,
        pagination: {
            total,
            page: Number(page),
            limit: limit,
            totalPages: Math.ceil(total / limit),
        },
    });
};

export const getOwnerDashboard = async (request: FastifyRequest, reply: FastifyReply) => {
    const ownerId = request.userId;

    const [
        recentBookingsResult,
        venues,
        totalBookings,
        confirmedBookings,
        totalVenues,
        activeVenues,
        revenueResult,
    ] = await Promise.all([
        prisma.booking.findMany({
            where: { venue: { ownerId: request.userId } },
            take: 10,
            select: {
                id: true,
                status: true,
                user: { select: { name: true } },
                venue: { select: { name: true } },
                bookingSessions: { select: { eventDate: true, pricePaid: true } },
            },
            orderBy: { createdAt: "desc" },
        }),

        prisma.venue.findMany({
            where: { ownerId },
            select: {
                id: true,
                name: true,
                images: true,
                location: true,
                isActive: true,
                verificationStatus: true,
                _count: { select: { bookings: true } },
            },

            take: 10,
            orderBy: {
                createdAt: "desc",
            },
        }),

        prisma.booking.count({ where: { venue: { ownerId } } }),

        prisma.booking.count({
            where: { venue: { ownerId }, status: "CONFIRMED" },
        }),

        prisma.venue.count({ where: { ownerId } }),

        prisma.venue.count({
            where: { ownerId, isActive: true },
        }),

        prisma.bookingSession.aggregate({
            where: { booking: { venue: { ownerId }, status: "CONFIRMED" } },
            _sum: { pricePaid: true },
        }),
    ]);

    const recentBookings = recentBookingsResult.map(({ bookingSessions, ...booking }) => ({
        ...booking,
        eventDate: bookingSessions[0]?.eventDate,
        totalAmount: fromSmallUnit(bookingSessions.reduce((total, session) => total + session.pricePaid, 0)),
    }));
    return reply.send({
        stats: {
            venues,
            totalRevenue: fromSmallUnit(revenueResult._sum.pricePaid ?? 0),
            totalBookings,
            confirmedBookings,
            activeVenues,
            totalVenues,
        },
        recentBookings,
        venues: venues.map(({ _count, ...venue }) => ({
            ...venue,
            bookingCount: _count.bookings,
        })),
    });
};
