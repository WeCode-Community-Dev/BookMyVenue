import { resendConfig } from '../constants/env';
import { VENUE_CONSTANTS } from '../constants/venue.constants';

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildEmailWrapper(bodyContent: string): string {
  const appName = resendConfig.appName;
  const currentYear = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${appName}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
               style="max-width:600px;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color:#1d4ed8;padding:32px 40px;text-align:center;">
              <img src="${resendConfig.logoUrl}" alt="${appName}"
                   style="height:40px;width:auto;display:inline-block;"
                   width="auto" height="40" />
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              ${bodyContent}
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:0;" />
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;color:#6b7280;">
                This email was sent by ${appName}. If you have questions, reply to this email.
              </p>
              <p style="margin:0 0 8px;font-size:13px;color:#9ca3af;">
                If you did not request this, you can safely ignore this email.
                Your account remains secure and no action is required.
              </p>
              <p style="margin:0;font-size:12px;color:#d1d5db;">
                &copy; ${String(currentYear)} ${appName}. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function getPasswordResetTemplate(resetLink: string, email: string): string {
  const appName = resendConfig.appName;
  const isDev = process.env.NODE_ENV === 'development';
  const safeResetLink = escapeHtml(resetLink);
  const safeEmail = escapeHtml(email);

  const bodyContent = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Reset your password</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374151;">
      We received a request to reset the password for your <strong>${appName}</strong> account.
      Click the button below to choose a new password.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      <tr>
        <td style="border-radius:6px;background-color:#1d4ed8;">
          <a href="${safeResetLink}"
             target="_blank"
             rel="noopener noreferrer"
             style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;
                    color:#ffffff;text-decoration:none;border-radius:6px;
                    background-color:#1d4ed8;">
            Reset Password
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 16px;font-size:14px;color:#6b7280;">
      This link expires in <strong>15 minutes</strong>. After that you will need to request a new one.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="background-color:#fef9c3;border-radius:6px;margin-bottom:16px;">
      <tr>
        <td style="padding:14px 16px;">
          <p style="margin:0;font-size:13px;color:#92400e;line-height:1.5;">
            <strong>Security notice:</strong> If you did not request a password reset,
            please ignore this email. Your password will not be changed and your account
            remains secure.
          </p>
        </td>
      </tr>
    </table>
    <p style="margin:0;font-size:13px;color:#9ca3af;">
      If the button above does not work, copy and paste the following URL into your browser.
      Do not share this link with anyone.
    </p>
    <p style="margin:8px 0 0;font-size:13px;color:#6b7280;word-break:break-all;">
      ${safeResetLink}
    </p>
    ${isDev ? `<p style="margin:16px 0 0;font-size:13px;color:#92400e;"><strong>Development mode</strong> - Email sent to ${safeEmail}</p>` : ''}
  `;

  return buildEmailWrapper(bodyContent);
}

// Admin Password Reset Template
export function getAdminPasswordResetTemplate(newPassword: string, username: string): string {
  const appName = resendConfig.appName;
  const safeNewPassword = escapeHtml(newPassword);
  const safeUsername = escapeHtml(username);
  const bodyContent = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Your Password Has Been Reset</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374151;">
      Hi ${safeUsername}, an administrator has reset your password for your <strong>${appName}</strong> account.
    </p>
    <div style="background-color:#f3f4f6;padding:16px;border-radius:6px;margin-bottom:24px;">
      <p style="margin:0;font-size:15px;color:#374151;">Your new temporary password is:</p>
      <p style="margin:8px 0 0;font-size:20px;font-weight:700;color:#111827;">${safeNewPassword}</p>
    </div>
    <p style="margin:0;font-size:15px;line-height:1.6;color:#374151;">
      Please log in with this new password and change it immediately from your profile settings.
    </p>
  `;

  return buildEmailWrapper(bodyContent);
}

export function getPasswordChangedTemplate(): string {
  const appName = resendConfig.appName;

  const bodyContent = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Your password was changed</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374151;">
      The password for your <strong>${appName}</strong> account was successfully changed.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="background-color:#fef9c3;border-radius:6px;margin-bottom:24px;">
      <tr>
        <td style="padding:14px 16px;">
          <p style="margin:0;font-size:13px;color:#92400e;line-height:1.5;">
            <strong>Was this you?</strong> No action is required. Your account is secure.<br />
            <strong>Was this NOT you?</strong> Contact our support team immediately so we can
            help secure your account.
          </p>
        </td>
      </tr>
    </table>
    <p style="margin:0;font-size:13px;color:#9ca3af;">
      For your security, all active sessions have been signed out. You will need to log in
      again with your new password.
    </p>
  `;

  return buildEmailWrapper(bodyContent);
}

export function getBookingConfirmationTemplate(details: {
  venueName: string;
  date: string;
  startTime: string;
  endTime: string;
  amount: number;
  paymentReference: string;
}): string {
  const safeVenueName = escapeHtml(details.venueName);
  const safeDate = escapeHtml(details.date);
  const safeStartTime = escapeHtml(details.startTime);
  const safeEndTime = escapeHtml(details.endTime);
  const safePaymentReference = escapeHtml(details.paymentReference);

  const bodyContent = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Booking Confirmed! 🎉</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374151;">
      Your booking at <strong>${safeVenueName}</strong> is confirmed.
      Here's a summary of your reservation.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="background-color:#f0fdf4;border-radius:8px;margin-bottom:24px;">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 8px;font-size:14px;color:#166534;"><strong>Venue</strong></p>
          <p style="margin:0 0 16px;font-size:16px;color:#111827;font-weight:600;">${safeVenueName}</p>
          <p style="margin:0 0 8px;font-size:14px;color:#166534;"><strong>Date</strong></p>
          <p style="margin:0 0 16px;font-size:16px;color:#111827;">${safeDate}</p>
          <p style="margin:0 0 8px;font-size:14px;color:#166534;"><strong>Time</strong></p>
          <p style="margin:0 0 16px;font-size:16px;color:#111827;">${safeStartTime} – ${safeEndTime}</p>
          <p style="margin:0 0 8px;font-size:14px;color:#166534;"><strong>Amount Paid</strong></p>
          <p style="margin:0;font-size:20px;color:#111827;font-weight:700;">₹${details.amount.toLocaleString('en-IN')}</p>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 8px;font-size:13px;color:#9ca3af;">
      Payment Reference: <code style="font-size:12px;color:#6b7280;">${safePaymentReference}</code>
    </p>
    <p style="margin:16px 0 0;font-size:14px;color:#374151;">
      We look forward to hosting your event. If you have any questions, please reply to this email.
    </p>
  `;

  return buildEmailWrapper(bodyContent);
}

export function getRefundNotificationTemplate(details: {
  venueName: string;
  date: string;
  startTime: string;
  endTime: string;
  amount: number;
  refundReference: string;
}): string {
  const appName = resendConfig.appName;
  const safeVenueName = escapeHtml(details.venueName);
  const safeDate = escapeHtml(details.date);
  const safeStartTime = escapeHtml(details.startTime);
  const safeEndTime = escapeHtml(details.endTime);
  const safeRefundReference = escapeHtml(details.refundReference);

  const bodyContent = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Booking Unsuccessful – Refund Initiated</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374151;">
      We're sorry — by the time your payment was processed, the selected slot at
      <strong>${safeVenueName}</strong> had been booked by another customer.
      We have initiated a full refund.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="background-color:#fef2f2;border-radius:8px;margin-bottom:24px;">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 8px;font-size:14px;color:#991b1b;"><strong>Venue</strong></p>
          <p style="margin:0 0 16px;font-size:16px;color:#111827;font-weight:600;">${safeVenueName}</p>
          <p style="margin:0 0 8px;font-size:14px;color:#991b1b;"><strong>Requested Date</strong></p>
          <p style="margin:0 0 16px;font-size:16px;color:#111827;">${safeDate}</p>
          <p style="margin:0 0 8px;font-size:14px;color:#991b1b;"><strong>Time Slot</strong></p>
          <p style="margin:0 0 16px;font-size:16px;color:#111827;">${safeStartTime} – ${safeEndTime}</p>
          <p style="margin:0 0 8px;font-size:14px;color:#991b1b;"><strong>Refund Amount</strong></p>
          <p style="margin:0;font-size:20px;color:#111827;font-weight:700;">₹${details.amount.toLocaleString('en-IN')}</p>
        </td>
      </tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="background-color:#fef9c3;border-radius:6px;margin-bottom:16px;">
      <tr>
        <td style="padding:14px 16px;">
          <p style="margin:0;font-size:13px;color:#92400e;line-height:1.5;">
            <strong>Refund Timeline:</strong> Refunds typically reflect in your account within
            5–7 business days depending on your bank.
          </p>
        </td>
      </tr>
    </table>
    <p style="margin:0;font-size:13px;color:#9ca3af;">
      Refund Reference: <code style="font-size:12px;color:#6b7280;">${safeRefundReference}</code>
    </p>
    <p style="margin:16px 0 0;font-size:14px;color:#374151;">
      We apologise for the inconvenience. Please try booking another available slot on ${appName}.
    </p>
  `;

  return buildEmailWrapper(bodyContent);
}

export function getBookingCancellationTemplate(details: {
  venueName: string;
  date: string;
  timeRange: string;
  refundAmount: number;
  bookingRef: string;
}): string {
  const appName = resendConfig.appName;
  const safeVenueName = escapeHtml(details.venueName);
  const safeDate = escapeHtml(details.date);
  const safeTimeRange = escapeHtml(details.timeRange);
  const safeBookingRef = escapeHtml(details.bookingRef);

  const bodyContent = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Booking Cancelled</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374151;">
      Your booking at <strong>${safeVenueName}</strong> has been successfully cancelled.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="background-color:#fef2f2;border-radius:8px;margin-bottom:24px;">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 8px;font-size:14px;color:#991b1b;"><strong>Venue</strong></p>
          <p style="margin:0 0 16px;font-size:16px;color:#111827;font-weight:600;">${safeVenueName}</p>
          <p style="margin:0 0 8px;font-size:14px;color:#991b1b;"><strong>Date</strong></p>
          <p style="margin:0 0 16px;font-size:16px;color:#111827;">${safeDate}</p>
          <p style="margin:0 0 8px;font-size:14px;color:#991b1b;"><strong>Time Slot</strong></p>
          <p style="margin:0 0 16px;font-size:16px;color:#111827;">${safeTimeRange}</p>
          <p style="margin:0 0 8px;font-size:14px;color:#991b1b;"><strong>Refund Amount</strong></p>
          <p style="margin:0;font-size:20px;color:#111827;font-weight:700;">₹${details.refundAmount.toLocaleString('en-IN')}</p>
        </td>
      </tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="background-color:#fef9c3;border-radius:6px;margin-bottom:16px;">
      <tr>
        <td style="padding:14px 16px;">
          <p style="margin:0;font-size:13px;color:#92400e;line-height:1.5;">
            <strong>Important notice:</strong> If this cancellation was a mistake or was not done by you,
            please contact our support team immediately.
          </p>
        </td>
      </tr>
    </table>
    <p style="margin:0;font-size:13px;color:#9ca3af;">
      Booking Reference: <code style="font-size:12px;color:#6b7280;">${safeBookingRef}</code>
    </p>
    <p style="margin:16px 0 0;font-size:14px;color:#374151;">
      We hope to host you another time on ${appName}.
    </p>
  `;
  return buildEmailWrapper(bodyContent);
}

export function getVenueApprovedTemplate(venueName: string): string {
  const safeVenueName = escapeHtml(venueName);
  const bodyContent = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Venue Approved! 🎉</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374151;">
      Great news! Your venue <strong>${safeVenueName}</strong> has been approved by our admin team and is now live on the platform.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="background-color:#f0fdf4;border-radius:8px;margin-bottom:24px;">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0;font-size:15px;color:#166534;line-height:1.6;">
            Users can now view and book your venue. Make sure your availability and pricing are up to date!
          </p>
        </td>
      </tr>
    </table>
  `;
  return buildEmailWrapper(bodyContent);
}

export function getVenueRejectedTemplate(
  venueName: string,
  reason: string,
  editDeadline: Date,
  submissionNumber: number
): string {
  const deadlineStr = editDeadline.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const daysLeft = Math.ceil((editDeadline.getTime() - Date.now()) / (24 * 60 * 60 * 1000));

  const maxAttempts = VENUE_CONSTANTS.MAX_SUBMISSION_ATTEMPTS.toString();
  const safeVenueName = escapeHtml(venueName);
  const safeReason = escapeHtml(reason);

  const attemptNotice =
    submissionNumber >= 7
      ? `<p style="margin:0 0 8px;font-size:14px;color:#713f12;">
         <strong>This is submission attempt #${String(submissionNumber)} of ${maxAttempts}.</strong>
       </p>`
      : '';

  const bodyContent = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Venue Application Update</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374151;">
      We reviewed your application for <strong>${safeVenueName}</strong>, but unfortunately, we cannot approve it at this time.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="background-color:#fef2f2;border-radius:8px;margin-bottom:24px;">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 8px;font-size:14px;color:#991b1b;"><strong>Reason for Rejection:</strong></p>
          <p style="margin:0;font-size:15px;color:#7f1d1d;line-height:1.5;">${safeReason}</p>
        </td>
      </tr>
    </table>
    ${attemptNotice}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="background-color:#fef9c3;border-radius:8px;margin-bottom:24px;">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 8px;font-size:14px;color:#92400e;"><strong>⏰ Action Required: Edit & Resubmit</strong></p>
          <p style="margin:0 0 8px;font-size:15px;color:#713f12;line-height:1.5;">
            You have <strong>${daysLeft.toString()} days</strong> (until <strong>${deadlineStr}</strong>)
            to edit your venue and resubmit for review.
          </p>
          <p style="margin:8px 0 0;font-size:14px;color:#713f12;">
            After this deadline, your venue will be <strong>auto-suspended</strong> and no longer editable.
          </p>
        </td>
      </tr>
    </table>
    <p style="margin:0;font-size:15px;line-height:1.6;color:#374151;">
      You can update your venue details in the owner dashboard and submit it again for review once the issues have been addressed.
    </p>
  `;
  return buildEmailWrapper(bodyContent);
}

export function getVenueSuspendedTemplate(venueName: string, reason: string): string {
  const safeVenueName = escapeHtml(venueName);
  const safeReason = escapeHtml(reason);
  const bodyContent = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Venue Suspended</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374151;">
      Your venue <strong>${safeVenueName}</strong> has been temporarily suspended by our admin team and is currently not visible to users.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="background-color:#fef9c3;border-radius:8px;margin-bottom:24px;">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 8px;font-size:14px;color:#854d0e;"><strong>Reason for Suspension:</strong></p>
          <p style="margin:0;font-size:15px;color:#713f12;line-height:1.5;">${safeReason}</p>
        </td>
      </tr>
    </table>
    <p style="margin:0;font-size:15px;line-height:1.6;color:#374151;">
      Please contact our support team to resolve this issue and have your venue unsuspended.
    </p>
  `;
  return buildEmailWrapper(bodyContent);
}

export function getVenueUnsuspendedTemplate(venueName: string): string {
  const safeVenueName = escapeHtml(venueName);
  const bodyContent = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Your Venue Has Been Reactivated ✅</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374151;">
      Great news! Your venue <strong>${safeVenueName}</strong> has been reactivated and is now visible to customers again.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="background-color:#f0fdf4;border-radius:8px;margin-bottom:24px;">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 8px;font-size:14px;color:#166534;"><strong>Venue</strong></p>
          <p style="margin:0;font-size:16px;color:#111827;font-weight:600;">${safeVenueName}</p>
        </td>
      </tr>
    </table>
    <p style="margin:16px 0 0;font-size:14px;color:#374151;">
      You can now manage your venue and accept bookings as usual. If you have any questions, please reply to this email.
    </p>
  `;

  return buildEmailWrapper(bodyContent);
}

export function getVenueDeadlineExtendedTemplate(venueName: string, newDeadline: Date): string {
  const deadlineStr = newDeadline.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const daysLeft = Math.ceil((newDeadline.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  const safeVenueName = escapeHtml(venueName);

  const bodyContent = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Edit Deadline Extended ✅</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374151;">
      Good news! The deadline to edit and resubmit your venue <strong>${safeVenueName}</strong> has been extended.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="background-color:#f0fdf4;border-radius:8px;margin-bottom:24px;">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 8px;font-size:14px;color:#166534;"><strong>New Deadline</strong></p>
          <p style="margin:0;font-size:18px;color:#111827;font-weight:600;">${deadlineStr}</p>
          <p style="margin:8px 0 0;font-size:14px;color:#166534;">
            You now have <strong>${daysLeft.toString()} days</strong> to make changes and resubmit.
          </p>
        </td>
      </tr>
    </table>
    <p style="margin:16px 0 0;font-size:14px;color:#374151;">
      Please update your venue details and submit for review before the new deadline.
    </p>
  `;
  return buildEmailWrapper(bodyContent);
}

interface BanScopeDisplay {
  label: string;
  description: string;
}

function getBanScopeDisplay(scope: string, venueName?: string): BanScopeDisplay {
  switch (scope) {
    case 'full':
      return {
        label: 'Full Platform Ban',
        description:
          'You cannot access any features of the platform. Your account has been deactivated.',
      };
    case 'commenting':
      return {
        label: 'Commenting Ban',
        description: venueName
          ? `You cannot post reviews or comments on <strong>${escapeHtml(venueName)}</strong>.`
          : 'You cannot post reviews or comments on any venue.',
      };
    case 'owner_dashboard':
      return {
        label: 'Owner Dashboard Ban',
        description: venueName
          ? `You cannot access the owner dashboard for <strong>${escapeHtml(venueName)}</strong>.`
          : 'You cannot access the owner dashboard for any of your venues.',
      };
    case 'venue_creation':
      return {
        label: 'Venue Creation Ban',
        description: 'You cannot create new venues on the platform.',
      };
    default:
      return {
        label: 'Account Restriction',
        description: 'Your account has been restricted.',
      };
  }
}

export function getUserBannedTemplate(
  scope: string,
  reason: string,
  expiresAt: Date | null,
  venueName?: string
): string {
  const scopeDisplay = getBanScopeDisplay(scope, venueName);
  const appName = resendConfig.appName;
  const isDev = process.env.NODE_ENV === 'development';
  const safeReason = escapeHtml(reason);

  const expiryHtml = expiresAt
    ? `<p style="margin:16px 0 0;font-size:14px;color:#166534;"><strong>This ban expires on:</strong> ${expiresAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} at ${expiresAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>`
    : '<p style="margin:16px 0 0;font-size:14px;color:#991b1b;"><strong>This ban is permanent</strong> unless lifted by an administrator.</p>';

  const bodyContent = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Account Restriction Applied</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374151;">
      Your <strong>${appName}</strong> account has been restricted. Please review the details below.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="background-color:#fef2f2;border-radius:8px;margin-bottom:24px;">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 8px;font-size:14px;color:#991b1b;"><strong>Restriction Type</strong></p>
          <p style="margin:0 0 16px;font-size:16px;color:#111827;font-weight:600;">${scopeDisplay.label}</p>
          <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#374151;">${scopeDisplay.description}</p>
          <p style="margin:0 0 8px;font-size:14px;color:#991b1b;"><strong>Reason</strong></p>
          <p style="margin:0;font-size:15px;color:#111827;">${safeReason}</p>
        </td>
      </tr>
    </table>
    ${expiryHtml}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="background-color:#fef9c3;border-radius:6px;margin-bottom:16px;">
      <tr>
        <td style="padding:14px 16px;">
          <p style="margin:0;font-size:13px;color:#92400e;line-height:1.5;">
            <strong>What this means:</strong> You will not be able to perform actions related to this restriction.
            If you believe this was a mistake, please contact our support team by replying to this email.
          </p>
        </td>
      </tr>
    </table>
    ${isDev ? `<p style="margin:16px 0 0;font-size:13px;color:#92400e;background-color:#fef9c3;padding:12px;border-radius:6px;"><strong>Development mode:</strong> This email was redirected to the development address. The original recipient email is shown in the application logs.</p>` : ''}
  `;

  return buildEmailWrapper(bodyContent);
}

export function getUserUnbannedTemplate(): string {
  const appName = resendConfig.appName;
  const isDev = process.env.NODE_ENV === 'development';

  const bodyContent = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Account Restriction Lifted ✅</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374151;">
      Good news! The restriction on your <strong>${appName}</strong> account has been lifted.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="background-color:#f0fdf4;border-radius:8px;margin-bottom:24px;">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 8px;font-size:14px;color:#166534;"><strong>Status</strong></p>
          <p style="margin:0;font-size:16px;color:#111827;font-weight:600;">All restrictions removed</p>
        </td>
      </tr>
    </table>
    <p style="margin:16px 0 0;font-size:14px;color:#374151;">
      You can now use all platform features as normal. If you have any questions, please reply to this email.
    </p>
    ${isDev ? `<p style="margin:16px 0 0;font-size:13px;color:#92400e;background-color:#fef9c3;padding:12px;border-radius:6px;"><strong>Development mode:</strong> This email was redirected to the development address. The original recipient email is shown in the application logs.</p>` : ''}
  `;

  return buildEmailWrapper(bodyContent);
}

export function getReviewRemovedTemplate(venueName: string, reason: string): string {
  const appName = resendConfig.appName;
  const isDev = process.env.NODE_ENV === 'development';
  const safeVenueName = escapeHtml(venueName);
  const safeReason = escapeHtml(reason);

  const bodyContent = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Your Review Has Been Removed</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374151;">
      An administrator has removed your review for <strong>${safeVenueName}</strong> on <strong>${appName}</strong>.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="background-color:#fef2f2;border-radius:8px;margin-bottom:24px;">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 8px;font-size:14px;color:#991b1b;"><strong>Venue</strong></p>
          <p style="margin:0 0 16px;font-size:16px;color:#111827;font-weight:600;">${safeVenueName}</p>
          <p style="margin:0 0 8px;font-size:14px;color:#991b1b;"><strong>Reason for Removal</strong></p>
          <p style="margin:0;font-size:15px;color:#111827;">${safeReason}</p>
        </td>
      </tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="background-color:#fef9c3;border-radius:6px;margin-bottom:16px;">
      <tr>
        <td style="padding:14px 16px;">
          <p style="margin:0;font-size:13px;color:#92400e;line-height:1.5;">
            <strong>Note:</strong> Reviews are removed when they violate our community guidelines.
            If you believe this was a mistake, please contact our support team by replying to this email.
          </p>
        </td>
      </tr>
    </table>
    ${isDev ? `<p style="margin:16px 0 0;font-size:13px;color:#92400e;background-color:#fef9c3;padding:12px;border-radius:6px;"><strong>Development mode:</strong> This email was redirected to the development address. The original recipient email is shown in the application logs.</p>` : ''}
  `;

  return buildEmailWrapper(bodyContent);
}

export function getReviewRestoredTemplate(venueName: string): string {
  const appName = resendConfig.appName;
  const isDev = process.env.NODE_ENV === 'development';
  const safeVenueName = escapeHtml(venueName);

  const bodyContent = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Your Review Has Been Restored ✅</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374151;">
      An administrator has restored your review for <strong>${safeVenueName}</strong> on <strong>${appName}</strong>.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="background-color:#f0fdf4;border-radius:8px;margin-bottom:24px;">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 8px;font-size:14px;color:#166534;"><strong>Venue</strong></p>
          <p style="margin:0;font-size:16px;color:#111827;font-weight:600;">${safeVenueName}</p>
        </td>
      </tr>
    </table>
    <p style="margin:16px 0 0;font-size:14px;color:#374151;">
      Your review is now visible to other users. If you have any questions, please reply to this email.
    </p>
    ${isDev ? `<p style="margin:16px 0 0;font-size:13px;color:#92400e;background-color:#fef9c3;padding:12px;border-radius:6px;"><strong>Development mode:</strong> This email was redirected to the development address. The original recipient email is shown in the application logs.</p>` : ''}
  `;

  return buildEmailWrapper(bodyContent);
}
