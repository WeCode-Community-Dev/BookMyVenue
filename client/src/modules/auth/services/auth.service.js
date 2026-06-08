import { signupUser, loginUser } from '../api/auth.api';

export const signupApi = async (payload) => {
   return signupUser(payload);
};

export const loginApi = async (payload) => {
   return loginUser(payload);

};