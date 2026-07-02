import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@bookmyvenue/database";
import { VerificationStatus } from "@bookmyvenue/database/enums";
import type { CreateBookingBody, GetOwnerBookingQuery, GetUserBookingQuery } from "@bookmyvenue/types";

export const createBooking = async (
    request: FastifyRequest<{ Body: CreateBookingBody }>,
    reply: FastifyReply,
) => {
    const { venueId, sessionIds, eventDate, phone, purpose } = request.body;

    const sessions = await prisma.venueSession.findMany({
        where: {
            id: { in: sessionIds },
            venue: {
                id: venueId,
                isActive: true,
                verificationStatus: VerificationStatus.APPROVED,
            },
            isActive: true,
        },
        select: { id: true, price: true },
    });

    if (sessions.length !== sessionIds.length) {
        return reply.status(400).send({ message: "Venue or session not found" });
    }

    try {
        const booking = await prisma.booking.create({
            data: {
                userId: request.userId!,
                venueId,
                phone,
                purpose,
                bookingSessions: {
                    create: sessions.map((s) => ({
                        sessionId: s.id,
                        eventDate: new Date(eventDate),
                        pricePaid: s.price,
                    })),
                },
            },
            include: { bookingSessions: true },
        });

        return reply.status(201).send({ booking });
    } catch (err: any) {
        if (err.code === "P2002") {
            return reply.status(409).send({ message: "One or more slots are already booked" });
        }
        throw err;
    }
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
        totalAmount: booking.bookingSessions.reduce((sum, session) => sum + session.pricePaid, 0),
        sessions: booking.bookingSessions.map((session) => ({
            eventDate: session.eventDate,
            pricePaid: session.pricePaid,
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
        totalAmount: booking.bookingSessions.reduce((sum, session) => sum + session.pricePaid, 0),
        sessions: booking.bookingSessions.map((session) => ({
            eventDate: session.eventDate,
            pricePaid: session.pricePaid,
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
