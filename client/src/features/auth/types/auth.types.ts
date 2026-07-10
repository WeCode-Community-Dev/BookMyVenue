export interface ISignupData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  confirmPassword?: string;
  role: string;
}

export interface ISigninData {
  email: string;
  password?: string;
}

export interface IResetPasswordData {
  resetToken: string;
  password?: string;
  confirmPassword?: string;
}
