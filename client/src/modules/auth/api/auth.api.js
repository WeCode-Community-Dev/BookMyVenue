import axiosInstance from '../../../shared/services/axios';

export const signupApi = async (payload) => {
   const response = await axiosInstance.post('/auth/signup', payload);

   return response.data;
};