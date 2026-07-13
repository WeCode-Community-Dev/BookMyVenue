package com.bookmyvenue.server.auth.service;

import com.bookmyvenue.server.auth.dto.request.LoginRequest;
import com.bookmyvenue.server.auth.dto.request.RegisterRequest;
import com.bookmyvenue.server.auth.dto.response.AuthResponse;
import com.bookmyvenue.server.auth.dto.response.AuthResult;
import com.bookmyvenue.server.auth.security.JwtService;
import com.bookmyvenue.server.common.exception.*;
import com.bookmyvenue.server.common.response.MessageResponse;
import com.bookmyvenue.server.user.entity.User;
import com.bookmyvenue.server.user.enums.Role;
import com.bookmyvenue.server.user.repository.UserRepository;
import com.bookmyvenue.server.verification.mail.service.MailService;
import com.bookmyvenue.server.verification.service.OtpRedisService;
import com.bookmyvenue.server.verification.service.VerificationService;
import com.bookmyvenue.server.verification.util.OtpGenerator;
import com.bookmyvenue.server.verification.util.RedisKeys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final VerificationService verificationService;
    private final OtpGenerator otpGenerator;
    private final OtpRedisService otpRedisService;
    private final MailService mailService;

    @Override
    public MessageResponse register(RegisterRequest request) {

        log.info("Attempting registration for email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Registration failed. Email already exists: {}", request.getEmail());
            throw new BusinessException(ErrorCode.USER_ALREADY_EXISTS);
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            log.warn("Registration failed. Phone already exists: {}", request.getPhone());
            throw new BusinessException(ErrorCode.PHONE_ALREADY_EXISTS);
        }

        if (request.getRole() == Role.ADMIN) {
            log.warn("Attempted ADMIN registration for email: {}", request.getEmail());
            throw new BusinessException(
                    ErrorCode.ADMIN_REGISTRATION_NOT_ALLOWED
            );
        }
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .emailVerified(false)
                .phoneVerified(false)
                .build();

        User savedUser = userRepository.save(user);

        verificationService.sendEmailVerificationOtp(savedUser.getEmail());

        log.info("Verification email sent to {}", savedUser.getEmail());
        return MessageResponse.builder()
                .message("Registration successful. Please verify your email.")
                .build();
    }



    @Override
    public AuthResult login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.warn("Login failed. User not found: {}", request.getEmail());
                    return new BusinessException(ErrorCode.INVALID_CREDENTIALS);
                });

        if (!user.isEmailVerified()) {
            log.warn("Login failed. Email not verified: {}", request.getEmail());
            throw new BusinessException(ErrorCode.EMAIL_NOT_VERIFIED);
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Login failed. Invalid password for email: {}", request.getEmail());
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }

        String accessToken = jwtService.generateAccessToken(user.getEmail(), user.getRole());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail(), user.getRole());

        log.info("User logged in successfully: {}", user.getEmail());

        AuthResponse response = AuthResponse.builder()
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();

        return new AuthResult(
                response,
                accessToken,
                refreshToken
        );
    }


    @Override
    public AuthResult refreshToken(String refreshToken) {

        String email = jwtService.extractEmail(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.INVALID_REFRESH_TOKEN)
                );

        if (!jwtService.isTokenValid(refreshToken, user.getEmail()
        )) {
            throw new BusinessException(ErrorCode.INVALID_REFRESH_TOKEN);
        }
        String accessToken = jwtService.generateAccessToken(user.getEmail(), user.getRole());
        String newRefreshToken = jwtService.generateRefreshToken(user.getEmail(), user.getRole());

        AuthResponse response = AuthResponse.builder()
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
        return new AuthResult(
                response,
                accessToken,
                newRefreshToken
        );
    }

    @Override
    public MessageResponse forgotPassword(String email) {

        log.info("Forgot password requested for {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        String otp = otpGenerator.generateOtp();
        String key = RedisKeys.passwordReset(email);
        otpRedisService.saveOtp(key, otp);
        mailService.sendPasswordResetOtp(email, otp);

        log.info("Password reset OTP sent to {}", email);
        return MessageResponse.builder()
                .message("Password reset OTP sent successfully.")
                .build();
    }

    @Override
    public MessageResponse resetPassword(String email, String otp, String newPassword)
    {

        log.info("Password reset requested for {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));


        String key = RedisKeys.passwordReset(email);
        String savedOtp = otpRedisService.getOtp(key);

        if (savedOtp == null) {
            throw new BusinessException(ErrorCode.OTP_EXPIRED);
        }

        if (!savedOtp.equals(otp)) {
            throw new BusinessException(ErrorCode.INVALID_OTP);
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        otpRedisService.deleteOtp(key);
        log.info("Password reset successfully for {}", email);
        return MessageResponse.builder()
                .message("Password reset successful.")
                .build();
    }




}