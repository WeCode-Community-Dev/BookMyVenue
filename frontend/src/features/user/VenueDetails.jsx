import React, { useMemo, useState, useEffect } from 'react'
import './VenueDetails.scss'
import { useGetVenueDetailsQuery, useCreateBookingMutation, useGetFavoritesQuery, useAddFavoriteMutation, useDeleteFavoriteMutation } from './venueApi'
import { href, useParams } from 'react-router-dom'
import { FiStar } from 'react-icons/fi'

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

const getDayType = (date) => {
  const dayNumber = date.getDay()
  return dayNumber === 0 || dayNumber === 6 ? 'weekend' : 'weekday'
}

const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString()}`

function VenueDetails() {
  const { venueId } = useParams()
  const { data: response, isLoading, error } = useGetVenueDetailsQuery(venueId)
  const venue = response?.data
  const [activeImage, setActiveImage] = useState(0)
  const [bookingDate, setBookingDate] = useState('')
  const [bookingStartDate, setBookingStartDate] = useState('')
  const [bookingEndDate, setBookingEndDate] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('13:00')
  const [bookingMessage, setBookingMessage] = useState('')

  useEffect(() => {
    if (!venue) return

    const today = new Date().toISOString().slice(0, 10)
    setBookingDate((prev) => prev || today)
    setBookingStartDate((prev) => prev || today)
    setBookingEndDate((prev) => prev || today)
    setStartTime((prev) => prev || venue.openTime || '09:00')
    setEndTime((prev) => prev || venue.closeTime || '13:00')
  }, [venue])

  const images = venue?.images || []
  const imageUrl = (img) => (typeof img === 'string' ? img : img?.url || '')
  const imageAlt = (img) => (typeof img === 'string' ? venue?.name || 'Venue image' : img?.alt || venue?.name || 'Venue image')

  const { data: favResp, refetch: refetchFavorites } = useGetFavoritesQuery()
  const favoriteIds = new Set((favResp?.data || []).map(i => i?.venue?.id).filter(Boolean))
  const [addFavorite] = useAddFavoriteMutation()
  const [deleteFavorite] = useDeleteFavoriteMutation()
  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation()

  const isFavorited = Boolean(favoriteIds.has(Number(venueId)) || favoriteIds.has(venue?.id))

  const toggleFavorite = async () => {
    try {
      const id = venue?.id || Number(venueId)
      if (!id) return
      if (isFavorited) {
        await deleteFavorite(id).unwrap()
      } else {
        await addFavorite(id).unwrap()
      }
    } catch (e) {
      console.error('toggle favorite failed', e)
    } finally {
      refetchFavorites()
    }
  }

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
  const pricingMap = useMemo(() => {
    return pricingRows.reduce((acc, row) => {
      if (row?.dayType) acc[row.dayType] = row
      return acc
    }, {})
  }, [pricingRows])

  const getPricingRow = (dayType) => pricingMap[dayType] || pricingRows[0] || { price: 0, minHours: venue?.minBookingHours || 1 }

  const minBookingHours = venue?.minBookingHours ?? getPricingRow('weekday')?.minHours ?? 1
  const bookingType = venue?.bookingType === 'hourly' ? 'hourly' : 'daily'

  const handleBookNow = async () => {
    if (!venue?.id) return

    const requestBody = {
      venueId: venue.id,
      startDate: bookingType === 'hourly' ? bookingDate : bookingStartDate,
      endDate: bookingType === 'hourly' ? bookingDate : bookingEndDate,
      startTime: bookingType === 'hourly' ? startTime : venue.openTime || '00:00',
      endTime: bookingType === 'hourly' ? endTime : venue.closeTime || '23:59',
    }

    try {
      setBookingMessage('')
      const response = await createBooking(requestBody).unwrap();
      window.location.href = response.data.redirectUrl
      setBookingMessage('Booking request sent. Please complete the payment if redirected.')
    } catch (err) {
      setBookingMessage(err?.data?.message || err?.message || 'Booking failed. Please try again.')
    }
  }

  const priceEstimate = useMemo(() => {
    if (bookingType === 'hourly') {
      if (!bookingDate || !startTime || !endTime) return null
      const [startH, startM] = startTime.split(':').map(Number)
      const [endH, endM] = endTime.split(':').map(Number)
      const hours = endH + endM / 60 - (startH + startM / 60)
      if (hours <= 0) return null
      const date = new Date(bookingDate)
      const pricing = getPricingRow(getDayType(date))
      return {
        amount: hours * Number(pricing.price || 0),
        hours,
        dayType: getDayType(date),
        pricing,
      }
    }

    if (bookingType === 'daily') {
      if (!bookingStartDate || !bookingEndDate) return null
      const start = new Date(bookingStartDate)
      const end = new Date(bookingEndDate)
      if (Number(end) < Number(start)) return null
      let total = 0
      let dayCount = 0
      const breakdown = []
      const current = new Date(start)

      while (current <= end) {
        const dayType = getDayType(current)
        const pricing = getPricingRow(dayType)
        total += Number(pricing.price || 0)
        dayCount += 1
        breakdown.push({
          date: current.toISOString().slice(0, 10),
          dayType,
          amount: Number(pricing.price || 0),
        })
        current.setDate(current.getDate() + 1)
      }

      return { amount: total, days: dayCount, breakdown }
    }

    return null
  }, [bookingType, bookingDate, bookingStartDate, bookingEndDate, startTime, endTime, getPricingRow])

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
  const venueCity = [venue.city, venue.state].filter(Boolean).join(', ');

  const bookingLabel = bookingType === 'hourly' ? 'Hourly booking' : 'Daily booking'
  const pricingNote = bookingType === 'hourly' ? 'per hour' : 'per day'

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
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
              <h1>{venue.name}</h1>
              <button type="button" className={`favorite-toggle ${isFavorited ? 'active' : ''}`} onClick={toggleFavorite} aria-label="Toggle favorite">
                <FiStar />
              </button>
            </div>
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
            <div className="form-group">
              <span className="form-label">Booking type</span>
              <div>{bookingLabel}</div>
            </div>

            <table className="pricing-table">
              <tbody>
                {pricingRows.length > 0 ? (
                  pricingRows.map((pricing) => (
                    <tr key={`${pricing.dayType}-${pricing.id || pricing.dayType}`}>
                      <td className="price-day">{pricing.dayType?.charAt(0).toUpperCase() + pricing.dayType?.slice(1)}</td>
                      <td className="price-value">
                        {formatCurrency(pricing.price)}
                        <span className="price-note">{pricingNote} {bookingType === 'hourly' ? `(min. ${pricing.minHours || minBookingHours} hrs)` : ''}</span>
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

            {bookingType === 'hourly' ? (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="booking-date">Date</label>
                  <input
                    type="date"
                    id="booking-date"
                    className="form-input"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="start-time">Start Time</label>
                    <select
                      id="start-time"
                      className="form-input"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    >
                      <option value="09:00">09:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="13:00">01:00 PM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="15:00">03:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="end-time">End Time</label>
                    <select
                      id="end-time"
                      className="form-input"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    >
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="13:00">01:00 PM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="15:00">03:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                      <option value="17:00">05:00 PM</option>
                    </select>
                  </div>
                </div>
                <div className="estimation-row">
                  <span className="est-label">Estimated Total</span>
                  <span className="est-value">
                    {priceEstimate ? formatCurrency(priceEstimate.amount) : 'Select date and time'}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="booking-start-date">Start Date</label>
                    <input
                      type="date"
                      id="booking-start-date"
                      className="form-input"
                      value={bookingStartDate}
                      onChange={(e) => setBookingStartDate(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="booking-end-date">End Date</label>
                    <input
                      type="date"
                      id="booking-end-date"
                      className="form-input"
                      value={bookingEndDate}
                      onChange={(e) => setBookingEndDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="estimation-row">
                  <span className="est-label">Estimated Total</span>
                  <span className="est-value">
                    {priceEstimate ? formatCurrency(priceEstimate.amount) : 'Select booking dates'}
                  </span>
                </div>
              </>
            )}

            <button type="button" className="book-btn" onClick={handleBookNow} disabled={!priceEstimate || isBooking}>
              {isBooking ? 'Booking...' : 'Book Now'}
            </button>
            {bookingMessage && <div className="booking-message">{bookingMessage}</div>}
            <span className="muted-note">
              {bookingType === 'hourly'
                ? `Min. booking: ${minBookingHours} ${minBookingHours === 1 ? 'hour' : 'hours'}`
                : 'Daily bookings are selected using a date range.'}
            </span>
          </div>
        </aside>
      </main>
    </div>
  )
}

export default VenueDetails
