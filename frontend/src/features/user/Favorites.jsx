import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiUsers, FiStar, FiHeart } from 'react-icons/fi';
import { useGetFavoritesQuery } from './venueApi';
import PageTransition from '../../components/ui/PageTransition';
import { VenueGridSkeleton } from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';
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
    <PageTransition className="favorites-page">
      <div className="favorites-hero">
        <span className="eyebrow">Your collection</span>
        <h1>Saved <em>favorites</em></h1>
        {!isLoading && !error && favorites.length > 0 && (
          <p>{favorites.length} venue{favorites.length !== 1 ? 's' : ''} you love</p>
        )}
      </div>
      <main className="favorites-container">
        {isLoading ? (
          <VenueGridSkeleton count={3} />
        ) : error ? (
          <EmptyState
            title="Couldn't load favorites"
            message="Something went wrong. Please refresh and try again."
            variant="error"
          />
        ) : favorites.length === 0 ? (
          <EmptyState
            icon={FiHeart}
            title="No favorites yet"
            message="Browse venues and tap the star icon to save your favorite spaces here."
            actionLabel="Browse Venues"
            actionTo="/browse-venues"
          />
        ) : (
          <section className="favorites-grid">
            {favorites.map((venue) => (
              <article key={venue.id} className="favorite-card">
                <div className="favorite-card-image">
                  <img src={venue.images?.[0]?.url || venue.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&h=400&q=80'} alt={venue.name} />
                  <span className="favorite-chip">Saved</span>
                </div>
                <div className="favorite-card-body">
                  <h2>{venue.name}</h2>
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
    </PageTransition>
  );
}

export default Favorites;
