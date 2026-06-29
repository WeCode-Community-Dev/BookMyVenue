import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { FiSearch, FiUsers, FiX } from 'react-icons/fi'
import {
  useGetAdminVenuesQuery,
  useDeactivateVenueMutation,
  useActivateVenueMutation,
} from '../api/adminApi.js'
import './AdminActiveVenues.scss'

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&h=400&q=80'

function getVenueImage(venue) {
  const primary = venue.images?.find((img) => img.isPrimary) || venue.images?.[0]
  return primary?.url || venue.image || PLACEHOLDER_IMAGE
}

function formatApprovalStatus(status) {
  if (!status) return 'Unknown'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function AdminActiveVenues() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(9)
  const [togglingId, setTogglingId] = useState(null)
  const [activeOverrides, setActiveOverrides] = useState({})

  const { data, isLoading, isError, isFetching } = useGetAdminVenuesQuery({
    page,
    pageSize,
    search: search.trim() || undefined,
  })

  const [deactivateVenue] = useDeactivateVenueMutation()
  const [activateVenue] = useActivateVenueMutation()

  const venues = data?.data ?? []
  const meta = data?.meta ?? { total: 0, page: 1, pageSize: 9 }
  const totalPages = Math.max(1, Math.ceil(meta.total / meta.pageSize))

  useEffect(() => {
    if (!isFetching) {
      setActiveOverrides({})
    }
  }, [data, isFetching])

  const handleSearchChange = (value) => {
    setSearch(value)
    setPage(1)
  }

  const getIsActive = (venue) => {
    if (activeOverrides[venue.id] !== undefined) {
      return activeOverrides[venue.id]
    }
    return !!venue.isActive
  }

  const canToggleListing = (venue) => venue.approvalStatus === 'approved'

  const handleToggleActive = async (venue) => {
    if (!canToggleListing(venue)) {
      toast.error('Only approved venues can be activated or deactivated.')
      return
    }

    const isActive = getIsActive(venue)
    const nextActive = !isActive

    if (isActive) {
      const confirmed = window.confirm(
        'Deactivate this venue? It will be hidden from users until reactivated.'
      )
      if (!confirmed) return
    }

    setActiveOverrides((prev) => ({ ...prev, [venue.id]: nextActive }))
    setTogglingId(venue.id)

    try {
      if (isActive) {
        await deactivateVenue(venue.id).unwrap()
        toast.success('Venue deactivated.')
      } else {
        await activateVenue(venue.id).unwrap()
        toast.success('Venue activated.')
      }
    } catch (error) {
      setActiveOverrides((prev) => {
        const next = { ...prev }
        delete next[venue.id]
        return next
      })
      console.error('Toggle failed', error)
      toast.error('Unable to update venue status. Please try again.')
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <div className="admin-active-venues">
      <header className="admin-active-venues__header">
        <h1>All Venues</h1>
        <p>
          Every venue in the system. Use the toggle on approved listings to activate or deactivate them for users.
        </p>
      </header>

      <div className="admin-active-venues__toolbar">
        <div className="admin-active-venues__search">
          <FiSearch className="admin-active-venues__search-icon" aria-hidden />
          <input
            type="text"
            placeholder="Search by venue name or city…"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="admin-active-venues__search-clear"
              onClick={() => handleSearchChange('')}
              aria-label="Clear search"
            >
              <FiX />
            </button>
          )}
        </div>
        <span className="admin-active-venues__count">
          {meta.total} venue{meta.total !== 1 ? 's' : ''} found
        </span>
      </div>

      {isLoading ? (
        <p>Loading venues...</p>
      ) : isError ? (
        <p>Unable to load venues. Refresh your browser and try again.</p>
      ) : venues.length === 0 ? (
        <p className="admin-active-venues__empty">
          {search.trim() ? 'No venues match your search.' : 'There are no venues yet.'}
        </p>
      ) : (
        <>
          <div className="admin-active-venues__grid">
            {venues.map((venue) => {
              const pricePerHour = venue.pricing?.[0]?.price
              const isActive = getIsActive(venue)
              const isApproved = venue.approvalStatus === 'approved'
              const isSaving = togglingId === venue.id
              const toggleDisabled = isSaving || !isApproved

              return (
                <article
                  key={venue.id}
                  className={`admin-active-venues__card ${!isActive && isApproved ? 'admin-active-venues__card--inactive' : ''}`}
                >
                  <div className="admin-active-venues__image-wrap">
                    <img src={getVenueImage(venue)} alt={venue.name} />
                    {isApproved && !isActive && (
                      <span className="admin-active-venues__status-badge admin-active-venues__status-badge--inactive">
                        Inactive
                      </span>
                    )}
                    {isApproved && isActive && (
                      <span className="admin-active-venues__status-badge admin-active-venues__status-badge--active">
                        Active
                      </span>
                    )}
                    {!isApproved && (
                      <span className="admin-active-venues__status-badge">
                        {formatApprovalStatus(venue.approvalStatus)}
                      </span>
                    )}
                    <span className="admin-active-venues__type-badge">{venue.type}</span>
                  </div>

                  <div className="admin-active-venues__body">
                    <h2 className="admin-active-venues__name">{venue.name}</h2>
                    <p className="admin-active-venues__location">{venue.city}</p>

                    <div className="admin-active-venues__meta">
                      <span>
                        <FiUsers size={13} aria-hidden />
                        {venue.capacity} guests
                      </span>
                      <span>
                        {pricePerHour != null
                          ? `₹${Number(pricePerHour).toLocaleString()}/hr`
                          : 'Price N/A'}
                      </span>
                    </div>

                    <div className="admin-active-venues__footer">
                      <div className="admin-active-venues__toggle-text">
                        <strong>
                          {isApproved
                            ? (isActive ? 'Active' : 'Inactive')
                            : formatApprovalStatus(venue.approvalStatus)}
                        </strong>
                        <span>
                          {isApproved
                            ? (isActive ? 'Visible to users' : 'Hidden from users')
                            : 'Approve first to manage listing status'}
                        </span>
                      </div>
                      <label
                        className={`admin-active-venues__switch ${toggleDisabled ? 'admin-active-venues__switch--disabled' : ''}`}
                        title={
                          isApproved
                            ? (isActive ? 'Deactivate venue' : 'Activate venue')
                            : 'Only approved venues can be toggled'
                        }
                      >
                        <input
                          type="checkbox"
                          checked={isApproved ? isActive : false}
                          disabled={toggleDisabled}
                          onChange={() => handleToggleActive(venue)}
                        />
                        <span className="admin-active-venues__slider" />
                      </label>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          {totalPages > 1 && (
            <div className="admin-active-venues__pagination">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <span>
                Page {meta.page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AdminActiveVenues
