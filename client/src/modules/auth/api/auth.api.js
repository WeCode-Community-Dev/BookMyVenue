import axiosInstance from '../../../shared/services/axios';
import { API_ROUTES } from '../../../shared/constants/apiRoutes';

export const signupApi = async (payload) => {
   const response = await axiosInstance.post(API_ROUTES.AUTH.SIGNUP, payload);

   return response.data;
};