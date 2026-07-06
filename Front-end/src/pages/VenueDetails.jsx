import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { venues } from "../services/Data";
import { useAuth } from "../context/AuthContext";

export default function VenueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const venue = venues.find(v => v.id === parseInt(id));

  const [activeImg, setActiveImg] = useState(0);
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(100);
  const [eventType, setEventType] = useState("Wedding");

  if (!venue) return <div className="not-found">Venue not found</div>;

  const handleBook = () => {
    if (!user) {
      navigate("/login", { state: { from: `/venues/${id}`, booking: { date, guests, eventType } } });
      return;
    }
    navigate("/booking", { state: { venue, date, guests, eventType } });
  };

  const today = new Date().toISOString().split("T")[0];

  useEffect(()=> {
    window.scrollTo({top:0, behavior: "smooth"});
  }, []);

  return (
    <div className="venue-details-page">
      {/* Image Gallery */}
      <div className="gallery">
        <div className="gallery-main">
          <img src={venue.images?.[activeImg] || venue.image} alt={venue.name} />
          <button className="gallery-back" onClick={() => navigate(-1)}>← Back</button>
        </div>
        {venue.images?.length > 1 && (
          <div className="gallery-thumbs">
            {venue.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className={`thumb ${activeImg === i ? "active" : ""}`}
                onClick={() => setActiveImg(i)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="details-layout">
        {/* Left: Info */}
        <div className="details-info">
          <div className="details-header">
            <div>
              <span className="details-type-badge">{venue.type}</span>
              <h1 className="details-title">{venue.name}</h1>
              <p className="details-location">📍 {venue.location}, {venue.city}</p>
            </div>
            <div className="details-rating-wrap">
              <span className="details-rating">⭐ {venue.rating}</span>
              <span className="details-reviews">({venue.reviews} reviews)</span>
            </div>
          </div>

          <div className="details-highlights">
            <div className="highlight"><span>👥</span><span>Up to {venue.capacity}</span></div>
            <div className="highlight"><span>💰</span><span>From ₹{venue.price?.toLocaleString()}/day</span></div>
            <div className="highlight"><span>✅</span><span>Verified Venue</span></div>
            <div className="highlight"><span>🎉</span><span>{venue.type} Friendly</span></div>
          </div>

          <div className="details-section">
            <h2>About This Venue</h2>
            <p>{venue.description}</p>
          </div>

          <div className="details-section">
            <h2>Amenities & Features</h2>
            <div className="amenities-grid">
              {venue.amenities?.map(a => (
                <div key={a} className="amenity-item">✔ {a}</div>
              ))}
            </div>
          </div>

          <div className="details-section">
            <h2>Venue Policies</h2>
            <ul className="policy-list">
              <li>🕘 Available from 8:00 AM to 11:00 PM</li>
              <li>🚫 Outside alcohol/catering may be restricted</li>
              <li>📋 50% advance payment required at booking</li>
              <li>↩️ Full refund if cancelled 15 days prior</li>
            </ul>
          </div>
        </div>

        {/* Right: Booking Card */}
        <div className="booking-card">
          <h2>Book This Venue</h2>
          <div className="booking-price">
            <span className="bp-amount">₹{venue.price?.toLocaleString()}</span>
            <span className="bp-unit">/ day</span>
          </div>

          <div className="booking-form">
            <div className="form-group">
              <label>Event Date</label>
              <input
                type="date"
                min={today}
                value={date}
                onChange={e => setDate(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Event Type</label>
              <select value={eventType} onChange={e => setEventType(e.target.value)} className="form-input">
                <option>Wedding</option>
                <option>Engagement</option>
                <option>Birthday Party</option>
                <option>Corporate Event</option>
                <option>Reception</option>
              </select>
            </div>
            <div className="form-group">
              <label>Expected Guests: <strong>{guests}</strong></label>
              <input
                type="range"
                min={20}
                max={1000}
                step={10}
                value={guests}
                onChange={e => setGuests(e.target.value)}
                className="range-input"
              />
              <div className="range-limits"><span>20</span><span>1000</span></div>
            </div>

            <div className="booking-summary">
              <div className="bs-row"><span>Venue Charge</span><span>₹{venue.price?.toLocaleString()}</span></div>
              <div className="bs-row"><span>Service Fee (5%)</span><span>₹{Math.round(venue.price * 0.05).toLocaleString()}</span></div>
              <div className="bs-row bs-total"><span>Total Estimate</span><span>₹{Math.round(venue.price * 1.05).toLocaleString()}</span></div>
            </div>

            <button className="book-now-btn" onClick={handleBook}>
              {user ? "Book Now" : "Login to Book"}
            </button>
            {!user && <p className="login-hint">Please login to complete your booking</p>}
          </div>
        </div>
      </div>
    </div>
  );
}