import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { VenuesService } from './venues.service';
import { PublicVenuesFilterDto } from './dto/public-venues-filter.dto';

@Controller('venues/public')
export class PublicVenuesController {
  constructor(private readonly venuesService: VenuesService) { }

  /**
   * GET /venues/public
   * List all approved venues with optional filters and pagination.
   */
  @Get()
  getPublicVenues(@Query() filters: PublicVenuesFilterDto) {
    return this.venuesService.findPublicVenues(filters);
  }

  /**
   * GET /venues/public/:id
   * Get full details of a specific approved venue.
   */
  @Get(':id')
  getPublicVenueDetail(@Param('id', ParseUUIDPipe) id: string) {
    return this.venuesService.findPublicVenueDetail(id);
  }

  /**
   * GET /venues/public/:id/check-availability
   * Check if a specific date is available (not booked or blocked).
   */
  @Get(':id/check-availability')
  checkAvailability(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('date') date: string,
  ) {
    return this.venuesService.checkAvailability(id, date);
  }
}
