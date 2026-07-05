import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./venues.css";
import VenueCard from "../VenueCard/VenueCard";
import { getVenues } from "../../../api/venueApi";
import {
  addFavorite,
  getFavorites,
  hasAccessToken,
  removeFavorite,
} from "../../../api/favoriteApi";

const PAGE_SIZE = 6;

const Venues = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [venueCount, setVenueCount] = useState(0);
  const [page, setPageNumber] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favoriteError, setFavoriteError] = useState("");
  const [favoritesByVenue, setFavoritesByVenue] = useState({});
  const [favoritesLoading, setFavoritesLoading] = useState(hasAccessToken());
  const [savingFavoriteIds, setSavingFavoriteIds] = useState(new Set());

  useEffect(() => {
    let ignoreResult = false;

    async function loadFavorites() {
      if (!hasAccessToken()) return;

      try {
        const favorites = await getFavorites();
        if (!ignoreResult) {
          setFavoritesByVenue(Object.fromEntries(
            favorites.map((favorite) => [favorite.venue.id, favorite.id])
          ));
        }
      } catch (requestError) {
        if (!ignoreResult && hasAccessToken()) {
          setFavoriteError("Unable to load your favorites.");
          console.error(requestError);
        }
      } finally {
        if (!ignoreResult) {
          setFavoritesLoading(false);
        }
      }
    }

    loadFavorites();

    return () => {
      ignoreResult = true;
    };
  }, []);

  useEffect(() => {
    async function loadVenues() {
      setLoading(true);
      setError("");

      try {
        const data = await getVenues(page);
        setVenues(data.results);
        setVenueCount(data.count);
        setHasNextPage(Boolean(data.next));
        setHasPreviousPage(Boolean(data.previous));
      } catch (error) {
        setError("Unable to load venues.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadVenues();
  }, [page]);

  async function handleFavoriteToggle(venueId) {
    if (!hasAccessToken()) {
      navigate("/login", { state: { from: "/venues" } });
      return;
    }

    setFavoriteError("");
    setSavingFavoriteIds((currentIds) => new Set(currentIds).add(venueId));

    try {
      const favoriteId = favoritesByVenue[venueId];

      if (favoriteId) {
        await removeFavorite(favoriteId);
        setFavoritesByVenue((currentFavorites) => {
          const updatedFavorites = { ...currentFavorites };
          delete updatedFavorites[venueId];
          return updatedFavorites;
        });
      } else {
        const favorite = await addFavorite(venueId);
        setFavoritesByVenue((currentFavorites) => ({
          ...currentFavorites,
          [venueId]: favorite.id,
        }));
      }
    } catch (requestError) {
      setFavoriteError(
        hasAccessToken()
          ? "Unable to update your favorites. Please try again."
          : "Your session has expired. Please log in again."
      );
      console.error(requestError);
    } finally {
      setSavingFavoriteIds((currentIds) => {
        const updatedIds = new Set(currentIds);
        updatedIds.delete(venueId);
        return updatedIds;
      });
    }
  }

  const firstVenueNumber = venues.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastVenueNumber = (page - 1) * PAGE_SIZE + venues.length;

  return (
    <div>

    <main>
      <section className="filters-section">
        <div className="container">
          <form className="filters-box">
            <div className="row g-3 align-items-center">
              {/* <!-- Location --> */}
              <div className="col-12 col-md-6 col-xl">
                <label className="filter-field">
                  <i className="bi bi-geo-alt-fill"></i>
                  <span>
                    Location
                    <input type="text" placeholder="Enter location" />
                  </span>
                </label>
              </div>

              {/* <!-- Venue type --> */}
              <div className="col-12 col-md-6 col-xl">
                <label className="filter-field">
                  <i className="bi bi-building"></i>
                  <span>
                    Venue Type
                    <select>
                      <option>All Types</option>
                      <option>Wedding Hall</option>
                      <option>Banquet Hall</option>
                      <option>Auditorium</option>
                      <option>Conference Hall</option>
                      <option>Outdoor Lawn</option>
                    </select>
                  </span>
                </label>
              </div>

              {/* <!-- Date --> */}
              <div className="col-12 col-md-6 col-xl">
                <label className="filter-field">
                  <i className="bi bi-calendar-event"></i>
                  <span>
                    Event Date
                    <input type="date" />
                  </span>
                </label>
              </div>

              {/* <!-- Price range --> */}
              <div className="col-12 col-md-6 col-xl">
                <label className="filter-field">
                  <i className="bi bi-currency-rupee"></i>
                  <span>
                    Price Range
                    <select>
                      <option>Select range</option>
                      <option>Under ₹15,000</option>
                      <option>₹15,000 - ₹25,000</option>
                      <option>₹25,000 - ₹40,000</option>
                      <option>Above ₹40,000</option>
                    </select>
                  </span>
                </label>
              </div>

              {/* <!-- Capacity --> */}
              <div className="col-12 col-md-6 col-xl">
                <label className="filter-field">
                  <i className="bi bi-people-fill"></i>
                  <span>
                    Capacity
                    <select>
                      <option>Any Capacity</option>
                      <option>Up to 100</option>
                      <option>100 - 250</option>
                      <option>250 - 500</option>
                      <option>500+</option>
                    </select>
                  </span>
                </label>
              </div>

              {/* <!-- Amenities --> */}
              <div className="col-12 col-md-6 col-xl">
                <label className="filter-field">
                  <i className="bi bi-stars"></i>
                  <span>
                    Amenities
                    <select>
                      <option>Select amenities</option>
                      <option>Parking</option>
                      <option>AC</option>
                      <option>Wi-Fi</option>
                      <option>Catering</option>
                      <option>Stage</option>
                    </select>
                  </span>
                </label>
              </div>

              {/* <!-- Search button --> */}
              <div className="col-6 col-md-4 col-xl-auto d-grid action-btn-col">
                <button className="btn primary-btn big-btn" type="submit">
                  <i className="bi bi-search me-2"></i>Search
                </button>
              </div>

              {/* <!-- Reset button --> */}
              <div className="col-6 col-md-4 col-xl-auto d-grid action-btn-col">
                <button className="btn reset-btn big-btn" type="reset">
                  <i className="bi bi-arrow-counterclockwise me-2"></i>Reset
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* <!-- =====================================================
           PAGE TITLE + RESULT BAR
           ===================================================== --> */}
      <section className="venues-listing-section">
        <div className="container">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 page-heading-wrap">
            <div>
              <h1 className="page-title">Explore Venues</h1>
              <p className="page-subtitle">Find the perfect venue for your event</p>
            </div>

            <div className="results-toolbar">
              <p className="results-count mb-2 mb-lg-0">
                Showing {firstVenueNumber}–{lastVenueNumber} of {venueCount} venues
              </p>

              <div className="sort-box">
                <label htmlFor="sortVenue" className="sort-label">Sort by:</label>
                <select id="sortVenue" className="form-select sort-select">
                  <option>Popular</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Highest Rated</option>
                  <option>Capacity</option>
                </select>
              </div>
            </div>
          </div>

          {/* <!-- =================================================
               VENUE CARDS GRID
               3 cards per row on desktop
               2 on tablet
               1 on mobile
               ================================================= --> */}

{loading && <p>Loading venues...</p>}

{error && <p>{error}</p>}

{favoriteError && <p role="alert">{favoriteError}</p>}

{!loading && !error && venues.length === 0 && (
  <p>No venues found.</p>
)}

{/* VENUE CARDS GRID */}
{!loading && !error && venues.length > 0 && (
  <div className="row g-4">
    {venues.map((venue) => (
      <div
        className="col-12 col-md-6 col-xl-4"
        key={venue.id}
      >
        <VenueCard
          venue={venue}
          favoriteId={favoritesByVenue[venue.id]}
          favoriteSaving={favoritesLoading || savingFavoriteIds.has(venue.id)}
          onFavoriteToggle={handleFavoriteToggle}
        />
      </div>
    ))}
  </div>
)}

          {/* <!-- =================================================
               SIMPLE PAGINATION
               ================================================= --> */}
          {!loading && !error && venueCount > PAGE_SIZE && (
          <nav className="pagination-wrap" aria-label="Venue pagination">
            <ul className="pagination custom-pagination justify-content-center">
              <li className={`page-item ${!hasPreviousPage ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  type="button"
                  disabled={!hasPreviousPage}
                  onClick={() => setPageNumber((currentPage) => currentPage - 1)}
                >
                  Previous
                </button>
              </li>
              <li className="page-item active">
                <span className="page-link">{page}</span>
              </li>
              <li className={`page-item ${!hasNextPage ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  type="button"
                  disabled={!hasNextPage}
                  onClick={() => setPageNumber((currentPage) => currentPage + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
          )}
        </div>
      </section>
    </main>

   
    </div>
  );
};

export default Venues;
