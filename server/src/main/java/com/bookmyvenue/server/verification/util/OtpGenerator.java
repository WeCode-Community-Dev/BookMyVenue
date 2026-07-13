package com.bookmyvenue.server.verification.util;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

/**
 * Utility class for generating secure 6-digit OTPs.
 * Used for email and phone verification.
 */
@Component
public class OtpGenerator {

    // Cryptographically secure random number generator
    private static final SecureRandom RANDOM = new SecureRandom();

    /**
     * Generates a random 6-digit OTP.
     * Leading zeros are preserved (e.g., 000123).
     *
     * @return 6-digit OTP as a String
     */
    public String generateOtp() {

        return String.format("%06d", RANDOM.nextInt(1_000_000));
    }
}