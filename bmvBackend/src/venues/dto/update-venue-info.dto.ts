import { PartialType } from '@nestjs/mapped-types';
import { CreateVenueDto } from './create-venue.dto';

/**
 * All fields from CreateVenueDto become optional.
 * Used for PUT /venues/:venueId/info to allow partial updates.
 */
export class UpdateVenueInfoDto extends PartialType(CreateVenueDto) {}
