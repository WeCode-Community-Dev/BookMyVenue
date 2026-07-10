import { emailLayout } from './email.layout';

export const otpEmail = (otp: string) => ({
  subject: 'Your BookMyVenue OTP Code',

  html: emailLayout(
    'OTP',
    'Email Verification',

    `
      <p style="margin:0 0 8px;color:#94a3b8;font-size:14px;">
        Hello,
      </p>

      <p style="margin:0 0 28px;color:#e2e8f0;font-size:15px;line-height:1.6;">
        Use the one-time password below to verify your email address.
        This code expires in
        <strong style="color:#f87171;">5 minutes</strong>.
      </p>

      <div style="background:#0f172a;border:2px dashed #dc2626;border-radius:12px;padding:24px;text-align:center;margin-bottom:28px;">

        <p style="margin:0 0 6px;color:#64748b;font-size:11px;letter-spacing:3px;text-transform:uppercase;">
          Your OTP Code
        </p>

        <p style="margin:0;color:#fff;font-size:40px;font-weight:800;letter-spacing:16px;">
          ${otp}
        </p>

      </div>

      <p style="margin:0 0 6px;color:#64748b;font-size:13px;">
        If you did not create an account, you can safely ignore this email.
      </p>

      <p style="margin:0;color:#64748b;font-size:13px;">
        Do not share this code with anyone.
      </p>
`
  ),
});
