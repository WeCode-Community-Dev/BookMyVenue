import argon2 from 'argon2';
import { userRepository } from '@/repositories/user.repository';
import { otpService } from './otp.service';
import { emailService } from './email.service';
import { passwordChangeOtpEmail } from '@/template/password-change.layout';
import { AppError } from '@/utils/AppError';
import { HTTP_STATUS } from '@/constants/http';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const OTP_PURPOSE = 'password-change';

/**
 * Send OTP to the user's registered email for password change verification.
 */
const requestChangeOtp = async (userId: string): Promise<void> => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  // Check cooldown
  const { allowed, secondsLeft } = await otpService.canResend(user.email, OTP_PURPOSE);
  if (!allowed) {
    if (secondsLeft > 0) {
      throw new AppError(
        `Please wait ${secondsLeft} seconds before requesting a new OTP.`,
        HTTP_STATUS.TOO_MANY_REQUESTS
      );
    }
    throw new AppError('Maximum resend limit reached.', HTTP_STATUS.TOO_MANY_REQUESTS);
  }

  // Generate OTP
  const { otp } = await otpService.generateAndSendOtp(user.email, OTP_PURPOSE);

  // Send email using the proper template
  const mail = passwordChangeOtpEmail(otp);
  await emailService.sendEmail({
    to: user.email,
    subject: mail.subject,
    html: mail.html,
  });
};

/**
 * Verify OTP and change password.
 * Rejects the new password if it matches the current one.
 */
const changePassword = async (
  userId: string,
  otp: string,
  newPassword: string
): Promise<void> => {
  // Validate password complexity
  if (!PASSWORD_REGEX.test(newPassword)) {
    throw new AppError(
      'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character.',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const user = await userRepository.findById(userId);
  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }
// if (user && user.password) {
//   const isSameAsOld = await argon2.verify(user.password, newPassword);
//   if (isSameAsOld) {
//     throw new AppError('New password cannot be the same as your current password.', 400);
//   }
// }
  // Verify OTP (throws AppError if invalid)
  console.log('the otp from frontend:',otp);
  console.log('the new password:',newPassword);
  console.log('the old password:',user.password)
  await otpService.verifyOtp(user.email, otp, OTP_PURPOSE);

  // Check new password is not the same as the current one
  if (user.password) {
    const isSameAsOld = await argon2.verify(user.password, newPassword);
    if (isSameAsOld) {
      throw new AppError(
        'New password cannot be the same as your current password.',
        HTTP_STATUS.BAD_REQUEST
      );
    }
  }

  // Hash and save
  const hashedPassword = await argon2.hash(newPassword);
  await userRepository.update(userId, { password: hashedPassword });
};

export const passwordService = {
  requestChangeOtp,
  changePassword,
};
