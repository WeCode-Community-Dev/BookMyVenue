import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import BookingTableRow from "./BookingTableRow";

const BookingTable = ({
    bookings,
    onView,
}) => {

    return (

        <div className="rounded-lg border bg-white">

            <Table>

                <TableHeader>

                    <TableRow>

                        <TableHead>Booking ID</TableHead>

                        <TableHead>User</TableHead>

                        <TableHead>Venue</TableHead>

                        <TableHead>Vendor</TableHead>

                        <TableHead>Event Date</TableHead>

                        <TableHead>Total</TableHead>

                        <TableHead>Status</TableHead>

                        <TableHead>Payment</TableHead>

                        <TableHead className="text-center">
                            Actions
                        </TableHead>

                    </TableRow>

                </TableHeader>

                <TableBody>

                    {bookings?.length > 0 ? (

                        bookings.map((booking) => (

                            <BookingTableRow
                                key={booking._id}
                                booking={booking}
                                onView={onView}
                            />

                        ))

                    ) : (

                        <TableRow>

                            <td
                                colSpan={9}
                                className="py-10 text-center text-gray-500"
                            >
                                No bookings found
                            </td>

                        </TableRow>

                    )}

                </TableBody>

            </Table>

        </div>

    );

};

export default BookingTable;