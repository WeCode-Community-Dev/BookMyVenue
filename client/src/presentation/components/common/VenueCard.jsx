import { useNavigate } from "react-router-dom";

export default function VenueCard({
  venue,
  variant = "default",
  isWishlisted = false,
  onWishlistToggle,
}) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/user/venue/${venue.id}`)}
      className="cursor-pointer bg-white rounded-3xl overflow-hidden border hover:shadow-xl transition self-start"
    >
      {/* Image */}
      <div className="relative">
        <img
          src={venue.images?.[0]?.url}
          alt={venue.name}
          className={
            variant === "home"
              ? "h-62 w-full object-cover flex-shrink-0"
              : "h-52 w-full object-cover flex-shrink-0"
          }
        />

        <span className="absolute bottom-4 left-4 bg-amber-500 px-4 py-2 rounded-full text-sm font-semibold">
          {venue.category}
        </span>


        <button
          onClick={(e) => { e.stopPropagation();
            onWishlistToggle?.(venue.id);
          }}
          className="absolute right-4 top-4 bg-white rounded-full w-11 h-11 flex items-center justify-center shadow"
        >
          {isWishlisted ? "❤️" : "🤍"}
        </button>

      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Rating */}
        <div className="flex gap-2 mb-3">
          <span className="text-amber-500">⭐</span>

          <span>{venue.rating || 0}</span>
        </div>

        {/* Name */}

        <h2 className="text-xl font-bold line-clamp-1">{venue.name}</h2>

        {/* Location */}

        <p className="text-gray-500 text-sm mt-2">
          📍 {venue.address?.city}, {venue.address?.state}
        </p>

        {/* Description only browse */}

        {variant === "default" && (
          <p className="text-gray-600 text-sm mt-3 line-clamp-2">
            {venue.description}
          </p>
        )}

        {/* Price + Capacity */}

        <div className="flex justify-between mt-5">
          <div>
            <p className="text-gray-500 text-sm">Starting from</p>

            <p className="font-bold text-xl">
              ₹{venue.pricePerDay}
              <span className="text-sm font-normal">/day</span>
            </p>
          </div>

          <div className="text-right">
            <p className="text-gray-500 text-sm">Capacity</p>

            <p className="font-bold">{venue.seatingCapacity} Seating</p>

            <p className="font-bold">{venue.standingCapacity} Standing</p>
          </div>
        </div>

        {/* Browse extra details */}

        {variant === "default" && (
          <>
            <div className="mt-4">
              <p className="text-gray-500 text-sm">Available</p>

              <p>
                {venue.availabilityRules?.openTime}-
                {venue.availabilityRules?.closeTime}
              </p>
            </div>

            <div className="flex gap-2 mt-4">
              {venue.amenities?.slice(0, 3).map((item, index) => (
                <span
                  key={index}
                  className="bg-gray-100 px-3 py-1 rounded-full text-xs"
                >
                  {item}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
