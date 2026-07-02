export const emailChangeOtpTemplate = ({ otp }) => {
    return {
        subject: "Email Change OTP",
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Email Change Verification</h2>
                <p>Your OTP is:</p>
                <h1>${otp}</h1>
                <p>This OTP is valid for 5 minutes.</p>
                <br/>
                <p>Best regards,</p>
                <p><strong>BookMyVenue Team</strong></p>
            </div>
        `
    };
};