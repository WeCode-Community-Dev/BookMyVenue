import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import VenueCard from "../components/VenueCard";
import SearchBar from "../components/SearchBar";
import { venues } from "../services/Data";

const TYPES = ["All", "Wedding", "Party", "Corporate", "Outdoor", "Birthday", "Reception"];
const SORT_OPTIONS = ["Recommended", "Price: Low to High", "Price: High to Low", "Top Rated"];
const AMENITIES = ["AC", "Parking", "Catering", "DJ", "Garden", "Bar", "WiFi", "Stage"];

export default function Venues() {
  const [searchParams] = useSearchParams();
  const [filtered, setFiltered] = useState(venues);
  const [activeType, setActiveType] = useState("All");
  const [sortBy, setSortBy] = useState("Recommended");
  const [maxPrice, setMaxPrice] = useState(200000);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const sidebarRef = useRef(null);

  // Read URL params on mount
  useEffect(() => {
    const type = searchParams.get("type");
    const q = searchParams.get("q");
    if (type && type !== "all") {
      const cap = type.charAt(0).toUpperCase() + type.slice(1);
      setActiveType(cap);
    }
  }, [searchParams]);

  // Apply filters
  useEffect(() => {
    let result = [...venues];
    const q = searchParams.get("q");

    if (activeType !== "All") result = result.filter(v => v.type.toLowerCase() === activeType.toLowerCase());
    if (q) result = result.filter(v =>
      v.name.toLowerCase().includes(q.toLowerCase()) ||
      v.location.toLowerCase().includes(q.toLowerCase()) ||
      v.city.toLowerCase().includes(q.toLowerCase())
    );
    result = result.filter(v => v.price <= maxPrice);
    if (selectedAmenities.length > 0) {
      result = result.filter(v => selectedAmenities.every(a => v.amenities?.includes(a)));
    }
    if (sortBy === "Price: Low to High") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "Price: High to Low") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "Top Rated") result.sort((a, b) => b.rating - a.rating);

    setFiltered(result);
  }, [activeType, sortBy, maxPrice, selectedAmenities, searchParams]);

  const toggleAmenity = (a) => {
    setSelectedAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  };

  const clearAll = () => {
    setActiveType("All");
    setMaxPrice(200000);
    setSelectedAmenities([]);
    setSortBy("Recommended");
  };

  const activeFilterCount = [
    activeType !== "All" ? 1 : 0,
    maxPrice < 200000 ? 1 : 0,
    selectedAmenities.length,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="venues-page">
      {/* Hero */}
      <div className="venues-hero">
        <h1>Find Your Venue</h1>
        <p>Explore {venues.length}+ verified venues across India</p>
        <SearchBar />
      </div>

      {/* ── Inline Top Filter Bar ── */}
      <div className="top-filter-bar">
        <div className="top-filter-inner">

          {/* Type Pills */}
          <div className="type-pills-scroll">
            {TYPES.map(t => (
              <button
                key={t}
                className={`type-pill ${activeType === t ? "active" : ""}`}
                onClick={() => setActiveType(t)}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="filter-bar-divider" />

          {/* Sort */}
          <select
            className="inline-sort-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>

          {/* Price quick filter */}
          <div className="price-quick">
            <span className="price-quick-label">Max ₹{(maxPrice / 1000).toFixed(0)}K</span>
            <input
              type="range" min={20000} max={200000} step={10000}
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="price-quick-range"
            />
          </div>

          {/* More Filters (opens sidebar) */}
          <button
            className={`more-filters-btn ${showSidebar ? "active" : ""}`}
            onClick={() => setShowSidebar(s => !s)}
          >
            ⚙ Filters {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
          </button>

          {/* Clear */}
          {activeFilterCount > 0 && (
            <button className="clear-inline-btn" onClick={clearAll}>✕ Clear</button>
          )}
        </div>
      </div>

      {/* Active filter chips */}
      {(activeType !== "All" || selectedAmenities.length > 0 || maxPrice < 200000) && (
        <div className="active-chips">
          {activeType !== "All" && (
            <span className="chip">{activeType} <button onClick={() => setActiveType("All")}>✕</button></span>
          )}
          {maxPrice < 200000 && (
            <span className="chip">≤ ₹{(maxPrice/1000).toFixed(0)}K <button onClick={() => setMaxPrice(200000)}>✕</button></span>
          )}
          {selectedAmenities.map(a => (
            <span key={a} className="chip">{a} <button onClick={() => toggleAmenity(a)}>✕</button></span>
          ))}
        </div>
      )}

      <div className="venues-layout-new">
        {/* ── Slide-in Sidebar ── */}
        <aside className={`filter-drawer ${showSidebar ? "open" : ""}`} ref={sidebarRef}>
          <div className="drawer-header">
            <h3>More Filters</h3>
            <button className="drawer-close" onClick={() => setShowSidebar(false)}>✕</button>
          </div>

          <div className="filter-group">
            <label className="filter-label">Event Type</label>
            {TYPES.map(t => (
              <button
                key={t}
                className={`filter-type-btn ${activeType === t ? "active" : ""}`}
                onClick={() => setActiveType(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="filter-group">
            <label className="filter-label">Max Budget</label>
            <div className="range-value">₹{maxPrice.toLocaleString()}</div>
            <input
              type="range" min={20000} max={200000} step={5000}
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="range-input"
            />
            <div className="range-limits"><span>₹20K</span><span>₹2L</span></div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Amenities</label>
            <div className="amenity-check-grid">
              {AMENITIES.map(a => (
                <label key={a} className={`amenity-check ${selectedAmenities.includes(a) ? "checked" : ""}`}>
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(a)}
                    onChange={() => toggleAmenity(a)}
                  />
                  {a}
                </label>
              ))}
            </div>
          </div>

          <div className="drawer-footer">
            <button className="clear-filters-btn" onClick={clearAll}>Clear All</button>
            <button className="apply-btn" onClick={() => setShowSidebar(false)}>
              Show {filtered.length} Results
            </button>
          </div>
        </aside>

        {/* Overlay */}
        {showSidebar && <div className="drawer-overlay" onClick={() => setShowSidebar(false)} />}

        {/* ── Main Results ── */}
        <main className="venues-main-new">
          <p className="results-count">
            <strong>{filtered.length}</strong> venues found
            {activeType !== "All" && ` for "${activeType}"`}
          </p>

          {filtered.length > 0 ? (
            <div className="venues-grid">
              {filtered.map(v => <VenueCard key={v.id} venue={v} />)}
            </div>
          ) : (
            <div className="no-results">
              <span>😔</span>
              <h3>No venues found</h3>
              <p>Try adjusting your filters or search query</p>
              <button className="clear-filters-btn" onClick={clearAll}>Clear Filters</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}