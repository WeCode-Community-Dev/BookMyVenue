import { MapPin, SpinnerOne } from "@mynaui/icons-react";
import { useVenueGrid } from "../hooks/useVenueGrid";
import { useNavigate } from 'react-router-dom';

function GridHeader({ venueCount }) {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-10 pb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#0a2540] tracking-tight">
                        Venues for you
                    </h2>
                    <p className="text-gray-500 text-sm md:text-base">
                        Discover the perfect space for your next event
                    </p>
                </div>
                
                <div className="inline-flex items-center px-4 py-2 bg-gray-100/80 rounded-full text-sm font-semibold text-[#0a2540]">
                    <span className="text-[#40484b]">{venueCount} venues available</span>
                </div>
            </div>
            <hr className="border-t-2 border-gray-100" />
        </div>
    );
}

function VenueCard({ venue }) {
    const navigate = useNavigate();

    const gridSpan = venue.isLarge ? "md:col-span-2 md:row-span-2" : "col-span-1";
    const titleSize = venue.isLarge ? "text-2xl" : "text-lg";
    const detailSize = venue.isLarge ? "text-base" : "text-sm";
    const priceSize = venue.isLarge ? "text-lg" : "text-sm";
    const imageSize = venue.isLarge ? "h-144" : "h-56"; // Slightly taller base height for better aspect ratio

    // Variables for API INTEGRATION PHASE
    const venue_name = venue.venue_name;
    const venue_image = venue.image;
    const venue_details = venue.venue_description;
    const venue_price = venue.price;
    const venue_location = venue.location;

    return (
        <div 
            onClick={() => navigate(`/venues/${venue.id}`)}
            className={`group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer overflow-hidden ${gridSpan}`}
        >
            {/* Image Container */}
            <div className="relative w-full overflow-hidden bg-gray-100">
                <img 
                    src={venue_image} 
                    alt={venue_name} 
                    className={`w-full ${imageSize} object-cover`}
                />
                {/* Subtle dark overlay on hover instead of scaling */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.03] transition-colors duration-300" />
            </div>
            
            {/* Content Container */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start gap-4 mb-3">
                    <div  >
                        <h3 className={`font-bold text-[#1a3d46] leading-tight ${titleSize}`}>
                            {venue_name}
                        </h3>
                        <p className={` text-[#2a5660] leading-relaxed text-sm`}>
                            {venue_details}
                        </p>
                    </div>

                    {/* Price Badge */}
                    <div className={`shrink-0 font-bold text-[#ae3b2f] bg-red-50 px-2.5 py-1 rounded-md ${priceSize}`}>
                        {venue_price}₹
                    </div>
                </div>
                
                {/* Location/Details anchored to bottom */}
                <div className="flex items-start gap-2 mt-auto text-gray-500 pt-2">
                    <MapPin className="shrink-0 mt-0.5 text-[#2a5660]" size={16} stroke={2.5} />
                    <p className={`leading-relaxed line-clamp-2 ${detailSize}`}>
                        {venue_location}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function VenueGrid() {
    const { venues, isLoading, error } = useVenueGrid();
    const Data = Array.isArray(venues) ? venues : []; 

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="p-6 bg-red-50 text-red-700 rounded-xl border border-red-100 shadow-sm max-w-md text-center">
                    <p className="font-bold text-lg mb-1">Oops! Something went wrong.</p>
                    <p className="text-sm opacity-80">{error.message}</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-[#2b5155]">
                <SpinnerOne className="w-10 h-10 animate-spin mb-4 text-[#2a5660]" />
                <p className="font-semibold text-lg tracking-wide">Loading your spaces...</p>
            </div>
        );
    }

    if (Data.length === 0) {
        return (
            <div className="w-full max-w-7xl mx-auto">
                <GridHeader venueCount={0} />
                <div className="flex flex-col items-center justify-center min-h-[40vh] text-gray-500 bg-gray-50/50 rounded-2xl m-4 md:m-8 border border-dashed border-gray-200">
                    <MapPin size={48} className="mb-4 text-gray-300" />
                    <p className="text-xl font-semibold text-[#0a2540]">No venues available right now</p>
                    <p className="text-sm mt-2">Check back later or try adjusting your search filters.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-12 bg-[#fafaf9] min-h-screen bg-[#f9f9f7] ">
            <GridHeader venueCount={Data.length} />

            <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-auto max-w-7xl gap-6 md:gap-8 px-4 md:px-8 py-6 mx-auto">
                {Data.map((venue) => (
                    <VenueCard key={venue.id} venue={venue} />
                ))}
            </div>
        </div>
    );
}