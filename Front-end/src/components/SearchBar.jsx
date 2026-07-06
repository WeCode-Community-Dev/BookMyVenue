import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar({ large = false }) {
  const [query, setQuery] = useState("");
  const [eventType, setEventType] = useState("");
  const [guests, setGuests] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (eventType) params.set("type", eventType);
    if (guests) params.set("guests", guests);
    navigate(`/venues?${params.toString()}`);
  };

  return (
    <form className={`search-bar ${large ? "search-bar-large" : ""}`} onSubmit={handleSearch}>
      <div className="search-input-wrap">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search venues, areas..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="search-input"
        />
      </div>
      <select value={eventType} onChange={e => setEventType(e.target.value)} className="search-select">
        <option value="">Event Type</option>
        <option value="wedding">Wedding</option>
        <option value="engagement">Engagement</option>
        <option value="birthday">Birthday Party</option>
        <option value="corporate">Corporate Event</option>
        <option value="reception">Reception</option>
        <option value="outdoor">Outdoor</option>
      </select>
      <select value={guests} onChange={e => setGuests(e.target.value)} className="search-select">
        <option value="">Guest Count</option>
        <option value="50">Up to 50</option>
        <option value="100">Up to 100</option>
        <option value="200">Up to 200</option>
        <option value="500">Up to 500</option>
        <option value="1000">500+</option>
      </select>
      <button type="submit" className="search-btn">Search</button>
    </form>
  );
}