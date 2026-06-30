export default function VenueCard({ venue }) {
    return (
        <div className="bg-white border rounded-3xl overflow-hidden hover:shadow-xl transition h-fit">

            {/* Image */}
            <div className="relative">
                <img
                    src={venue.images?.[0]?.url}
                    className="h-48 w-full object-cover"
                />

                <span className="absolute bottom-3 left-3 bg-amber-500 px-3 py-1 rounded-full text-sm font-semibold">
                    {venue.category}
                </span>

                <button className="absolute right-3 top-3 bg-white rounded-full p-2">
                    🤍
                </button>
            </div>


            <div className="p-5">

                {/* Name + Rating */}
                <div className="flex justify-between items-start">

                    <h2 className="text-lg font-bold line-clamp-1">
                        {venue.name}
                    </h2>

                    <span className="text-sm text-amber-500">
                        ⭐ {venue.rating}
                    </span>

                </div>


                {/* Location */}
                <p className="text-gray-500 text-sm mt-2 line-clamp-1">
                    📍 {venue.address?.city}, {venue.address?.state}
                </p>


                {/* Description */}
                <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                    {venue.description}
                </p>



                {/* Capacity */}
                <div className="grid grid-cols-2 gap-3 mt-4 text-sm">

                    <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-gray-500">
                            Seating
                        </p>
                        <b>
                            {venue.seatingCapacity}
                        </b>
                    </div>


                    <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-gray-500">
                            Standing
                        </p>
                        <b>
                            {venue.standingCapacity}
                        </b>
                    </div>

                </div>



                {/* Price */}
                <div className="flex justify-between mt-4">

                    <div>
                        <p className="text-xs text-gray-500">
                            Per Day
                        </p>

                        <b>
                            ₹{venue.pricePerDay}
                        </b>
                    </div>


                    <div>
                        <p className="text-xs text-gray-500">
                            Per Hour
                        </p>

                        <b>
                            ₹{venue.pricePerHour}
                        </b>
                    </div>

                </div>



                {/* Availability */}
                <div className="mt-4 text-sm">

                    <p className="text-gray-500">
                        Available
                    </p>

                    <p className="font-medium">
                        {venue.availabilityRules?.openTime} - {venue.availabilityRules?.closeTime}
                    </p>

                </div>



                {/* Amenities */}
                <div className="flex gap-2 mt-4 overflow-hidden">

                    {venue.amenities?.slice(0,3).map((item,index)=>(
                        <span
                            key={index}
                            className="bg-gray-100 px-3 py-1 rounded-full text-xs whitespace-nowrap"
                        >
                            {item}
                        </span>
                    ))}

                    {venue.amenities?.length > 3 && (
                        <span className="text-xs text-gray-500 py-1">
                            +{venue.amenities.length - 3}
                        </span>
                    )}

                </div>


                {/* Booking */}
                <div className="mt-5 flex justify-between items-center">

                    <span className="text-xs text-gray-500">
                        Min {venue.minimumBookingHours} hrs
                    </span>


                    <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm">
                        View
                    </button>

                </div>


            </div>

        </div>
    )
}