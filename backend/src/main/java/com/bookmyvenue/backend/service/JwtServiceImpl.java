package com.bookmyvenue.backend.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.bookmyvenue.backend.entity.Users;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtServiceImpl implements JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration-millis}")
    private Long jwtExpirationMillis;

    private Algorithm algorithm;

    private DecodedJWT getDecodedJWT(String token) {
        return JWT.require(algorithm).build().verify(token);
    }

    @PostConstruct
    public void init() {
        algorithm = Algorithm.HMAC256(jwtSecret);
    }


    @Override
    public String generateToken(Users user) {

        return JWT.create()
                .withSubject(user.getEmail())
                .withClaim("userId", user.getUserId())
                .withClaim("role", user.getRole().name())
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + jwtExpirationMillis))
                .sign(algorithm);
    }

    @Override
    public String extractUserName(String token) {
        return getDecodedJWT(token).getSubject();
    }

    @Override
    public String extractUserRole(String token) {
        return getDecodedJWT(token).getClaims().get("role").asString();
    }

    @Override
    public Long extractUserId(String token) {
        return getDecodedJWT(token).getClaim("userId").asLong();
    }

    @Override
    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            DecodedJWT decodedJWT = getDecodedJWT(token);
            return userDetails.getUsername().equals(decodedJWT.getSubject());
        }
        catch (JWTVerificationException ex) {
            return false;
        }
    }
}
