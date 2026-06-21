import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { Venue, type VenueStatus } from '../../core/domain/venues/entities/venue.entity';
import { Address } from '../../core/domain/venues/value-objects/address.vo';
import type { IVenueRepository, VenueFilters } from '../../core/domain/venues/repositories/venue-repository.interface';
import { venue_status as PrismaVenueStatus } from '../database/prisma/generated/prisma/client';

@Injectable()
export class PrismaVenueRepository implements IVenueRepository {
  constructor(private readonly prisma: PrismaService) { }

  private mapToDomain(dbVenue: any): Venue {
    const address = Address.create({
      addressLine1: dbVenue.address_line_1,
      city: dbVenue.city,
      state: dbVenue.state,
      country: dbVenue.country,
      postalCode: dbVenue.postal_code,
      latitude: dbVenue.latitude ? Number(dbVenue.latitude) : null,
      longitude: dbVenue.longitude ? Number(dbVenue.longitude) : null,
    });

    return Venue.restore(dbVenue.id, {
      ownerId: dbVenue.owner_id,
      title: dbVenue.title,
      description: dbVenue.description,
      venueType: dbVenue.venue_type,
      address,
      capacity: dbVenue.capacity,
      pricePerDay: Number(dbVenue.price_per_day),
      status: dbVenue.status as VenueStatus,
      amenities: dbVenue.amenities,
      images: dbVenue.images.map(img => ({
        id: img.id,
        url: img.image_url
      })),
      createdAt: dbVenue.created_at,
      updatedAt: dbVenue.updated_at,
    });
  }

  async findById(id: string): Promise<Venue | null> {
    const dbVenue = await this.prisma.venues.findUnique({
      where: { id },
    });
    if (!dbVenue) return null;
    return this.mapToDomain(dbVenue);
  }

  async findAll(filters?: VenueFilters): Promise<Venue[]> {
    const where: any = {};

    if (filters) {
      if (filters.city) {
        where.city = { contains: filters.city, mode: 'insensitive' };
      }
      if (filters.venueType) {
        where.venue_type = filters.venueType;
      }
      if (filters.capacity) {
        where.capacity = { gte: filters.capacity };
      }
      if (filters.status) {
        where.status = filters.status as PrismaVenueStatus;
      }
    }

    const dbVenues = await this.prisma.venues.findMany({
      where,
      include: { images: true },
      orderBy: { created_at: 'desc' },
    });

    return dbVenues.map((dbVenue) => this.mapToDomain(dbVenue));
  }

  async save(venue: Venue): Promise<void> {
    const data = {
      owner_id: venue.ownerId,
      title: venue.title,
      description: venue.description,
      venue_type: venue.venueType,
      address_line_1: venue.address.addressLine1,
      city: venue.address.city,
      state: venue.address.state,
      country: venue.address.country,
      postal_code: venue.address.postalCode,
      latitude: venue.address.latitude ? (venue.address.latitude as any) : null,
      longitude: venue.address.longitude ? (venue.address.longitude as any) : null,
      capacity: venue.capacity,
      price_per_day: venue.pricePerDay as any,
      status: venue.status as PrismaVenueStatus,
      updated_at: venue.updatedAt,
    };

    await this.prisma.venues.upsert({
      where: { id: venue.id },
      update: data,
      create: {
        id: venue.id,
        ...data,
        created_at: venue.createdAt,
      },
    });
  }
}
