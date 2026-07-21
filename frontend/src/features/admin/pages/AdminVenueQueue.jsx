import { toast } from 'react-hot-toast'
import {
  useGetPendingVenuesQuery,
  useApproveVenueMutation,
  useRejectVenueMutation,
} from '../api/adminApi.js'
import './AdminVenueQueue.scss'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useGetVenueDetailsQuery } from '../../owner/ownerApi.js'

function AdminVenueQueue() {
  const { data, isLoading, isError } = useGetPendingVenuesQuery()
  const [approveVenue, { isLoading: isApproving }] = useApproveVenueMutation()
  const [rejectVenue, { isLoading: isRejecting }] = useRejectVenueMutation()

    const [selectedVenueId, setSelectedVenueId] = useState(null)

  const { data: venueDetailData, isLoading: venueIsLoading } = useGetVenueDetailsQuery(selectedVenueId, {
  skip: !selectedVenueId  
})

  const navigate = useNavigate();

  const pendingVenues = data?.data ?? []

  const handleApprove = async (venueId) => {

    try {
      await approveVenue(venueId).unwrap()
      toast.success('Venue approved successfully.')
    } catch (error) {
      console.error('Approve failed', error)
      toast.error('Unable to approve the venue. Please try again.')
    }
  }

  const handleReject = async (venueId) => {
    const reason = window.prompt('Enter reason for rejection')
    if (reason === null) return
    if (!reason.trim()) {
      toast.error('Rejection reason is required.')
      return
    }

    try {
      await rejectVenue({ venueId, reason }).unwrap()
      toast.success('Venue rejected successfully.')
    } catch (error) {
      console.error('Reject failed', error)
      toast.error('Unable to reject the venue. Please try again.')
    }
  }

  const viewDetails = async (venueId) => {
       setSelectedVenueId(venueId)

  }


function VenueDetailModal({ venue, onClose, onApprove, onReject, isApproving, isRejecting }) {
  if (!venue) return (
    <div className="modal-overlay">
      <div className="modal">
        <p>Loading...</p>
      </div>
    </div>
  )

  const primaryImage = venue.images?.find(img => img.isPrimary) || venue.images?.[0]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        
        <div className="modal__header">
          <h2>{venue.name}</h2>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="modal__body">

          {/* Images */}
          {venue.images?.length > 0 && (
            <div className="modal__images">
              {venue.images.map((img, i) => (
                <div key={i} className={`modal__image-wrap ${img.isPrimary ? 'modal__image-wrap--primary' : ''}`}>
                  <img src={img.url} alt="venue" />
                  {img.isPrimary && <span className="modal__primary-badge">Primary</span>}
                </div>
              ))}
            </div>
          )}

          {/* Basic Info */}
          <div className="modal__section">
            <h3>Basic Info</h3>
            <div className="modal__grid">
              <div><span>Type</span><strong>{venue.type}</strong></div>
              <div><span>Capacity</span><strong>{venue.capacity} people</strong></div>
              <div><span>Booking Type</span><strong>{venue.bookingType}</strong></div>
              <div><span>Status</span><strong>{venue.approvalStatus}</strong></div>
            </div>
          </div>

          {/* Location */}
          <div className="modal__section">
            <h3>Location</h3>
            <p>{venue.address}, {venue.city}, {venue.state} — {venue.pincode}</p>
          </div>

          {/* Description */}
          <div className="modal__section">
            <h3>Description</h3>
            <p>{venue.description}</p>
          </div>

          {/* Availability */}
          <div className="modal__section">
            <h3>Availability</h3>
            <div className="modal__grid">
              <div><span>Open Days</span><strong>{venue.openDays?.join(', ')}</strong></div>
              <div><span>Hours</span><strong>{venue.openTime} – {venue.closeTime}</strong></div>
              <div><span>Min Booking</span><strong>{venue.minBookingHours} hrs</strong></div>
            </div>
          </div>

          {/* Pricing */}
          {venue.pricing?.length > 0 && (
            <div className="modal__section">
              <h3>Pricing</h3>
              <div className="modal__pricing">
                {venue.pricing.map(rule => (
                  <div key={rule.id} className="modal__pricing-row">
                    <span>{rule.dayType}</span>
                    <span>₹{rule.price}/hr</span>
                    <span>Min {rule.minHours} hrs</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Amenities */}
          {venue.venueAmenities?.length > 0 && (
            <div className="modal__section">
              <h3>Amenities</h3>
              <div className="modal__amenities">
                {venue.venueAmenities.map(a => (
                  <span key={a.amenityId} className="modal__amenity-tag">
                    <i className={`ti ${a.amenity.icon}`} /> {a.amenity.name}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        <div className="modal__footer">
          <button
            className="admin-venue-queue__button admin-venue-queue__button--reject"
            onClick={onReject}
            disabled={isApproving || isRejecting}
          >
            {isRejecting ? 'Rejecting...' : 'Reject'}
          </button>
          <button
            className="admin-venue-queue__button admin-venue-queue__button--approve"
            onClick={onApprove}
            disabled={isApproving || isRejecting}
          >
            {isApproving ? 'Approving...' : 'Approve'}
          </button>
        </div>

      </div>
    </div>
  )
}

  


  return (
  
    <div className="admin-venue-queue">
      {selectedVenueId && (
  <VenueDetailModal
    venue={venueDetailData?.data}
    onClose={() => setSelectedVenueId(null)}
    onApprove={() => handleApprove(selectedVenueId)}
    onReject={() => handleReject(selectedVenueId)}
    isApproving={isApproving}
    isRejecting={isRejecting}
  />
)}
      <header className="admin-venue-queue__header">
        <h1>Venue Approvals</h1>
        <p>Review all pending venue submissions and approve or reject them from one place.</p>
      </header>

      {isLoading ? (
        <p>Loading pending venues...</p>
      ) : isError ? (
        <p>Unable to load pending venues. Refresh your browser and try again.</p>
      ) : pendingVenues.length === 0 ? (
        <p className="admin-venue-queue__empty">There are no pending venue approvals right now.</p>
      ) : (
        <div className="admin-venue-queue__list">
          <div className="admin-venue-queue__row admin-venue-queue__row--head">
            <span>Venue</span>
            <span>Owner</span>
            <span>City</span>
            <span>Submitted</span>
            <span>Actions</span>
          </div>

          {pendingVenues.map((venue) => (
            <div onClick={() => viewDetails(venue.id)} key={venue.id} className="admin-venue-queue__row">
              <span className="admin-venue-queue__venue-name">{venue.name}</span>
              <span>{venue.owner?.username || venue.owner?.email || '—'}</span>
              <span>{venue.city}</span>
              <span>{new Date(venue.createdAt).toLocaleDateString()}</span>
              <span className="admin-venue-queue__actions">
                <button
                  type="button"
                  className="admin-venue-queue__button admin-venue-queue__button--approve"
                 onClick={(e) => { e.stopPropagation(); handleApprove(venue.id) }}
                  disabled={isApproving || isRejecting}
                >
                  Approve
                </button>
                <button
                  type="button"
                  className="admin-venue-queue__button admin-venue-queue__button--reject"
                  onClick={(e) => { e.stopPropagation(); handleReject(venue.id) }}
                  disabled={isApproving || isRejecting}
                >
                  Reject
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminVenueQueue