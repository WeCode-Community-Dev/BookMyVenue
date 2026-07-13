package com.bookmyvenue.server.auth.dto.response;

/**
 * Authentication result containing user details and generated tokens.
 */
public record AuthResult(
        AuthResponse response,
        String accessToken,
        String refreshToken
) {
}