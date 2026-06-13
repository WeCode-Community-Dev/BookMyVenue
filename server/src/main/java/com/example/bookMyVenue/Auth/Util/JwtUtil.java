package com.example.bookMyVenue.Auth.Util;

import io.jsonwebtoken.Claims;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    private final String key = "qwertyutgbyhnikedfvbnmloiasdfghjklzxcvbnmlkjhgfdsaqwertyuisdfghjklzaqwsx";
    SecretKey secretKey = Keys.hmacShaKeyFor(key.getBytes());

    public String generateToken(String userName) {
        return Jwts.builder().
                subject(userName)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 10))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String getUserName(String token) {
        return extractAllClaims(token).getSubject();
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser().
                verifyWith(secretKey).
                build().
                parseSignedClaims(token)
                .getPayload();

    }

    public boolean validate(String username, String jwtToken) {
        String extractedUserName = getUserName(jwtToken);
        if (username != null && extractedUserName != null) {
            return username.equals(extractedUserName) && !isTokenExpired(jwtToken);
        }
        return false;
    }

    private boolean isTokenExpired(String jwtToken) {
        return extractAllClaims(jwtToken).getExpiration().before(new Date());
    }
}


