import React from 'react'

const TopVenues = ({ venues = [] }) => {
  return (
    <div>
      <h2 className='text-lg font-semibold mb-4'>Top Venues</h2>

      {venues.length === 0 ? (
        <p className='text-sm text-gray-500'>No venue activity yet.</p>
      ) : (
        <ul className='list-disc pl-6 space-y-2'>
          {venues.map((venue) => (
            <li key={venue.venueId || venue._id}>
              {venue.name} ({venue.bookings} bookings)
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TopVenues
