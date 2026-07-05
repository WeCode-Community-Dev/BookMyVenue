import React from "react";
import { Link } from "react-router-dom";

const fallbackImage =
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(price));

const VenueCard = ({ venue, favoriteId, favoriteSaving, onFavoriteToggle }) => {
  const visibleAmenities = venue.amenities.slice(0, 4);
  const remainingAmenities = venue.amenities.length - visibleAmenities.length;
  const isFavorite = Boolean(favoriteId);

  return (
    <article className="listing-card">
                <div className="card-image-wrap">
                  <img
                    src={venue.cover_image?.image || fallbackImage}
                    alt={venue.cover_image?.alt_text || venue.name}
                  />
                  <button
                    className={`wishlist-btn ${isFavorite ? "is-favorite" : ""}`}
                    type="button"
                    aria-label={`${isFavorite ? "Remove" : "Add"} ${venue.name} ${isFavorite ? "from" : "to"} favorites`}
                    aria-pressed={isFavorite}
                    disabled={favoriteSaving}
                    onClick={() => onFavoriteToggle(venue.id)}
                  >
                    <i className={`bi ${isFavorite ? "bi-heart-fill" : "bi-heart"}`}></i>
                  </button>
                </div>

                <div className="listing-card-body">
                  <div className="title-price-row">
                    <div>
                      <h2>{venue.name}</h2>
                      <p className="location-text">
                        <i className="bi bi-geo-alt-fill"></i> {venue.city}
                      </p>
                    </div>
                    <div className="price-box">
                      {formatPrice(venue.base_price_per_day)} <span>/day</span>
                    </div>
                  </div>

                  <div className="meta-row">
                    <span>
                      <i className="bi bi-people-fill"></i> Capacity {venue.max_capacity}
                    </span>
                    <span>{venue.venue_type_display}</span>
                  </div>

                  <div className="amenities-list">
                    {visibleAmenities.map((amenity) => (
                      <span key={amenity.id}>{amenity.name}</span>
                    ))}
                    {remainingAmenities > 0 && <span>+{remainingAmenities} more</span>}
                  </div>

                  <div className="card-btn-wrap">
                    <Link
                      className="btn small-outline-btn"
                      to={`/venues/${venue.slug}`}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
    </article>
  );
};

export default VenueCard;
