import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule,PrismaModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
