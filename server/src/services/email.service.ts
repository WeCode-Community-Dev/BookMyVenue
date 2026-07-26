import { Resend } from 'resend';
import { z } from 'zod';
import { EmailIntent, type EmailIntentType } from '../constants/email.constants';
import { resendConfig } from '../constants/env';
import { logError, logInfo } from '../utils/logger';
import {
  getPasswordResetTemplate,
  getPasswordChangedTemplate,
  getBookingConfirmationTemplate,
  getRefundNotificationTemplate,
  getBookingCancellationTemplate,
  getVenueApprovedTemplate,
  getVenueRejectedTemplate,
  getVenueSuspendedTemplate,
  getVenueUnsuspendedTemplate,
  getVenueDeadlineExtendedTemplate,
  getAdminPasswordResetTemplate,
  getUserBannedTemplate,
  getUserUnbannedTemplate,
  getReviewRemovedTemplate,
  getReviewRestoredTemplate,
} from './emailTemplateFactory';

// Validates required email configuration on startup.
export function validateEmailConfig(): void {
  const missing: string[] = [];

  if (!resendConfig.apiKey) missing.push('RESEND_API_KEY');
  if (!resendConfig.fromName) missing.push('EMAIL_FROM_NAME');
  if (!resendConfig.fromEmail) missing.push('EMAIL_FROM_EMAIL');
  if (!resendConfig.devToEmail) missing.push('RESEND_DEV_EMAIL_ADDRESS');
  if (!resendConfig.frontendUrl) missing.push('FRONTEND_URL');

  if (missing.length > 0) {
    logError('Missing required email environment variables', {
      module: 'email.service.ts/validateEmailConfig',
      missing,
    });
    process.exit(1);
  }

  logInfo('Email config validated');
}

let _resend: Resend | null = null;

function getResendClient(): Resend {
  if (!_resend) {
    if (!resendConfig.apiKey) {
      throw new Error('RESEND_API_KEY is not set');
    }
    _resend = new Resend(resendConfig.apiKey);
  }
  return _resend;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
}

// Email input validation
const emailAddressSchema = z.email('Invalid recipient email address');

function validateRecipient(email: string): string {
  if (process.env.NODE_ENV === 'development') {
    const res = resendConfig.devToEmail ?? '';
    if (!emailAddressSchema.safeParse(res).success) {
      throw new Error('Invalid development recipient email address');
    }
    return res;
  }
  return emailAddressSchema.parse(email);
}

// Core send helper
async function sendEmail(
  to: string,
  subject: string,
  html: string,
  intent: EmailIntentType
): Promise<SendEmailResult> {
  const from = `${resendConfig.fromName ?? ''} <${resendConfig.fromEmail ?? ''}>`;

  try {
    const resend = getResendClient();
    const { data, error } = await resend.emails.send({ from, to, subject, html });

    if (error) {
      logError('Email delivery failed', {
        module: 'email.service.ts/sendEmail',
        intent,
        recipient: to,
        providerError: error.message,
      });
      return { success: false };
    }

    logInfo('Email sent successfully', {
      intent,
      recipient: to,
      messageId: data.id,
    });

    return { success: true, messageId: data.id };
  } catch (e) {
    const err = e as Error;
    logError('Email service encountered an unexpected error', {
      module: 'email.service.ts/sendEmail',
      intent,
      recipient: to,
      error: err.message,
    });
    return { success: false };
  }
}

class EmailService {
  // Sends a password reset email.
  // @param email     - Recipient email address
  // @param resetLink - Fully-qualified HTTPS reset URL (token included)
  async sendPasswordResetEmail(email: string, resetLink: string): Promise<SendEmailResult> {
    const validatedRecipientEmail = validateRecipient(email);
    const appName = resendConfig.appName;
    const html = getPasswordResetTemplate(resetLink, email);

    return sendEmail(
      validatedRecipientEmail,
      `Reset your ${appName} password`,
      html,
      'password_reset'
    );
  }

  // Sends an admin password reset email
  async sendAdminPasswordResetEmail(
    email: string,
    newPassword: string,
    username: string
  ): Promise<SendEmailResult> {
    const validatedRecipientEmail = validateRecipient(email);
    const appName = resendConfig.appName;
    const html = getAdminPasswordResetTemplate(newPassword, username);

    return sendEmail(
      validatedRecipientEmail,
      `Your ${appName} password has been reset`,
      html,
      'admin_password_reset'
    );
  }

  // Sends a security notification informing the user that their password was changed.
  // @param email - Recipient email address
  async sendPasswordChangedEmail(email: string): Promise<SendEmailResult> {
    const validatedRecipientEmail = validateRecipient(email);
    const appName = resendConfig.appName;
    const html = getPasswordChangedTemplate();

    return sendEmail(
      validatedRecipientEmail,
      `Your ${appName} password was changed`,
      html,
      'security_alert'
    );
  }

  // Booking flow emails
  // Sends a booking confirmation email to the customer.
  // @param email  - Customer email address
  // @param details - Booking details for rendering the email body
  async sendBookingConfirmation(
    email: string,
    details: {
      venueName: string;
      date: string;
      startTime: string;
      endTime: string;
      amount: number;
      paymentReference: string;
    }
  ): Promise<SendEmailResult> {
    const validatedRecipientEmail = validateRecipient(email);
    const html = getBookingConfirmationTemplate(details);

    return sendEmail(
      validatedRecipientEmail,
      `Booking Confirmed – ${details.venueName} on ${details.date}`,
      html,
      EmailIntent.BOOKING_CONFIRMATION
    );
  }

