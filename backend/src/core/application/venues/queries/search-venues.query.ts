import { Injectable, Inject } from '@nestjs/common';
import { type IVenueRepository } from '../../../domain/venues/repositories/venue-repository.interface';
import { Pagination } from '../../_shared/dto/pagination';

export interface SearchVenuesFilter {
  limit: number,
  offset: number,
  search?: string,
  city?: string;
  venueType?: string;
  capacity?: number;
}

export interface VenueResponseDto {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  venueType: string;
  addressLine1: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: number | null;
  longitude: number | null;
  capacity: number;
  pricePerDay: number;
  status: string;
  createdAt: Date;
  amenities: string[]
  images: string[]
}

@Injectable()
export class SearchVenuesQuery {
  constructor(
    @Inject('IVenueRepository')
    private readonly venueRepository: IVenueRepository,
  ) { }

  async execute(filter: SearchVenuesFilter): Promise<Pagination<VenueResponseDto>> {
    const { count, venues } = await this.venueRepository.findAndCountAll({
      ...filter,
      status: 'APPROVED'
    });

    const docs = venues.map((v) => ({
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
    }));

    return new Pagination({
      data: docs,
      limit: filter.limit,
      offset: filter.offset,
      total: count,
    })
  }
}
