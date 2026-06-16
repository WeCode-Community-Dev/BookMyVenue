import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApproveVenueCommand } from 'src/core/application/admin/commands/approve-venue.command';
import { RejectVenueCommand } from 'src/core/application/admin/commands/reject-venue.command';
import { ListVenueQuery } from 'src/core/application/admin/queries/list-venues.query';
import { UserRole } from 'src/core/domain/_shared/enum/UserRole';
import { Roles } from 'src/presentation/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/presentation/guards/jwt-auth.guard';
import { RolesGuard } from 'src/presentation/guards/roles.guard';
import { CreateUserDTO } from './dto/create-user';
import { CreateUserCommand } from 'src/core/application/admin/commands/create-user.command';

@ApiTags('admin')
@Controller({
  version: '1',
  path: 'admin',
})
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth('JWT-auth')
export class AdminController {
  constructor(
    private readonly listVenuesQuery: ListVenueQuery,
    private readonly approveVenueCommand: ApproveVenueCommand,
    private readonly rejectVenueCommand: RejectVenueCommand,
    private readonly createUserCommand: CreateUserCommand
  ) { }

  @Get('venues')
  create() {
    return this.listVenuesQuery.execute({ limit: 20, offset: 0, search: '' })
  }

  @Post('venues/:id/approve')
  approveVenue(@Param('id', ParseUUIDPipe) id: string) {
    return this.approveVenueCommand.execute(id)
  }

  @Post('venues/:id/reject')
  rejectVenue(@Param('id', ParseUUIDPipe) id: string) {
    return this.rejectVenueCommand.execute(id)
  }

  @Post('users')
  createUser(@Body() data: CreateUserDTO) {
    return this.createUserCommand.execute(data)
  }

}
