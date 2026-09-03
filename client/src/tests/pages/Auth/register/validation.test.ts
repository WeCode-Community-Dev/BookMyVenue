import { describe, it, expect } from 'vitest';

describe('signupSchema', () => {
  it('should validate a valid signup', async () => {
    const { signupSchema } = await import('../../../../pages/Auth/register/validation');
    const valid = await signupSchema.isValid({
      name: 'John Doe',
      email: 'user@test.com',
      password: 'Passw0rd!',
      confirmPassword: 'Passw0rd!',
    });
    expect(valid).toBe(true);
  });

  it('should reject missing name', async () => {
    const { signupSchema } = await import('../../../../pages/Auth/register/validation');
    await expect(
      signupSchema.validate({
        email: 'user@test.com',
        password: 'Passw0rd!',
        confirmPassword: 'Passw0rd!',
      })
    ).rejects.toThrow('Full name is required');
  });

  it('should reject missing email', async () => {
    const { signupSchema } = await import('../../../../pages/Auth/register/validation');
    await expect(
      signupSchema.validate({
        name: 'John',
        password: 'Passw0rd!',
        confirmPassword: 'Passw0rd!',
      })
    ).rejects.toThrow('Email is required');
  });

  it('should reject invalid email', async () => {
    const { signupSchema } = await import('../../../../pages/Auth/register/validation');
    await expect(
      signupSchema.validate({
        name: 'John',
        email: 'bad',
        password: 'Passw0rd!',
        confirmPassword: 'Passw0rd!',
      })
    ).rejects.toThrow('Enter a valid email address');
  });

  it('should reject password shorter than 8 characters', async () => {
    const { signupSchema } = await import('../../../../pages/Auth/register/validation');
    await expect(
      signupSchema.validate({
        name: 'John',
        email: 'user@test.com',
        password: 'Short1!',
        confirmPassword: 'Short1!',
      })
    ).rejects.toThrow('at least 8 characters');
  });

  it('should reject password missing lowercase', async () => {
    const { signupSchema } = await import('../../../../pages/Auth/register/validation');
    await expect(
      signupSchema.validate({
        name: 'John',
        email: 'user@test.com',
        password: 'UPPERCASE1!',
        confirmPassword: 'UPPERCASE1!',
      })
    ).rejects.toThrow('lowercase letter');
  });

  it('should reject password missing uppercase', async () => {
    const { signupSchema } = await import('../../../../pages/Auth/register/validation');
    await expect(
      signupSchema.validate({
        name: 'John',
        email: 'user@test.com',
        password: 'lowercase1!',
        confirmPassword: 'lowercase1!',
      })
    ).rejects.toThrow('uppercase letter');
  });

  it('should reject password missing number', async () => {
    const { signupSchema } = await import('../../../../pages/Auth/register/validation');
    await expect(
      signupSchema.validate({
        name: 'John',
        email: 'user@test.com',
        password: 'NoNumber!',
        confirmPassword: 'NoNumber!',
      })
    ).rejects.toThrow('at least one number');
  });

  it('should reject password missing special symbol', async () => {
    const { signupSchema } = await import('../../../../pages/Auth/register/validation');
    await expect(
      signupSchema.validate({
        name: 'John',
        email: 'user@test.com',
        password: 'NoSymbol1',
        confirmPassword: 'NoSymbol1',
      })
    ).rejects.toThrow('special symbol');
  });

  it('should reject mismatched passwords', async () => {
    const { signupSchema } = await import('../../../../pages/Auth/register/validation');
    await expect(
      signupSchema.validate({
        name: 'John',
        email: 'user@test.com',
        password: 'Passw0rd!',
        confirmPassword: 'Different1!',
      })
    ).rejects.toThrow('Passwords do not match');
  });
});
