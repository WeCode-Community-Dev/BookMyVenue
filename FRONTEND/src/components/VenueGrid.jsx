import { MapPin, SpinnerOne } from "@mynaui/icons-react";
import { VENUE_DATA } from "../data/VenueCardData";
import { useVenueGrid } from "../hooks/useVenueGrid"
import { useNavigate } from 'react-router-dom';

function GridHeader({ venueCount }) {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-4 gap-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#0a2540]">
                Venues for you
            </h2>
            <div className="flex items-center space-x-6 text-sm md:text-base font-medium text-[#0a2540]">
                <span className="text-[#40484b]">{venueCount} venues found</span>
            </div>
            </div>
            <hr className="border-t border-gray-200" />
        </div>
    );
}

function VenueCard({ venue }) {
    const navigate = useNavigate();

    const gridSpan = venue.isLarge ? "md:col-span-2 md:row-span-2" : "col-span-1";
    const titleSize = venue.isLarge ? "text-xl" : "text-sm";
    const detailSize = venue.isLarge ? "text-md" : "text-sm";
    const priceSize = venue.isLarge ? "text-lg" : "text-sm";
    const imageSize = venue.isLarge ? "h-144" : "h-48";

    // Variables to change in API INTERGRATION PHASE
    const venue_name = venue.title
    const venue_image = venue.imageUrl
    const venue_details = venue.details
    const venue_price = venue.price

  return (
    <div onClick={() => navigate(`/venues/${venue.id}`)}
        className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer ${gridSpan}`}
        >
            <img 
            src={venue_image} 
            alt={venue_name} 
            className={`w-full ${imageSize} object-cover`}
            />
            
            <div className="p-4">
                <h3 className={`font-semibold text-[#2a5660] mb-2 ${titleSize}`}>
                    {venue_name}
                </h3>
                
                <div className="flex items-center gap-2 mb-2">
                    <MapPin size={15} stroke={2} />
                    <p className={`text-gray-600 mb-1 ${detailSize}`}>
                    {venue_details}
                    </p>
                </div>
                
                <p className={`font-semibold text-[#ae3b2f] mb-1 ${priceSize}`}>
                    {venue_price}
                </p>
            </div>
    </div>
    );
}


export default function VenueGrid() {
    // const {venues, isLoading, error} = useVenueGrid();
    const Data = VENUE_DATA  // 'venues' for fetched api data [API INTEGRATION PHASE]

    // if(error){
    //     return (
    //         <div className="flex flex-col items-center justify-center min-h-[50vh]" >
    //             <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200" >
    //                 <p className="font-bold">Oops! Something went wrong.</p>
    //                 <p className="text-sm">{error.message}</p>
    //             </div>
    //         </div>
    //     )
    // }

    // if(isLoading){
    //     return (
    //         <div className="flex flex-col items-center justify-center min-h-[50vh] text-[#2b5155]">
    //             <SpinnerOne className="w-10 h-10 animate-spin mb-4" />
    //             <p className="font-semibold text-lg">Loading your spaces...</p>
    //         </div>
    //     )
    // }

    return (
        <div>
            <GridHeader venueCount={VENUE_DATA.length} />

            <div
                className="grid grid-cols-1 md:grid-cols-3 row-auto max-w-7xl min-h-screen gap-6 px-4 md:px-8 py-6 mx-auto"
            >
                {Data.map((venue) => (
                    <VenueCard key={venue.id} venue={venue} />
                ))}
            </div>
        </div>
    );
}