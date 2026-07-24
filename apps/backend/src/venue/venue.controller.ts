import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VenueService } from './venue.service';
import { CreateVenueDto } from './dto/create-venue.dto';

import type { AuthRequest } from 'src/types/auth.request.interface';

interface UploadedFile {
  buffer: Buffer;
}
function parseJson<T>(value: string): T {
  return JSON.parse(value) as T;
}
@Controller('venue')
export class VenueController {
  constructor(private readonly venueService: VenueService) {}
  @Post('add')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 10))
  createVenue(
    @UploadedFiles() files: UploadedFile[],
    @Body() body: Record<string, string>,
    @Request() req: AuthRequest,
  ) {
    const dto: CreateVenueDto = {
      name: body.name,
      description: body.description,
      venueType: body.venueType as CreateVenueDto['venueType'],

      capacityMin: Number(body.capacityMin),
      capacityMax: Number(body.capacityMax),

      addressLine: body.addressLine,
      city: body.city,

      latitude: Number(body.latitude),
      longitude: Number(body.longitude),

      categories: JSON.parse(body.categories) as CreateVenueDto['categories'],

      amenities: JSON.parse(body.amenities) as CreateVenueDto['amenities'],

      slotTemplates: parseJson<CreateVenueDto['slotTemplates']>(
        body.slotTemplates,
      ),
    };

    return this.venueService.createVenue(dto, files, req.user.id);
  }

  @Get('my-venues')
  @UseGuards(JwtAuthGuard)
  getMyVenues(@Request() req: AuthRequest) {
    return this.venueService.getMyVenues(req.user.id);
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard)
  getPendingVenues(@Request() req: AuthRequest) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Only administrators can access pending venues.',
      );
    }
    return this.venueService.getPendingVenues();
  }

  @Post('approve/:id')
  @UseGuards(JwtAuthGuard)
  approveVenue(@Param('id') id: string, @Request() req: AuthRequest) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only administrators can approve venues.');
    }
    return this.venueService.approveVenue(id);
  }

  @Post('reject/:id')
  @UseGuards(JwtAuthGuard)
  rejectVenue(
    @Param('id') id: string,
    @Body('rejectionNote') rejectionNote: string,
    @Request() req: AuthRequest,
  ) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only administrators can reject venues.');
    }
    return this.venueService.rejectVenue(id, rejectionNote);
  }

  @Get('all')
  getAllVenues() {
    return this.venueService.getAllVenues();
  }

  @Get(':id')
  getVenueById(@Param('id') id: string) {
    return this.venueService.getVenueById(id);
  }
}
