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

const VenueFeaturedCard = ({ venue }) => {
  return (
    <div className="col-12 col-md-6 col-lg-4 d-flex">
      <article className="venue-card">
        <img
          src={venue.cover_image?.image || fallbackImage}
          alt={venue.cover_image?.alt_text || venue.name}
        />
        <div className="venue-content">
          <h3>{venue.name}</h3>
          <p><i className="bi bi-geo-alt-fill"></i> {venue.city}</p>
          <strong>
            {formatPrice(venue.base_price_per_day)}<span>/day</span>
          </strong>
          <p>
            <i className="bi bi-people-fill"></i> Capacity {venue.max_capacity}
          </p>
          <Link
            className="btn small-outline-btn"
            to={`/venues/${venue.slug}`}
          >
            View Details
          </Link>
        </div>
      </article>
    </div>
  );
};

export default VenueFeaturedCard;
