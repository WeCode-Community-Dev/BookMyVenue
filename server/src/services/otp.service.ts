import crypto from 'crypto';
import argon2 from 'argon2';
import { redisService } from './redis.service';
import { AppError } from '../utils/AppError';
import { MESSAGES } from '../constants/messages';
import { HTTP_STATUS } from '../constants/http';
import env from '../configs/env.config';
import logger from '@/libs/logger';

const keys = {
  otp: (email: string, purpose: string) => `otp:hash:${purpose}:${email}`,
  verifyCount: (email: string, purpose: string) => `otp:verify_count:${purpose}:${email}`,
  resendCount: (email: string, purpose: string) => `otp:resend_count:${purpose}:${email}`,
  resendAt: (email: string, purpose: string) => `otp:resend_at:${purpose}:${email}`,
};

export const otpService = {
  async generateAndSendOtp(
    emailAddr: string,
    purpose: string = 'email-verification'
  ): Promise<{ otp: string }> {
    const otp = crypto.randomInt(100000, 999999).toString();
    logger.info(`OTP: ${otp}`);

    const hashed = await argon2.hash(otp);

    // Store hashed OTP with expiry
    await redisService.set(keys.otp(emailAddr, purpose), hashed, env.OTP_EXPIRY_SECONDS);

    // Reset verify attempt counter
    await redisService.del(keys.verifyCount(emailAddr, purpose));

    // Record resend timestamp for cooldown period
    await redisService.set(
      keys.resendAt(emailAddr, purpose),
      Date.now().toString(),
      env.OTP_EXPIRY_SECONDS + env.RESEND_COOLDOWN_SECONDS
    );

    return { otp };
  },

  async verifyOtp(
    emailAddr: string,
    otp: string,
    purpose: string = 'email-verification'
  ): Promise<void> {
    const hashedOtp = await redisService.get(keys.otp(emailAddr, purpose));
    if (!hashedOtp) {
      throw new AppError(MESSAGES.OTP_NOT_FOUND, HTTP_STATUS.BAD_REQUEST);
    }

    // Check verify attempt count
    const attemptKey = keys.verifyCount(emailAddr, purpose);
    const attempts = parseInt((await redisService.get(attemptKey)) ?? '0', 10);
    if (attempts >= env.MAX_VERIFY_ATTEMPTS) {
      await redisService.del(keys.otp(emailAddr, purpose));
      await redisService.del(attemptKey);
      throw new AppError(MESSAGES.OTP_MAX_ATTEMPTS, HTTP_STATUS.TOO_MANY_REQUESTS);
    }

    const isValid = await argon2.verify(hashedOtp, otp);
    if (!isValid) {
      const newCount = await redisService.incr(attemptKey);
      await redisService.expire(attemptKey, env.OTP_EXPIRY_SECONDS);
      const remaining = env.MAX_VERIFY_ATTEMPTS - newCount;
      throw new AppError(
        `${MESSAGES.OTP_INVALID}. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // OTP is valid clear all keys
    await redisService.del(keys.otp(emailAddr, purpose));
    await redisService.del(keys.verifyCount(emailAddr, purpose));
    await redisService.del(keys.resendCount(emailAddr, purpose));
    await redisService.del(keys.resendAt(emailAddr, purpose));
  },

  async canResend(
    emailAddr: string,
    purpose: string = 'email-verification'
  ): Promise<{
    allowed: boolean;
    secondsLeft: number;
  }> {
    const resendedAt = await redisService.get(keys.resendAt(emailAddr, purpose));
    if (resendedAt) {
      const secondsPassed = (Date.now() - parseInt(resendedAt, 10)) / 1000;
      if (secondsPassed < env.RESEND_COOLDOWN_SECONDS) {
        return {
          allowed: false,
          secondsLeft: Math.ceil(env.RESEND_COOLDOWN_SECONDS - secondsPassed),
        };
      }
    }

    const resendCount = parseInt(
      (await redisService.get(keys.resendCount(emailAddr, purpose))) ?? '0',
      10
    );
    if (resendCount >= env.MAX_RESEND_COUNT) {
      return { allowed: false, secondsLeft: 0 };
    }

    return { allowed: true, secondsLeft: 0 };
  },
};
