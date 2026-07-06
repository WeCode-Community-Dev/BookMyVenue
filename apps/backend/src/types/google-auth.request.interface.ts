import { Request } from 'express';

export interface GoogleUser {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
}

export interface GoogleAuthRequest extends Request {
  user: GoogleUser;
}
