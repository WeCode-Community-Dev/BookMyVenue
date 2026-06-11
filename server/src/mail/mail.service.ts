import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private fromEmail = 'BookMyVenue <support@bookmyvenue.dev>'; // Default sender

  constructor(private configService: ConfigService) {
    const smtpHost = this.configService.get<string>('SMTP_HOST') || 'smtp.gmail.com';
    const smtpPort = this.configService.get<number>('SMTP_PORT') || 587;
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');
    const configuredFrom = this.configService.get<string>('MAIL_FROM');

    if (configuredFrom) {
      this.fromEmail = configuredFrom;
    } else if (smtpUser) {
      this.fromEmail = `BookMyVenue <${smtpUser}>`;
    }

    if (smtpUser && smtpPass) {
      try {
        this.transporter = nodemailer.createTransport({
          host: smtpHost,
          port: Number(smtpPort),
          secure: Number(smtpPort) === 465, // true for 465, false for other ports
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });
        this.logger.log('📧 SMTP Mail Service successfully initialized.');
      } catch (err) {
        this.logger.error(`Failed to initialize SMTP Mail: ${err.message}`);
      }
    } else {
      this.logger.warn(
        '⚠️ SMTP credentials (SMTP_USER/SMTP_PASS) not configured in environment. All outbound emails will be printed to the server logs.',
      );
    }
  }

  /**
   * Sends a beautiful, professional email.
   * Falls back to logging if SMTP is not configured.
   */
  async sendMail(to: string | string[], subject: string, htmlContent: string): Promise<boolean> {
    const recipients = Array.isArray(to) ? to : [to];

    if (this.transporter) {
      try {
        this.logger.log(`Sending email to ${recipients.join(', ')} via SMTP...`);
        const info = await this.transporter.sendMail({
          from: this.fromEmail,
          to: recipients.join(', '),
          subject: subject,
          html: htmlContent,
        });

        this.logger.log(`✅ Email sent successfully! MessageId: ${info.messageId}`);
        return true;
      } catch (error) {
        this.logger.error(`SMTP send failure: ${error.message}`);
        this.logLocalEmail(recipients, subject, htmlContent);
        return false;
      }
    } else {
      this.logLocalEmail(recipients, subject, htmlContent);
      return true;
    }
  }

  /**
   * Helper to strip HTML tags to show a readable plain-text console preview.
   */
  private stripHtml(html: string): string {
    return html
      .replace(/<style([\s\S]*?)<\/style>/gi, '')
      .replace(/<script([\s\S]*?)<\/script>/gi, '')
      .replace(/<\/div>/ig, '\n')
      .replace(/<\/li>/ig, '\n')
      .replace(/<\/p>/ig, '\n\n')
      .replace(/<br\s*\/?>/ig, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/\n\s*\n+/g, '\n\n')
      .trim();
  }

  /**
   * Formatted logging output for local development.
   */
  private logLocalEmail(recipients: string[], subject: string, htmlContent: string) {
    const plainText = this.stripHtml(htmlContent);
    const border = '═'.repeat(80);

    this.logger.log(`
${border}
📬 LOCAL EMAIL PREVIEW
${border}
TO:      ${recipients.join(', ')}
FROM:    ${this.fromEmail}
SUBJECT: ${subject}
${border}
${plainText}
${border}
    `);
  }
}
