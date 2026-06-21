import { Injectable, Inject } from '@nestjs/common';
import { Address } from '../../../domain/venues/value-objects/address.vo';
import { type IVenueRepository } from '../../../domain/venues/repositories/venue-repository.interface';
import { NotFoundException } from '../../../domain/_shared/exception/notfound.exception';
import { BusinessRuleException } from '../../../domain/_shared/exception/business-rule.exception';

export interface UpdateVenueDto {
  venueId: string;
  userId: string;
  userRole: string;
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
  amenities: string[],
}

@Injectable()
export class UpdateVenueCommand {
  constructor(
    @Inject('IVenueRepository')
    private readonly venueRepository: IVenueRepository,
  ) { }

  async execute(dto: UpdateVenueDto): Promise<void> {
    const venue = await this.venueRepository.findById(dto.venueId);
    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    // Authorization check
    if (venue.ownerId !== dto.userId && dto.userRole !== 'ADMIN') {
      throw new BusinessRuleException('You do not have permission to update this venue');
    }

    const address = Address.create({
      addressLine1: dto.addressLine1,
      city: dto.city,
      state: dto.state,
      country: dto.country,
      postalCode: dto.postalCode,
      latitude: dto.latitude,
      longitude: dto.longitude,
    });

    venue.updateDetails(
      dto.title,
      dto.description,
      dto.venueType,
      address,
      dto.capacity,
      dto.pricePerDay,
      dto.amenities
    );

    await this.venueRepository.save(venue);
  }
}
