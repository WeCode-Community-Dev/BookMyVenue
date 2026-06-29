import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@bookmyvenue/database";
import { ReviewStatus } from "@bookmyvenue/types";

export const getVenueReviewStatus = async (
    request: FastifyRequest<{ Params: { venueId: string } }>,
    reply: FastifyReply,
) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { venueId } = request.params;
    const userId = request.userId;

    let reviewStatus: ReviewStatus = "NOT_LOGGED_IN";

    if (!userId) {
        reviewStatus = "NOT_LOGGED_IN";
        return reply.send({
            reviewStatus,
        });
    }

    const booking = await prisma.booking.findFirst({
        where: {
            venueId: Number(venueId),
            userId,
            bookingSessions: { some: { eventDate: { lt: today } } },
        },
        select: { id: true },
    });

    if (!booking) {
        reviewStatus = "NO_BOOKING";
        return reply.send({ reviewStatus });
    }

    const review = await prisma.review.findFirst({
        where: { venueId: Number(venueId), userId },
        select: { id: true },
    });

    if (review) {
        reviewStatus = "ALREADY_REVIEWED";
        return reply.send({ reviewStatus });
    }

    reviewStatus = "CAN_REVIEW";
    return reply.send({ reviewStatus });
};
