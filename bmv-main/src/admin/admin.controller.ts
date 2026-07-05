import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RejectVenueDto } from './dto/reject-venue.dto';

@ApiTags('admin') // Groups the endpoints under "Admin" in Swagger
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('venues/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all pending venue applications',
  })
  getPendingVenues() {
    return this.adminService.getPendingVenues();
  }

  @Patch('venues/:venueId/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Approve a pending venue application',
    description:
      'Marks the specified pending venue as approved and moves it into active status.',
  })
  @ApiParam({
    name: 'venueId',
    required: true,
    description: 'Unique identifier of the venue application to approve',
    example: 'f4d8b0a6-2f5d-4c90-9c7b-b8c8d4c6a1fd',
  })
  @ApiResponse({
    status: 200,
    description: 'Venue approved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Requires admin privileges.',
  })
  @ApiResponse({
    status: 404,
    description: 'Venue not found.',
  })
  approveVenue(@Param('venueId') venueId: string) {
    return this.adminService.approveVenue(venueId);
  }

  @Patch('venues/:venueId/reject')
@ApiOperation({
  summary: 'Reject a venue',
})
@ApiResponse({
  status: 200,
  description: 'Venue rejected successfully.',
})
rejectVenue(
  @Param('venueId') venueId: string,
  @Body() rejectVenueDto: RejectVenueDto,
) {
  return this.adminService.rejectVenue(
    venueId,
    rejectVenueDto,
  );
}
}
