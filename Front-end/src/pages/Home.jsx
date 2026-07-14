import { useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import VenueCard from "../components/VenueCard";
import { venues, eventCategories } from "../services/Data";

const testimonials = [
  { name: "Priya & Arjun", event: "Wedding", text: "BookMyVenue made our dream wedding a reality! Found the perfect garden venue in just 2 days.", avatar: "P" },
  { name: "Rahul Sharma", event: "Corporate Event", text: "Booked a great convention center for our product launch. Seamless experience from search to confirmation.", avatar: "R" },
  { name: "Sneha Patel", event: "Birthday Party", text: "The rooftop venue for my 30th birthday was absolutely stunning. Got exactly what we wanted!", avatar: "S" },
];

function CategoryRow({ category }) {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const catVenues = venues.filter(v => v.type.toLowerCase() === category.id.toLowerCase());
  const displayVenues = catVenues.slice(0, 6);
  const hasMore = catVenues.length > 6;

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 320, behavior: "smooth" });
    }
  };

  if (catVenues.length === 0) return null;

  return (
    <div className="cat-row">
      <div className="cat-row-header">
        <div className="cat-row-title">
          <div>
            <h2>{category.label} Venues</h2>
            <p>{category.count}+ venues across India</p>
          </div>
        </div>
        <div className="cat-row-actions">
          <div className="scroll-btns">
            <button className="scroll-btn" onClick={() => scroll(-1)}>‹</button>
            <button className="scroll-btn" onClick={() => scroll(1)}>›</button>
          </div>
          <button
            className="view-all-btn"
            onClick={() => navigate(`/venues?type=${category.id}`)}
          >
            View All {category.label} →
          </button>
        </div>
      </div>

      <div className="cat-scroll-wrap">
        <div className="cat-scroll-track" ref={scrollRef}>
          {displayVenues.map(v => (
            <div className="cat-scroll-item" key={v.id}>
              <VenueCard venue={v} />
            </div>
          ))}
          {hasMore && (
            <div className="cat-scroll-item">
              <div
                className="view-more-card"
                onClick={() => navigate(`/venues?type=${category.id}`)}
              >
                <span className="view-more-text">More {category.label} Venues</span>
                <span className="view-more-arrow">→</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg"><div className="hero-overlay" /></div>
        <div className="hero-content">
          <div className="hero-badge">🎉 India's #1 Venue Booking Platform</div>
          <h1 className="hero-title">
            Find Your Perfect<br />
            <span className="hero-highlight">Celebration Venue</span>
          </h1>
          <p className="hero-subtitle">
            Discover and book stunning venues for weddings, parties, corporate events & more.<br />
            10,000+ venues across 50+ cities.
          </p>
          <SearchBar large />
          <div className="hero-stats">
            <div className="stat"><span className="stat-num">10K+</span><span className="stat-label">Venues</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">50+</span><span className="stat-label">Cities</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">2L+</span><span className="stat-label">Bookings</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">4.8★</span><span className="stat-label">Rating</span></div>
          </div>
        </div>
      </section>

      {/* Quick Category Pills */}
      <section className="quick-cats">
        <div className="quick-cats-inner">
          {eventCategories.map(cat => (
            <button
              key={cat.id}
              className="quick-cat-pill"
              onClick={() => navigate(`/venues?type=${cat.id}`)}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Category Rows */}
      <div className="all-cat-rows">
        {eventCategories.map(cat => (
          <CategoryRow key={cat.id} category={cat} />
        ))}
      </div>

      {/* Why BookMyVenue */}
      <section className="section why-section">
        <div className="section-header">
          <h2>Why BookMyVenue?</h2>
          <p>Everything you need for a perfect celebration</p>
        </div>
        <div className="features-grid">
          {[
            { icon: "🔍", title: "Easy Discovery", desc: "Filter by location, capacity, price and more to find your ideal venue in minutes." },
            { icon: "✅", title: "Verified Venues", desc: "Every venue is personally verified by our team. No surprises on your big day." },
            { icon: "💰", title: "Best Prices", desc: "Direct bookings mean no middleman markups. Get the best price guaranteed." },
            { icon: "🛡️", title: "Secure Booking", desc: "Safe payment gateway with instant confirmation and booking protection." },
            { icon: "📞", title: "24/7 Support", desc: "Dedicated support team to assist you at every step of your journey." },
            { icon: "⭐", title: "Trusted Reviews", desc: "Real reviews from real customers to help you make informed decisions." },
          ].map(f => (
            <div key={f.title} className="feature-card">
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials-section">
        <div className="section-header">
          <h2>Happy Celebrations</h2>
          <p>What our customers say</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map(t => (
            <div key={t.name} className="testimonial-card">
              <div className="testimonial-quote">"</div>
              <p className="testimonial-text">{t.text}</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.avatar}</div>
                <div>
                  <p className="testimonial-name">{t.name}</p>
                  <p className="testimonial-event">{t.event}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Own a Venue? List It Free!</h2>
          <p>Reach thousands of customers looking for the perfect event space.</p>
          <Link to="/venueOwner" className="cta-btn">Add Venue →</Link>
        </div>
      </section>
    </div>
  );
}