import { FastifyInstance } from "fastify";
import { ownerAuthMiddleware } from "../middleware/authmiddleware.js";
import { prisma, District, VenueCategory } from "@bookmyvenue/database";

const createVenueSchema = {
    body: {
        type: "object",
        required: ["name", "description", "capacity", "category", "location", "district"],
        properties: {
            name: { type: "string", minLength: 2 },
            description: { type: "string", minLength: 10 },
            capacity: { type: "integer", minimum: 1 },
            category: { type: "string", enum: Object.values(VenueCategory) },
            location: { type: "string", minLength: 2 },
            district: { type: "string", enum: Object.values(District) },
            images: { type: "array", items: { type: "string" }, default: [] },
            amenities: { type: "array", items: { type: "string" }, default: [] },
            sessions: {
                type: "array",
                items: {
                    type: "object",
                    required: ["label", "startTime", "endTime", "price"],
                    properties: {
                        label: { type: "string", minLength: 1 },
                        startTime: { type: "string" },
                        endTime: { type: "string" },
                        price: { type: "integer", minimum: 0 },
                    },
                },
                default: [],
            },
        },
    },
};

interface SessionInput {
    label: string;
    startTime: string;
    endTime: string;
    price: number;
}

interface CreateVenueBody {
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

export const venueRoute = async (fastify: FastifyInstance) => {
    fastify.post<{ Body: CreateVenueBody }>(
        "/create-venue",
        { preHandler: ownerAuthMiddleware, schema: createVenueSchema },
        async (request, reply) => {
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
        },
    );
};
