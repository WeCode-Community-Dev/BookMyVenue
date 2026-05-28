import {
  Controller,
  Get,
  Post,
  Patch,
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
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { User, UserRole } from '../users/entities/user.entity';
import { BookingStatus } from './entities/booking.entity';

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Create a booking', description: 'Book a venue for a time slot. Optionally provide a lock ID.' })
  @ApiResponse({ status: 201, description: 'Booking created' })
  @ApiResponse({ status: 409, description: 'Time slot already booked' })
  @ApiResponse({ status: 400, description: 'Invalid or expired booking lock' })
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @CurrentUser() user: User,
  ) {
    return this.bookingsService.create(createBookingDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get my bookings', description: 'Returns bookings made by the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of user bookings with pagination' })
  @ApiQuery({ name: 'status', required: false, enum: BookingStatus, description: 'Filter by status' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findMyBookings(
    @CurrentUser() user: User,
    @Query('status') status?: BookingStatus,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.bookingsService.findUserBookings(
      user.id,
      status,
      page ? +page : 1,
      limit ? +limit : 10,
    );
  }

  @Get('owner')
  @UseGuards(RolesGuard)
  @Roles(UserRole.VENUE_OWNER)
  @ApiOperation({ summary: 'Get bookings for my venues', description: 'Returns all bookings across the owner\'s venues' })
  @ApiResponse({ status: 200, description: 'Owner booking list' })
  @ApiQuery({ name: 'status', required: false, enum: BookingStatus })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findOwnerBookings(
    @CurrentUser() user: User,
    @Query('status') status?: BookingStatus,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.bookingsService.findOwnerBookings(
      user.id,
      status,
      page ? +page : 1,
      limit ? +limit : 10,
    );
  }

  @Get('venue/:venueId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.VENUE_OWNER)
  @ApiOperation({ summary: 'Get bookings for a specific venue', description: 'Owner-only: list bookings for one venue' })
  @ApiResponse({ status: 200, description: 'Venue booking list' })
  @ApiResponse({ status: 403, description: 'Access denied — not your venue' })
  @ApiParam({ name: 'venueId', description: 'Venue UUID' })
  async findVenueBookings(
    @Param('venueId') venueId: string,
    @CurrentUser() user: User,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.bookingsService.findVenueBookings(
      venueId,
      user.id,
      page ? +page : 1,
      limit ? +limit : 10,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking details', description: 'Returns details of a single booking' })
  @ApiResponse({ status: 200, description: 'Booking details' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiParam({ name: 'id', description: 'Booking UUID' })
  async findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update booking status',
    description: 'Owner can accept/reject; user can cancel; admin can do all',
  })
  @ApiResponse({ status: 200, description: 'Status updated' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiParam({ name: 'id', description: 'Booking UUID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        bookingStatus: {
          type: 'string',
          enum: Object.values(BookingStatus),
          example: BookingStatus.CONFIRMED,
        },
      },
      required: ['bookingStatus'],
    },
  })
  async updateStatus(
    @Param('id') id: string,
    @Body('bookingStatus') bookingStatus: BookingStatus,
    @CurrentUser() user: User,
  ) {
    return this.bookingsService.updateStatus(id, bookingStatus, user);
  }
}
