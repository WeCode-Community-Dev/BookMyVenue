import React from 'react';
import { FiPlus, FiMapPin, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import {useGetOwnerVenuesQuery} from './ownerApi.js'

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&h=400&q=80';

function getVenueImage(venue) {
  const primary = venue.images?.find((img) => img.isPrimary) || venue.images?.[0];
  const url = typeof primary === 'string' ? primary : primary?.url;
  return url || PLACEHOLDER_IMAGE;
}

function OwnerVenues() {
  const navigate = useNavigate();

  const {data, isLoading,isError,error} = useGetOwnerVenuesQuery();

  const venues = data?.data ?? [];

  if (isLoading) return <p>.......................</p>;

if (isError) {
    return <div>{error?.data?.message || 'Something went wrong'}</div>;
}

  return (
    <div className="venues-container">
      <div className="venues-header-row">
        <h1 className="venues-title">My Venues</h1>
        {venues.length === 0 ? <div>No venues found</div> : ( 
        <button 
          className="add-venue-btn" 
          onClick={() => navigate('/owner/add-venue')}
        >
          Add New Venue
        </button>
        )}
      </div>

      <div className="venues-grid">
        {venues.map((venue) => (
          <div key={venue.id} className="venue-card">
            <div className="venue-card-image-wrapper">
              <img src={getVenueImage(venue)} alt={venue.name} className="venue-card-image" />
            </div>
            <div className="venue-card-body">
              <div className="venue-card-title-row">
                <h3 className="venue-card-name">{venue.name}</h3>
                <span className={`status-badge status-${venue.approvalStatus.toLowerCase()}`}>
                  {venue.approvalStatus}
                </span>
              </div>

              <div className="venue-card-location">
                <FiMapPin className="location-icon" />
                <span>{venue.city}</span>
              </div>

              <div className="venue-card-details-row">
                <span className="category-tag">{venue.category}</span>
                <span className="capacity-text">
                  {venue.capacity} guests
                </span>
              </div>

              <button
                className="view-details-btn"
                onClick={() => navigate(`/owner/venues/${venue.id}`)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OwnerVenues;
