import jwt from 'jsonwebtoken';
import { IUser } from '@/models/user.model';
import { env } from 'node:process';

const accessScreteKey = env.JWT_ACCESS_SECRET as string;
const refreshScreteKey = env.JWT_REFRESH_SECRET as string;

export const generateAccessToken = (user: IUser) => {
  const accessToken = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    accessScreteKey,
    { expiresIn: '7d' }
  );
  return accessToken;
};

export const generateRefreshToken = (user: IUser) => {
  const refreshToken = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    refreshScreteKey,
    { expiresIn: '30d' }
  );

  return refreshToken;
};

export const jwtVerify = (token: string, type: 'access' | 'refresh') => {
  const screte = type === 'access' ? accessScreteKey : refreshScreteKey;
  return jwt.verify(token, screte);
};
