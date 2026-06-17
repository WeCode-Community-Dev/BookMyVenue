import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import MainLayout from "../../common/MainLayout";

import VenueSetupModal from "../components/VenueSetupModal";

import { fetchMyVenuesApi } from "../../venues/api/venue.api";

const OwnerDashboard = () => {
   const [venues, setVenues] = useState([]);
   const [selectedVenue, setSelectedVenue] = useState(null);

   const location = useLocation();

   useEffect(() => {
      loadVenues();
   }, []);

   const loadVenues = async () => {
      try {
         const response = await fetchMyVenuesApi();

         const data = response.data || [];

         setVenues(data);

         /*
          * Open automatically only after
          * signup redirect.
          */
         if (location.state?.openVenueSetup) {
            const incompleteVenue =
               data.find(isVenueIncomplete);

            if (incompleteVenue) {
               setSelectedVenue(incompleteVenue);
            }
         }
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

   return (
      <MainLayout>
         <div className="max-w-7xl mx-auto px-5 py-10 mt-20">

            {/* Header */}
            <div className="mb-8">
               <h1 className="text-3xl font-bold">
                  Owner Dashboard
               </h1>

               <p className="text-gray-500 mt-2">
                  Manage your venues and booking requests.
               </p>
            </div>

            {/* Setup Alerts */}
            <section className="mb-10">
               <div className="flex items-center justify-between mb-4">

                  <h2 className="text-xl font-semibold">
                     Setup Alerts
                  </h2>

               </div>

               <div className="space-y-4">

                  {venues
                     .filter(isVenueIncomplete)
                     .length === 0 ? (

                     <div className="border rounded-2xl p-5 bg-green-50">
                        <p className="text-green-700 font-medium">
                           ✓ All your venues are fully configured.
                        </p>
                     </div>

                  ) : (

                     venues
                        .filter(isVenueIncomplete)
                        .map((venue) => (
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
                              <div>
                                 <h3 className="font-semibold">
                                    {venue.name}
                                 </h3>

                                 <p className="text-gray-500 mt-1">
                                    Setup incomplete
                                 </p>
                              </div>

                              <button
                                 onClick={() =>
                                    setSelectedVenue(venue)
                                 }
                                 className="btn-primary"
                              >
                                 Complete Setup
                              </button>
                           </div>
                        ))
                  )}

               </div>
            </section>

            {/* Recent Bookings */}
            <section className="mb-10">

               <h2 className="text-xl font-semibold mb-4">
                  Recent Bookings
               </h2>

               <div className="border rounded-2xl p-8 text-center">

                  <p className="text-gray-500">
                     No booking requests yet.
                  </p>

               </div>

            </section>

            {/* My Venues */}
            <section>

               <h2 className="text-xl font-semibold mb-4">
                  My Venues
               </h2>

               {venues.length === 0 ? (

                  <div className="border rounded-2xl p-8 text-center">

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
                                       ? `₹${venue.price} / day`
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

            </section>

            {/* Venue Setup Modal */}
            {selectedVenue && (
               <VenueSetupModal
                  venue={selectedVenue}
                  onClose={() => {
                     setSelectedVenue(null);

                     /*
                      * Reload venues after update.
                      */
                     loadVenues();
                  }}
               />
            )}

         </div>
      </MainLayout>
   );
};

export default OwnerDashboard;