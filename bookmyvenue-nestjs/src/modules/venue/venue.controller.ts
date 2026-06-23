import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { VenueService } from './venue.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { Public } from '../../shared/decorators/public.decorator';

@Controller('venues')
export class VenueController {
  constructor(private readonly venueService: VenueService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  async createVenue(@Body() createVenueDto: CreateVenueDto, @Req() req: any) {
    const ownerId = req.user.sub; 
    const venue = await this.venueService.create(createVenueDto, ownerId);
    return { success: true, message: 'Venue submitted for admin verification.', data: venue };
  }
  @Public()
  @Get()
  async getAllApprovedVenues() {
    const venues = await this.venueService.findAllApproved();
    return { success: true, message: 'Approved venues fetched successfully.', data: venues };
  }

  @UseGuards(JwtAuthGuard)
  @Get('owner')
  async getMyVenues(@Req() req: any) {
    const ownerId = req.user.sub;
    const venues = await this.venueService.findOwnerVenues(ownerId);
    return { success: true, message: 'Your venues fetched successfully.', data: venues };
  }
}