import { Module, Global } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
      defaults: {
        from: `"BookMyVenue Support" <${process.env.EMAIL_USER}>`,
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}