import { AUTH_ROUTES } from '@/constants/apiRoutes';
import apiClient from '@/services/apiClient';
import type { ISigninData, ISignupData, IResetPasswordData } from '../types/auth.types';

export const signupApi = async (data: ISignupData) => {
  return await apiClient.post(AUTH_ROUTES.SIGNUP, data);
};

export const signinApi = async (data: ISigninData) => {
  return await apiClient.post(AUTH_ROUTES.SIGNIN, data);
};

export const googleAuthApi = async (credential: string, role?: string) => {
  return await apiClient.post(AUTH_ROUTES.GOOGLE_AUTH, { credential, role });
};

export const verifyOtpApi = async (verificationToken: string, otp: string) => {
  return await apiClient.post(AUTH_ROUTES.VERIFY_OTP, { verificationToken, otp });
};

export const resendOtpApi = async (verificationToken: string) => {
  return await apiClient.post(AUTH_ROUTES.RESEND_OTP, { verificationToken });
};

export const logoutApi = async () => {
  return await apiClient.post(AUTH_ROUTES.LOGOUT);
};

export const forgotPasswordApi = async (email: string) => {
  return await apiClient.post(AUTH_ROUTES.FORGOT_PASSWORD, { email });
};

export const verifyForgotPasswordOtpApi = async (verificationToken: string, otp: string) => {
  return await apiClient.post(AUTH_ROUTES.VERIFY_FORGOT_PASSWORD_OTP, { verificationToken, otp });
};

export const resetPasswordApi = async (data: IResetPasswordData) => {
  return await apiClient.post(AUTH_ROUTES.RESET_PASSWORD, data);
};
