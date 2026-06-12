import { API_ROUTES } from "../../../shared/constants/apiRoutes";
import axiosInstance from "../../../shared/services/axios";

export const createVenueApi = async (payload) => {
   const response = await axiosInstance.post(
     API_ROUTES.VENUES.BASE,
     payload
   );
 
   return response.data;
 };
 
 export const fetchVenuesApi = async () => {
   const response = await axiosInstance.get(
     API_ROUTES.VENUES.BASE
   );
 
   return response.data;
 };
 
 export const fetchVenueByIdApi = async (id) => {
   const response = await axiosInstance.get(
     `${API_ROUTES.VENUES.BASE}/${id}`
   );
 
   return response.data;
 };
 
 export const updateVenueApi = async (id, payload) => {
   const response = await axiosInstance.patch(
     `${API_ROUTES.VENUES.BASE}/${id}`,
     payload
   );
 
   return response.data;
 };
 
 export const deleteVenueApi = async (id) => {
   const response = await axiosInstance.delete(
     `${API_ROUTES.VENUES.BASE}/${id}`
   );
 
   return response.data;
 };

 export const fetchMyVenuesApi = async () => {
   const response = await axiosInstance.get(
     API_ROUTES.USERS.MY_VENUES
   );
 
   return response.data;
 };