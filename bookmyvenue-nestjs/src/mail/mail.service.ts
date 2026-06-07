import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendOtpEmail(email: string, name: string, otp: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Verify Your Email - BookMyVenue',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #333;">Welcome to BookMyVenue, ${name}!</h2>
            <p>Thank you for creating an account. Please use the verification code below to complete your registration:</p>
            <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #4CAF50; margin: 20px 0; border-radius: 4px;">
              ${otp}
            </div>
            <p style="color: #666; font-size: 14px;">This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
          </div>
        `,
      });
    } catch (error) {
      throw new Error(`Failed to send verification email: ${(error as any).message}`);
    }
  }
}