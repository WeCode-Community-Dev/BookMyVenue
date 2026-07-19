import { Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
    TableCell,
    TableRow,
} from "@/components/ui/table";

const PaymentTableRow = ({
    payment,
    onView,
}) => {

    const paymentStatusClass = {

        pending: "bg-yellow-100 text-yellow-700",

        success: "bg-green-100 text-green-700",

        failed: "bg-red-100 text-red-700",

        refunded: "bg-purple-100 text-purple-700",

    };

    const paymentTypeClass = {

        advance: "bg-blue-100 text-blue-700",

        balance: "bg-orange-100 text-orange-700",

        full: "bg-purple-100 text-purple-700",

    };

    return (

        <TableRow>

            {/* Payment ID */}

            <TableCell>

                {payment._id?.slice(-6)}

            </TableCell>

            {/* Booking ID */}

            <TableCell>

                {payment.bookingId?._id?.slice(-6) || "-"}

            </TableCell>

            {/* User */}

            <TableCell>

                {payment.userId?.fullName || "-"}

            </TableCell>

            {/* Vendor */}

            <TableCell>

                {payment.vendorId?.fullName ||
                    payment.vendorId?.companyName ||
                    "-"}

            </TableCell>

            {/* Amount */}

            <TableCell>

                ₹{payment.amount?.toLocaleString()}

            </TableCell>

            {/* Payment Type */}

            <TableCell>

                <Badge
                    className={
                        paymentTypeClass[
                            payment.paymentType
                        ]
                    }
                >

                    {payment.paymentType}

                </Badge>

            </TableCell>

            {/* Payment Status */}

            <TableCell>

                <Badge
                    className={
                        paymentStatusClass[
                            payment.paymentStatus
                        ]
                    }
                >

                    {payment.paymentStatus}

                </Badge>

            </TableCell>

            {/* Date */}

            <TableCell>

                {new Date(
                    payment.createdAt
                ).toLocaleDateString()}

            </TableCell>

            {/* Actions */}

            <TableCell>

                <div className="flex justify-center">

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView(payment)}
                    >

                        <Eye className="w-4 h-4 mr-1" />

                        View

                    </Button>

                </div>

            </TableCell>

        </TableRow>

    );

};

export default PaymentTableRow;