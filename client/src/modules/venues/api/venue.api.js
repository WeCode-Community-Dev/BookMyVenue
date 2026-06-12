import { API_ROUTES } from "../../../shared/constants/apiRoutes";
import axiosInstance from "../../../shared/services/axios";



export const venueRegistrationApi = async (payload) => {

   const response = await axiosInstance.post(
      API_ROUTES.VENUES.CREATE,
      payload
   );
    return response.data;
};

export const fetchVenuesApi = async () => {
   const response = await axiosInstance.get(
      API_ROUTES.VENUES.GET_ALL
   );
   return response.data;
};
