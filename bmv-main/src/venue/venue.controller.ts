import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { VenueService } from './venue.service';
import { CreateVenueDto } from './dto/create.venue.dto';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorators';

@ApiTags('venue') // Groups the endpoints under "Venue" in Swagger
@Controller('venue')
export class VenueController {
  constructor(private readonly venueService: VenueService) {}
@UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new venue' })
  @ApiResponse({ status: 201, description: 'Venue created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UseGuards(JwtAuthGuard)
  createVenue(@Req() req, @Body() createVenueDto: CreateVenueDto) {
    return this.venueService.createVenue(req.user.userId, createVenueDto);
  }
  @UseGuards(JwtAuthGuard ,RolesGuard)
  @Roles(Role.ADMIN)
  @Get('my-venues')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all venues' })
  @ApiResponse({ status: 200, description: 'List of venues.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getAllVenues(@Req() req) {
    return this.venueService.getAllVenues(req.user.userId);
  }
}
