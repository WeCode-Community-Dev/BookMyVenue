/**
 * Generates a cryptographically random 6-digit OTP string.
 */
import { randomInt } from 'crypto';
export function generateOtp(): string {
  return randomInt(100000, 1000000).toString();
}
