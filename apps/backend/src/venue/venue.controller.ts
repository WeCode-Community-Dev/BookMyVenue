import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
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

  @Get('all')
  getAllVenues(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.venueService.getAllVenues(Number(page), Number(limit));
  }

  @Get(':id')
  getVenueById(@Param('id') id: string) {
    return this.venueService.getVenueById(id);
  }
}
