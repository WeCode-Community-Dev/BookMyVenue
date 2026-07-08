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
console.log("vendor44",vendor)
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

                <Badge variant={badgeVariant}>

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
                                    variant="default"
                                    size="sm"
                                    onClick={() => onApprove(vendor)}
                                >

                                    <CheckCircle className="w-4 h-4 mr-1" />

                                    Approve

                                </Button>

                                <Button
                                    variant="destructive"
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
                                variant="default"
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