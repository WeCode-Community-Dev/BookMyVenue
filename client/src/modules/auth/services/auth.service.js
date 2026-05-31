import { signupApi } from '../api/auth.api';

export const signupUser = async (payload) => {
   return signupApi(payload);
};