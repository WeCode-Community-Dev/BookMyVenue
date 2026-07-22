import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { VenueService } from './venue.service';
import { CreateVenueDto } from './dto/create.venue.dto';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { BlockVenueDatesDto } from './dto/block-venue-dates.dto';
import { UpdateBookingApprovalDto } from './dto/update-booking-approval.dto';

@ApiTags('venue')
@Controller('venue')
export class VenueController {
  constructor(private readonly venueService: VenueService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new venue' })
  @ApiResponse({ status: 201, description: 'Venue created successfully.' })
  createVenue(@Req() req, @Body() createVenueDto: CreateVenueDto) {
    return this.venueService.createVenue(req.user.userId, createVenueDto);
  }

  @Get('my-venues')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.VENUE_OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get venues managed by the current owner' })
  getAllVenues(@Req() req) {
    return this.venueService.getAllVenues(req.user.userId);
  }

  @Get(':venueId/availability')
  @ApiOperation({ summary: 'Get venue availability, blocked dates, and reserved dates' })
  getVenueAvailability(@Param('venueId') venueId: string) {
    return this.venueService.getVenueAvailability(venueId);
  }

  @Post(':venueId/blocked-slots')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENUE_OWNER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Block venue dates from booking' })
  blockVenueDates(@Param('venueId') venueId: string, @Body() dto: BlockVenueDatesDto, @Req() req) {
    return this.venueService.blockVenueDates(venueId, req.user.userId, dto);
  }

  @Patch(':venueId/booking-approval')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENUE_OWNER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enable or disable owner approval before payment' })
  updateBookingApproval(@Param('venueId') venueId: string, @Body() dto: UpdateBookingApprovalDto, @Req() req) {
    return this.venueService.updateBookingApproval(venueId, req.user.userId, dto);
  }
}
