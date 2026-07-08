export const VerifyRegisterotpTemplate = (fullName, otpCode) => `
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
        .otp-box { background-color: #f0f4ff; border: 2px solid #2563eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .otp-code { font-size: 36px; font-weight: bold; color: #2563eb; letter-spacing: 2px; font-family: monospace; }
        .timer { color: #ef4444; font-weight: bold; margin-top: 10px; }
        .footer { background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
        .warning { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 10px; margin: 10px 0; color: #92400e; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Welcome to BookMyVenue</h1>
        </div>
        <div class="content">
            <p>Hi <strong>${fullName}</strong>,</p>
            <p>Thank you for signing up! To complete your registration, please verify your email address using the OTP code below:</p>

            <div class="otp-box">
                <div class="otp-code">${otpCode}</div>
                <div class="timer">⏱️ Expires in 10 minutes</div>
            </div>

            <p><strong>How to use:</strong></p>
            <p>1. Copy the code above<br>2. Enter it in the verification field<br>3. Complete your registration</p>

            <div class="warning">
                ⚠️ Do not share this code with anyone. We will never ask for this code.
            </div>
        </div>
        <div class="footer">
            <p>© 2024 BookMyVenue. All rights reserved.</p>
            <p>If you didn't sign up for this account, please ignore this email.</p>
        </div>
    </div>
</body>
</html>
`;
