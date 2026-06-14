import { randomBytes, createHmac } from 'crypto';

export const hashPassword = async (password, UserSalt) => {
  const salt = UserSalt || randomBytes(256).toString('hex');
  const hashedPassword = createHmac('sha256', salt).update(password).digest('hex');
  return { password: hashedPassword, salt };
};
