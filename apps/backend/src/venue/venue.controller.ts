import {
  Body,
  Controller,
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
@Controller('venue')
export class VenueController {
  constructor(private readonly venueService: VenueService) {}
  @Post('add')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 10))
  createVenue(
    @UploadedFiles() files: UploadedFile[],
    @Body() dto: CreateVenueDto,
    @Request() req: AuthRequest,
  ) {
    return this.venueService.createVenue(dto, files, req.user.id);
  }
}
