import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getVenueBySlug } from "../../../api/venueApi";
import { createBooking } from "../../../api/bookingApi";
import { getCurrentUser, hasAuthSession } from "../../../api/authApi";
import {
  addFavorite,
  getFavorites,
  hasAccessToken,
  removeFavorite,
} from "../../../api/favoriteApi";
import "./venuedetail.css";

const fallbackImage =
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(price));

const VenueDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState("");
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [favoriteSaving, setFavoriteSaving] = useState(false);
  const [favoriteError, setFavoriteError] = useState("");
  const [bookingUser, setBookingUser] = useState(null);
  const [bookingUserLoading, setBookingUserLoading] = useState(hasAuthSession());
  const [bookingSaving, setBookingSaving] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [bookingForm, setBookingForm] = useState({
    event_date: "",
    event_type: "wedding",
    guest_count: "",
    message: "",
  });
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    let ignoreResult = false;

    async function loadVenue() {
      setLoading(true);
      setError("");

      try {
        const data = await getVenueBySlug(slug);
        if (!ignoreResult) {
          setVenue(data);
        }
      } catch (requestError) {
        if (!ignoreResult) {
          setError("Unable to load this venue. Please try again.");
          console.error(requestError);
        }
      } finally {
        if (!ignoreResult) {
          setLoading(false);
        }
      }
    }

    if (slug) {
      loadVenue();
    }

    return () => {
      ignoreResult = true;
    };
  }, [slug]);

  useEffect(() => {
    let ignoreResult = false;

    async function loadFavorite() {
      if (!venue || !hasAccessToken()) return;

      setFavoriteLoading(true);
      try {
        const favorites = await getFavorites();
        const favorite = favorites.find((item) => item.venue.id === venue.id);
        if (!ignoreResult) {
          setFavoriteId(favorite?.id ?? null);
        }
      } catch (requestError) {
        if (!ignoreResult && hasAccessToken()) {
          setFavoriteError("Unable to load favorite status.");
          console.error(requestError);
        }
      } finally {
        if (!ignoreResult) {
          setFavoriteLoading(false);
        }
      }
    }

    loadFavorite();

    return () => {
      ignoreResult = true;
    };
  }, [venue]);

  useEffect(() => {
    let ignoreResult = false;

    async function loadBookingUser() {
      if (!hasAuthSession()) {
        setBookingUserLoading(false);
        return;
      }

      setBookingUserLoading(true);
      try {
        const user = await getCurrentUser();
        if (!ignoreResult) setBookingUser(user);
      } catch (requestError) {
        if (!ignoreResult) setBookingUser(null);
        console.error(requestError);
      } finally {
        if (!ignoreResult) setBookingUserLoading(false);
      }
    }

    loadBookingUser();

    return () => {
      ignoreResult = true;
    };
  }, []);

  async function handleFavoriteToggle() {
    if (!hasAccessToken()) {
      navigate("/login", { state: { from: `/venues/${slug}` } });
      return;
    }

    setFavoriteSaving(true);
    setFavoriteError("");

    try {
      if (favoriteId) {
        await removeFavorite(favoriteId);
        setFavoriteId(null);
      } else {
        const favorite = await addFavorite(venue.id);
        setFavoriteId(favorite.id);
      }
    } catch (requestError) {
      setFavoriteError(
        hasAccessToken()
          ? "Unable to update this favorite. Please try again."
          : "Your session has expired. Please log in again."
      );
      console.error(requestError);
    } finally {
      setFavoriteSaving(false);
    }
  }

  function handleBookingChange(event) {
    const { name, value } = event.target;
    setBookingForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  function redirectGuestToLogin(event) {
    if (!hasAuthSession()) {
      event.preventDefault();
      navigate("/login", {
        state: { returnTo: `/venues/${slug}` },
      });
    }
  }

  async function handleBookingSubmit(event) {
    event.preventDefault();

    if (!hasAuthSession()) {
      navigate("/login", { state: { returnTo: `/venues/${slug}` } });
      return;
    }

    if (bookingUser?.account_type !== "venue_user") {
      setBookingError("Only venue-user accounts can book a venue.");
      return;
    }

    setBookingSaving(true);
    setBookingError("");
    setBookingSuccess("");

    try {
      await createBooking({
        venue_id: venue.id,
        ...bookingForm,
        guest_count: Number(bookingForm.guest_count),
      });
      setBookingSuccess("Your booking request was sent successfully.");
      setBookingForm({
        event_date: "",
        event_type: "wedding",
        guest_count: "",
        message: "",
      });
    } catch (requestError) {
      const responseData = requestError.response?.data;
      const firstError = responseData && typeof responseData === "object"
        ? Object.values(responseData).flat()[0]
        : null;
      setBookingError(
        typeof firstError === "string"
          ? firstError
          : "Unable to send your booking request. Please try again."
      );
      console.error(requestError);
    } finally {
      setBookingSaving(false);
    }
  }

  const address = useMemo(() => {
    if (!venue) return "";

    return [
      venue.address,
      venue.city,
      venue.state,
      venue.postal_code,
      venue.country,
    ]
      .filter(Boolean)
      .join(", ");
  }, [venue]);

  if (!slug) {
    return (
      <main className="venue-detail-status container">
        <h1>No venue selected</h1>
        <p>Please choose a venue from the venue listing.</p>
        <Link className="btn primary-btn" to="/venues">
          Browse venues
        </Link>
      </main>
    );
  }

  if (loading) {
    return <main className="venue-detail-status container">Loading venue details...</main>;
  }

  if (error || !venue) {
    return (
      <main className="venue-detail-status container">
        <h1>Venue unavailable</h1>
        <p>{error}</p>
        <Link className="btn primary-btn" to="/venues">
          Back to venues
        </Link>
      </main>
    );
  }

  const images = venue.images.length > 0 ? venue.images : [
    { id: "fallback", image: fallbackImage, alt_text: venue.name },
  ];
  const isFavorite = Boolean(favoriteId);

  return (
    <div className="venue-detail-page">
      <main>
        <section className="breadcrumb-section">
          <div className="container">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb custom-breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/venues">Venues</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">{venue.name}</li>
              </ol>
            </nav>
          </div>
        </section>

        <section className="venue-detail-section">
          <div className="container">
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="venue-title-wrap">
                  <div>
                    <span className="venue-type-badge">{venue.venue_type_display}</span>
                    <div className="venue-heading-row">
                      <h1>{venue.name}</h1>
                      <button
                        type="button"
                        className={`favorite-btn ${isFavorite ? "is-favorite" : ""}`}
                        aria-label={`${isFavorite ? "Remove" : "Add"} ${venue.name} ${isFavorite ? "from" : "to"} favorites`}
                        aria-pressed={isFavorite}
                        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        disabled={favoriteLoading || favoriteSaving}
                        onClick={handleFavoriteToggle}
                      >
                        <i className={`bi ${isFavorite ? "bi-heart-fill" : "bi-heart"}`}></i>
                      </button>
                    </div>
                    {favoriteError && <p role="alert">{favoriteError}</p>}
                    <div className="venue-meta-line">
                      <span><i className="bi bi-geo-alt-fill"></i> {venue.city}, {venue.state}</span>
                      <span><i className="bi bi-people-fill"></i> Capacity {venue.max_capacity}</span>
                      {venue.is_verified && (
                        <span><i className="bi bi-patch-check-fill"></i> Verified</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="venue-image-gallery">
                  {images.map((image, index) => (
                    <img
                      className={index === 0 ? "venue-main-image" : ""}
                      key={image.id}
                      src={image.image}
                      alt={image.alt_text || `${venue.name} view ${index + 1}`}
                    />
                  ))}
                </div>

                <article className="detail-card">
                  <h2>About this venue</h2>
                  <p>{venue.description}</p>
                </article>

                <article className="detail-card">
                  <h2>Amenities</h2>
                  {venue.amenities.length > 0 ? (
                    <div className="amenities-grid">
                      {venue.amenities.map((amenity) => (
                        <div className="amenity-item" key={amenity.id}>
                          <i className={amenity.icon || "bi bi-check-circle"}></i>
                          {amenity.name}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No amenities have been listed.</p>
                  )}
                </article>

                <article className="detail-card">
                  <h2>Packages</h2>
                  {venue.packages.length > 0 ? (
                    <div className="package-list">
                      {venue.packages.map((venuePackage) => (
                        <div className="package-item" key={venuePackage.id}>
                          <div>
                            <h3>{venuePackage.name}</h3>
                            <p>{venuePackage.description}</p>
                          </div>
                          <strong>{formatPrice(venuePackage.price_per_day)}/day</strong>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No packages are currently available.</p>
                  )}
                </article>

                <article className="detail-card">
                  <h2>Location</h2>
                  <p className="mb-3">
                    <i className="bi bi-geo-alt-fill text-teal"></i> {address}
                  </p>
                  <div className="map-placeholder">
                    <i className="bi bi-map"></i>
                    <span>{venue.city}, {venue.state}</span>
                  </div>
                </article>
              </div>

              <div className="col-lg-4">
                <aside className="booking-card">
                  <div className="price-main">
                    {formatPrice(venue.base_price_per_day)} <span>/day</span>
                  </div>
                  <p className="booking-note">
                    Request a booking and the venue owner will confirm availability.
                  </p>

                  <form onSubmit={handleBookingSubmit}>
                    <label className="booking-field">
                      Event Date
                      <input
                        type="date"
                        name="event_date"
                        min={today}
                        value={bookingForm.event_date}
                        onChange={handleBookingChange}
                        required
                      />
                    </label>

                    <label className="booking-field">
                      Event Type
                      <select
                        name="event_type"
                        value={bookingForm.event_type}
                        onChange={handleBookingChange}
                        required
                      >
                        <option value="birthday">Birthday</option>
                        <option value="wedding">Wedding</option>
                        <option value="corporate">Corporate Event</option>
                        <option value="engagement">Engagement</option>
                        <option value="reception">Reception</option>
                        <option value="conference">Conference</option>
                        <option value="other">Other</option>
                      </select>
                    </label>

                    <label className="booking-field">
                      Number of Guests
                      <input
                        type="number"
                        name="guest_count"
                        min="1"
                        max={venue.max_capacity}
                        placeholder="Example: 250"
                        value={bookingForm.guest_count}
                        onChange={handleBookingChange}
                        required
                      />
                    </label>

                    <label className="booking-field">
                      Message
                      <textarea
                        name="message"
                        placeholder="Tell the owner about your event"
                        value={bookingForm.message}
                        onChange={handleBookingChange}
                      ></textarea>
                    </label>

                    {bookingUser?.account_type === "venue_owner" && (
                      <p className="booking-message booking-error" role="alert">
                        Venue-owner accounts cannot book venues. Please use a venue-user account.
                      </p>
                    )}
                    {bookingError && (
                      <p className="booking-message booking-error" role="alert">
                        {bookingError}
                      </p>
                    )}
                    {bookingSuccess && (
                      <p className="booking-message booking-success" role="status">
                        {bookingSuccess}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="btn primary-btn booking-submit-btn w-100"
                      disabled={
                        bookingUserLoading
                        || bookingSaving
                        || bookingUser?.account_type === "venue_owner"
                      }
                      onClick={redirectGuestToLogin}
                    >
                      {bookingSaving ? "Sending..." : "Book Now"}
                    </button>
                  </form>

                  <hr />
                  <div className="quick-info">
                    {venue.is_verified && (
                      <div><i className="bi bi-check-circle"></i> Verified venue</div>
                    )}
                    <button
                      type="button"
                      className="contact-details-link"
                      aria-expanded={showContactDetails}
                      aria-controls="venue-contact-details"
                      onClick={() => setShowContactDetails((isVisible) => !isVisible)}
                    >
                      <i className="bi bi-person-lines-fill"></i> Contact details
                    </button>
                    {showContactDetails && (
                      <div className="contact-detail-values" id="venue-contact-details">
                        {venue.contact_phone && (
                          <a href={`tel:${venue.contact_phone}`}>
                            <i className="bi bi-telephone"></i> {venue.contact_phone}
                          </a>
                        )}
                        {venue.contact_email && (
                          <a href={`mailto:${venue.contact_email}`}>
                            <i className="bi bi-envelope"></i> {venue.contact_email}
                          </a>
                        )}
                        {!venue.contact_phone && !venue.contact_email && (
                          <span>Contact details are not available.</span>
                        )}
                      </div>
                    )}
                    <div><i className="bi bi-credit-card"></i> No online payment required now</div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VenueDetail;
