import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema, forgotPasswordSchema } from '../../src/modules/auth/auth.validator';

describe('Auth Validators (Zod Schemas)', () => {
  describe('registerSchema', () => {
    it('should validate valid user registration payload', () => {
      const validPayload = {
        username: 'johndoe',
        email: 'john@example.com',
        password: 'Password@123',
      };

      const result = registerSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('should reject short username', () => {
      const invalidPayload = {
        username: 'jo',
        email: 'john@example.com',
        password: 'Password@123',
      };

      const result = registerSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it('should reject weak password without special character or uppercase', () => {
      const invalidPayload = {
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123',
      };

      const result = registerSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('should validate login with email', () => {
      const result = loginSchema.safeParse({
        email: 'john@example.com',
        password: 'Password@123',
      });
      expect(result.success).toBe(true);
    });

    it('should validate login with username', () => {
      const result = loginSchema.safeParse({
        username: 'johndoe',
        password: 'Password@123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject when neither email nor username is provided', () => {
      const result = loginSchema.safeParse({
        password: 'Password@123',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('forgotPasswordSchema', () => {
    it('should validate valid email', () => {
      const result = forgotPasswordSchema.safeParse({ email: 'user@example.com' });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email format', () => {
      const result = forgotPasswordSchema.safeParse({ email: 'invalid-email' });
      expect(result.success).toBe(false);
    });
  });
});
