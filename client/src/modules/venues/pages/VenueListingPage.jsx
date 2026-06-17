import MainLayout from "../../common/MainLayout";

import VenueCard from "../components/VenueCard";

import { useVenues } from "../hooks/useVenues";

const VenueListingPage = () => {
   const {
      venues,
      loading,
   } = useVenues();

   return (
      <MainLayout>
         <div
            className="
               max-w-[1200px]
               mx-auto
               px-5
               py-32
            "
         >
            <div className="mb-10">
               <h1
                  className="
                     text-3xl
                     font-bold
                  "
               >
                  Browse Venues
               </h1>

               <p className="text-gray-500">
                  Discover venues for every occasion.
               </p>
            </div>

            {loading ? (
               <p>Loading venues...</p>
            ) : venues.length === 0 ? (
               <p>
                  No venues available.
               </p>
            ) : (
               <div
                  className="
                     grid
                     grid-cols-1
                     sm:grid-cols-2
                     lg:grid-cols-3
                     gap-5
                  "
               >
                  {venues.map((venue) => (
                     <VenueCard
                        key={venue.id}
                        venue={venue}
                     />
                  ))}
               </div>
            )}
         </div>
      </MainLayout>
   );
};

export default VenueListingPage;