import React, { useCallback, useEffect, useMemo, useState } from 'react'
import "./home.css";
import '../../Header/header.css'
import VenueFeaturedCard from '../VenueFeaturedCard/VenueFeaturedCard'
import { getFeaturedVenues } from '../../../api/venueApi'

export const Home = () => {
  const today = new Date().toISOString().split("T")[0];
  const [numberOfDays, setNumberOfDays] = useState("1");
  const [startDate, setStartDate] = useState("");
  const [featuredVenues, setFeaturedVenues] = useState([]);
  const [featuredPage, setFeaturedPage] = useState(0);
  const [featuredHasMore, setFeaturedHasMore] = useState(false);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState("");

  const loadFeaturedVenues = useCallback(async (page) => {
    setFeaturedLoading(true);
    setFeaturedError("");

    try {
      const data = await getFeaturedVenues(page);

      setFeaturedVenues((currentVenues) => (
        page === 1
          ? data.results
          : [...currentVenues, ...data.results]
      ));
      setFeaturedPage(page);
      setFeaturedHasMore(Boolean(data.next));
    } catch (error) {
      setFeaturedError("Unable to load featured venues. Please try again.");
      console.error(error);
    } finally {
      setFeaturedLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeaturedVenues(1);
  }, [loadFeaturedVenues]);

  function handleLoadMore() {
    loadFeaturedVenues(featuredPage + 1);
  }

  const selectedDates = useMemo(() => {
    if (!startDate) {
      return [];
    }

    const dateCount = Number(numberOfDays);
    const [year, month, day] = startDate.split("-").map(Number);
    const firstDate = new Date(year, month - 1, day);

    return Array.from({ length: dateCount }, (_, index) => {
      const date = new Date(firstDate);
      date.setDate(firstDate.getDate() + index);

      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      });
    });
  }, [numberOfDays, startDate]);

  return (
    <div>
    <main>
      {/* <!-- =======================
           HERO SECTION
           ======================= --> */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center g-4">
            {/* <!-- Hero left text --> */}
            <div className="col-lg-6">
              <div className="hero-badge">
                <i className="bi bi-stars"></i>
                Your event, our perfect venue
              </div>

              <h1>Find and Book<br />the Right Venue</h1>

              <p className="hero-text">
                Browse venues, compare options, and request bookings for
                birthdays, weddings, meetups, and local events.
              </p>


              {/* <!-- Search box --> */}
              <form className="search-box">
                <div className="search-filters">
                  <div className="search-item">
                    <label className="search-field">
                      <i className="bi bi-geo-alt-fill"></i>
                      <span>
                        Location
                        <input type="text" placeholder="City or area" />
                      </span>
                    </label>
                  </div>

                  <div className="search-item">
                    <label className="search-field">
                      <i className="bi bi-building"></i>
                      <span>
                        Venue Type
                        <select>
                          <option>All Types</option>
                          <option>Wedding Hall</option>
                          <option>Auditorium</option>
                          <option>Banquet Hall</option>
                        </select>
                      </span>
                    </label>
                  </div>

                  <div className="search-item">
                    <label className="search-field">
                      <i className="bi bi-calendar2-week"></i>
                      <span>
                        How many days?
                        <select
                          value={numberOfDays}
                          onChange={(event) => setNumberOfDays(event.target.value)}
                        >
                          <option value="1">1 day</option>
                          <option value="2">2 days</option>
                          <option value="3">3 days</option>
                          <option value="4">4 days</option>
                          <option value="5">5 days</option>
                          <option value="6">6 days</option>
                          <option value="7">7 days</option>
                        </select>
                      </span>
                    </label>
                  </div>

                  <div className="search-item">
                    <label className="search-field date-box">
                      <i className="bi bi-calendar-event"></i>
                      <span>
                        Start Date
                        <input
                          type="date"
                          min={today}
                          value={startDate}
                          onChange={(event) => setStartDate(event.target.value)}
                          aria-label="Select event start date"
                        />
                      </span>
                    </label>
                  </div>
                </div>

                {selectedDates.length > 0 && (
                  <div className="selected-date-range" aria-live="polite">
                    <span>Selected dates</span>
                    <div>
                      {selectedDates.map((date) => (
                        <strong key={date}>{date}</strong>
                      ))}
                    </div>
                  </div>
                )}

                <div className="search-action">
                  <button className="btn primary-btn search-btn" type="submit">
                      <i className="bi bi-search"></i>
                      <span>Search</span>
                    </button>
                </div>
              </form>
            </div>

            {/* <!-- Hero right image --> */}
            <div className="col-lg-6 img-full-div">
              <img
                className="hero-image"
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80"
                alt="Luxury decorated wedding venue hall"
              />
            </div>
          </div>
        </div>
      </section>

      {/* <!-- =======================
           FEATURED VENUES SECTION
           ======================= --> */}
      <section className="page-section">
        <div className="container">
          <h2 className="section-title">Featured Venues</h2>

          {featuredLoading && featuredVenues.length === 0 && (
            <p className="featured-status">Loading featured venues...</p>
          )}

          {featuredError && (
            <p className="featured-status featured-error" role="alert">
              {featuredError}
            </p>
          )}

          {!featuredLoading && !featuredError && featuredVenues.length === 0 && (
            <p className="featured-status">No featured venues are currently available.</p>
          )}

          {featuredVenues.length > 0 && (
            <div className="row g-4">
              {featuredVenues.map((venue) => (
                <VenueFeaturedCard
                  key={venue.id}
                  venue={venue}
                />
              ))}
            </div>
          )}

          {featuredHasMore && (
            <div className="featured-load-more">
              <button
                type="button"
                className="btn primary-btn"
                disabled={featuredLoading}
                onClick={handleLoadMore}
              >
                {featuredLoading ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* <!-- =======================
           EVENT BUNDLES SECTION
           ======================= --> */}
      <section className="page-section bundle-section" id="bundles">
        <div className="container">
          <h2 className="section-title">Event Bundles</h2>

          <div className="row g-4">
            {/* <!-- Bundle card 1 --> */}
            <div className="col-lg-4 d-flex">
              <article className="bundle-card">
                <div className="bundle-icon blue">
                  <i className="bi bi-cake2"></i>
                </div>
                <div className="bundle-content">
                  <h3>Birthday Bundle</h3>
                  <ul>
                    <li>Themed Decoration</li>
                    <li>Catering (Veg & Non-Veg)</li>
                    <li>Photography</li>
                  </ul>
                </div>
                <a href="#" className="btn small-outline-btn">Request Bundle</a>
              </article>
            </div>

            {/* <!-- Bundle card 2 --> */}
            <div className="col-lg-4 d-flex">
              <article className="bundle-card">
                <div className="bundle-icon light-blue">
                  <i className="bi bi-briefcase"></i>
                </div>
                <div className="bundle-content">
                  <h3>Corporate Bundle</h3>
                  <ul>
                    <li>Conference Setup</li>
                    <li>Catering & Refreshments</li>
                    <li>AV & Sound System</li>
                  </ul>
                </div>
                <a href="#" className="btn small-outline-btn">Request Bundle</a>
              </article>
            </div>

            {/* <!-- Bundle card 3 --> */}
            <div className="col-lg-4 d-flex">
              <article className="bundle-card">
                <div className="bundle-icon pink">
                  <i className="bi bi-gem"></i>
                </div>
                <div className="bundle-content">
                  <h3>Wedding Bundle</h3>
                  <ul>
                    <li>Premium Decoration</li>
                    <li>Catering (Multi-Cuisine)</li>
                    <li>Photography & Videography</li>
                  </ul>
                </div>
                <a href="#" className="btn small-outline-btn">Request Bundle</a>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- =======================
           HOW IT WORKS + WHY CHOOSE US
           ======================= --> */}
      <section className="info-section" id="how-it-works">
        <div className="container">
          <div className="row g-4 align-items-start">
            {/* <!-- How it works --> */}
            <div className="col-lg-6">
              <h2 className="section-title">How It Works</h2>

              <div className="steps">
                <article className="step-item">
                  <span className="step-number">1</span>
                  <div className="step-icon">
                    <i className="bi bi-search"></i>
                  </div>
                  <div>
                    <h3>Search venue</h3>
                    <p>Find the perfect venue by location, type, and date.</p>
                  </div>
                </article>

                <article className="step-item">
                  <span className="step-number">2</span>
                  <div className="step-icon">
                    <i className="bi bi-card-checklist"></i>
                  </div>
                  <div>
                    <h3>Check details</h3>
                    <p>Compare prices, capacity, amenities, and photos.</p>
                  </div>
                </article>

                <article className="step-item">
                  <span className="step-number">3</span>
                  <div className="step-icon">
                    <i className="bi bi-send"></i>
                  </div>
                  <div>
                    <h3>Send booking request</h3>
                    <p>Send a request and get a confirmation.</p>
                  </div>
                </article>
              </div>
            </div>

            {/* <!-- Why choose us --> */}
            <div className="col-lg-6">
              <h2 className="section-title">Why Choose Us</h2>

              <div className="why-grid">
                <article className="why-card">
                  <i className="bi bi-shield-check"></i>
                  <h3>Trusted venues</h3>
                  <p>Verified venues you can rely on.</p>
                </article>

                <article className="why-card">
                  <i className="bi bi-calendar-check"></i>
                  <h3>Easy booking</h3>
                  <p>Simple and quick booking process.</p>
                </article>

                <article className="why-card">
                  <i className="bi bi-balance-scale"></i>
                  <h3>Simple comparison</h3>
                  <p>Compare venues side-by-side.</p>
                </article>

                <article className="why-card">
                  <i className="bi bi-heart"></i>
                  <h3>Good for events</h3>
                  <p>Perfect for all types of events.</p>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    {/* <!-- =======================
         FOOTER
         ======================= --> */}
    

    {/* <!-- Bootstrap JavaScript for the mobile navbar toggle --> */}
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
 
    </div>
  )
}
export default Home;
