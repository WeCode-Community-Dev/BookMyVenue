package com.bookmyvenue.server.verification.service;


import com.bookmyvenue.server.common.exception.BusinessException;
import com.bookmyvenue.server.common.exception.ErrorCode;
import com.bookmyvenue.server.user.entity.User;
import com.bookmyvenue.server.user.repository.UserRepository;
import com.bookmyvenue.server.verification.mail.service.MailService;
import com.bookmyvenue.server.verification.util.OtpGenerator;
import com.bookmyvenue.server.verification.util.RedisKeys;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class VerificationServiceImpl implements VerificationService {

    private final OtpGenerator otpGenerator;
    private final OtpRedisService otpRedisService;
    private final MailService mailService;
    private final UserRepository userRepository;



    @Override
    public void sendEmailVerificationOtp(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (user.isEmailVerified()) {
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_VERIFIED);
        }
        String otp = otpGenerator.generateOtp();
        String key = RedisKeys.emailVerification(email);
        otpRedisService.saveOtp(key, otp);
        log.info("Sending verification email to {}", email);
        mailService.sendVerificationOtp(email, otp);
        log.info("Verification email sent successfully to {}", email);
    }

    @Transactional
    @Override
    public void verifyEmail(String email, String otp) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));


        if (user.isEmailVerified()) {
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_VERIFIED);
        }

        String key = RedisKeys.emailVerification(email);
        String savedOtp = otpRedisService.getOtp(key);

        if (savedOtp == null) {
            throw new BusinessException(ErrorCode.OTP_EXPIRED);
        }

        if (!savedOtp.equals(otp)) {
            throw new BusinessException(ErrorCode.INVALID_OTP);
        }
        user.setEmailVerified(true);
        userRepository.save(user);
        otpRedisService.deleteOtp(key);
        log.info("Email verified successfully: {}", email);
    }

}