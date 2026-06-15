import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { GetUserProfileQuery } from '../../../core/application/users/queries/get-user-profile.query';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { InfraModule } from '../../../infra/infra.module';
import { ListUsersQuery } from 'src/core/application/users/queries/list-users.query';

@Module({
  imports: [InfraModule],
  controllers: [UsersController],
  providers: [GetUserProfileQuery, ListUsersQuery, JwtAuthGuard],
})
export class UsersModule { }
