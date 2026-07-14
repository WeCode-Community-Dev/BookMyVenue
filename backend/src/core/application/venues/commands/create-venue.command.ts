import { Injectable, Inject } from '@nestjs/common';
import { Venue } from '../../../domain/venues/entities/venue.entity';
import { Address } from '../../../domain/venues/value-objects/address.vo';
import { type IVenueRepository } from '../../../domain/venues/repositories/venue-repository.interface';
import * as crypto from 'crypto';

export interface CreateVenueDto {
  ownerId: string;
  title: string;
  description: string;
  venueType: string;
  addressLine1: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude?: number | null;
  longitude?: number | null;
  capacity: number;
  pricePerDay: number;
  amenities: string[]
}

@Injectable()
export class CreateVenueCommand {
  constructor(
    @Inject('IVenueRepository')
    private readonly venueRepository: IVenueRepository,
  ) { }

  async execute(dto: CreateVenueDto): Promise<{ venueId: string }> {
    const address = Address.create({
      addressLine1: dto.addressLine1,
      city: dto.city,
      state: dto.state,
      country: dto.country,
      postalCode: dto.postalCode,
      latitude: dto.latitude,
      longitude: dto.longitude,
    });

    const venueId = crypto.randomUUID();
    const venue = Venue.create(venueId, {
      ownerId: dto.ownerId,
      title: dto.title,
      description: dto.description,
      venueType: dto.venueType,
      address,
      capacity: dto.capacity,
      pricePerDay: dto.pricePerDay,
      status: 'PENDING',
      amenities: dto.amenities,
      images: []
    });

    await this.venueRepository.save(venue);

    return { venueId };
  }
}
