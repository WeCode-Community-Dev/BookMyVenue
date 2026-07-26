import { describe, it, expect } from 'vitest';

describe('signinSchema', () => {
  it('should validate a valid login', async () => {
    const { signinSchema } = await import('../../../../pages/Auth/login/validation');
    const valid = await signinSchema.isValid({
      email: 'user@test.com',
      password: 'mypassword',
    });
    expect(valid).toBe(true);
  });

  it('should reject missing email', async () => {
    const { signinSchema } = await import('../../../../pages/Auth/login/validation');
    await expect(signinSchema.validate({ password: 'mypassword' })).rejects.toThrow(
      'Email is required'
    );
  });

  it('should reject invalid email format', async () => {
    const { signinSchema } = await import('../../../../pages/Auth/login/validation');
    await expect(
      signinSchema.validate({ email: 'notanemail', password: 'mypassword' })
    ).rejects.toThrow('Enter a valid email address');
  });

  it('should reject missing password', async () => {
    const { signinSchema } = await import('../../../../pages/Auth/login/validation');
    await expect(signinSchema.validate({ email: 'user@test.com' })).rejects.toThrow(
      'Password required'
    );
  });
});
