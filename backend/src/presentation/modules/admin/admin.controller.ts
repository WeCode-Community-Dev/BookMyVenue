import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ListVenueQuery } from 'src/core/application/admin/queries/list-venues.query';
import { UserRole } from 'src/core/domain/_shared/enum/UserRole';
import { Roles } from 'src/presentation/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/presentation/guards/jwt-auth.guard';
import { RolesGuard } from 'src/presentation/guards/roles.guard';

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
    private readonly listVenuesQuery: ListVenueQuery
  ) { }

  @Get('list/venues')
  create() {
    return this.listVenuesQuery.execute({ limit: 20, offset: 0, search: '' })
  }

}
