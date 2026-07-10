import { JwtPayload } from '@/constants/types';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
