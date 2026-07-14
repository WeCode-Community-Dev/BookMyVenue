import { Injectable, Inject } from '@nestjs/common';
import type { IVenueRepository } from 'src/core/domain/venues/repositories/venue-repository.interface';
import { Pagination } from '../../_shared/dto/pagination';

export interface ListVenueQueryOutputDto {
    id: string
    ownerId: string
    title: string
    description: string
    venueType: string
    addressLine1: string
    capacity: number
    pricePerDay: number
    status: string
    createdAt: Date
    updatedAt: Date
}

export interface ListVenueQueryInputDto {
    offset: number
    limit: number
    search: string
}

@Injectable()
export class ListVenueQuery {
    constructor(
        @Inject('IVenueRepository')
        private readonly venueRepository: IVenueRepository,
    ) { }

    async execute(params: ListVenueQueryInputDto): Promise<Pagination<ListVenueQueryOutputDto>> {

        const response = await this.venueRepository.findAll()

        const venues = response.map(item => ({
            id: item.id,
            ownerId: item.ownerId,
            capacity: item.capacity,
            description: item.description,
            title: item.title,
            pricePerDay: item.pricePerDay,
            status: item.status,
            venueType: item.venueType,
            addressLine1: item.address.addressLine1,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        }))

        return new Pagination({
            data: venues,
            total: response.length,
            offset: 0,
            limit: params.limit
        })

    }
}
