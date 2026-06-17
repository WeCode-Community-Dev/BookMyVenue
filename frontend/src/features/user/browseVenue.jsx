import React, { useState } from 'react';
import { FiSearch, FiMapPin, FiUsers, FiChevronDown, FiChevronUp, FiStar, FiFilter, FiX } from 'react-icons/fi';
import './browseVenue.scss';
import { useNavigate } from 'react-router-dom'
import PageTransition from '../../components/ui/PageTransition';
import { VenueGridSkeleton } from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';

import {useGetUserVenuesQuery, useGetFavoritesQuery, useAddFavoriteMutation, useDeleteFavoriteMutation} from "./venueApi.js"


// ─── Mock Data ────────────────────────────────────────────────────────────────
const VENUE_TYPES = ['Hall', 'Rooftop', 'Banquet', 'Conference Room', 'Farmhouse', 'Studio', 'Cafe'];

const AMENITIES_FILTER = [
  { slug: 'wifi',        label: 'Wi-Fi' },
  { slug: 'parking',     label: 'Parking' },
  { slug: 'ac',          label: 'AC' },
  { slug: 'projector',   label: 'Projector' },
  { slug: 'av_equipment',label: 'AV Equipment' },
  { slug: 'stage',       label: 'Stage' },
  { slug: 'catering',    label: 'Catering' },
  { slug: 'kitchen',     label: 'Kitchen' },
];

const MOCK_VENUES = [
  {
    id: 1, name: 'Elegant Grand Hall', type: 'Hall',
    city: 'Bengaluru', state: 'Karnataka',
    capacity: 250, pricePerHour: 1500, rating: 4.7, reviews: 38,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=700&h=420&q=80',
    amenities: ['wifi', 'ac', 'parking', 'projector'],
  },
  {
    id: 2, name: 'Skyview Plaza Rooftop', type: 'Rooftop',
    city: 'Mumbai', state: 'Maharashtra',
    capacity: 180, pricePerHour: 2200, rating: 4.9, reviews: 61,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=700&h=420&q=80',
    amenities: ['wifi', 'catering', 'parking'],
  },
  {
    id: 3, name: 'Rustic Farmhouse Estate', type: 'Farmhouse',
    city: 'Pune', state: 'Maharashtra',
    capacity: 400, pricePerHour: 3500, rating: 4.5, reviews: 22,
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=700&h=420&q=80',
    amenities: ['parking', 'catering', 'kitchen'],
  },
  {
    id: 4, name: 'Tech Conference Centre', type: 'Conference Room',
    city: 'Bengaluru', state: 'Karnataka',
    capacity: 120, pricePerHour: 1200, rating: 4.6, reviews: 45,
    image: 'https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&w=700&h=420&q=80',
    amenities: ['wifi', 'projector', 'av_equipment', 'ac'],
  },
  {
    id: 5, name: 'Skyline Banquet Hall', type: 'Banquet',
    city: 'Delhi', state: 'Delhi',
    capacity: 500, pricePerHour: 4000, rating: 4.8, reviews: 90,
    image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=700&h=420&q=80',
    amenities: ['wifi', 'ac', 'parking', 'catering', 'stage'],
  },
  {
    id: 6, name: 'Creative Loft Studio', type: 'Studio',
    city: 'Hyderabad', state: 'Telangana',
    capacity: 60, pricePerHour: 800, rating: 4.3, reviews: 17,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=700&h=420&q=80',
    amenities: ['wifi', 'ac'],
  },
];

const TYPE_COLORS = {
  Hall: 'type-hall',
  Rooftop: 'type-rooftop',
  Banquet: 'type-banquet',
  'Conference Room': 'type-conference',
  Farmhouse: 'type-farmhouse',
  Studio: 'type-studio',
  Cafe: 'type-cafe',
};


