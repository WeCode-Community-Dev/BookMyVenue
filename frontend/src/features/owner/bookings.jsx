import React from 'react';

const MOCK_BOOKINGS = [
  { id: 'B101', venue: 'The Grand Ballroom', customer: 'Alice Johnson', date: '2026-06-12', time: '18:00 - 22:00', status: 'Confirmed', amount: '$1,200' },
  { id: 'B102', venue: 'Rustic Barn', customer: 'Robert Smith', date: '2026-06-14', time: '10:00 - 16:00', status: 'Pending', amount: '$850' },
  { id: 'B103', venue: 'The Draft', customer: 'Carol White', date: '2026-06-18', time: '09:00 - 13:00', status: 'Confirmed', amount: '$600' },
  { id: 'B104', venue: 'The Grand Ballroom', customer: 'David Brown', date: '2026-06-20', time: '14:00 - 19:00', status: 'Cancelled', amount: '$1,200' },
];

function OwnerBookings() {
  return (
    <div className="bookings-container">
      <div className="bookings-header-row">
        <h1 className="bookings-title">Bookings Manager</h1>
      </div>

      <div className="bookings-table-wrapper">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Venue</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_BOOKINGS.map((booking) => (
              <tr key={booking.id}>
                <td className="booking-id">{booking.id}</td>
                <td className="booking-venue">{booking.venue}</td>
                <td>{booking.customer}</td>
                <td>{booking.date}</td>
                <td>{booking.time}</td>
                <td>
                  <span className={`status-pill status-${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="booking-amount">{booking.amount}</td>
                <td>
                  <button className="table-action-btn">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OwnerBookings;
