import { Controller, Get, Patch, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { AuthRequest } from 'src/types/auth.request.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('my-bookings')
  @UseGuards(JwtAuthGuard)
  getMyBookings(@Request() req: AuthRequest) {
    return this.userService.getUserBookings(req.user.id);
  }

  @Patch('upgrade-to-owner')
  @UseGuards(JwtAuthGuard)
  upgradeToVenueOwner(@Request() req: AuthRequest) {
    return this.userService.upgradeToVenueOwner(req.user.id);
  }

  @Get('my-venues')
  @UseGuards(JwtAuthGuard)
  getMyVenues(@Request() req: AuthRequest) {
    return this.userService.getMyVenues(req.user.id);
  }
}