  // Sends a refund notification to the customer when their booking fails
  // due to a slot collision after the lock TTL expired.
  async sendRefundNotification(
    email: string,
    details: {
      venueName: string;
      date: string;
      startTime: string;
      endTime: string;
      amount: number;
      refundReference: string;
    }
  ): Promise<SendEmailResult> {
    const validatedRecipientEmail = validateRecipient(email);
    const html = getRefundNotificationTemplate(details);

    return sendEmail(
      validatedRecipientEmail,
      `Booking Failed – Full Refund Initiated for ${details.venueName}`,
      html,
      EmailIntent.BOOKING_REFUND
    );
  }

  // Sends a cancellation notification with refund details.
  async sendBookingCancellationEmail(
    email: string,
    details: {
      venueName: string;
      date: string;
      timeRange: string;
      refundAmount: number;
      bookingRef: string;
    }
  ): Promise<SendEmailResult> {
    const validatedRecipientEmail = validateRecipient(email);
    const html = getBookingCancellationTemplate(details);

    return sendEmail(
      validatedRecipientEmail,
      `Booking Cancelled – ${details.venueName}`,
      html,
      EmailIntent.BOOKING_CANCELLATION
    );
  }

  // Venue status emails
  async sendVenueApprovedEmail(email: string, venueName: string): Promise<SendEmailResult> {
    const validatedRecipientEmail = validateRecipient(email);
    const html = getVenueApprovedTemplate(venueName);

    return sendEmail(
      validatedRecipientEmail,
      `Your Venue "${venueName}" has been Approved!`,
      html,
      EmailIntent.VENUE_APPROVED
    );
  }

  async sendVenueRejectedEmail(
    email: string,
    venueName: string,
    reason: string,
    editDeadline: Date,
    submissionNumber: number
  ): Promise<SendEmailResult> {
    const validatedRecipientEmail = validateRecipient(email);
    const html = getVenueRejectedTemplate(venueName, reason, editDeadline, submissionNumber);

    return sendEmail(
      validatedRecipientEmail,
      `Application Update: Venue "${venueName}"`,
      html,
      EmailIntent.VENUE_REJECTED
    );
  }

  async sendVenueSuspendedEmail(
    email: string,
    venueName: string,
    reason: string
  ): Promise<SendEmailResult> {
    const validatedRecipientEmail = validateRecipient(email);
    const html = getVenueSuspendedTemplate(venueName, reason);

    return sendEmail(
      validatedRecipientEmail,
      `Important: Your Venue "${venueName}" has been Suspended`,
      html,
      EmailIntent.VENUE_SUSPENDED
    );
  }

  async sendVenueUnsuspendedEmail(email: string, venueName: string): Promise<SendEmailResult> {
    const validatedRecipientEmail = validateRecipient(email);
    const html = getVenueUnsuspendedTemplate(venueName);

    return sendEmail(
      validatedRecipientEmail,
      `Your Venue "${venueName}" has been Reactivated`,
      html,
      EmailIntent.VENUE_UNSUSPENDED
    );
  }

  async sendVenueDeadlineExtendedEmail(
    email: string,
    venueName: string,
    newDeadline: Date
  ): Promise<SendEmailResult> {
    const validatedRecipientEmail = validateRecipient(email);
    const html = getVenueDeadlineExtendedTemplate(venueName, newDeadline);

    return sendEmail(
      validatedRecipientEmail,
      `Edit Deadline Extended for "${venueName}"`,
      html,
      EmailIntent.VENUE_UNSUSPENDED // reuse existing intent or create new one
    );
  }

  // Moderation emails
  async sendUserBannedEmail(
    email: string,
    details: {
      scope: string;
      reason: string;
      expiresAt: Date | null;
      venueName?: string;
    }
  ): Promise<SendEmailResult> {
    const validatedRecipientEmail = validateRecipient(email);
    const html = getUserBannedTemplate(
      details.scope,
      details.reason,
      details.expiresAt,
      details.venueName
    );

    return sendEmail(
      validatedRecipientEmail,
      'Account Restriction Applied',
      html,
      EmailIntent.USER_BANNED
    );
  }

  async sendUserUnbannedEmail(email: string): Promise<SendEmailResult> {
    const validatedRecipientEmail = validateRecipient(email);
    const html = getUserUnbannedTemplate();

    return sendEmail(
      validatedRecipientEmail,
      'Account Restriction Lifted',
      html,
      EmailIntent.USER_UNBANNED
    );
  }

  async sendReviewRemovedEmail(
    email: string,
    details: {
      venueName: string;
      reason: string;
    }
  ): Promise<SendEmailResult> {
    const validatedRecipientEmail = validateRecipient(email);
    const html = getReviewRemovedTemplate(details.venueName, details.reason);

    return sendEmail(
      validatedRecipientEmail,
      'Your Review Has Been Removed',
      html,
      EmailIntent.REVIEW_REMOVED
    );
  }

  async sendReviewRestoredEmail(email: string, venueName: string): Promise<SendEmailResult> {
    const validatedRecipientEmail = validateRecipient(email);
    const html = getReviewRestoredTemplate(venueName);

    return sendEmail(
      validatedRecipientEmail,
      'Your Review Has Been Restored',
      html,
      EmailIntent.REVIEW_RESTORED
    );
  }
}

export const emailService = new EmailService();
