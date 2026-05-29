import { Venue } from "../../domain/entities/Venue.js";

import type { VenueRepository, VenueFilters } from "../../domain/repositories/VenueRepository.js";
import type { PrismaClient, Prisma } from "@prisma/client";

export class PrismaVenueRepository implements VenueRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Venue | null> {
    const venue = await this.prisma.venue.findUnique({ where: { id } });
    if (!venue) return null;
    return this.toDomain(venue);
  }

  async findByOwnerId(ownerId: string): Promise<Venue[]> {
    const venues = await this.prisma.venue.findMany({ where: { ownerId } });
    return venues.map((venue) => this.toDomain(venue));
  }

  async findAll(filters?: VenueFilters): Promise<Venue[]> {
    const where = this.buildWhereClause(filters);
    const venues = await this.prisma.venue.findMany({ where });
    return venues.map((venue) => this.toDomain(venue));
  }

  async search(query: string, filters?: VenueFilters): Promise<Venue[]> {
    const where: Prisma.VenueWhereInput = {
      ...this.buildWhereClause(filters),
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { city: { contains: query, mode: "insensitive" } },
      ],
    };
    const venues = await this.prisma.venue.findMany({ where });
    return venues.map((venue) => this.toDomain(venue));
  }

  async save(venue: Venue): Promise<Venue> {
    const created = await this.prisma.venue.create({
      data: {
        id: venue.id,
        name: venue.name,
        description: venue.description,
        address: venue.address,
        city: venue.city,
        state: venue.state,
        zipCode: venue.zipCode,
        capacity: venue.capacity,
        pricePerHour: venue.pricePerHour,
        amenities: venue.amenities,
        images: venue.images,
        ownerId: venue.ownerId,
        isActive: venue.isActive,
        createdAt: venue.createdAt,
        updatedAt: venue.updatedAt,
      },
    });
    return this.toDomain(created);
  }

  async update(venue: Venue): Promise<Venue> {
    const updated = await this.prisma.venue.update({
      where: { id: venue.id },
      data: {
        name: venue.name,
        description: venue.description,
        address: venue.address,
        city: venue.city,
        state: venue.state,
        zipCode: venue.zipCode,
        capacity: venue.capacity,
        pricePerHour: venue.pricePerHour,
        amenities: venue.amenities,
        images: venue.images,
        isActive: venue.isActive,
        updatedAt: venue.updatedAt,
      },
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.venue.delete({ where: { id } });
  }

  private buildWhereClause(filters?: VenueFilters): Prisma.VenueWhereInput {
    if (!filters) return {};

    const where: Prisma.VenueWhereInput = {};

    if (filters.city) where.city = { equals: filters.city, mode: "insensitive" };
    if (filters.ownerId) where.ownerId = filters.ownerId;
    if (filters.isActive !== undefined) where.isActive = filters.isActive;
    if (filters.minCapacity || filters.maxCapacity) {
      where.capacity = {};
      if (filters.minCapacity) where.capacity.gte = filters.minCapacity;
      if (filters.maxCapacity) where.capacity.lte = filters.maxCapacity;
    }
    if (filters.minPrice || filters.maxPrice) {
      where.pricePerHour = {};
      if (filters.minPrice) where.pricePerHour.gte = filters.minPrice;
      if (filters.maxPrice) where.pricePerHour.lte = filters.maxPrice;
    }
    if (filters.amenities && filters.amenities.length > 0) {
      where.amenities = { hasEvery: filters.amenities };
    }

    return where;
  }

  private toDomain(data: {
    id: string;
    name: string;
    description: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    capacity: number;
    pricePerHour: number;
    amenities: string[];
    images: string[];
    ownerId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Venue {
    return new Venue({
      id: data.id,
      name: data.name,
      description: data.description,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      capacity: data.capacity,
      pricePerHour: data.pricePerHour,
      amenities: data.amenities,
      images: data.images,
      ownerId: data.ownerId,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
