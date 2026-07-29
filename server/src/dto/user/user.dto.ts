export interface UserDto {
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  isVerified: boolean;
  isBlocked: boolean;
  googleId?: string;
  avatar?: string;
  authProvider?: 'local' | 'google';
  createdAt: Date;
  updatedAt: Date;
}
