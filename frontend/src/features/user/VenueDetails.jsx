import React, { useMemo, useState, useEffect } from 'react'
import './VenueDetails.scss'
import { useGetVenueDetailsQuery, useCreateBookingMutation, useGetFavoritesQuery, useAddFavoriteMutation, useDeleteFavoriteMutation } from './venueApi'
import { useParams } from 'react-router-dom'
import { FiStar, FiMapPin, FiUsers, FiClock, FiCalendar } from 'react-icons/fi'
import PageTransition from '../../components/ui/PageTransition'
import { VenueDetailSkeleton } from '../../components/ui/LoadingSkeleton'
import EmptyState from '../../components/ui/EmptyState'
import { ToastBanner } from '../../components/ui/ToastProvider'

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
      <PageTransition className="venue-details-page">
        <VenueDetailSkeleton />
      </PageTransition>
    )
  }

  if (error) {
    return (
      <PageTransition className="venue-details-page">
        <main className="container container--centered">
          <EmptyState
            title="Unable to load venue"
            message="Something went wrong while fetching venue details. Please try again later."
            variant="error"
          />
        </main>
      </PageTransition>
    )
  }

  if (!venue) {
    return (
      <PageTransition className="venue-details-page">
        <main className="container container--centered">
          <EmptyState
            title="Venue not found"
            message="The venue you're looking for doesn't exist or may have been removed."
            actionLabel="Browse Venues"
            actionTo="/browse-venues"
          />
        </main>
      </PageTransition>
    )
  }

  const openDaysSet = new Set(venue.openDays || [])
  const venueCity = [venue.city, venue.state].filter(Boolean).join(', ');

  const bookingLabel = bookingType === 'hourly' ? 'Hourly booking' : 'Daily booking'
  const pricingNote = bookingType === 'hourly' ? 'per hour' : 'per day'
  const startingPrice = pricingRows[0]?.price

  return (
    <PageTransition className="venue-details-page">
      {/* ── Hero with gallery ── */}
      <section className="venue-hero">
        <img
          src={imageUrl(images[activeImage] || images[0] || {})}
          alt={imageAlt(images[activeImage] || images[0] || {})}
          className="venue-hero__img"
        />
        <div className="venue-hero__gradient" />

        <div className="venue-hero__actions">
          <button
            type="button"
            className={`favorite-toggle ${isFavorited ? 'active' : ''}`}
            onClick={toggleFavorite}
            aria-label="Toggle favorite"
          >
            <FiStar />
            <span>{isFavorited ? 'Saved' : 'Save'}</span>
          </button>
        </div>

        {images.length > 1 && (
          <div className="venue-hero__thumbs">
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
        )}

        <div className="venue-hero__content">
          <span className="pill pill-type">{venueTypeLabel}</span>
          <h1 className="venue-hero__title">{venue.name}</h1>
          <p className="venue-hero__location">
            <FiMapPin /> {venueCity}
          </p>
        </div>
      </section>

      {/* ── Quick stats strip ── */}
      <div className="venue-stats-bar">
        <div className="venue-stats-bar__inner">
          <div className="venue-stat">
            <FiUsers className="venue-stat__icon" />
            <div>
              <span className="venue-stat__label">Capacity</span>
              <span className="venue-stat__value">Up to {venue.capacity}</span>
            </div>
          </div>
          <div className="venue-stat">
            <FiClock className="venue-stat__icon" />
            <div>
              <span className="venue-stat__label">Hours</span>
              <span className="venue-stat__value">{venue.openTime || '—'} – {venue.closeTime || '—'}</span>
            </div>
          </div>
          <div className="venue-stat">
            <FiCalendar className="venue-stat__icon" />
            <div>
              <span className="venue-stat__label">Booking</span>
              <span className="venue-stat__value">{bookingLabel}</span>
            </div>
          </div>
          {startingPrice != null && (
            <div className="venue-stat venue-stat--price">
              <div>
                <span className="venue-stat__label">From</span>
                <span className="venue-stat__value">{formatCurrency(startingPrice)}<small>/{bookingType === 'hourly' ? 'hr' : 'day'}</small></span>
              </div>
            </div>
          )}
        </div>
      </div>

      <main className="container">
        <section className="main-content">
          {/* Open days */}
          <div className="detail-card detail-card--compact">
            <div className="detail-card__header">
              <span className="eyebrow">Schedule</span>
              <h2>Open days</h2>
            </div>
            <div className="day-pills">
              {DAY_ORDER.map((day) => (
                <div key={day} className={`day-pill ${openDaysSet.has(day) ? 'active' : ''}`} title={day}>
                  <span className="day-pill__letter">{day.slice(0, 1)}</span>
                  <span className="day-pill__name">{day.slice(0, 3)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="content-section detail-card">
            <div className="detail-card__header">
              <span className="eyebrow">Overview</span>
              <h2>About this venue</h2>
            </div>
            <p className="about-text">{venue.description}</p>
            <div className="venue-address">
              <FiMapPin className="venue-address__icon" />
              <div>
                <strong>Address</strong>
                <p>{venue.address}{venue.pincode ? ` • ${venue.pincode}` : ''}</p>
              </div>
            </div>
          </div>

          <div className="content-section detail-card">
            <div className="detail-card__header">
              <span className="eyebrow">Features</span>
              <h2>Amenities</h2>
            </div>
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
              {Object.keys(amenitiesByCategory).length === 0 && (
                <p className="empty-hint">No amenities listed for this venue.</p>
              )}
            </div>
          </div>

          <div className="content-section detail-card">
            <div className="detail-card__header">
              <span className="eyebrow">Hours</span>
              <h2>Availability</h2>
            </div>
            <div className="info-row">
              <div className="info-block">
                <span className="info-label">Opens</span>
                <span className="info-value">{venue.openTime || 'N/A'}</span>
              </div>
              <div className="info-block">
                <span className="info-label">Closes</span>
                <span className="info-value">{venue.closeTime || 'N/A'}</span>
              </div>
              <div className="info-block">
                <span className="info-label">Min. booking</span>
                <span className="info-value">{minBookingHours} {minBookingHours === 1 ? 'hr' : 'hrs'}</span>
              </div>
            </div>
          </div>
        </section>

        <aside className="sidebar-wrapper">
          <div className="booking-card">
            <div className="booking-card__header">
              <span className="eyebrow">Reserve</span>
              <h2>Book this venue</h2>
            </div>

            <div className="booking-type-badge">
              <FiCalendar />
              <span>{bookingLabel}</span>
            </div>

            <div className="pricing-cards">
              {pricingRows.length > 0 ? (
                pricingRows.map((pricing) => (
                  <div key={`${pricing.dayType}-${pricing.id || pricing.dayType}`} className="pricing-card">
                    <span className="pricing-card__day">
                      {pricing.dayType?.charAt(0).toUpperCase() + pricing.dayType?.slice(1)}
                    </span>
                    <span className="pricing-card__price">
                      {formatCurrency(pricing.price)}
                      <small>{pricingNote}{bookingType === 'hourly' ? ` · min ${pricing.minHours || minBookingHours}h` : ''}</small>
                    </span>
                  </div>
                ))
              ) : (
                <p className="empty-hint">Pricing unavailable</p>
              )}
            </div>

            <div className="booking-form">
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
                  <span className="est-label">Estimated total</span>
                  <span className="est-value">
                    {priceEstimate ? formatCurrency(priceEstimate.amount) : '—'}
                  </span>
                </div>
                {!priceEstimate && (
                  <p className="est-hint">Select a date and time to see pricing</p>
                )}
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
                  <span className="est-label">Estimated total</span>
                  <span className="est-value">
                    {priceEstimate ? formatCurrency(priceEstimate.amount) : '—'}
                  </span>
                </div>
                {!priceEstimate && (
                  <p className="est-hint">Select booking dates to see pricing</p>
                )}
              </>
            )}
            </div>

            <div className="booking-card__footer">
              <button type="button" className="book-btn" onClick={handleBookNow} disabled={!priceEstimate || isBooking}>
                {isBooking ? 'Booking...' : 'Book Now'}
              </button>
              <ToastBanner message={bookingMessage} type={bookingMessage?.toLowerCase().includes('fail') ? 'error' : 'success'} />
              <span className="muted-note">
                {bookingType === 'hourly'
                  ? `Min. booking: ${minBookingHours} ${minBookingHours === 1 ? 'hour' : 'hours'}`
                  : 'Daily bookings use a date range.'}
              </span>
            </div>
          </div>
        </aside>
      </main>
    </PageTransition>
  )
}

export default VenueDetails
