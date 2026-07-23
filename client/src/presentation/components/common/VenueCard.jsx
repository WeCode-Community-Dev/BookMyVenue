import { useNavigate } from "react-router-dom";

export default function VenueCard({
  venue,
  variant = "default",
  isWishlisted = false,
  onWishlistToggle,
}) {
  const navigate = useNavigate();

  const handleVenueClick = () => {
    navigate(`/user/venue/${venue.id}`);
  };

  const handleWishlistClick = (event) => {
    event.stopPropagation();
    onWishlistToggle?.(venue.id);
  };

  return (
    <div
      onClick={handleVenueClick}
      className="cursor-pointer self-start overflow-hidden rounded-3xl border bg-white transition hover:shadow-xl"
    >
      {/* Image */}
      <div className="relative">
        <img
          src={venue.images?.[0]?.url}
          alt={venue.name}
          className={
            variant === "home"
              ? "h-62 w-full flex-shrink-0 object-cover"
              : "h-52 w-full flex-shrink-0 object-cover"
          }
        />

        <span className="absolute bottom-4 left-4 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold">
          {venue.category}
        </span>

        <button
          type="button"
          onClick={handleWishlistClick}
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow"
          aria-label={
            isWishlisted ? "Remove from wishlist" : "Add to wishlist"
          }
        >
          {isWishlisted ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        {/* Rating */}
        <div className="mb-3 flex gap-2">
          <span className="text-amber-500">⭐</span>
          <span>{venue.rating || 0}</span>
        </div>

        {/* Name */}
        <h2 className="line-clamp-1 text-xl font-bold">{venue.name}</h2>

        {/* Location */}
        <p className="mt-2 text-sm text-gray-500">
          📍 {venue.address?.city}, {venue.address?.state}
        </p>

        {/* Description */}
        {variant === "default" && (
          <p className="mt-3 line-clamp-2 text-sm text-gray-600">
            {venue.description}
          </p>
        )}

        {/* Price + Capacity */}
        <div className="mt-5 flex justify-between">
          <div>
            <p className="text-sm text-gray-500">Starting from</p>

            <p className="text-xl font-bold">
              ₹{venue.pricePerDay}
              <span className="text-sm font-normal">/day</span>
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">Capacity</p>

            <p className="font-bold">
              {venue.seatingCapacity} Seating
            </p>

            <p className="font-bold">
              {venue.standingCapacity} Standing
            </p>
          </div>
        </div>

        {/* Browse Extra Details */}
        {variant === "default" && (
          <>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Available</p>

              <p>
                {venue.availabilityRules?.openTime}-
                {venue.availabilityRules?.closeTime}
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              {venue.amenities?.slice(0, 3).map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs"
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