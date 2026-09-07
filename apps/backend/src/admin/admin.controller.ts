import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { AuthRequest } from 'src/types/auth.request.interface';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  private verifyAdmin(req: AuthRequest) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Only administrators can access admin routes.',
      );
    }
  }

  @Get('dashboard')
  getDashboard(@Request() req: AuthRequest) {
    this.verifyAdmin(req);
    return this.adminService.getDashboardStats();
  }

  @Get('venues/pending')
  getPendingVenues(@Request() req: AuthRequest) {
    this.verifyAdmin(req);
    return this.adminService.getPendingVenues();
  }

  @Patch('venues/:id/approve')
  approveVenue(@Param('id') id: string, @Request() req: AuthRequest) {
    this.verifyAdmin(req);
    return this.adminService.approveVenue(id);
  }

  @Patch('venues/:id/reject')
  rejectVenue(
    @Param('id') id: string,
    @Body('rejectionNote') rejectionNote: string,
    @Request() req: AuthRequest,
  ) {
    this.verifyAdmin(req);
    return this.adminService.rejectVenue(id, rejectionNote);
  }
}
