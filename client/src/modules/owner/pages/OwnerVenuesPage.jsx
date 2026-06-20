import { useEffect, useState } from "react";

import VenueSetupModal from "../components/VenueSetupModal";

import SetupAlert from "../components/SetupAlert";

import { fetchMyVenuesApi } from "../../venues/api/venue.api";

const OwnerVenuesPage = () => {
   const [venues, setVenues] = useState([]);
   const [selectedVenue, setSelectedVenue] =
      useState(null);

   useEffect(() => {
      loadVenues();
   }, []);

   const loadVenues = async () => {
      try {
         const response = await fetchMyVenuesApi();

         setVenues(response.data || []);
      } catch (error) {
         console.error(error);
      }
   };

   const isVenueIncomplete = (venue) => {
      return (
         !venue.address ||
         !venue.description ||
         !venue.capacity ||
         !venue.price ||
         !venue.images ||
         venue.images.length === 0
      );
   };

   const incompleteVenues =
      venues.filter(isVenueIncomplete);

   return (
      <>

         <SetupAlert
            incompleteVenues={incompleteVenues}
            onComplete={(venue) =>
               setSelectedVenue(venue)
            }
         />

         <div className="mb-6">

            <h2 className="text-2xl font-bold">
               My Venues
            </h2>

         </div>

         {venues.length === 0 ? (

            <div
               className="
                  border
                  rounded-2xl
                  p-8
                  text-center
               "
            >

               <p className="text-gray-500">
                  No venues found.
               </p>

            </div>

         ) : (

            <div className="grid gap-5">

               {venues.map((venue) => (
                  <div
                     key={venue.id}
                     className="
                        border
                        rounded-2xl
                        p-5
                        flex
                        flex-col
                        md:flex-row
                        md:items-center
                        md:justify-between
                        gap-4
                     "
                  >

                     <div className="flex gap-4">

                        <div
                           className="
                              w-24
                              h-24
                              rounded-xl
                              overflow-hidden
                              bg-gray-100
                              shrink-0
                           "
                        >

                           {venue.images?.length > 0 ? (

                              <img
                                 src={venue.images[0]}
                                 alt={venue.name}
                                 className="
                                    w-full
                                    h-full
                                    object-cover
                                 "
                              />

                           ) : (

                              <div
                                 className="
                                    w-full
                                    h-full
                                    flex
                                    items-center
                                    justify-center
                                    text-3xl
                                 "
                              >
                                 🏢
                              </div>

                           )}

                        </div>

                        <div>

                           <h3 className="font-semibold text-lg">
                              {venue.name}
                           </h3>

                           <p className="text-gray-500">
                              {venue.city}
                           </p>

                           <p className="text-sm text-gray-400 mt-1">
                              {venue.price
                                 ? `₹${venue.price}/day`
                                 : "Price not set"}
                           </p>

                        </div>

                     </div>

                     <button
                        onClick={() =>
                           setSelectedVenue(venue)
                        }
                        className={
                           isVenueIncomplete(venue)
                              ? "btn-primary"
                              : "btn-outline"
                        }
                     >
                        {isVenueIncomplete(venue)
                           ? "Complete Setup"
                           : "Manage"}
                     </button>

                  </div>
               ))}

            </div>

         )}

         {selectedVenue && (
            <VenueSetupModal
               venue={selectedVenue}
               onClose={() => {
                  setSelectedVenue(null);
                  loadVenues();
               }}
            />
         )}

      </>
   );
};

export default OwnerVenuesPage;