function BrowseVenues() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [minCapacity, setMinCapacity] = useState(1);
  const [maxPrice, setMaxPrice] = useState('');
  const [openSections, setOpenSections] = useState({ type: true, amenities: true, capacity: true, price: true });

  const navigate = useNavigate()

  const apiParams = {
    page,
    pageSize,
    search: search || undefined,
    type: selectedTypes[0] || undefined,
    capacity: minCapacity > 1 ? minCapacity : undefined,
  };
  const { data: apiResp, isLoading, error } = useGetUserVenuesQuery(apiParams);
  const { data: favResp, refetch: refetchFavorites } = useGetFavoritesQuery();
  const favoriteIds = new Set((favResp?.data || []).map(i => i?.venue?.id).filter(Boolean));
  const [addFavorite] = useAddFavoriteMutation();
  const [deleteFavorite] = useDeleteFavoriteMutation();

  const toggleFavorite = async (venueId, isFav) => {
    try {
      if (isFav) {
        await deleteFavorite(venueId).unwrap();
      } else {
        await addFavorite(venueId).unwrap();
      }
    } catch (e) {
      console.error('favorite toggle failed', e);
    } finally {
      refetchFavorites();
    }
  };
  const serverVenues = apiResp?.data || [];
  const meta = apiResp?.meta || { total: 0, page: 1, pageSize };

  // local filtering for amenities and maxPrice
  const venues = serverVenues.filter(v => {
    const matchAmenity = selectedAmenities.length === 0 || selectedAmenities.every(a => v.venueAmenities?.some(x => x.amenity?.slug === a));
    const price = v.pricing && v.pricing[0] ? Number(v.pricing[0].pricePerHour) : Infinity;
    const matchPrice = !maxPrice || price <= Number(maxPrice);
    return matchAmenity && matchPrice;
  });

  const toggleSection = (key) =>
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  const toggleType = (t) =>
    setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const toggleAmenity = (s) =>
    setSelectedAmenities(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedAmenities([]);
    setMinCapacity(1);
    setMaxPrice('');
    setSearch('');
  };

  const activeFilterCount =
    selectedTypes.length + selectedAmenities.length +
    (minCapacity > 1 ? 1 : 0) + (maxPrice ? 1 : 0);

  const filtered = venues;

  const viewDetail = (venueId) => {
    navigate(`/venue/${venueId}`)
}

  return (
    <PageTransition className="browse-page">
      <div className="browse-hero">
        <div className="browse-hero__content">
          <span className="eyebrow">Explore venues</span>
          <h1 className="browse-hero__title">Discover your <em>perfect</em> space</h1>
          <p className="browse-hero__subtitle">Filter by type, capacity, amenities, and price to find venues that fit your vision.</p>
        </div>
        <div className="browse-hero__chips">
          <span className="browse-chip"><FiUsers size={13} /> 500+ venues</span>
          <span className="browse-chip browse-chip--sage">Instant booking</span>
          <span className="browse-chip">Transparent pricing</span>
        </div>
      </div>
      <div className="browse-search-bar">
        <div className="search-input-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by venue name or city…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>
              <FiX />
            </button>
          )}
        </div>
        <div className="results-meta">
          {filtered.length} venue{filtered.length !== 1 ? 's' : ''} found
        </div>
      </div>

      <div className="browse-body">
        {/* ── LEFT: Venue cards ── */}
        <section className="venue-grid-section">
          {isLoading ? (
            <VenueGridSkeleton count={pageSize} />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={FiSearch}
              title="No venues match your filters"
              message="Try adjusting your search or clearing filters to see more results."
              actionLabel="Clear all filters"
              onAction={clearFilters}
            />
          ) : (
            <div className="venue-grid">
              {filtered.map(venue => {
                const pricePerHour = venue.pricing && venue.pricing[0]
                  ? Number(venue.pricing[0].pricePerHour)
                  : null;
                return (
                <div key={venue.id} className="venue-card">
                  <div className="venue-card-image">
                    <img src={venue.images?.[0]?.url || venue.image} alt={venue.name} />
                    <button
                      type="button"
                      className={`fav-btn ${favoriteIds.has(venue.id) ? 'active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(venue.id, favoriteIds.has(venue.id)); }}
                      aria-label="Toggle favorite"
                    >
                      <FiStar />
                    </button>
                    <span className={`type-badge ${TYPE_COLORS[venue.type] || ''}`}>{venue.type}</span>
                    {pricePerHour && (
                      <span className="price-badge">
                        ₹{pricePerHour.toLocaleString()}<small>/hr</small>
                      </span>
                    )}
                    <span className="capacity-badge">
                      <FiUsers size={11} /> {venue.capacity}
                    </span>
                  </div>
                  <div className="venue-card-body">
                    <h3 className="venue-name">{venue.name}</h3>
                    <div className="venue-meta">
                      <span className="venue-location">
                        <FiMapPin size={12} /> {venue.city}, {venue.state}
                      </span>
                      <span className="venue-rating">
                        <FiStar size={12} /> {venue.rating}
                        <span className="review-count">({venue.reviews})</span>
                      </span>
                    </div>
                    <div className="venue-price">
                      From <strong>₹{(venue.pricing && venue.pricing[0]) ? Number(venue.pricing[0].pricePerHour).toLocaleString() : 'N/A'}</strong>/hr
                    </div>
                    <div className="venue-amenities-row">
                      {(venue.venueAmenities || []).slice(0, 4).map(x => {
                        const slug = x.amenity?.slug;
                        const def = AMENITIES_FILTER.find(f => f.slug === slug);
                        return def ? (
                          <span key={slug} className="amenity-chip">{def.label}</span>
                        ) : null;
                      })}
                      {(venue.venueAmenities || []).length > 4 && (
                        <span className="amenity-chip more">+{(venue.venueAmenities || []).length - 4}</span>
                      )}
                    </div>
                    <button onClick={() => viewDetail(venue.id)} className="view-details-btn">View Details</button>
                  </div>
                </div>
              );})}
            </div>
          )}
          {/* Pagination */}
          <div className="pagination-controls">
            <button className="btn-page" disabled={meta.page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
            <span>Page {meta.page} of {Math.max(1, Math.ceil((meta.total || 0) / meta.pageSize))}</span>
            <button className="btn-page" disabled={meta.page >= Math.ceil((meta.total || 0) / meta.pageSize)} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        </section>

        

        {/* ── RIGHT: Filter panel ── */}
        <aside className="filter-panel">
          <div className="filter-panel-header">
            <span className="filter-title">
              <FiFilter size={15} /> Filters
              {activeFilterCount > 0 && (
                <span className="filter-count-badge">{activeFilterCount}</span>
              )}
            </span>
            {activeFilterCount > 0 && (
              <button className="btn-clear-all" onClick={clearFilters}>Clear all</button>
            )}
          </div>

          {/* Venue Type */}
          <div className="filter-section">
            <button className="filter-section-header" onClick={() => toggleSection('type')}>
              <span>Venue Type</span>
              {openSections.type ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
            </button>
            {openSections.type && (
              <div className="type-pills">
                {VENUE_TYPES.map(t => (
                  <button
                    key={t}
                    className={`type-pill ${selectedTypes.includes(t) ? 'active' : ''}`}
                    onClick={() => toggleType(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Amenities */}
          <div className="filter-section">
            <button className="filter-section-header" onClick={() => toggleSection('amenities')}>
              <span>Amenities</span>
              {openSections.amenities ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
            </button>
            {openSections.amenities && (
              <div className="amenities-checklist">
                {AMENITIES_FILTER.map(a => (
                  <label key={a.slug} className="amenity-check-row">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(a.slug)}
                      onChange={() => toggleAmenity(a.slug)}
                    />
                    <span>{a.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Max Capacity */}
          <div className="filter-section">
            <button className="filter-section-header" onClick={() => toggleSection('capacity')}>
              <span>Min Capacity</span>
              {openSections.capacity ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
            </button>
            {openSections.capacity && (
              <div className="capacity-filter">
                <span className="capacity-value">{minCapacity} people</span>
                <input
                  type="range"
                  min={1} max={500} step={10}
                  value={minCapacity}
                  onChange={e => setMinCapacity(Number(e.target.value))}
                />
                <div className="capacity-range-labels">
                  <span>1</span><span>500</span>
                </div>
              </div>
            )}
          </div>

          {/* Max Price */}
          <div className="filter-section">
            <button className="filter-section-header" onClick={() => toggleSection('price')}>
              <span>Max Price / hr</span>
              {openSections.price ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
            </button>
            {openSections.price && (
              <div className="price-filter">
                <div className="price-input-wrapper">
                  <span className="price-prefix">₹</span>
                  <input
                    type="number"
                    placeholder="e.g. 3000"
                    value={maxPrice}
                    min={0}
                    onChange={e => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="filter-actions">
            <button className="btn-apply" onClick={() => {}}>Apply Filters</button>
            <button className="btn-clear" onClick={clearFilters}>Clear</button>
          </div>
        </aside>
      </div>
    </PageTransition>
  );
}

export default BrowseVenues;