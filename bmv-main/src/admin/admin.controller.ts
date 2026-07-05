import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

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


  
}
