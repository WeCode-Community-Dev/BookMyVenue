import { FastifyRequest, FastifyReply } from "fastify";
import { prisma, District, VenueCategory, VerificationStatus } from "@bookmyvenue/database";

interface SessionInput {
    label: string;
    startTime: string;
    endTime: string;
    price: number;
}

export interface CreateVenueBody {
    name: string;
    description: string;
    capacity: number;
    category: VenueCategory;
    location: string;
    district: District;
    images: string[];
    amenities: string[];
    sessions: SessionInput[];
}

export interface GetVenuesQuery {
    district?: District;
    category?: VenueCategory;
    page?: number;
    limit?: number;
}

export const getVenues = async (
    request: FastifyRequest<{ Querystring: GetVenuesQuery }>,
    reply: FastifyReply,
) => {
    const { district, category, page = 1, limit = 10 } = request.query;

    const take = Math.min(Number(limit), 50);
    const skip = (Number(page) - 1) * take;

    const where = {
        isActive: true,
        verificationStatus: VerificationStatus.APPROVED,
        ...(district && { district }),
        ...(category && { category }),
    };

    const [venues, total] = await Promise.all([
        prisma.venue.findMany({
            where,
            skip,
            take,
            select: {
                id: true,
                name: true,
                description: true,
                capacity: true,
                images: true,
                amenities: true,
                category: true,
                location: true,
                district: true,
                sessions: {
                    where: { isActive: true },
                    select: { id: true, label: true, startTime: true, endTime: true, price: true },
                },
                reviews: {
                    select: { rating: true },
                },
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
        }),
        prisma.venue.count({ where }),
    ]);

    const venuesWithRating = venues.map(({ reviews, ...venue }) => ({
        ...venue,
        averageRating: reviews.length
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : null,
        reviewCount: reviews.length,
    }));

    return reply.send({
        venues: venuesWithRating,
        pagination: {
            total,
            page: Number(page),
            limit: take,
            totalPages: Math.ceil(total / take),
        },
    });
};

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
            reviews: {
                include: { user: { select: { id: true, email: true } } },
                orderBy: { createdAt: "desc" },
            },
            owner: { select: { id: true, email: true } },
        },
    });

    if (!venue) return reply.status(404).send({ message: "Venue not found" });

    const { reviews, ...rest } = venue;
    return reply.send({
        venue: {
            ...rest,
            averageRating: reviews.length
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : null,
            reviewCount: reviews.length,
            reviews,
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
