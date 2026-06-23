import { FastifyRequest, FastifyReply } from "fastify";
import { prisma, District, VenueCategory } from "@bookmyvenue/database";

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
