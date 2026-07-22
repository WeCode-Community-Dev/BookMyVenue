
import { format } from 'date-fns';
import { Clock, Users, MapPin, IndianRupee } from 'lucide-react';
import { STATUS_STYLES } from '../constants/Admin-bookings.contant';
import type { BookingsTableProps } from '../types/bookings/AdminBookings.types';


const BookingsTable = ({ bookings }: BookingsTableProps) => {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-surface/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-semibold text-foreground">Booking</th>
              <th className="px-6 py-4 font-semibold text-foreground">Venue &amp; Owner</th>
              <th className="px-6 py-4 font-semibold text-foreground">Customer</th>
              <th className="px-6 py-4 font-semibold text-foreground">Event Date</th>
              <th className="px-6 py-4 font-semibold text-foreground text-right">Amount</th>
              <th className="px-6 py-4 font-semibold text-foreground text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {bookings.map((booking: any) => {
              const statusClass = STATUS_STYLES[booking.bookingStatus] || STATUS_STYLES.RESERVED;
              const venue = booking.venueInfo;
              const category = booking.categoryInfo;
              const owner = booking.ownerUserInfo;
              const customer = booking.customerInfo;

              return (
                <tr key={booking._id} className="hover:bg-surface/30 transition-colors">
                  {/* Booking Info */}
                  <td className="px-6 py-4">
                    <p className="font-semibold text-foreground">{booking.bookingId}</p>
                    <p className="text-xs text-muted flex items-center gap-1 mt-1">
                      <Clock size={12} />
                      {format(new Date(booking.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </td>

                  {/* Venue & Owner */}
                  <td className="px-6 py-4">
                    <p className="font-semibold text-foreground">{venue?.name || 'Unknown Venue'}</p>
                    <p className="text-xs text-muted flex items-center gap-1 mt-1">
                      <Users size={12} /> {owner?.fullName || 'Unknown Owner'}
                    </p>
                    <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                      <MapPin size={12} /> {category?.name || 'Uncategorized'}
                    </p>
                  </td>

                  {/* Customer */}
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">
                      {customer?.fullName || booking.contactName}
                    </p>
                    <p className="text-xs text-muted mt-1">{booking.contactEmail}</p>
                  </td>

                  {/* Event Date */}
                  <td className="px-6 py-4">
                    <p className="text-foreground">
                      {format(new Date(booking.startDateTime), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-xs text-muted mt-1">{booking.guests} Guests</p>
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4 text-right">
                    <p className="font-semibold text-foreground flex items-center justify-end gap-0.5">
                      <IndianRupee size={13} />
                      {booking.totalAmount?.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-muted mt-1">
                      Paid: ₹{booking.amountPaid?.toLocaleString('en-IN')}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusClass}`}
                    >
                      {booking.bookingStatus}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsTable;