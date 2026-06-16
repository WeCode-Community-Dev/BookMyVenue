import { Injectable, Inject } from '@nestjs/common';
import type { IVenueRepository } from 'src/core/domain/venues/repositories/venue-repository.interface';
import { Pagination } from '../../_shared/dto/pagination';


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

    async execute(params: ListVenueQueryInputDto): Promise<Pagination<any>> {

        const response = await this.venueRepository.findAll()

        return new Pagination(response, response.length, 1, params.limit)

    }
}
