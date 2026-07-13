export interface AuthResponse {
  userId: string;
  name: string;
  email: string;
  role: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  isVendor?: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface MessageResponse {
  message: string;
}

export interface RefreshTokenApiResponse {
  userId: string;
  name: string;
  email: string;
  role: string;
  accessToken: string;
  refreshToken: string;
}
