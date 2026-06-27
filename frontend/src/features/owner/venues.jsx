import React from 'react';
import { FiPlus, FiMapPin, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import {useGetOwnerVenuesQuery} from './ownerApi.js'


function OwnerVenues() {
  const navigate = useNavigate();

  const {data, isLoading,isError,error} = useGetOwnerVenuesQuery();

  let venues;

  if(data){
     venues = data.data;
  }

  if (isLoading) return <p>.......................</p>;

if (isError) {
    return <div>{error?.data?.message || 'Something went wrong'}</div>;
}

  return (
    <div className="venues-container">
      <div className="venues-header-row">
        <h1 className="venues-title">My Venues</h1>
        <button 
          className="add-venue-btn" 
          onClick={() => navigate('/owner/add-venue')}
        >
          Add New Venue
        </button>
      </div>

      <div className="venues-grid">
        {venues.map((venue) => (
          <div key={venue.id} className="venue-card">
            <div className="venue-card-image-wrapper">
              <img src={venue.images[0].url} alt={venue.name} className="venue-card-image" /> 
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
