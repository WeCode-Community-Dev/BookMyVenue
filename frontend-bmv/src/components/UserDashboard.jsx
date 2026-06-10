import { useState } from 'react';

const INITIAL_VENUES = [
  {
    id: 1,
    name: 'Grand Ballroom & Convention Center',
    type: 'banquet',
    location: 'New York, USA',
    capacity: 500,
    price: 150,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 2,
    name: 'Skyline Rooftop Terrace',
    type: 'outdoor',
    location: 'Los Angeles, USA',
    capacity: 150,
    price: 120,
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 3,
    name: 'Silicon Valley Executive Meeting Suite',
    type: 'meeting',
    location: 'San Francisco, USA',
    capacity: 25,
    price: 50,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 4,
    name: 'The Rustic Barn & Vineyard',
    type: 'wedding',
    location: 'Napa Valley, USA',
    capacity: 300,
    price: 200,
    image: 'https://images.unsplash.com/photo-1519225495810-7517c696567a?auto=format&fit=crop&q=80&w=600'
  }
];

function UserDashboard({ user, onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [bookings, setBookings] = useState([
    {
      id: 101,
      venueName: 'Silicon Valley Executive Meeting Suite',
      date: '2026-06-15',
      timeSlot: '09:00 AM - 01:00 PM',
      totalPrice: 200,
      status: 'Confirmed'
    }
  ]);
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' or 'bookings'

  const handleBookVenue = (venue) => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 7);
    const dateString = futureDate.toISOString().split('T')[0];

    const newBooking = {
      id: Date.now(),
      venueName: venue.name,
      date: dateString,
      timeSlot: '02:00 PM - 06:00 PM',
      totalPrice: venue.price * 4,
      status: 'Pending Host Approval'
    };

    setBookings([newBooking, ...bookings]);
    alert(`Successfully requested booking for: ${venue.name}!\nCheck the 'My Bookings' tab to view status.`);
  };

  const filteredVenues = INITIAL_VENUES.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          venue.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || venue.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="dashboard-container">
      <header className="dashboard-nav">
        <div className="dashboard-user-info">
          <div className="avatar-small">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-text-info">
            <h3>{user?.name || 'Guest'}</h3>
            <span className="role-badge">Booker</span>
          </div>
        </div>
        <div className="dashboard-tabs">
          <button 
            className={`tab-button ${activeTab === 'browse' ? 'active' : ''}`}
            onClick={() => setActiveTab('browse')}
          >
            Browse Venues
          </button>
          <button 
            className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            My Bookings ({bookings.length})
          </button>
          <button className="logout-link-btn" onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </header>

      <main className="dashboard-content-area">
        {activeTab === 'browse' ? (
          <div className="browse-section">
            <div className="filter-bar">
              <input
                type="text"
                placeholder="Search by venue name or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Types</option>
                <option value="banquet">Banquet Hall</option>
                <option value="outdoor">Outdoor Terrace</option>
                <option value="meeting">Meeting Room</option>
                <option value="wedding">Wedding Venue</option>
              </select>
            </div>

            <div className="venues-grid">
              {filteredVenues.length > 0 ? (
                filteredVenues.map(venue => (
                  <div className="venue-card" key={venue.id}>
                    <div className="venue-image" style={{ backgroundImage: `url(${venue.image})` }}>
                      <span className="venue-type-tag">{venue.type}</span>
                    </div>
                    <div className="venue-card-body">
                      <h4>{venue.name}</h4>
                      <p className="venue-loc">{venue.location}</p>
                      <div className="venue-meta">
                        <span>👥 Max {venue.capacity} guests</span>
                        <span className="venue-price">${venue.price}/hr</span>
                      </div>
                      <button 
                        onClick={() => handleBookVenue(venue)}
                        className="book-btn"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">No venues found matching your criteria.</div>
              )}
            </div>
          </div>
        ) : (
          <div className="bookings-section">
            <h3>My Event Bookings</h3>
            <div className="bookings-table-wrapper">
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Venue</th>
                    <th>Date</th>
                    <th>Time Slot</th>
                    <th>Total Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking.id}>
                      <td className="bold">{booking.venueName}</td>
                      <td>{booking.date}</td>
                      <td>{booking.timeSlot}</td>
                      <td>${booking.totalPrice}</td>
                      <td>
                        <span className={`status-badge ${booking.status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default UserDashboard;
