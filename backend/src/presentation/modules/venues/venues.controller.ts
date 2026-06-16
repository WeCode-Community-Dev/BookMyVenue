import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CreateVenueCommand } from '../../../core/application/venues/commands/create-venue.command';
import { SearchVenuesQuery } from '../../../core/application/venues/queries/search-venues.query';
import { GetVenueDetailsQuery } from '../../../core/application/venues/queries/get-venue-details.query';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { type TokenPayload } from '../../../core/application/users/services/token.interface';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { createVenueSchema } from '../../validation/venues/create-venue.schema';
import { CreateVenueDto } from './dto/create-venue.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('venues')
@Controller({
  version: '1',
  path: 'venues',
})
@ApiBearerAuth('JWT-auth')
export class VenuesController {
  constructor(
    private readonly createVenueCommand: CreateVenueCommand,
    private readonly searchVenuesQuery: SearchVenuesQuery,
    private readonly getVenueDetailsQuery: GetVenueDetailsQuery,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new venue' })
  @ApiResponse({ status: 201, description: 'Venue created successfully' })
  create(
    @CurrentUser() user: TokenPayload,
    @Body(new ZodValidationPipe(createVenueSchema as any)) data: CreateVenueDto,
  ) {
    return this.createVenueCommand.execute({
      ownerId: user.userId,
      ...data,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Search and filter venues' })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'venueType', required: false })
  @ApiQuery({ name: 'capacity', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false })
  findAll(
    @Query('city') city?: string,
    @Query('venueType') venueType?: string,
    @Query('capacity') capacity?: string,
    @Query('status') status?: string,
  ) {
    return this.searchVenuesQuery.execute({
      city,
      venueType,
      capacity: capacity ? parseInt(capacity, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific venue by ID' })
  @ApiResponse({ status: 200, description: 'Venue found' })
  @ApiResponse({ status: 404, description: 'Venue not found' })
  findOne(@Param('id') id: string) {
    return this.getVenueDetailsQuery.execute(id);
  }

}
