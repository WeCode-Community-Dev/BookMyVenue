import { useEffect, useState } from "react";

import {
   fetchAdminVenuesApi,
} from "../api/admin.api";

import VenueReviewModal
   from "../components/VenueReviewModal";

const AdminVenuesPage = () => {

   const [venues, setVenues] =
      useState([]);

   const [selectedVenue,
      setSelectedVenue] =
      useState(null);

   useEffect(() => {
      loadVenues();
   }, []);

   const loadVenues = async () => {

      try {

         const response =
            await fetchAdminVenuesApi();

         setVenues(response.data || []);

      } catch (error) {

         console.error(error);

      }
   };

   return (

      <div>

         <h2 className="text-2xl font-bold mb-6">
            Venue Approvals
         </h2>

         <div className="space-y-4">

            {venues.map((venue) => (

               <div
                  key={venue.id}
                  onClick={() =>
                     setSelectedVenue(venue)
                  }
                  className="
                     border
                     rounded-xl
                     p-5
                     cursor-pointer
                     hover:shadow-md
                  "
               >

                  <div className="flex justify-between">

                     <div>

                        <h3 className="font-semibold">
                           {venue.name}
                        </h3>

                        <p className="text-gray-500">
                           {venue.city}
                        </p>

                     </div>

                     <span
                        className={`
                           px-3
                           py-1
                           rounded-full
                           text-sm
                           ${
                              venue.status === "PENDING"
                                 ? "bg-yellow-100 text-yellow-700"
                                 : venue.status === "APPROVED"
                                 ? "bg-green-100 text-green-700"
                                 : "bg-red-100 text-red-700"
                           }
                        `}
                     >
                        {venue.status}
                     </span>

                  </div>

               </div>

            ))}

         </div>

         {selectedVenue && (

            <VenueReviewModal
               venue={selectedVenue}
               onClose={() =>
                  setSelectedVenue(null)
               }
               reloadVenues={loadVenues}
            />

         )}

      </div>
   );
};

export default AdminVenuesPage;