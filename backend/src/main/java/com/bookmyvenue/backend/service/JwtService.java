package com.bookmyvenue.backend.service;

import com.bookmyvenue.backend.entity.Users;
import org.springframework.security.core.userdetails.UserDetails;

public interface JwtService {

    String generateToken(Users user);
    String extractUserName(String token);
    Long extractUserId(String token);
    String extractUserRole(String token);
    boolean validateToken(String token, UserDetails userDetails);
}
