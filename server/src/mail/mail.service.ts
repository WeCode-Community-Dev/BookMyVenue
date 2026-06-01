import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private resend: Resend | null = null;
  private fromEmail = 'BookMyVenue <onboarding@resend.dev>'; // Default Resend test sending domain

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    const configuredFrom = this.configService.get<string>('MAIL_FROM');

    if (configuredFrom) {
      this.fromEmail = configuredFrom;
    }

    if (apiKey && apiKey !== 'your_resend_api_key' && apiKey.trim() !== '') {
      try {
        this.resend = new Resend(apiKey);
        this.logger.log('📧 Resend Email Service successfully initialized.');
      } catch (err) {
        this.logger.error(`Failed to initialize Resend: ${err.message}`);
      }
    } else {
      this.logger.warn(
        '⚠️ RESEND_API_KEY not configured in environment. All outbound emails will be printed to the server logs.',
      );
    }
  }

  /**
   * Sends a beautiful, professional email.
   * Falls back to logging if Resend is not configured.
   */
  async sendMail(to: string | string[], subject: string, htmlContent: string): Promise<boolean> {
    const recipients = Array.isArray(to) ? to : [to];

    if (this.resend) {
      try {
        this.logger.log(`Sending email to ${recipients.join(', ')} via Resend...`);
        let { data, error } = await this.resend.emails.send({
          from: this.fromEmail,
          to: recipients,
          subject: subject,
          html: htmlContent,
        });

        const isProduction = this.configService.get<string>('NODE_ENV') === 'production';

        // Intercept unverified domain errors (Only in development/test environments)
        if (error && error.message && error.message.includes('not verified') && !isProduction) {
          this.logger.warn(`
┌────────────────────────────────────────────────────────────────────────┐
│ 💡 RESEND DOMAIN VERIFICATION TIP                                     │
├────────────────────────────────────────────────────────────────────────┤
│ The domain in your MAIL_FROM is not verified on Resend.               │
│                                                                        │
│ To fix this:                                                           │
│ 1. Verify your domain at https://resend.com/domains                    │
│ 2. Or, change MAIL_FROM=onboarding@resend.dev in server/.env           │
│                                                                        │
│ ➡️ Retrying automatically using onboarding@resend.dev ...              │
└────────────────────────────────────────────────────────────────────────┘
          `);

          // Auto-retry with sandbox onboarding@resend.dev
          const retryResult = await this.resend.emails.send({
            from: 'BookMyVenue <onboarding@resend.dev>',
            to: recipients,
            subject: subject,
            html: htmlContent,
          });
          data = retryResult.data;
          error = retryResult.error;
        }

        // Intercept sandbox recipient restrictions (Only in development/test environments)
        if (error && error.message && error.message.includes('only send testing emails') && !isProduction) {
          const match = error.message.match(/own email address \(([^)]+)\)/);
          if (match && match[1]) {
            const sandboxEmail = match[1];
            this.logger.warn(`
┌────────────────────────────────────────────────────────────────────────┐
│ 💡 RESEND SANDBOX AUTO-FORWARD                                         │
├────────────────────────────────────────────────────────────────────────┤
│ Resend limits sandbox sends strictly to your registered email:         │
│ ➡️ ${sandboxEmail}                                                     │
│                                                                        │
│ We are automatically redirecting this email to your inbox so you can    │
│ view the dynamic HTML live!                                           │
└────────────────────────────────────────────────────────────────────────┘
            `);

            const sandboxRetry = await this.resend.emails.send({
              from: 'BookMyVenue <onboarding@resend.dev>',
              to: sandboxEmail,
              subject: `[Test Redirect: ${recipients.join(', ')}] ${subject}`,
              html: htmlContent,
            });
            data = sandboxRetry.data;
            error = sandboxRetry.error;
          }
        }

        if (error) {
          this.logger.error(`Resend API Error: ${JSON.stringify(error)}`);
          if (!isProduction) {
            this.logger.warn('Email sending failed. Displaying local fallback console preview.');
            this.logLocalEmail(recipients, subject, htmlContent);
          }
          return false;
        }

        this.logger.log(`✅ Email sent successfully! ID: ${data?.id}`);
        return true;
      } catch (error) {
        this.logger.error(`Resend send failure: ${error.message}`);
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
