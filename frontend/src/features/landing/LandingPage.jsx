import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiSearch, FiCalendar, FiStar, FiArrowRight,
  FiMapPin, FiUsers, FiHeart,
} from 'react-icons/fi';
import PageTransition from '../../components/ui/PageTransition';
import './LandingPage.scss';

const STEPS = [
  {
    icon: FiSearch,
    title: 'Search',
    description: 'Browse hundreds of curated venues by type, capacity, amenities, and location.',
  },
  {
    icon: FiCalendar,
    title: 'Book',
    description: 'Pick your date, compare pricing, and secure your space in minutes.',
  },
  {
    icon: FiStar,
    title: 'Celebrate',
    description: 'Show up and create unforgettable moments — we handle the rest.',
  },
];

const VENUE_TYPES = [
  {
    name: 'Banquet Hall',
    image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=600&h=400&q=80',
    count: '120+ venues',
  },
  {
    name: 'Cafe',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&h=400&q=80',
    count: '85+ venues',
  },
  {
    name: 'Rooftop',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&h=400&q=80',
    count: '60+ venues',
  },
  {
    name: 'Farmhouse',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&h=400&q=80',
    count: '45+ venues',
  },
  {
    name: 'Conference Room',
    image: 'https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&w=600&h=400&q=80',
    count: '90+ venues',
  },
  {
    name: 'Studio',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&h=400&q=80',
    count: '35+ venues',
  },
];

const TESTIMONIALS = [
  {
    quote: 'BookMyVenue made planning our wedding reception effortless. Found the perfect hall in under an hour.',
    name: 'Priya Sharma',
    role: 'Wedding Planner',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80',
    rating: 5,
  },
  {
    quote: 'As a venue owner, the dashboard and booking tools are exactly what I needed. Revenue is up 40%.',
    name: 'Rajesh Kumar',
    role: 'Venue Owner',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
    rating: 5,
  },
  {
    quote: 'Our corporate offsites have never been easier to organize. Great filters and transparent pricing.',
    name: 'Ananya Patel',
    role: 'HR Manager',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80',
    rating: 5,
  },
];

const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Jaipur'];

const HERO_FLOATS = [
  {
    img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=400&h=300&q=80',
    label: 'Rooftop',
    city: 'Mumbai',
    className: 'float-card--main',
  },
  {
    img: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=300&h=200&q=80',
    label: 'Banquet',
    city: 'Delhi',
    className: 'float-card--secondary',
  },
  {
    img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&h=200&q=80',
    label: 'Cafe',
    city: 'Bengaluru',
    className: 'float-card--tertiary',
  },
];

