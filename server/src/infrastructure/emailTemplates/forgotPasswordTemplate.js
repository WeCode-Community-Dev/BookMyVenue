export const forgotPasswordTemplate = (fullName, resetLink) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 30px 20px; text-align: center; }
        .button-container { margin: 30px 0; }
        .reset-button { background-color: #2563eb; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; display: inline-block; font-weight: bold; }
        .token-box { background-color: #f0f4ff; border: 2px solid #2563eb; border-radius: 8px; padding: 15px; margin: 20px 0; word-break: break-all; }
        .footer { background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
        .warning { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 10px; margin: 10px 0; color: #92400e; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Reset Your Password</h1>
        </div>
        <div class="content">
            <p>Hi <strong>${fullName}</strong>,</p>
            <p>We received a request to reset your BookMyVenue password. Click the button below to set a new password:</p>

            <div class="button-container">
                <a href="${resetLink}" class="reset-button">Reset Password</a>
            </div>

            <p><strong>Or copy this link:</strong></p>
            <div class="token-box">
                <small>${resetLink}</small>
            </div>

            <p><strong>This link expires in 1 hour.</strong></p>

            <div class="warning">
                ⚠️ If you didn't request a password reset, please ignore this email or contact support immediately.
            </div>
        </div>
        <div class="footer">
            <p>© 2024 BookMyVenue. All rights reserved.</p>
            <p>For security, we never send passwords in emails. Always reset your password through our secure link.</p>
        </div>
    </div>
</body>
</html>
`;
