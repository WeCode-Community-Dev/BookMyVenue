package com.bookmyvenue.server.auth.service;

import com.bookmyvenue.server.auth.dto.request.LoginRequest;
import com.bookmyvenue.server.auth.dto.request.RegisterRequest;
import com.bookmyvenue.server.auth.dto.response.AuthResult;
import com.bookmyvenue.server.common.response.MessageResponse;


public interface AuthService {

    /**
     * Registers a new USER or VENDOR account.
     */
    MessageResponse register(RegisterRequest request);

    /**
     * Authenticates a user and returns JWT tokens.
     */
    AuthResult login(LoginRequest request);


    /**
     * Generates a new access token using a valid refresh token.
     */
    AuthResult refreshToken(String refreshToken);


    MessageResponse forgotPassword(String email);

    MessageResponse resetPassword(String email,String otp, String newPassword);
}