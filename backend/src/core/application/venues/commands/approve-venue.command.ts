import { Injectable, Inject } from '@nestjs/common';
import { type IVenueRepository } from '../../../domain/venues/repositories/venue-repository.interface';
import { NotFoundException } from '../../../domain/_shared/exception/notfound.exception';
import { BusinessRuleException } from '../../../domain/_shared/exception/business-rule.exception';

export interface ApproveVenueDto {
  venueId: string;
  userRole: string;
  approve: boolean;
}

@Injectable()
export class ApproveVenueCommand {
  constructor(
    @Inject('IVenueRepository')
    private readonly venueRepository: IVenueRepository,
  ) { }

  async execute(dto: ApproveVenueDto): Promise<void> {
    if (dto.userRole !== 'ADMIN') {
      throw new BusinessRuleException('Only admins can approve or reject venues');
    }

    const venue = await this.venueRepository.findById(dto.venueId);
    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    if (dto.approve) {
      venue.approve();
    } else {
      venue.reject();
    }

    await this.venueRepository.save(venue);
  }
}
