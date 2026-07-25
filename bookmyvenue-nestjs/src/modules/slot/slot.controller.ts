import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuthenticatedRequest } from '../auth/types/authenticated-request.type';
import { Public } from '../../shared/decorators/public.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { SlotService } from './slot.service';

@ApiTags('Venue Slots')
@Controller()
export class SlotController {
  constructor(private readonly slotService: SlotService) {}

  @ApiBearerAuth()
  @Roles(Role.OWNER)
  @Post('venues/:venueId/slots')
  @ApiOperation({ summary: 'Create one-time or recurring slots for an approved owner venue' })
  async create(
    @Param('venueId', ParseUUIDPipe) venueId: string,
    @Body() dto: CreateSlotDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return {
      success: true,
      message: 'Slot request processed successfully.',
      data: await this.slotService.create(venueId, req.user.sub, dto),
    };
  }

  @Public()
  @Get('venues/:venueId/slots')
  @ApiOperation({ summary: 'Get public future active slots for a venue' })
  async findPublicVenueSlots(
    @Param('venueId', ParseUUIDPipe) venueId: string,
  ) {
    return {
      success: true,
      data: await this.slotService.findPublicVenueSlots(venueId),
    };
  }

  @ApiBearerAuth()
  @Roles(Role.OWNER)
  @Get('venues/:venueId/slots/me')
  @ApiOperation({ summary: 'Get all slots for the current owner venue' })
  async findOwnerVenueSlots(
    @Param('venueId', ParseUUIDPipe) venueId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return {
      success: true,
      data: await this.slotService.findOwnerVenueSlots(venueId, req.user.sub),
    };
  }

  @ApiBearerAuth()
  @Roles(Role.OWNER)
  @Patch('slots/:slotId')
  @ApiOperation({ summary: 'Update owner slot' })
  async update(
    @Param('slotId', ParseUUIDPipe) slotId: string,
    @Body() dto: UpdateSlotDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return {
      success: true,
      message: 'Slot updated successfully.',
      data: await this.slotService.update(slotId, req.user.sub, dto),
    };
  }

  @ApiBearerAuth()
  @Roles(Role.OWNER)
  @Patch('slots/:slotId/deactivate')
  @ApiOperation({ summary: 'Deactivate owner slot' })
  async deactivate(
    @Param('slotId', ParseUUIDPipe) slotId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return {
      success: true,
      message: 'Slot deactivated successfully.',
      data: await this.slotService.deactivate(slotId, req.user.sub),
    };
  }
}