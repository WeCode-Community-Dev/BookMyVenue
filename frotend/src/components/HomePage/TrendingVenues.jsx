import { useNavigate } from 'react-router-dom';
import './TrendingVenues.css';

export default function TrendingVenues() {
  const navigate = useNavigate();

  const venues = [
    {
      id: 1,
      name: 'The Glass Atelier',
      price: 250,
      location: 'Chelsea, Manhattan',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 2,
      name: 'Secret Garden Oasis',
      price: 180,
      location: 'Silver Lake, LA',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=500&q=80'
    }
  ];

  return (
    <section className="trending-section">
      <div className="trending-header">
        <h2>Trending Venues</h2>
        <p>Most requested event spaces this week.</p>
      </div>

      <div className="venues-grid">
        {venues.map((venue) => (
          <div 
            key={venue.id} 
            className="venue-card"
            onClick={() => navigate('/book')} /* Takes user to booking page on click */
          >
            <div className="venue-image-container">
              <img src={venue.image} className="venue-card-img" alt={venue.name} />
              <span className="rating-badge">★ {venue.rating}</span>
            </div>
            <div className="venue-details">
              <div className="venue-title-row">
                <h3>{venue.name}</h3>
                <span className="venue-price">${venue.price}/hr</span>
              </div>
              <p className="venue-location">📍 {venue.location}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}