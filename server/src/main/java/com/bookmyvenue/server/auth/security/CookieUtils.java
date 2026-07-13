package com.bookmyvenue.server.auth.security;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

/**
 * Utility methods for authentication cookies.
 */
@Component
@RequiredArgsConstructor
public class CookieUtils {

    /**
     * Access token cookie name.
     */
    public static final String ACCESS_TOKEN = "accessToken";

    /**
     * Refresh token cookie name.
     */
    public static final String REFRESH_TOKEN = "refreshToken";

    /**
     * Cookie path used throughout the application.
     */
    private static final String COOKIE_PATH = "/";

    /**
     * SameSite policy for authentication cookies.
     */
    private static final String SAME_SITE_POLICY = "Lax";



    private final JwtProperties jwtProperties;

    /**
     * Creates an access token cookie.
     */
    public ResponseCookie accessTokenCookie(String token) {
        return ResponseCookie.from(ACCESS_TOKEN, token)
                .httpOnly(true)
                .secure(false) // Use true in production.
                .path(COOKIE_PATH)
                .sameSite(SAME_SITE_POLICY)
                .maxAge(jwtProperties.getAccessTokenExpiration() / 1000)
                .build();
    }

    /**
     * Creates a refresh token cookie.
     */
    public ResponseCookie refreshTokenCookie(String token) {
        return ResponseCookie.from(REFRESH_TOKEN, token)
                .httpOnly(true)
                .secure(false) // Use true in production.
                .path(COOKIE_PATH)
                .sameSite(SAME_SITE_POLICY)
                .maxAge(jwtProperties.getRefreshTokenExpiration() / 1000)
                .build();
    }

    /**
     * Creates an expired access token cookie.
     */
    public ResponseCookie clearAccessTokenCookie() {
        return ResponseCookie.from(ACCESS_TOKEN, "")
                .httpOnly(true)
                .secure(false) // Use true in production.
                .path(COOKIE_PATH)
                .sameSite(SAME_SITE_POLICY)
                .maxAge(0)
                .build();
    }

    /**
     * Creates an expired refresh token cookie.
     */
    public ResponseCookie clearRefreshTokenCookie() {
        return ResponseCookie.from(REFRESH_TOKEN, "")
                .httpOnly(true)
                .secure(false) // Use true in production.
                .path(COOKIE_PATH)
                .sameSite(SAME_SITE_POLICY)
                .maxAge(0)
                .build();
    }
}