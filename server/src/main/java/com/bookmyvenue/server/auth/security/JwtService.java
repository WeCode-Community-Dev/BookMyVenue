package com.bookmyvenue.server.auth.security;

import com.bookmyvenue.server.user.enums.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

/**
 * Handles JWT token generation, validation, and claim extraction.
 */
@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtProperties jwtProperties;

    /**
     * Generates an access token for the given user.
     */
    public String generateAccessToken(String email, Role role) {
        return generateToken(email, role, jwtProperties.getAccessTokenExpiration());
    }

    /**
     * Generates a refresh token for the given user.
     */
    public String generateRefreshToken(String email, Role role) {
        return generateToken(email, role, jwtProperties.getRefreshTokenExpiration());
    }

    /**
     * Common token generation logic.
     */
    private String generateToken(String email, Role role, long expiration) {
        return Jwts.builder()
                .subject(email)
                .claim("role", role.name())
                .issuedAt(new Date())
                .expiration(
                        new Date(
                                System.currentTimeMillis() + expiration
                        )
                )
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Extracts the email (subject) from a JWT token.
     */
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extracts the role from a JWT token.
     */
    public String extractRole(String token) {
        return extractClaim(
                token,
                claims -> claims.get("role", String.class)
        );
    }

    /**
     * Extracts a specific claim from a token.
     */
    public <T> T extractClaim(
            String token,
            Function<Claims, T> claimsResolver
    ) {
        Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Validates whether a token belongs to the expected user
     * and is not expired.
     */
    public boolean isTokenValid(String token, String email) {
        return email.equals(extractEmail(token))
                && !isTokenExpired(token);
    }

    /**
     * Checks whether a token has expired.
     */
    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration)
                .before(new Date());
    }

    /**
     * Extracts all claims from the token.
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Creates the signing key from the configured JWT secret.
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(
                jwtProperties.getSecret()
        );

        return Keys.hmacShaKeyFor(keyBytes);
    }
}