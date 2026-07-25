import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null;
  private readonly mailFrom?: string;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('MAIL_HOST');
    const port = Number(this.configService.get<string>('MAIL_PORT'));
    const user = this.configService.get<string>('MAIL_USER');
    const pass = this.configService.get<string>('MAIL_PASSWORD');
    this.mailFrom = this.configService.get<string>('MAIL_FROM') || undefined;

    if (!host || !port || !user || !pass || !this.mailFrom) {
      this.logger.warn('Mail configuration is incomplete. Email notifications will be skipped.');
      this.transporter = null;
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: false,
      auth: {
        user,
        pass,
      },
    });
  }

  private async sendMail(options: { to: string; subject: string; html: string }) {
    if (!this.transporter || !this.mailFrom) {
      this.logger.warn(`Skipping email to ${options.to} because mail transport is not configured.`);
      return;
    }

    try {
      await this.transporter.sendMail({
        from: this.mailFrom,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async sendForgotPasswordOtp(email: string, otp: string): Promise<void> {
    await this.sendMail({
      to: email,
      subject: 'BookMyVenue Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
          <h2>BookMyVenue</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password.</p>
          <p>Your One-Time Password (OTP) is:</p>
          <h1 style="letter-spacing:5px; color:#2c3e50;">${otp}</h1>
          <p>This OTP is valid for <strong>10 minutes</strong>.</p>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
          <br>
          <p>Regards,</p>
          <p><strong>BookMyVenue Team</strong></p>
        </div>
      `,
    });
  }

  async sendEmailVerificationOtp(email: string, otp: string): Promise<void> {
    await this.sendMail({
      to: email,
      subject: 'Verify Your BookMyVenue Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
          <h2>Welcome to BookMyVenue</h2>
          <p>Thank you for creating your account.</p>
          <p>Your email verification OTP is:</p>
          <h1 style="letter-spacing:5px;">${otp}</h1>
          <p>This OTP is valid for <strong>10 minutes</strong>.</p>
          <p>If you did not create this account, please ignore this email.</p>
          <br>
          <p>Regards,</p>
          <p><strong>BookMyVenue Team</strong></p>
        </div>
      `,
    });
  }

  async sendVenueApprovedEmail(email: string, venueName: string): Promise<void> {
    await this.sendMail({
      to: email,
      subject: 'Your Venue Has Been Approved',
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
          <h2>Congratulations!</h2>
          <p>Your venue <strong>${venueName}</strong> has been approved by our admin team.</p>
          <p>Your venue is now visible to users and can start receiving bookings.</p>
          <br>
          <p>Thank you for choosing BookMyVenue.</p>
          <br>
          <p>Regards,</p>
          <p><strong>BookMyVenue Team</strong></p>
        </div>
      `,
    });
  }

  async sendVenueRejectedEmail(email: string, venueName: string, reason: string): Promise<void> {
    await this.sendMail({
      to: email,
      subject: 'Your Venue Application Was Reviewed',
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
          <h2>Venue Application Rejected</h2>
          <p>Your venue <strong>${venueName}</strong> could not be approved at this time.</p>
          <p><strong>Reason:</strong></p>
          <p style="background:#f5f5f5;padding:12px;border-radius:6px;">${reason}</p>
          <p>Please update your venue information and submit it again for review.</p>
          <br>
          <p>Regards,</p>
          <p><strong>BookMyVenue Team</strong></p>
        </div>
      `,
    });
  }
}
