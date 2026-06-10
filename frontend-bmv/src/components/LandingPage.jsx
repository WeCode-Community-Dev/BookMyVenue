import { useState } from 'react';

const FEATURED_CATEGORIES = [
  {
    id: 'banquet',
    name: 'Banquet & Party Halls',
    desc: 'Perfect for galas, anniversaries, and grand celebrations.',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=400',
    count: 24
  },
  {
    id: 'outdoor',
    name: 'Outdoor Gardens & Rooftops',
    desc: 'Breathtaking locations under the sky for social gatherings.',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=400',
    count: 18
  },
  {
    id: 'meeting',
    name: 'Executive Meeting Rooms',
    desc: 'High-speed internet and professional setups for businesses.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400',
    count: 35
  },
  {
    id: 'wedding',
    name: 'Charming Wedding Chapels',
    desc: 'Make your special day unforgettable in gorgeous spots.',
    image: 'https://images.unsplash.com/photo-1519225495810-7517c696567a?auto=format&fit=crop&q=80&w=400',
    count: 12
  }
];

function LandingPage({ user, onLogout, onNavigate }) {
  const [searchLoc, setSearchLoc] = useState('');
  const [searchType, setSearchType] = useState('all');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!user) {
      alert(`Searching for ${searchType} venues in ${searchLoc || 'any location'}...\nPlease Sign In to submit inquiries and complete bookings!`);
      onNavigate('login');
    } else {
      alert(`Searching for ${searchType} venues in ${searchLoc || 'any location'}...\nRedirecting you to your Booker dashboard.`);
      onNavigate('dashboard');
    }
  };

  return (
    <div className="landing-container">
      {/* Header element within landing page context */}
      <header className="landing-header">
        <div className="logo-container">
          <span className="logo-text">BookMyVenue</span>
        </div>
        <nav className="header-nav-right">
          {user ? (
            <div className="header-auth-group">
              <span className="user-greeting">Hello, <strong>{user.name}</strong></span>
              <button 
                onClick={() => onNavigate('dashboard')} 
                className="header-btn dashboard-btn"
              >
                Dashboard
              </button>
              <button 
                onClick={onLogout} 
                className="header-btn logout-btn-header"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="header-auth-group">
              <button 
                onClick={() => onNavigate('login')} 
                className="header-btn login-btn"
              >
                Sign In
              </button>
              <button 
                onClick={() => onNavigate('register')} 
                className="header-btn register-btn"
              >
                Sign Up
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find & Book the Perfect Venue for Any Event</h1>
          <p className="hero-subtitle">
            Discover a curated collection of banquet halls, corporate hubs, rooftop terraces, and vineyard retreats.
          </p>

          <form onSubmit={handleSearch} className="hero-search-bar">
            <div className="search-field">
              <label>Where</label>
              <input 
                type="text" 
                placeholder="City, state, or location..." 
                value={searchLoc}
                onChange={(e) => setSearchLoc(e.target.value)}
              />
            </div>
            <div className="search-field">
              <label>Event Type</label>
              <select 
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="all">Any Event</option>
                <option value="banquet">Party / Banquet</option>
                <option value="meeting">Business Meeting</option>
                <option value="outdoor">Rooftop / Garden</option>
                <option value="wedding">Wedding / Chapel</option>
              </select>
            </div>
            <button type="submit" className="search-submit-btn">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Explore Venues by Category</h2>
          <p>Find the space that fits your guest count, budget, and aesthetic.</p>
        </div>
        
        <div className="categories-grid">
          {FEATURED_CATEGORIES.map(category => (
            <div className="category-card" key={category.id}>
              <div 
                className="category-image" 
                style={{ backgroundImage: `url(${category.image})` }}
              >
                <span className="category-count">{category.count} Venues</span>
              </div>
              <div className="category-body">
                <h3>{category.name}</h3>
                <p>{category.desc}</p>
                <button 
                  onClick={() => user ? onNavigate('dashboard') : onNavigate('login')}
                  className="category-explore-btn"
                >
                  Explore Category →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hosting CTA Section */}
      <section className="hosting-cta">
        <div className="hosting-content">
          <h2>Have a space you want to share?</h2>
          <p>List your hall, office space, or garden on BookMyVenue. Set your hourly rates, manage requests, and earn side revenue.</p>
          <button 
            onClick={() => onNavigate('register')}
            className="hosting-btn"
          >
            Become a Host / Owner
          </button>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
