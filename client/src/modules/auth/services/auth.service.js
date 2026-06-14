
import { signupUser, loginUser,loginAdmin } from '../api/auth.api';

export const signupApi = async (payload) => {
   return signupUser(payload);
};

export const loginApi = async (payload) => {
   return loginUser(payload);

};

export const adminLoginApi  = async (payload) => {
   return loginAdmin(payload);
};