import { FastifyRequest, FastifyReply } from "fastify";
import { Prisma, prisma, VerificationStatus } from "@bookmyvenue/database";
import { CreateVenueBody, EditVenueBody, GetVenuesQuery, SessionInput } from "@bookmyvenue/types";

const VENUE_LIST_SELECT = {
    id: true,
    name: true,
    description: true,
    capacity: true,
    images: true,
    amenities: true,
    category: true,
    location: true,
    district: true,
    createdAt: true,
    sessions: {
        where: { isActive: true },
        select: {
            id: true,
            label: true,
            startTime: true,
            endTime: true,
            price: true,
        },
    },
    reviews: {
        select: { rating: true },
    },
} satisfies Prisma.VenueSelect;

const OWNER_VENUE_LIST_SELECT = {
    ...VENUE_LIST_SELECT,
    verificationStatus: true,
    verificationReason: true,
    isActive: true,
    _count: {
        select: {
            bookings: true,
        },
    },
} satisfies Prisma.VenueSelect;

const getPagination = (page = 1, limit = 10) => {
    const take = Math.min(Number(limit), 50);
    return {
        take,
        skip: (Number(page) - 1) * take,
    };
};

const withRating = <T extends { reviews: { rating: number }[] }>(venue: T) => {
    const { reviews, ...rest } = venue;

    return {
        ...rest,
        averageRating: reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null,
        reviewCount: reviews.length,
    };
};

const fetchVenues = async (
    where: Prisma.VenueWhereInput,
    page: number,
    limit: number,
    select: Prisma.VenueSelect = VENUE_LIST_SELECT,
) => {
    const { take, skip } = getPagination(page, limit);

    const [venues, total] = await prisma.$transaction([
        prisma.venue.findMany({
            where,
            skip,
            take,
            select,
            orderBy: { createdAt: "desc" },
        }),
        prisma.venue.count({ where }),
    ]);

    return {
        venues: venues.map(withRating),
        pagination: {
            total,
            page,
            limit: take,
            totalPages: Math.ceil(total / take),
        },
    };
};

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

    return reply.send(
        await fetchVenues(
            {
                isActive: true,
                ownerId: request.userId,
            },
            Number(page),
            Number(limit),
            OWNER_VENUE_LIST_SELECT,
        ),
    );
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

    const rating = await prisma.review.aggregate({
        where: { venueId: id },
        _avg: { rating: true },
    });


    const { _count, ...rest } = venue;
    return reply.send({
        venue: {
            ...rest,
            reviewCount: venue._count.reviews,
            averageRating: rating._avg.rating,
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

export const editVenue = async (
    request: FastifyRequest<{ Params: { id: string }; Body: EditVenueBody }>,

    reply: FastifyReply,
) => {
    const id = Number(request.params.id);
    if (isNaN(id)) return reply.status(400).send({ message: "Invalid venue id" });

    const existing = await prisma.venue.findUnique({
        where: { id },
        select: { id: true, ownerId: true },
    });

    if (!existing) {
        return reply.status(404).send({ message: "Venue not found" });
    }

    if (existing.ownerId !== request.userId) {
        return reply.status(403).send({ message: "Not authorized to edit this venue" });
    }

    const { name, description, capacity, category, location, district, images, amenities } = request.body;

    const venue = await prisma.venue.update({
        where: { id },
        data: {
            ...(name !== undefined && { name }),
            ...(description !== undefined && { description }),
            ...(capacity !== undefined && { capacity }),
            ...(category !== undefined && { category }),
            ...(location !== undefined && { location }),
            ...(district !== undefined && { district }),
            ...(images !== undefined && { images }),
            ...(amenities !== undefined && { amenities }),
        },
        include: { sessions: true },
    });

    return reply.send({ venue });
};
