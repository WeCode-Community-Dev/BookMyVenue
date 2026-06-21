import { Injectable, Inject } from '@nestjs/common';
import { type IVenueRepository } from '../../../domain/venues/repositories/venue-repository.interface';
import { NotFoundException } from '../../../domain/_shared/exception/notfound.exception';
import { VenueResponseDto } from './search-venues.query';

@Injectable()
export class GetVenueDetailsQuery {
  constructor(
    @Inject('IVenueRepository')
    private readonly venueRepository: IVenueRepository,
  ) { }

  async execute(venueId: string): Promise<VenueResponseDto> {
    const v = await this.venueRepository.findById(venueId);
    if (!v) {
      throw new NotFoundException('Venue not found');
    }

    return {
      id: v.id,
      ownerId: v.ownerId,
      title: v.title,
      description: v.description,
      venueType: v.venueType,
      addressLine1: v.address.addressLine1,
      city: v.address.city,
      state: v.address.state,
      country: v.address.country,
      postalCode: v.address.postalCode,
      latitude: v.address.latitude || null,
      longitude: v.address.longitude || null,
      capacity: v.capacity,
      pricePerDay: v.pricePerDay,
      amenities: v.amenities,
      images: v.images.map(img => img.url),
      status: v.status,
      createdAt: v.createdAt,
    };
  }
}
