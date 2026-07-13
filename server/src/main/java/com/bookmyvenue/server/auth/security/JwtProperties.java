package com.bookmyvenue.server.auth.security;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Stores JWT-related configuration loaded from application properties.
 *
 * Values are sourced from environment variables to keep secrets
 * and token settings outside the codebase.
 */
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {

    /**
     * Secret key used to sign and verify JWT tokens.
     */
    private String secret;

    /**
     * Access token validity duration in milliseconds.
     */
    private long accessTokenExpiration;

    /**
     * Refresh token validity duration in milliseconds.
     */
    private long refreshTokenExpiration;
}