function LandingPage() {
  return (
    <PageTransition className="landing-page">
      {/* Navbar */}
      <header className="landing-nav">
        <div className="landing-nav__inner">
          <Link to="/" className="landing-logo">
            <div className="landing-logo__icon">
              <FiMapPin />
            </div>
            <span>BookMy<span className="landing-logo__accent">Venue</span></span>
          </Link>
          <nav className="landing-nav__links">
            <a href="#how-it-works">How it works</a>
            <a href="#venues">Venues</a>
            <a href="#testimonials">Reviews</a>
          </nav>
          <div className="landing-nav__actions">
            <Link to="/login" className="landing-btn landing-btn--ghost">Log in</Link>
            <Link to="/register" className="landing-btn landing-btn--primary">
              Get Started <FiArrowRight />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero — split editorial layout */}
      <section className="landing-hero">
        <div className="landing-hero__orb landing-hero__orb--1" aria-hidden="true" />
        <div className="landing-hero__orb landing-hero__orb--2" aria-hidden="true" />

        <div className="landing-hero__grid">
          <div className="landing-hero__content animate-fade-up">
            <span className="landing-hero__badge">
              <span className="landing-hero__badge-dot" />
              India&apos;s #1 Venue Marketplace
            </span>
            <h1 className="landing-hero__title">
              Spaces worth <em className="text-gradient">celebrating</em>
            </h1>
            <p className="landing-hero__subtitle">
              From intimate cafes to grand banquet halls — discover, compare, and book exceptional venues across India in minutes.
            </p>
            <div className="landing-hero__ctas">
              <Link to="/browse-venues" className="landing-btn landing-btn--primary landing-btn--lg">
                Browse Venues <FiArrowRight />
              </Link>
              <Link to="/register" className="landing-btn landing-btn--secondary landing-btn--lg">
                List Your Venue
              </Link>
            </div>
            <div className="landing-hero__stats">
              <div className="landing-stat">
                <strong>500+</strong>
                <span>Curated venues</span>
              </div>
              <div className="landing-stat-divider" />
              <div className="landing-stat">
                <strong>10k+</strong>
                <span>Happy bookings</span>
              </div>
              <div className="landing-stat-divider" />
              <div className="landing-stat">
                <strong>4.8★</strong>
                <span>Avg. rating</span>
              </div>
            </div>
          </div>

          <div className="landing-hero__visual animate-fade-up stagger-2">
            <div className="landing-hero__floats">
              {HERO_FLOATS.map((card) => (
                <div key={card.label} className={`float-card ${card.className}`}>
                  <img src={card.img} alt={card.label} />
                  <div className="float-card__info">
                    <span className="float-card__type">{card.label}</span>
                    <span className="float-card__city"><FiMapPin size={11} /> {card.city}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cities marquee */}
      <div className="landing-marquee" aria-hidden="true">
        <div className="landing-marquee__track">
          {[...CITIES, ...CITIES].map((city, i) => (
            <span key={`${city}-${i}`} className="landing-marquee__item">
              <FiMapPin size={12} /> {city}
            </span>
          ))}
        </div>
      </div>

      {/* How it works — removed old hero block below */}
      <section id="how-it-works" className="landing-section">
        <div className="landing-section__inner">
          <div className="landing-section__header">
            <span className="eyebrow">Simple process</span>
            <h2>How it works</h2>
            <p>Three steps from search to celebration</p>
          </div>
          <div className="landing-steps">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className={`landing-step animate-fade-up stagger-${i + 1}`}>
                  <div className="landing-step__number">{i + 1}</div>
                  <div className="landing-step__icon">
                    <Icon />
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Venue types */}
      <section id="venues" className="landing-section landing-section--muted">
        <div className="landing-section__inner">
          <div className="landing-section__header">
            <span className="eyebrow">Explore by type</span>
            <h2>Venues for every occasion</h2>
            <p>From intimate gatherings to grand celebrations</p>
          </div>
          <div className="landing-venue-bento">
            {VENUE_TYPES.map((type, i) => (
              <Link
                key={type.name}
                to="/browse-venues"
                className={`landing-venue-card ${i === 0 ? 'landing-venue-card--featured' : ''}`}
              >
                <img src={type.image} alt={type.name} />
                <div className="landing-venue-card__overlay">
                  <h3>{type.name}</h3>
                  <span>{type.count}</span>
                  <span className="landing-venue-card__arrow"><FiArrowRight /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="landing-section">
        <div className="landing-section__inner">
          <div className="landing-section__header">
            <span className="eyebrow">Loved by thousands</span>
            <h2>What our users say</h2>
          </div>
          <div className="landing-testimonials">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="landing-testimonial">
                <div className="landing-testimonial__stars">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <FiStar key={i} className="star-filled" />
                  ))}
                </div>
                <p className="landing-testimonial__quote">&ldquo;{t.quote}&rdquo;</p>
                <div className="landing-testimonial__author">
                  <img src={t.avatar} alt={t.name} />
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="landing-cta-band">
        <div className="landing-cta-band__inner">
          <div>
            <h2>Ready to find your venue?</h2>
            <p>Join thousands of happy hosts and event planners today.</p>
          </div>
          <Link to="/browse-venues" className="landing-btn landing-btn--white landing-btn--lg">
            Start Browsing <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer__inner">
          <div className="landing-footer__brand">
            <Link to="/" className="landing-logo">
              <div className="landing-logo__icon">
                <FiMapPin />
              </div>
              <span>BookMy<span className="landing-logo__accent">Venue</span></span>
            </Link>
            <p>The premier marketplace for exceptional event spaces across India.</p>
          </div>
          <div className="landing-footer__links">
            <div>
              <h4>Product</h4>
              <Link to="/browse-venues">Browse Venues</Link>
              <Link to="/favorites">Favorites</Link>
              <Link to="/register">List a Venue</Link>
            </div>
            <div>
              <h4>Company</h4>
              <a href="#how-it-works">About</a>
              <a href="#testimonials">Reviews</a>
              <Link to="/login">Contact</Link>
            </div>
            <div>
              <h4>Legal</h4>
              <a href="#">Terms of Service</a>
              <a href="#">Privacy Policy</a>
            </div>
          </div>
        </div>
        <div className="landing-footer__bottom">
          <p>&copy; {new Date().getFullYear()} BookMyVenue Inc. All rights reserved.</p>
          <div className="landing-footer__social">
            <FiHeart className="landing-footer__heart" />
            <span>Made with love for celebrations</span>
          </div>
        </div>
      </footer>
    </PageTransition>
  );
}

export default LandingPage;
