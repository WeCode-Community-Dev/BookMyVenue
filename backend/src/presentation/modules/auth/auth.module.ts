import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { RegisterUserCommand } from '../../../core/application/users/commands/register-user.command';
import { LoginUserCommand } from '../../../core/application/users/commands/login-user.command';
import { RefreshAccessTokenCommand } from '../../../core/application/users/commands/refresh-access-token.command';
import { LogoutCommand } from '../../../core/application/users/commands/logout.command';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { InfraModule } from '../../../infra/infra.module';

@Module({
  imports: [InfraModule],
  controllers: [AuthController],
  providers: [
    RegisterUserCommand,
    LoginUserCommand,
    RefreshAccessTokenCommand,
    LogoutCommand,
    JwtAuthGuard,
  ],
})
export class AuthModule {}
