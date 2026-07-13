package com.bookmyvenue.server.verification.util;

public final class RedisKeys {

    private RedisKeys() {
    }

    public static String emailVerification(String email) {
        return "verify:email:" + email;
    }

    public static String verifiedEmail(String email) {
        return "verified:email:" + email;
    }

    public static String passwordReset(String email) {
        return "reset:password:" + email;
    }
}