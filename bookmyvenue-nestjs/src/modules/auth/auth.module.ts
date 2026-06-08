import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MailModule } from '../../shared/mail/mail.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [MailModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule { }
