import React from 'react'
import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from '@/components/ui/table'

const RecentBookings = ({ bookings = [] }) => {
  return (
    <div>
      <h2 className='text-lg font-semibold mb-4'>Recent Bookings</h2>
      {bookings.length === 0 ? (
        <p className='text-sm text-gray-500'>No recent bookings yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.bookingId || booking._id}>
                <TableCell>{booking.customer || '-'}</TableCell>
                <TableCell>{booking.venue || '-'}</TableCell>
                <TableCell>{booking.status || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

export default RecentBookings