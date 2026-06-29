import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole, UserStatus } from '../users/entities/user.entity';
import { VenueStatus } from '../venues/entities/venue.entity';
import { BookingStatus } from '../bookings/entities/booking.entity';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth('JWT-auth')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'List users', description: 'Admin: list all users with filters' })
  @ApiResponse({ status: 200, description: 'User list' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  @ApiQuery({ name: 'status', required: false, enum: UserStatus })
  @ApiQuery({ name: 'search', required: false, type: String })
  async getUsers(
    @Query('page') page?: number, @Query('limit') limit?: number,
    @Query('role') role?: UserRole, @Query('status') status?: UserStatus,
    @Query('search') search?: string,
  ) {
    return this.adminService.getUsers(page ? +page : 1, limit ? +limit : 20, role, status, search);
  }

  @Patch('users/:id/status')
  @ApiOperation({ summary: 'Block/unblock user' })
  @ApiResponse({ status: 200, description: 'Status updated' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiBody({ schema: { type: 'object', properties: { status: { type: 'string', enum: Object.values(UserStatus) }, reason: { type: 'string', nullable: true } } } })
  async updateUserStatus(
    @Param('id') id: string,
    @Body() body: { status: UserStatus; reason?: string },
  ) {
    return this.adminService.updateUserStatus(id, body.status, body.reason);
  }

  @Get('venue-owners')
  @ApiOperation({ summary: 'List venue owners', description: 'Admin: list all venue owner accounts' })
  @ApiResponse({ status: 200, description: 'Venue owner list' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  async getVenueOwners(
    @Query('page') page?: number, @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.adminService.getVenueOwners(page ? +page : 1, limit ? +limit : 20, search);
  }

  @Get('venues')
  @ApiOperation({ summary: 'List all venues', description: 'Admin: list venues with status filter' })
  @ApiResponse({ status: 200, description: 'Venue list' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: VenueStatus })
  async getVenues(
    @Query('page') page?: number, @Query('limit') limit?: number,
    @Query('status') status?: VenueStatus,
  ) {
    return this.adminService.getVenues(page ? +page : 1, limit ? +limit : 20, status);
  }

  @Patch('venues/:id/status')
  @ApiOperation({ summary: 'Approve/reject/suspend venue' })
  @ApiResponse({ status: 200, description: 'Venue status updated' })
  @ApiParam({ name: 'id', description: 'Venue UUID' })
  @ApiBody({ schema: { type: 'object', properties: { status: { type: 'string', enum: Object.values(VenueStatus) }, reason: { type: 'string', nullable: true } } } })
  async updateVenueStatus(
    @Param('id') id: string,
    @Body() body: { status: VenueStatus; reason?: string },
  ) {
    return this.adminService.updateVenueStatus(id, body.status, body.reason);
  }

  @Get('bookings')
  @ApiOperation({ summary: 'Monitor bookings', description: 'Admin: list all bookings' })
  @ApiResponse({ status: 200, description: 'Booking list' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: BookingStatus })
  async getBookings(
    @Query('page') page?: number, @Query('limit') limit?: number,
    @Query('status') status?: BookingStatus,
  ) {
    return this.adminService.getBookings(page ? +page : 1, limit ? +limit : 20, status);
  }

  @Patch('bookings/:id/status')
  @ApiOperation({ summary: 'Update booking status', description: 'Admin override for booking status' })
  @ApiParam({ name: 'id', description: 'Booking UUID' })
  @ApiBody({ schema: { type: 'object', properties: { bookingStatus: { type: 'string', enum: Object.values(BookingStatus) } } } })
  async updateBookingStatus(@Param('id') id: string, @Body('bookingStatus') bookingStatus: BookingStatus) {
    return this.adminService.updateBookingStatus(id, bookingStatus);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Platform analytics', description: 'Admin: get platform-wide stats and analytics' })
  @ApiResponse({ status: 200, description: 'Analytics data' })
  async getAnalytics() {
    return this.adminService.getAnalytics();
  }
}
