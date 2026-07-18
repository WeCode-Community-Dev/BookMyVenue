import { Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
    TableCell,
    TableRow,
} from "@/components/ui/table";

const BookingTableRow = ({
    booking,
    onView,
}) => {

    const bookingStatus = booking.status;

    const paymentStatus = booking.paymentStatus;

    const bookingStatusClass = {

        pending: "bg-yellow-100 text-yellow-700",

        confirmed: "bg-green-100 text-green-700",

        cancelled: "bg-red-100 text-red-700",

        completed: "bg-blue-100 text-blue-700",

    };

    const paymentStatusClass = {

        pending: "bg-yellow-100 text-yellow-700",

        partial: "bg-orange-100 text-orange-700",

        paid: "bg-green-100 text-green-700",

        refunded: "bg-purple-100 text-purple-700",

        failed: "bg-red-100 text-red-700",

        success: "bg-green-100 text-green-700",

    };

    return (

        <TableRow>

            {/* Booking ID */}

            <TableCell>

                {booking._id?.slice(-6)}

            </TableCell>

            {/* User */}

            <TableCell>

                {booking.user?.fullName || "-"}

            </TableCell>

            {/* Venue */}

            <TableCell>

                {booking.venue?.name || "-"}

            </TableCell>

            {/* Vendor */}

            <TableCell>

                {
                    booking.vendor?.fullName ||
                    "-"}

            </TableCell>

            {/* Booking Date */}

            <TableCell>

                {new Date(
                    booking.bookingDate
                ).toLocaleDateString()}

            </TableCell>

            {/* Total Amount */}

            <TableCell>

                ₹{booking.totalAmount?.toLocaleString()}

            </TableCell>

            {/* Booking Status */}

            <TableCell>

                <Badge
                    className={
                        bookingStatusClass[
                            bookingStatus
                        ]
                    }
                >

                    {bookingStatus}

                </Badge>

            </TableCell>

            {/* Payment Status */}

            <TableCell>

                <Badge
                    className={
                        paymentStatusClass[
                            paymentStatus
                        ]
                    }
                >

                    {paymentStatus}

                </Badge>

            </TableCell>

            {/* Actions */}

            <TableCell>

                <div className="flex justify-center">

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView(booking)}
                    >

                        <Eye className="w-4 h-4 mr-1" />

                        View

                    </Button>

                </div>

            </TableCell>

        </TableRow>

    );

};

export default BookingTableRow;