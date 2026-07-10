import argon2 from 'argon2';
import { RegisterDto } from '@/dto/auth/register.dto';
import { LoginDto } from '@/dto/auth/login.dto';
import { VerifyOtpDto } from '@/dto/auth/verify-otp.dto';
import { ResetPasswordDto } from '@/dto/auth/reset-password.dto';
import { OAuth2Client } from 'google-auth-library';
import { MESSAGES } from '@/constants/messages';
import { HTTP_STATUS } from '@/constants/http';
import env from '@/configs/env.config';
import { AppError } from '@/utils/AppError';
import { userRepository } from '@/repositories/user.repository';
import { IUser } from '@/models/user.model';
import { otpService } from './otp.service';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken, jwtVerify } from '@/utils/jwtUtils';
import { redisService } from './redis.service';
import { ForgotPasswordDto } from '@/dto/auth/forgot-password.dto';
import { emailService } from './email.service';
import { otpEmail } from '@/template/otp.layout';
import { UserDto } from '@/dto/user/user.dto';

type AuthTokenPayload = {
  email: string;
  purpose: 'email-verification' | 'password-reset';
};

const signup = async (userData: RegisterDto): Promise<{ verificationToken: string }> => {
  const email = userData.email.toLowerCase().trim();

  const existingUser = await userRepository.findByEmail(email);

  if (existingUser?.isVerified) {
    throw new AppError(MESSAGES.USER_ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
  }

  if (existingUser && !existingUser.isVerified) {
    await userRepository.deleteById(existingUser._id.toString());
  }

  const hashedPassword = await argon2.hash(userData.password as string);

  await userRepository.create({
    ...userData,
    email,
    password: hashedPassword,
    isVerified: false,
  });

  const { otp } = await otpService.generateAndSendOtp(email);

  // Create the email
  const mail = otpEmail(otp);

  // Send the email
  await emailService.sendEmail({
    to: email,
    subject: mail.subject,
    html: mail.html,
  });

  const verificationToken = jwt.sign(
    {
      email,
      purpose: 'email-verification',
    },
    env.JWT_REGISTRATION_SECRET as string,
    { expiresIn: '15m' }
  );

  return {
    verificationToken,
  };
};

const verifyToken = (verificationToken: string): AuthTokenPayload => {
  try {
    const payload = jwt.verify(
      verificationToken,
      env.JWT_REGISTRATION_SECRET as string
    ) as AuthTokenPayload;

    if (payload.purpose !== 'email-verification' && payload.purpose !== 'password-reset') {
      throw new Error();
    }

    return payload;
  } catch {
    throw new AppError(MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED);
  }
};

const validateOtpToken = async (
  verificationToken: string,
  otp: string,
  expectedPurpose: 'email-verification' | 'password-reset'
): Promise<string> => {
  const payload = verifyToken(verificationToken);

  if (payload.purpose !== expectedPurpose) {
    throw new AppError('Invalid token purpose', HTTP_STATUS.UNAUTHORIZED);
  }

  await otpService.verifyOtp(payload.email, otp, expectedPurpose);
  return payload.email;
};

const verifyOtp = async (data: VerifyOtpDto): Promise<void> => {
  const email = await validateOtpToken(data.verificationToken, data.otp, 'email-verification');

  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new AppError(MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const updatedUser = await userRepository.update(user._id.toString(), {
    isVerified: true,
  });

  if (!updatedUser) {
    throw new AppError(MESSAGES.INTERNAL_ERROR, HTTP_STATUS.SERVER_ERROR);
  }

  const userObj = user.toObject();
  delete userObj.password;
};

const verifyForgotPasswordOtp = async (data: VerifyOtpDto): Promise<{ resetToken: string }> => {
  const email = await validateOtpToken(data.verificationToken, data.otp, 'password-reset');

  const resetToken = jwt.sign(
    { email, purpose: 'password-reset' },
    env.JWT_REGISTRATION_SECRET as string,
    { expiresIn: '10m' }
  );

  return { resetToken };
};

const resendOtp = async (verificationToken: string): Promise<void> => {
  const payload = verifyToken(verificationToken);

  const { allowed, secondsLeft } = await otpService.canResend(payload.email, payload.purpose);

  if (!allowed && secondsLeft === 0) {
    throw new AppError(MESSAGES.OTP_RESEND_LIMIT, HTTP_STATUS.TOO_MANY_REQUESTS);
  }

  if (!allowed) {
    throw new AppError(
      `${MESSAGES.OTP_RESEND_COOLDOWN}. Try again in ${secondsLeft} second${
        secondsLeft === 1 ? '' : 's'
      }.`,
      HTTP_STATUS.TOO_MANY_REQUESTS
    );
  }

  await otpService.generateAndSendOtp(payload.email, payload.purpose);
};

const signin = async (
  data: LoginDto
): Promise<{
  user: UserDto;
  accessToken: string;
  refreshToken: string;
}> => {
  const email = data.email.toLowerCase().trim();
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new AppError(MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
  }

  if (!user.isVerified) {
    throw new AppError('Please verify your email first', HTTP_STATUS.FORBIDDEN);
  }

  if (!user.password) {
    throw new AppError('Please sign in with Google', HTTP_STATUS.UNAUTHORIZED);
  }

  const isMatch = await argon2.verify(user.password, data.password as string);

  if (!isMatch) {
    throw new AppError(MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
  }

  if (user.isBlocked) {
    throw new AppError(
      'Your account has been blocked by the administrator. Please contact support.',
      HTTP_STATUS.FORBIDDEN
    );
  }

  const userObj = user.toObject();

  const accessToken = generateAccessToken(userObj);
  const refreshToken = generateRefreshToken(userObj);

  const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60;

  const key = `refresh_token:${userObj._id}`;
  await redisService.set(key, refreshToken, REFRESH_TOKEN_TTL);

  delete userObj.password;

  return {
    user: {
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      isBlocked: user.isBlocked,
      isVerified: user.isVerified,
      authProvider: user.authProvider,
      googleId: user.googleId,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    accessToken,
    refreshToken,
  };
};

const googleAuth = async (
  idToken: string,
  requestedRole?: string
): Promise<{
  user: Partial<IUser>;
  accessToken: string;
  refreshToken: string;
}> => {
  const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

  const ticket = await client.verifyIdToken({
    idToken,
    audience: env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload?.email) {
    throw new AppError('Invalid Google token', HTTP_STATUS.UNAUTHORIZED);
  }

  const { email, name, picture, sub: googleId } = payload;

  let user = await userRepository.findByEmail(email);

  if (user) {
    if (user.isBlocked) {
      throw new AppError(
        'Your account has been blocked by the administrator. Please contact support.',
        HTTP_STATUS.FORBIDDEN
      );
    }

    if (!user.googleId) {
      user = await userRepository.update(user._id!.toString(), {
        googleId,
        avatar: picture,
        authProvider: 'google',
        isVerified: true,
      });
    }
  } else {
    const finalRole =
      requestedRole === 'owner' || requestedRole === 'admin' ? requestedRole : 'user';
    user = await userRepository.create({
      fullName: name || 'Google User',
      email,
      googleId,
      avatar: picture,
      authProvider: 'google',
      isVerified: true,
      role: finalRole,
    });
  }

  if (!user) {
    throw new AppError('Failed to process Google login', HTTP_STATUS.SERVER_ERROR);
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60;
  const key = `refresh_token:${user._id}`;
  await redisService.set(key, refreshToken, REFRESH_TOKEN_TTL);

  const userObj = user.toObject();
  delete userObj.password;

  return {
    user: userObj,
    accessToken,
    refreshToken,
  };
};

export const refreshTokenService = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new AppError('Refresh token is missing', HTTP_STATUS.UNAUTHORIZED);
  }

  const decoded = jwtVerify(refreshToken, 'refresh');

  if (typeof decoded === 'string' || !decoded.id) {
    throw new AppError('Invalid or expired refresh token', HTTP_STATUS.UNAUTHORIZED);
  }

  const key = `refresh_token:${decoded?.id}`;
  const storedToken = await redisService.get(key);

  if (!storedToken || storedToken !== refreshToken) {
    throw new AppError('Refresh token not found or already revoked', HTTP_STATUS.UNAUTHORIZED);
  }

  const user = await userRepository.findById(decoded.id);
  if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);

  const newAccessToken = generateAccessToken(user);
  return { accessToken: newAccessToken };
};

export const logout = async (userId: string): Promise<void> => {
  const key = `refresh_token:${userId}`;
  await redisService.del(key);
};

const forgotPassword = async (data: ForgotPasswordDto): Promise<{ verificationToken?: string }> => {
  const normalizedEmail = data.email.toLowerCase().trim();
  const user = await userRepository.findByEmail(normalizedEmail);

  if (!user) {
    return {};
  }

  await otpService.generateAndSendOtp(normalizedEmail, 'password-reset');

  const verificationToken = jwt.sign(
    {
      email: normalizedEmail,
      purpose: 'password-reset',
    },
    env.JWT_REGISTRATION_SECRET as string,
    { expiresIn: '10m' }
  );

  return { verificationToken };
};

const resetPassword = async (data: ResetPasswordDto): Promise<void> => {
  const payload = verifyToken(data.resetToken);

  if (payload.purpose !== 'password-reset') {
    throw new AppError(MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED);
  }

  const user = await userRepository.findByEmail(payload.email);
  if (!user) {
    throw new AppError(MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const hashedPassword = await argon2.hash(data.password);
  await userRepository.update(user._id.toString(), {
    password: hashedPassword,
  });
};

export const authService = {
  signup,
  verifyOtp,
  resendOtp,
  signin,
  googleAuth,
  logout,
  forgotPassword,
  verifyForgotPasswordOtp,
  resetPassword,
};
