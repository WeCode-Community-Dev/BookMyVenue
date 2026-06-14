import axiosInstance from '../../../shared/services/axios';
import { API_ROUTES } from '../../../shared/constants/apiRoutes';

export const signupUser = async (payload) => {

   const response = await axiosInstance.post(
      API_ROUTES.AUTH.SIGNUP,
      payload
   );

   return response.data;

};

export const loginUser = async (payload) => {

   const response = await axiosInstance.post(
      API_ROUTES.AUTH.LOGIN,
      payload
   );

   return response.data;

};

export const loginAdmin = async (payload) => {

   const response = await axiosInstance.post(
      API_ROUTES.ADMIN.LOGIN,
      payload
   );

   return response.data;

}
