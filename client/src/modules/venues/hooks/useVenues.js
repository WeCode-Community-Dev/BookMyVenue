import { useEffect, useState } from "react";

import { fetchVenuesApi } from "../api/venue.api";

export const useVenues = () => {
   const [venues, setVenues] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      loadVenues();
   }, []);

   const loadVenues = async () => {
      try {
         const response =
            await fetchVenuesApi();

         setVenues(response.data || []);
      } catch (error) {
         console.error(error);

         setVenues([]);
      } finally {
         setLoading(false);
      }
   };

   return {
      venues,
      loading,
      reload: loadVenues,
   };
};