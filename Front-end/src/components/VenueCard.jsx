import { useNavigate } from "react-router-dom";

export default function VenueCard({ venue }) {
  const navigate = useNavigate();

  return (
    <div className="venue-card" onClick={() => navigate(`/venues/${venue.id}`)}>
      <div className="card-img-wrap">
        <img src={venue.image} alt={venue.name} className="card-img" />
        <div className="card-badge">{venue.type}</div>
        {venue.featured && <div className="card-featured">⭐ Featured</div>}
      </div>
      <div className="card-body">
        <h3 className="card-title">{venue.name}</h3>
        <p className="card-location">📍 {venue.location}, {venue.city}</p>
        <div className="card-meta">
          <span className="card-capacity">👥 Up to {venue.capacity}</span>
          <span className="card-rating">⭐ {venue.rating} ({venue.reviews})</span>
        </div>
        <div className="card-tags">
          {venue.amenities?.slice(0, 3).map(a => (
            <span key={a} className="tag">{a}</span>
          ))}
        </div>
        <div className="card-footer">
          <div className="card-price">
            <span className="price-label">Starting from</span>
            <span className="price-amount">₹{venue.price?.toLocaleString()}</span>
            <span className="price-unit">/day</span>
          </div>
          <button className="card-btn">View Details</button>
        </div>
      </div>
    </div>
  );
}