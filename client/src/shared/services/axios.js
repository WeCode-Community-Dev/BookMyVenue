import axios from 'axios';

const axiosInstance = axios.create({
   baseURL: import.meta.env.VITE_API_URL,
   headers: {
      'Content-Type': 'application/json'
   }
});

axiosInstance.interceptors.response.use(

   (response) => response,

   (error) => {

      return Promise.reject({

         status: error?.response?.status,

         message:

            error?.response?.data?.message ||

            'Something went wrong'

      });

   }

);

export default axiosInstance;