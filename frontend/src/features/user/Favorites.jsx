import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiUsers, FiStar } from 'react-icons/fi';
import { useGetFavoritesQuery } from './venueApi';
import './Favorites.scss';

function Favorites() {
  const navigate = useNavigate();
  const { data: response, isLoading, error } = useGetFavoritesQuery();
  const favorites = Array.isArray(response?.data)
    ? response.data.map((item) => item?.venue).filter(Boolean)
    : [];

  const viewDetail = (venueId) => {
    navigate(`/venue/${venueId}`);
  };

  return (
    <div className="favorites-page">
      <main className="favorites-container">
        <header className="favorites-header">
          <div>
            <p>
              {isLoading && 'Loading your favorite venues...'}
              {error && 'Unable to load favorites. Please try again.'}
              {!isLoading && !error && favorites.length === 0 && 'You have no favorites yet.'}
              {!isLoading && !error && favorites.length > 0 && `${favorites.length} favorite venue${favorites.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </header>

        {isLoading ? (
          <div className="favorites-state">Loading favorites...</div>
        ) : error ? (
          <div className="favorites-state error">Failed to load favorites.</div>
        ) : favorites.length === 0 ? (
          <div className="favorites-empty">
            <h2>No favorites yet</h2>
            <p>Browse venues and tap the star icon to save them here.</p>
          </div>
        ) : (
          <section className="favorites-grid">
            {favorites.map((venue) => (
              <article key={venue.id} className="favorite-card">
                <div className="favorite-card-image">
                  <img src={venue.images?.[0]?.url || venue.image || 'https://via.placeholder.com/400x230'} alt={venue.name} />
                </div>
                <div className="favorite-card-body">
                  <div className="favorite-card-top">
                    <h2>{venue.name}</h2>
                    <span className="favorite-chip">Favorite</span>
                  </div>
                  <div className="favorite-meta">
                    <span>
                      <FiMapPin size={14} /> {venue.city}, {venue.state}
                    </span>
                    <span>
                      <FiUsers size={14} /> {venue.capacity || 'N/A'} guests
                    </span>
                    <span>
                      <FiStar size={14} /> {venue.rating || 'N/A'}
                    </span>
                  </div>
                  <div className="favorite-price">
                    {venue.pricing && venue.pricing[0]
                      ? `From ₹${Number(venue.pricing[0].pricePerHour).toLocaleString()}/hr`
                      : 'Price unavailable'}
                  </div>
                  <button type="button" className="favorite-details-btn" onClick={() => viewDetail(venue.id)}>
                    View Details
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default Favorites;
