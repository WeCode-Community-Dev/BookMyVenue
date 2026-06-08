import { signupUser } from '../api/auth.api';

export const signupApi = async (payload) => {
   return signupUser(payload);
};