import Modal from "./Modal";
import { Badge } from "@/components/ui/badge";
import { UserCircle } from "lucide-react";

const ViewVendorModal = ({
    isOpen,
    onClose,
    vendor,
}) => {

    if (!vendor) return null;

    return (

        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Vendor Details"
        >

            <div className="space-y-6">

                {/* Profile */}

                <div className="flex items-center gap-4">

                   {vendor.profileImage?.url ? (
    <img
        src={vendor.profileImage.url}
        alt={vendor.fullName}
        className="w-20 h-20 rounded-full object-cover border"
    />
) : (
    <div className="w-20 h-20 rounded-full border bg-gray-100 flex items-center justify-center">
        <UserCircle className="w-12 h-12 text-gray-400" />
    </div>
)}
                    <div>

                        <h2 className="text-xl font-semibold">

                            {vendor.fullName}

                        </h2>

                        <p className="text-gray-500">

                            {vendor.companyName}

                        </p>

                    </div>

                </div>

                {/* Basic Information */}

                <div className="grid grid-cols-2 gap-4">

                    <div>

                        <p className="text-gray-500 text-sm">

                            Email

                        </p>

                        <p>{vendor.email}</p>

                    </div>

                    <div>

                        <p className="text-gray-500 text-sm">

                            Phone

                        </p>

                        <p>{vendor.phone}</p>

                    </div>

                </div>

                {/* Bio */}

                <div>

                    <p className="text-gray-500 text-sm mb-1">

                        Bio

                    </p>

                    <p>

                        {vendor.bio || "-"}

                    </p>

                </div>

                {/* Address */}

                <div>

                    <p className="text-gray-500 text-sm mb-1">

                        Address

                    </p>

                    <p>

                        {vendor.address?.addressLine1}

                    </p>

                    <p>

                        {vendor.address?.city},{" "}
                        {vendor.address?.state}

                    </p>

                    <p>

                        {vendor.address?.pincode}

                    </p>

                </div>

                {/* Status */}

                <div className="grid grid-cols-2 gap-4">

                    <div>

                        <p className="text-gray-500 text-sm mb-1">

                            Approval Status

                        </p>

                        <Badge>

                            {vendor.approvalStatus}

                        </Badge>

                    </div>

                    <div>

                        <p className="text-gray-500 text-sm mb-1">

                            Account Status

                        </p>

                        <Badge
                            variant={
                                vendor.isBlocked
                                    ? "destructive"
                                    : "default"
                            }
                        >

                            {
                                vendor.isBlocked
                                    ? "Blocked"
                                    : "Active"
                            }

                        </Badge>

                    </div>

                </div>

                {/* Joined */}

                <div>

                    <p className="text-gray-500 text-sm">

                        Joined On

                    </p>

                    <p>

                        {new Date(
                            vendor.createdAt
                        ).toLocaleDateString()}

                    </p>

                </div>

                {/* Rejection Reason */}

                {

                    vendor.approvalStatus === "REJECTED" &&
                    vendor.rejectionReason && (

                        <div>

                            <p className="text-red-500 text-sm">

                                Rejection Reason

                            </p>

                            <p>

                                {vendor.rejectionReason}

                            </p>

                        </div>

                    )

                }

            </div>

        </Modal>

    );

};

export default ViewVendorModal;