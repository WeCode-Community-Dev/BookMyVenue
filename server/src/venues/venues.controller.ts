import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { VenuesService } from './venues.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { VenueType } from './entities/venue.entity';

@ApiTags('Venues')
@Controller('venues')
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @Get()
  @ApiOperation({ summary: 'List all venues', description: 'Search and filter approved venues with pagination' })
  @ApiResponse({ status: 200, description: 'List of venues with pagination metadata' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 12 })
  @ApiQuery({ name: 'venueType', required: false, enum: VenueType })
  @ApiQuery({ name: 'minCapacity', required: false, type: Number })
  @ApiQuery({ name: 'maxCapacity', required: false, type: Number })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'minRating', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by name or address' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('venueType') venueType?: VenueType,
    @Query('minCapacity') minCapacity?: number,
    @Query('maxCapacity') maxCapacity?: number,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('minRating') minRating?: number,
    @Query('search') search?: string,
  ) {
    return this.venuesService.findAll({
      page: page ? +page : 1,
      limit: limit ? +limit : 12,
      venueType,
      minCapacity: minCapacity ? +minCapacity : undefined,
      maxCapacity: maxCapacity ? +maxCapacity : undefined,
      minPrice: minPrice ? +minPrice : undefined,
      maxPrice: maxPrice ? +maxPrice : undefined,
      minRating: minRating ? +minRating : undefined,
      search,
    });
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Find nearby venues', description: 'Discover venues near a location using Haversine formula' })
  @ApiResponse({ status: 200, description: 'List of nearby venues sorted by distance' })
  @ApiQuery({ name: 'latitude', required: true, type: Number, example: 13.0827 })
  @ApiQuery({ name: 'longitude', required: true, type: Number, example: 80.2707 })
  @ApiQuery({ name: 'radius', required: false, type: Number, example: 10, description: 'Radius in km (default 10)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  async findNearby(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radius') radius?: number,
    @Query('limit') limit?: number,
  ) {
    return this.venuesService.findNearby(
      +latitude,
      +longitude,
      radius ? +radius : 10,
      limit ? +limit : 20,
    );
  }

  @Get('my-venues')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.VENUE_OWNER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'List my venues', description: 'Returns all venues owned by the authenticated venue owner' })
  @ApiResponse({ status: 200, description: 'List of owned venues' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findMyVenues(
    @CurrentUser() user: User,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.venuesService.findByOwner(user.id, page ? +page : 1, limit ? +limit : 10);
  }

  @Get('geocode')
  @ApiOperation({ summary: 'Geocode an address', description: 'Safely geocode address string via backend proxy' })
  @ApiQuery({ name: 'q', required: true, type: String })
  async geocode(@Query('q') query: string) {
    return this.venuesService.geocode(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get venue details', description: 'Returns full details of a single venue' })
  @ApiResponse({ status: 200, description: 'Venue details' })
  @ApiResponse({ status: 404, description: 'Venue not found' })
  @ApiParam({ name: 'id', description: 'Venue UUID' })
  async findOne(@Param('id') id: string) {
    return this.venuesService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.VENUE_OWNER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a venue', description: 'Register a new venue (venue_owner only). Status defaults to pending.' })
  @ApiResponse({ status: 201, description: 'Venue created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — requires venue_owner role' })
  async create(
    @Body() createVenueDto: CreateVenueDto,
    @CurrentUser() user: User,
  ) {
    return this.venuesService.create(createVenueDto, user.id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.VENUE_OWNER, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a venue', description: 'Update venue details (owner or admin)' })
  @ApiResponse({ status: 200, description: 'Venue updated' })
  @ApiResponse({ status: 403, description: 'Not your venue' })
  @ApiResponse({ status: 404, description: 'Venue not found' })
  @ApiParam({ name: 'id', description: 'Venue UUID' })
  async update(
    @Param('id') id: string,
    @Body() updateVenueDto: UpdateVenueDto,
    @CurrentUser() user: User,
  ) {
    return this.venuesService.update(id, updateVenueDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.VENUE_OWNER, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a venue', description: 'Remove a venue listing (owner or admin)' })
  @ApiResponse({ status: 200, description: 'Venue deleted' })
  @ApiResponse({ status: 403, description: 'Not your venue' })
  @ApiResponse({ status: 404, description: 'Venue not found' })
  @ApiParam({ name: 'id', description: 'Venue UUID' })
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.venuesService.remove(id, user);
  }

  @Post(':id/blocked-dates')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.VENUE_OWNER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Block a date', description: 'Mark a date as unavailable for a venue' })
  @ApiResponse({ status: 201, description: 'Date blocked' })
  @ApiParam({ name: 'id', description: 'Venue UUID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        blockedDate: { type: 'string', example: '2025-12-25', description: 'Date to block (YYYY-MM-DD)' },
        reason: { type: 'string', example: 'Holiday closure' },
      },
      required: ['blockedDate', 'reason'],
    },
  })
  async addBlockedDate(
    @Param('id') venueId: string,
    @Body() body: { blockedDate: string; reason: string },
    @CurrentUser() user: User,
  ) {
    return this.venuesService.addBlockedDate(venueId, body.blockedDate, body.reason, user.id);
  }

  @Get(':id/blocked-dates')
  @ApiOperation({ summary: 'Get blocked dates', description: 'List all blocked dates for a venue' })
  @ApiResponse({ status: 200, description: 'List of blocked dates' })
  @ApiParam({ name: 'id', description: 'Venue UUID' })
  async getBlockedDates(@Param('id') venueId: string) {
    return this.venuesService.getBlockedDates(venueId);
  }

  @Delete('blocked-dates/:blockedDateId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.VENUE_OWNER, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Unblock a date', description: 'Remove a blocked date' })
  @ApiResponse({ status: 200, description: 'Blocked date removed' })
  @ApiParam({ name: 'blockedDateId', description: 'Blocked date UUID' })
  async removeBlockedDate(@Param('blockedDateId') id: string) {
    return this.venuesService.removeBlockedDate(id);
  }
}
