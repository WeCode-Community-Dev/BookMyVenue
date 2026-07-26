import { Controller, Get, Request, UseGuards } from '@nestjs/common';
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
}
