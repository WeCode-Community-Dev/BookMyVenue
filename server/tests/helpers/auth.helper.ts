import { generateAccessToken } from '../../src/utils/tokenUtils';
import { createTestUser } from './db.helper';
import type { IUser } from '../../src/modules/user/user.models';

export interface AuthenticatedUserSession {
  user: IUser;
  accessToken: string;
  authHeader: { Authorization: string };
  cookieHeader: string;
}

export const createAuthenticatedSession = async (): Promise<AuthenticatedUserSession> => {
  const user = await createTestUser();
  const accessToken = generateAccessToken(user.id as string, user.username, user.email);

  return {
    user,
    accessToken,
    authHeader: { Authorization: `Bearer ${accessToken}` },
    cookieHeader: `accessToken=${accessToken}`,
  };
};
