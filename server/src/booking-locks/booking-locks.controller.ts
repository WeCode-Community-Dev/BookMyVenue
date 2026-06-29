import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { BookingLocksService } from './booking-locks.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { User, UserRole } from '../users/entities/user.entity';

@ApiTags('Booking Locks')
@Controller('bookings/lock')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
export class BookingLocksController {
  constructor(private readonly locksService: BookingLocksService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Lock a time slot', description: 'Temporarily locks a slot for 5 minutes' })
  @ApiResponse({ status: 201, description: 'Slot locked' })
  @ApiResponse({ status: 409, description: 'Slot already locked/booked' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        venueId: { type: 'string', example: 'uuid-of-venue' },
        bookingDate: { type: 'string', example: '2025-06-15' },
        endDate: { type: 'string', example: '2025-06-16' },
        startTime: { type: 'string', example: '10:00' },
        endTime: { type: 'string', example: '14:00' },
      },
      required: ['venueId', 'bookingDate', 'startTime', 'endTime'],
    },
  })
  async lockSlot(
    @Body() body: { venueId: string; bookingDate: string; endDate?: string; startTime: string; endTime: string },
    @CurrentUser() user: User,
  ) {
    return this.locksService.lockSlot(body.venueId, body.bookingDate, body.startTime, body.endTime, user.id, body.endDate);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Release a lock' })
  @ApiResponse({ status: 200, description: 'Lock released' })
  @ApiParam({ name: 'id', description: 'Lock UUID' })
  async releaseLock(@Param('id') id: string, @CurrentUser() user: User) {
    return this.locksService.releaseLock(id, user.id);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active lock' })
  @ApiResponse({ status: 200, description: 'Active lock or null' })
  async getActiveLock(@CurrentUser() user: User) {
    return this.locksService.getUserActiveLock(user.id);
  }
}
