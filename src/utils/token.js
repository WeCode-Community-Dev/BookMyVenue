import jwt from 'jsonwebtoken';
import { loadEnv } from '../config/env.js';

const { jwtSecret } = loadEnv();
const JWT_EXPIRES_IN = '24h';

export function signToken(payload) {
  return jwt.sign(payload, jwtSecret, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  return jwt.verify(token, jwtSecret);
}
