import { api } from "@/lib/api";
import {
  SignUpDto,
  LoginDto,
  ForgetPassDto,
  VerifyForgotPasswordOtpDto,
  ResetPasswordDto,
  AuthResponse,
} from "@/types/auth";

export async function login(data: LoginDto): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/login", data);
  return response.data;
}

export async function signUp(data: SignUpDto): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/signup", data);
  return response.data;
}

export async function forgotPassword(data: ForgetPassDto): Promise<{ message: string }> {
  const response = await api.post<{ message: string }>("/auth/forgot-password", data);
  return response.data;
}

export async function verifyForgotPasswordOtp(data: VerifyForgotPasswordOtpDto): Promise<{ message: string }> {
  const response = await api.post<{ message: string }>("/auth/verify-forgot-password-otp", data);
  return response.data;
}

export async function resetPassword(data: ResetPasswordDto): Promise<{ message: string }> {
  const response = await api.patch<{ message: string }>("/auth/reset-password", data);
  return response.data;
}
