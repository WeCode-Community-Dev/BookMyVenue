package com.bookmyvenue.server.verification.mail.service;

import com.bookmyvenue.server.verification.mail.client.BrevoClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailServiceImpl implements MailService {

    private final BrevoClient brevoClient;

    @Override
    public void sendVerificationOtp(String email, String otp) {

        String subject = "Verify your BookMyVenue account";

        String html = """
                <h2>Email Verification</h2>
                <p>Your verification code is:</p>
                <h1>%s</h1>
                <p>This code will expire in 5 minutes.</p>
                """.formatted(otp);

        brevoClient.sendEmail(email, subject, html);
    }


    @Override
    public void sendPasswordResetOtp(String email, String otp) {

        String subject = "Reset your BookMyVenue password";

        String html = """
            <h2>Password Reset</h2>
            <p>Your password reset code is:</p>
            <h1>%s</h1>
            <p>This code will expire in 5 minutes.</p>
            <p>If you did not request a password reset, you can safely ignore this email.</p>
            """.formatted(otp);

        brevoClient.sendEmail(email, subject, html);
    }
}