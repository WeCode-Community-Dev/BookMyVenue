const TopVenues = ({ venues = [] }) => {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">
        Top Venues
      </h2>

      {venues.length === 0 ? (
        <p className="text-sm text-gray-500">
          No venue activity yet.
        </p>
      ) : (
        <ul className="list-disc space-y-2 pl-6">
          {venues.map((venue) => (
            <li key={venue.venueId || venue._id}>
              {venue.name} ({venue.bookings} bookings)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopVenues;