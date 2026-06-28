import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VenueListing.css';

export default function VenueListing() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(500);

  const allVenues = [
    {
      id: 1,
      name: 'The Glass Atelier',
      price: 250,
      location: 'Chelsea, Manhattan',
      rating: 4.9,
      category: 'wedding',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 2,
      name: 'Secret Garden Oasis',
      price: 180,
      location: 'Silver Lake, LA',
      rating: 4.8,
      category: 'party',
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 3,
      name: 'Innovation Loft',
      price: 300,
      location: 'South End, Boston',
      rating: 5.0,
      category: 'corporate',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 4,
      name: 'Skyline Penthouse',
      price: 450,
      location: 'Downtown, Chicago',
      rating: 4.7,
      category: 'wedding',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 5,
      name: 'Creative Studio Lab',
      price: 120,
      location: 'Austin, Texas',
      rating: 4.6,
      category: 'workshop',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 6,
      name: 'Grand Banquet Hall',
      price: 490,
      location: 'Miami, Florida',
      rating: 4.9,
      category: 'party',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=500&q=80'
    }
  ];

  const filteredVenues = allVenues.filter(venue => {
    const matchesCategory = selectedCategory === 'all' || venue.category === selectedCategory;
    const matchesPrice = venue.price <= maxPrice;
    return matchesCategory && matchesPrice;
  });

  return (
    <div className="listing-page-container">
      
  
      <aside className="filter-sidebar">
        <h3>Filter Spaces</h3>
        
        <div className="filter-group">
          <label className="filter-label">Event Category</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            <option value="wedding">Weddings</option>
            <option value="corporate">Meetings & Corporate</option>
            <option value="party">Parties & Galas</option>
            <option value="workshop">Workshops</option>
          </select>
        </div>

        <div className="filter-group">
          <div className="price-label-row">
            <label className="filter-label">Max Hourly Price</label>
            <span className="price-display">${maxPrice}/hr</span>
          </div>
          <input 
            type="range" 
            min="100" 
            max="500" 
            step="10"
            value={maxPrice} 
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="price-slider"
          />
        </div>
      </aside>

      <main className="results-container">
        <div className="results-header">
          <h2>Available Venues</h2>
          <p>{filteredVenues.length} spaces found matching your search parameters</p>
        </div>

        {filteredVenues.length === 0 ? (
          <div className="no-results">
            <p>No venues match your exact filter guidelines. Try adjusting your slider!</p>
          </div>
        ) : (
          <div className="listing-grid">
            {filteredVenues.map((venue) => (
              <div 
                key={venue.id} 
                className="listing-card"
                onClick={() => navigate('/book')}
              >
                <div className="listing-img-wrapper">
                  <img src={venue.image} alt={venue.name} />
                  <span className="listing-rating">★ {venue.rating}</span>
                </div>
                <div className="listing-details">
                  <div className="listing-title-row">
                    <h4>{venue.name}</h4>
                    <span className="listing-price">${venue.price}/hr</span>
                  </div>
                  <p className="listing-location">📍 {venue.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

    </div>
  );
}