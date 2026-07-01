import { FastifyRequest, FastifyReply } from "fastify";
import { getVenueReviewStatusService } from "../services/review.service";
import { WriteReviewBody, GetReviewsQuery } from "@bookmyvenue/types";
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

export const writeReview = async (
    request: FastifyRequest<{ Body: WriteReviewBody }>,
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

export const getReviews = async (
    request: FastifyRequest<{ Params: { venueId: string }; Querystring: GetReviewsQuery }>,
    reply: FastifyReply,
) => {
    const venueId = Number(request.params.venueId);

    const page = Number(request.query.page ?? 1);
    const limit = Number(request.query.limit ?? 10);

    const skip = (page - 1) * limit;

    const [reviews, total] = await prisma.$transaction([
        prisma.review.findMany({
            where: { venueId },
            skip,
            take: limit,
            include: { user: { select: { name: true } } },
            orderBy: { createdAt: "desc" },
        }),
        prisma.review.count({ where: { venueId } }),
    ]);
    return reply.send({
        success: true,
        reviews,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
            hasPreviousPage: page > 1,
        },
    });
};
