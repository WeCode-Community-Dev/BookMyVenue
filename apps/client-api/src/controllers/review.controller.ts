import { FastifyRequest, FastifyReply } from "fastify";
import { getVenueReviewStatusService } from "../services/review.service";
import { CreateReviewBody } from "@bookmyvenue/types";
import { prisma } from "@bookmyvenue/database";

export const getVenueReviewStatus = async (
    request: FastifyRequest<{ Params: { venueId: string } }>,
    reply: FastifyReply,
) => {
    const { venueId } = request.params;
    const userId = request.userId;

    const reviewStatus = await getVenueReviewStatusService(Number(venueId), userId);

    return reply.send({ reviewStatus });
};

export const createReview = async (
    request: FastifyRequest<{ Body: CreateReviewBody }>,
    reply: FastifyReply,
) => {
    const { venueId, rating, comment } = request.body;
    const userId = request.userId;

    if (!userId) {
        return reply.status(403).send({ message: "Not authenticated" });
    }

    const reviewStatus = await getVenueReviewStatusService(Number(venueId), userId);

    if (reviewStatus !== "CAN_REVIEW") {
        return reply.status(403).send({
            message: "You are not allowed to review this venue.",
        });
    }

    const review = await prisma.review.create({
        data: {
            venueId: Number(venueId),
            userId,
            rating,
            comment,
        },
    });

    return reply.status(201).send({
        message: "Review created successfully.",
        review,
    });
};

// import { FastifyRequest, FastifyReply } from "fastify";
// import { BookingStatus, prisma } from "@bookmyvenue/database";
// import { ReviewStatus } from "@bookmyvenue/types";

// export const getVenueReviewStatus = async (
//     request: FastifyRequest<{ Params: { venueId: string } }>,
//     reply: FastifyReply,
// ) => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const { venueId } = request.params;
//     const userId = request.userId;

//     let reviewStatus: ReviewStatus = "NOT_LOGGED_IN";

//     if (!userId) {
//         reviewStatus = "NOT_LOGGED_IN";
//         return reply.send({
//             reviewStatus,
//         });
//     }

//     const booking = await prisma.booking.findFirst({
//         where: {
//             venueId: Number(venueId),
//             userId,
//             status: BookingStatus.CONFIRMED,
//             bookingSessions: { some: { eventDate: { lt: today } } },
//         },
//         select: { id: true },
//     });

//     if (!booking) {
//         reviewStatus = "NO_BOOKING";
//         return reply.send({ reviewStatus });
//     }

//     const review = await prisma.review.findFirst({
//         where: { venueId: Number(venueId), userId },
//         select: { id: true },
//     });

//     if (review) {
//         reviewStatus = "ALREADY_REVIEWED";
//         return reply.send({ reviewStatus });
//     }

//     reviewStatus = "CAN_REVIEW";
//     return reply.send({ reviewStatus });
// };
