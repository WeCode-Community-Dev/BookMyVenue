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

const VendorTableRow = ({
    vendor,
    onView,
    onApprove,
    onReject,
    onBlock,
    onUnblock,
}) => {
    
    const isBlocked = vendor.isBlocked;

    const approvalStatus = vendor.approvalStatus;

    // Display Status
    let displayStatus = "";

    if (isBlocked) {

        displayStatus = "Blocked";

    } else {

        displayStatus =
            approvalStatus.charAt(0) +
            approvalStatus.slice(1).toLowerCase();

    }

    // Badge Variant
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

            {/* Vendor ID */}

            <TableCell>

                {vendor.id.slice(-6)}

            </TableCell>

            {/* Company */}

            <TableCell>

                {vendor.companyName}

            </TableCell>

            {/* Owner */}

            <TableCell>

                {vendor.fullName}

            </TableCell>

            {/* Email */}

            <TableCell>

                {vendor.email}

            </TableCell>

            {/* Phone */}

            <TableCell>

                {vendor.phone}

            </TableCell>

            {/* Status */}

            <TableCell>

                <Badge
                    className={
                        isBlocked
                            ? "bg-red-600 text-white"
                            : approvalStatus === "APPROVED"
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
                        onClick={() => onView(vendor)}
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
                                    onClick={() => onApprove(vendor)}
                                >

                                    <CheckCircle className="w-4 h-4 mr-1" />

                                    Approve

                                </Button>

                                <Button
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    size="sm"
                                    onClick={() => onReject(vendor)}
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
                        approvalStatus === "APPROVED" && (

                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => onBlock(vendor)}
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
                                onClick={() => onUnblock(vendor)}
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

export default VendorTableRow;