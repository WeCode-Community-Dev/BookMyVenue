import {
    Eye,
    CheckCircle,
    XCircle,
    Ban,
    ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
    TableCell,
    TableRow,
} from "@/components/ui/table";

const VenueTableRow = ({
    venue,
    onView,
    onApprove,
    onReject,
    onBlock,
    onUnblock,
}) => {

    const isBlocked = venue.isBlocked;

    const approvalStatus = venue.approvalStatus;

    // Display Status
    let displayStatus = "";

    if (isBlocked) {

        displayStatus = "Blocked";

    } else {

        displayStatus =
            approvalStatus.charAt(0) +
            approvalStatus.slice(1).toLowerCase();

    }

    //Badge Variant
    let badgeVariant = "secondary";

    if (isBlocked) {

        badgeVariant = "destructive";

    } else if (approvalStatus === "APPROVED") {

        badgeVariant = "default";

    } else if (approvalStatus === "REJECTED") {

        badgeVariant = "outline";

    }

    return (

        <TableRow>

            {/* Venue ID */}

            <TableCell>

                {venue.id.slice(-6)}

            </TableCell>

            {/* name */}

            <TableCell>

                {venue.name}

            </TableCell>

            {/* category */}

            <TableCell>

                {venue.category}

            </TableCell>

            {/* Address */}

            <TableCell>

                {venue.address?.city}

            </TableCell>

            {/* Price */}

            <TableCell>

                ₹{venue.pricePerDay.toLocaleString()}

            </TableCell>

            {/* Status */}

            <TableCell>

                <Badge
                    className={
                        isBlocked
                            ? "bg-red-600 text-white"
                            : approvalStatus === "ACTIVE"
                                ? "bg-green-600 text-white"
                                : approvalStatus === "REJECTED"
                                    ? "bg-red-100 text-red-700 border border-red-300"
                                    : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                    }
                >
                    {displayStatus}
                </Badge>

            </TableCell>

            {/* Actions */}

            <TableCell>

                <div className="flex justify-center gap-2 flex-wrap">

                    {/* View */}

                    <Button
                        variant="outline"
                        size="sm"
                       onClick={() => onView(venue)}
                    >

                        <Eye className="w-4 h-4 mr-1" />

                        View

                    </Button>

                    {/* Pending */}

                    {
                        !isBlocked &&
                        approvalStatus === "PENDING" && (

                            <>
                                <Button
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    size="sm"
                                    onClick={() => onApprove(venue)}
                                >

                                    <CheckCircle className="w-4 h-4 mr-1" />

                                    Approve

                                </Button>

                                <Button
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    size="sm"
                                    onClick={() => onReject(venue)}
                                >

                                    <XCircle className="w-4 h-4 mr-1" />

                                    Reject

                                </Button>

                            </>

                        )
                    }

                    {/* Approved */}

                    {
                        !isBlocked &&
                        approvalStatus === "ACTIVE" && (

                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => onBlock(venue)}
                            >

                                <Ban className="w-4 h-4 mr-1" />

                                Block

                            </Button>

                        )
                    }

                    {/* Blocked */}

                    {
                        isBlocked && (

                            <Button
                                className="bg-green-600 hover:bg-green-700 text-white"
                                size="sm"
                                onClick={() => onUnblock(venue)}
                            >

                                <ShieldCheck className="w-4 h-4 mr-1" />

                                Unblock

                            </Button>

                        )
                    }

                </div>

            </TableCell>

        </TableRow>

    );

};

export default VenueTableRow;