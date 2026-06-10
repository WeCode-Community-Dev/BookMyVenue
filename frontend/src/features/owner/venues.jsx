import React from 'react';
import { FiPlus, FiMapPin, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const MOCK_VENUES = [
  {
    id: 1,
    name: 'The Grand Ballroom',
    status: 'Approved',
    location: 'San Francisco, CA',
    category: 'Conference Center',
    capacity: 250,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&h=400&q=80',
  },
  {
    id: 2,
    name: 'Grand Ballroom',
    status: 'Pending',
    location: 'San Francisco, CA',
    category: 'Event Space',
    capacity: 100,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&h=400&q=80',
  },
  {
    id: 3,
    name: 'Rustic Barn',
    status: 'Pending',
    location: 'San Francisco, CA',
    category: 'Banquet Hall',
    capacity: 100,
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&h=400&q=80',
  },
  {
    id: 4,
    name: 'The Futric Bann',
    status: 'Approved',
    location: 'San Francisco, CA',
    category: 'Banquet Hall',
    capacity: 100,
    image: 'https://images.unsplash.com/photo-1505232458627-a727b7f429f5?auto=format&fit=crop&w=600&h=400&q=80',
  },
  {
    id: 5,
    name: 'The Draft',
    status: 'Approved',
    location: 'San Francisco, CA',
    category: 'Conference Center',
    capacity: 250,
    image: 'https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&w=600&h=400&q=80',
  },
  {
    id: 6,
    name: 'Rustic Barn',
    status: 'Pending',
    location: 'San Francisco, CA',
    category: 'Event Space',
    capacity: 100,
    image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=600&h=400&q=80',
  },
  {
    id: 7,
    name: 'The Grand Ballroom',
    status: 'Draft',
    location: 'San Francisco, CA',
    category: 'Event Space',
    capacity: 200,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&h=400&q=80',
  },
  {
    id: 8,
    name: 'The Barn',
    status: 'Approved',
    location: 'San Francisco, CA',
    category: 'Banquet Hall',
    capacity: 100,
    image: 'https://images.unsplash.com/photo-1522158673376-3c72b228234e?auto=format&fit=crop&w=600&h=400&q=80',
  },
];

function OwnerVenues() {
  const navigate = useNavigate();

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
        {MOCK_VENUES.map((venue) => (
          <div key={venue.id} className="venue-card">
            <div className="venue-card-image-wrapper">
              <img src={venue.image} alt={venue.name} className="venue-card-image" />
            </div>
            
            <div className="venue-card-body">
              <div className="venue-card-title-row">
                <h3 className="venue-card-name">{venue.name}</h3>
                <span className={`status-badge status-${venue.status.toLowerCase()}`}>
                  {venue.status}
                </span>
              </div>

              <div className="venue-card-location">
                <FiMapPin className="location-icon" />
                <span>{venue.location}</span>
              </div>

              <div className="venue-card-details-row">
                <span className="category-tag">{venue.category}</span>
                <span className="capacity-text">
                  {venue.capacity} guests
                </span>
              </div>

              <button className="view-details-btn">
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
