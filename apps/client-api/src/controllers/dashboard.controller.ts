import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@bookmyvenue/database";
import { fromSmallUnit } from "../services/venue.service";

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
