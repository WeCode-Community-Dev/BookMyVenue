export interface SignUpDto {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ForgetPassDto {
  email: string;
}

export interface VerifyForgotPasswordOtpDto {
  email: string;
  otp: string;
}

export interface ResetPasswordDto {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthResponse {
  message: string;
  userId: string;
  token?: string;
}

export interface UserMeResponse {
  userId: string;
  email: string;
  role: string;
}
