import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@bookmyvenue/database";
import { VerificationStatus } from "@bookmyvenue/database/enums";
import type { CreateBookingBody } from "@bookmyvenue/types";

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
