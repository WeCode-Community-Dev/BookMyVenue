import axiosInstance from "../../../shared/services/axios";

export const fetchAdminVenuesApi =
   async () => {

      const response =
         await axiosInstance.get(
            "/venues"
         );

      return response.data;
   };

export const updateVenueStatusApi =
   async (
      venueId,
      status
   ) => {

      const response =
         await axiosInstance.patch(
            `/admin/venues/${venueId}/status`,
            {
               status,
            }
         );

      return response.data;
   };