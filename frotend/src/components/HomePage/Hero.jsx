import { useNavigate } from 'react-router-dom';
import './Hero.css';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <header className="hero-container">
      <div className="hero-content">
        <h1>Find and Book the Perfect Venue for Any Occasion</h1>
        <p>Discover unique spaces, connect with verified local hosts, and secure your event location seamlessly.</p>
        
        <div className="search-bar-widget">
          <div className="search-input-field">
            <label>Location</label>
            <input type="text" placeholder="Where is your event?" />
          </div>
          <div className="search-input-field">
            <label>Event Type</label>
            <select defaultValue="">
              <option value="" disabled>Select category</option>
              <option value="wedding">Wedding Hall</option>
              <option value="corporate">Corporate Office</option>
              <option value="party">Party Space</option>
            </select>
          </div>
          <button className="search-btn" onClick={() => navigate('/explore')}>
            Search Spaces
          </button>
        </div>
      </div>
    </header>
  );
}