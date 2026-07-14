import { Injectable, Inject } from '@nestjs/common';
import { type IVenueRepository } from '../../../domain/venues/repositories/venue-repository.interface';
import { NotFoundException } from '../../../domain/_shared/exception/notfound.exception';
import { BusinessRuleException } from '../../../domain/_shared/exception/business-rule.exception';


@Injectable()
export class ApproveVenueCommand {
  constructor(
    @Inject('IVenueRepository')
    private readonly venueRepository: IVenueRepository,
  ) { }

  async execute(venueId: string): Promise<{ message: string }> {

    const venue = await this.venueRepository.findById(venueId);
    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    venue.approve();

    await this.venueRepository.save(venue);

    return { message: 'Venue approved' }

  }
}
