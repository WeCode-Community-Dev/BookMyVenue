import React, { useMemo, useState } from 'react'
import './VenueDetails.scss'
import { useGetVenueDetailsQuery } from './venueApi'
import { useParams } from 'react-router-dom'

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const TYPE_LABELS = {
  banquet_hall: 'Banquet Hall',
  meeting_room: 'Meeting Room',
  outdoor_space: 'Outdoor Space',
  studio: 'Studio',
  hall: 'Hall',
  cafe: 'Cafe',
  rooftop: 'Rooftop',
}

function VenueDetails() {
  const { venueId } = useParams()
  const { data: response, isLoading, error } = useGetVenueDetailsQuery(venueId)
  const venue = response?.data
  const [activeImage, setActiveImage] = useState(0)

  const images = venue?.images || []
  const imageUrl = (img) => (typeof img === 'string' ? img : img?.url || '')
  const imageAlt = (img) => (typeof img === 'string' ? venue?.name || 'Venue image' : img?.alt || venue?.name || 'Venue image')

  const amenitiesByCategory = useMemo(() => {
    if (!venue?.venueAmenities) return {}
    return venue.venueAmenities.reduce((acc, item) => {
      const amenity = item?.amenity
      if (!amenity) return acc
      const category = amenity.category || 'Other'
      if (!acc[category]) acc[category] = []
      acc[category].push(amenity)
      return acc
    }, {})
  }, [venue])

  const pricingRows = venue?.pricing || []
  const defaultPricing = pricingRows.find((row) => row.dayType === 'weekday') || pricingRows[0]
  const minBookingHours = venue?.minBookingHours ?? defaultPricing?.minHours ?? 1
  const defaultPrice = defaultPricing ? Number(defaultPricing.pricePerHour || 0) : 0
  const formattedEstimate = defaultPrice && minBookingHours ? `₹${(defaultPrice * minBookingHours).toLocaleString()}` : 'N/A'

  const venueTypeLabel = TYPE_LABELS[venue?.type] || venue?.type || 'Venue'

  if (isLoading) {
    return (
      <div className="venue-details-page">
        <main className="container">
          <div className="loading-state">Loading venue details...</div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="venue-details-page">
        <main className="container">
          <div className="loading-state">Unable to load venue details.</div>
        </main>
      </div>
    )
  }

  if (!venue) {
    return (
      <div className="venue-details-page">
        <main className="container">
          <div className="loading-state">Venue not found.</div>
        </main>
      </div>
    )
  }

  const openDaysSet = new Set(venue.openDays || [])
  const venueCity = [venue.city, venue.state].filter(Boolean).join(', ')

  return (
    <div className="venue-details-page">
      <main className="container">
        <section className="main-content">
          <div className="gallery-container">
            <div className="primary-image">
              <img src={imageUrl(images[activeImage] || images[0] || {})} alt={imageAlt(images[activeImage] || images[0] || {})} />
            </div>
            <div className="thumbnails">
              {(images.length > 0 ? images : [{ url: '' }]).map((img, index) => (
                <button
                  key={index}
                  type="button"
                  className={`thumbnail ${index === activeImage ? 'active' : ''}`}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={imageUrl(img)} alt={imageAlt(img)} />
                </button>
              ))}
            </div>
          </div>

          <div className="venue-header">
            <h1>{venue.name}</h1>
            <div className="tag-row">
              <span className="pill pill-type">{venueTypeLabel}</span>
              <span className="pill">
                <i className="ti ti-map-pin" /> {venueCity}
              </span>
              <span className="pill">
                <i className="ti ti-users" /> Up to {venue.capacity} people
              </span>
              <div className="day-pills">
                {DAY_ORDER.map((day) => (
                  <div key={day} className={`day-pill ${openDaysSet.has(day) ? 'active' : ''}`}>
                    {day.slice(0, 1)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="content-section">
            <h2>About this venue</h2>
            <p className="about-text">{venue.description}</p>
            <div className="venue-address">
              <strong>Location:</strong> {venue.address}
              {venue.pincode ? ` • ${venue.pincode}` : ''}
            </div>
          </div>

          <div className="content-section">
            <h2>Amenities</h2>
            <div className="amenities-container">
              {Object.entries(amenitiesByCategory).map(([category, amenities]) => (
                <div key={category} className="amenity-category">
                  <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                  <div className="chip-grid">
                    {amenities.map((amenity) => (
                      <span key={amenity.slug} className="amenity-chip">
                        <i className={`ti ${amenity.icon || ''}`} /> {amenity.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              {Object.keys(amenitiesByCategory).length === 0 && <p>No amenities listed.</p>}
            </div>
          </div>

          <div className="content-section">
            <h2>Availability</h2>
            <div className="info-row">
              <div className="info-block">
                <span className="info-label">Opening Time</span>
                <span className="info-value">{venue.openTime || 'N/A'}</span>
              </div>
              <div className="info-block">
                <span className="info-label">Closing Time</span>
                <span className="info-value">{venue.closeTime || 'N/A'}</span>
              </div>
              <div className="info-block">
                <span className="info-label">Min. Booking</span>
                <span className="info-value">{minBookingHours} {minBookingHours === 1 ? 'Hour' : 'Hours'}</span>
              </div>
            </div>
          </div>
        </section>

        <aside className="sidebar-wrapper">
          <div className="booking-card">
            <h2>Book this Venue</h2>
            <table className="pricing-table">
              <tbody>
                {pricingRows.length > 0 ? (
                  pricingRows.map((pricing) => (
                    <tr key={`${pricing.dayType}-${pricing.id || pricing.dayType}`}>
                      <td className="price-day">{pricing.dayType?.charAt(0).toUpperCase() + pricing.dayType?.slice(1)}</td>
                      <td className="price-value">
                        ₹{Number(pricing.pricePerHour || 0).toLocaleString()}
                        <span className="price-note">per hour (min. {pricing.minHours || minBookingHours} hrs)</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="price-day">Pricing unavailable</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="form-group">
              <label className="form-label" htmlFor="booking-date">Date</label>
              <input type="date" id="booking-date" className="form-input" />
            </div>

            <div className="form-row">
              <div>
                <label className="form-label" htmlFor="start-time">Start Time</label>
                <select id="start-time" className="form-input" defaultValue={venue.openTime || '09:00'}>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                </select>
              </div>
              <div>
                <label className="form-label" htmlFor="end-time">End Time</label>
                <select id="end-time" className="form-input" defaultValue={venue.closeTime || '13:00'}>
                  <option value="13:00">01:00 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                </select>
              </div>
            </div>

            <div className="estimation-row">
              <span className="est-label">Estimated Total ({minBookingHours} hrs)</span>
              <span className="est-value">{formattedEstimate}</span>
            </div>

            <button type="button" className="book-btn">Book Now</button>
            <span className="muted-note">Min. booking: {minBookingHours} {minBookingHours === 1 ? 'hour' : 'hours'}</span>
          </div>
        </aside>
      </main>
    </div>
  )
}

export default VenueDetails
