import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { GetUserProfileQuery } from '../../../core/application/users/queries/get-user-profile.query';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { InfraModule } from '../../../infra/infra.module';

@Module({
  imports: [InfraModule],
  controllers: [UsersController],
  providers: [GetUserProfileQuery, JwtAuthGuard],
})
export class UsersModule {}
