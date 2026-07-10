import { Request, Response, NextFunction } from 'express';
import success from '../utils/response';
import { AppError } from '../utils/AppError';
import { MESSAGES } from '@/constants/messages';
import { HTTP_STATUS } from '@/constants/http';
import { authService, refreshTokenService } from '../services/auth.service';

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = req.body;
    const result = await authService.signup(validatedData);
    success(res, HTTP_STATUS.CREATED, result, MESSAGES.USER_CREATED);
  } catch (error: unknown) {
    next(error);
  }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = req.body;
    await authService.verifyOtp(data);
    success(res, HTTP_STATUS.OK, null, MESSAGES.USER_VERIFIED);
  } catch (error: unknown) {
    next(error);
  }
};

export const resendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { verificationToken } = req.body;
    await authService.resendOtp(verificationToken);
    success(res, HTTP_STATUS.OK, null, MESSAGES.OTP_RESENT);
  } catch (error: unknown) {
    next(error);
  }
};

export const googleAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { credential, role } = req.body;
    if (!credential) {
      next(new AppError('Google credential is required', HTTP_STATUS.BAD_REQUEST));
      return;
    }
    const result = await authService.googleAuth(credential, role);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    success(res, HTTP_STATUS.OK, result.user, 'Google Login Successful');
  } catch (error: unknown) {
    next(error);
  }
};

export const signin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = req.body;

    const result = await authService.signin(validatedData);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    success(res, HTTP_STATUS.OK, result.user, 'Sign In Successful');
  } catch (error: unknown) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) throw new AppError('Unauthorized access', HTTP_STATUS.UNAUTHORIZED);

    const result = await refreshTokenService(refreshToken);

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    success(res, HTTP_STATUS.OK, null, 'Token Refreshed Successfully');
  } catch (error: unknown) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('Unauthorized access', HTTP_STATUS.UNAUTHORIZED);
    }

    await authService.logout(userId);

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    success(res, HTTP_STATUS.OK, null, 'Logged out successfully');
  } catch (error: unknown) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(req.body);

    success(
      res,
      HTTP_STATUS.OK,
      result,
      'If an account exists, an OTP has been sent to the registered email.'
    );
  } catch (error) {
    next(error);
  }
};

export const verifyForgotPasswordOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = req.body;
    const result = await authService.verifyForgotPasswordOtp(data);

    if (!result.resetToken) {
      throw new AppError('Invalid operation', HTTP_STATUS.BAD_REQUEST);
    }

    success(res, HTTP_STATUS.OK, { resetToken: result.resetToken }, 'OTP verified successfully');
  } catch (error: unknown) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = req.body;
    await authService.resetPassword(data);
    success(res, HTTP_STATUS.OK, null, 'Password reset successfully');
  } catch (error: unknown) {
    next(error);
  }
};
