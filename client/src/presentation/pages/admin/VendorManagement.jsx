import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import PageHeader from "@/presentation/components/admin/common/PageHeader";
import VendorFilters from "@/presentation/components/admin/vendorManagement/VendorFilters";
import VendorTable from "@/presentation/components/admin/vendorManagement/VendorTable";

import Pagination from "@/presentation/components/common/Pagination";

import ViewVendorModal from "@/presentation/components/modal/ViewVendorModal";
import ConfirmationModal from "@/presentation/components/modal/ConfirmationModal";

import useDebounce from "@/hooks/useDebounce";

import {
    getVendors,
    approveVendor,
    rejectVendor,
    updateVendorStatus,
} from "@/redux/slices/AdminvendorSlice"

import RejectReasonModal from "@/presentation/components/modal/RejectReasonModal";

const VendorManagement = () => {

    const dispatch = useDispatch();

    const {
        vendors,
        loading,
        error,
        pagination,
    } = useSelector((state) => state.adminVendor);

    // ===========================
    // States
    // ===========================

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);

    const limit = 10;

    const [activeTab, setActiveTab] = useState("all");

    const [approvalStatus, setApprovalStatus] = useState(undefined);

    const [isBlocked, setIsBlocked] = useState(undefined);
    //rejectmodal
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");

    
    // ===========================
    // Debounce
    // ===========================

    const debouncedSearch = useDebounce(search, 500);

    // ===========================
    // View Modal
    // ===========================

    const [selectedVendor, setSelectedVendor] = useState(null);

    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    // ===========================
    // Confirmation Modal
    // ===========================

    const [isConfirmationOpen, setIsConfirmationOpen] =
        useState(false);

    const [actionType, setActionType] =
        useState(null);

    // ===========================
    // Fetch Vendors
    // ===========================

    useEffect(() => {

        dispatch(

            getVendors({

                search: debouncedSearch,

                approvalStatus,

                isBlocked,

                page,

                limit,

            })

        );

    }, [

        dispatch,

        debouncedSearch,

        approvalStatus,

        isBlocked,

        page,

    ]);

    // ===========================
    // Handlers
    // ===========================

    const handleView = (vendor) => {

        setSelectedVendor(vendor);

        setIsViewModalOpen(true);

    };

    const handleApprove = (vendor) => {

        setSelectedVendor(vendor);

        setActionType("approve");

        setIsConfirmationOpen(true);

    };

    const handleReject = (vendor) => {

        setSelectedVendor(vendor);

        setActionType("reject");
        setRejectionReason("");

        setIsConfirmationOpen(true);

    };

    const handleBlock = (vendor) => {

        setSelectedVendor(vendor);

        setActionType("block");

        setIsConfirmationOpen(true);

    };

    const handleUnblock = (vendor) => {
console.log("seleVen",selectedVendor);
        setSelectedVendor(vendor);

        setActionType("unblock");

        setIsConfirmationOpen(true);

    };
        // ===========================
    // Confirm Action
    // ===========================

    const handleConfirm = async () => {

        switch (actionType) {

            case "approve":

                await dispatch(
                    approveVendor(selectedVendor.id)
                );

                break;

            case "reject":
               setIsConfirmationOpen(false);
               setIsRejectModalOpen(true);
                return;
              

            case "block":

                await dispatch(
                    updateVendorStatus({
                        vendorId: selectedVendor.id,
                        isBlocked: true,
                    })
                );

                break;

            case "unblock":

                await dispatch(
                    updateVendorStatus({
                        
                        vendorId: selectedVendor.id,
                        isBlocked: false,
                    })
                );

                break;

            default:

                break;

        }

        setIsConfirmationOpen(false);

        dispatch(

            getVendors({

                search: debouncedSearch,

                approvalStatus,

                isBlocked,

                page,

                limit,

            })

        );


    };
const handleRejectSubmit = async (reason) => {

    await dispatch(
        rejectVendor({
            vendorId: selectedVendor.id,
            rejectionReason: reason,
        })
    );

    setIsRejectModalOpen(false);

    dispatch(
        getVendors({
            search: debouncedSearch,
            approvalStatus,
            isBlocked,
            page,
            limit,
        })
    );
};
    console.log("curr click",activeTab)
        return (

        <div>

            <PageHeader

                title="Vendor Management"

                subtitle="Manage platform vendors"

            />

            <VendorFilters

                search={search}

                onSearchChange={(e) =>
                    setSearch(e.target.value)
                }

                status={activeTab}

                onStatusChange={(value) => {

                    setPage(1);

                    setActiveTab(value);

                    switch (value) {

                        case "all":

                            setApprovalStatus(undefined);
                            setIsBlocked(undefined);

                            break;

                        case "pending":

                            setApprovalStatus("PENDING");
                            setIsBlocked(false);

                            break;

                        case "approved":

                            setApprovalStatus("APPROVED");
                            setIsBlocked(false);

                            break;

                        case "rejected":

                            setApprovalStatus("REJECTED");
                            setIsBlocked(false);

                            break;

                        case "blocked":

                            setApprovalStatus("APPROVED");
                            setIsBlocked(true);

                            break;

                        default:

                            break;

                    }

                }}

            />

            {

                loading ? (

                    <div className="text-center py-10">

                        Loading...

                    </div>

                ) : error ? (

                    <div className="text-center py-10 text-red-500">

                        {error}

                    </div>

                ) : (

                    <>

                        <VendorTable

                            vendors={vendors}

                            onView={handleView}

                            onApprove={handleApprove}

                            onReject={handleReject}

                            onBlock={handleBlock}

                            onUnblock={handleUnblock}

                        />

                        <div className="mt-6">

                            <Pagination

                                currentPage={page}

                                totalPages={pagination.totalPages}

                                onPageChange={setPage}

                            />

                        </div>

                    </>

                )

            }
                        {/* View Vendor Modal */}

            <ViewVendorModal

                isOpen={isViewModalOpen}

                onClose={() => setIsViewModalOpen(false)}

                vendor={selectedVendor}

            />

            {/* Confirmation Modal */}

            <ConfirmationModal

                isOpen={isConfirmationOpen}

                onClose={() => setIsConfirmationOpen(false)}

                onConfirm={handleConfirm}

                title={
                    actionType === "approve"
                        ? "Approve Vendor"
                        : actionType === "reject"
                        ? "Reject Vendor"
                        : actionType === "block"
                        ? "Block Vendor"
                        : "Unblock Vendor"
                }

                message={
                    actionType === "approve"
                        ? "Are you sure you want to approve this vendor?"
                        : actionType === "reject"
                        ? "Are you sure you want to reject this vendor?"
                        : actionType === "block"
                        ? "Are you sure you want to block this vendor?"
                        : "Are you sure you want to unblock this vendor?"
                }

                confirmText={
                    actionType === "approve"
                        ? "Approve"
                        : actionType === "reject"
                        ? "Reject"
                        : actionType === "block"
                        ? "Block"
                        : "Unblock"
                }

                confirmVariant={
                    actionType === "approve"
                        ? "default"
                        : actionType === "reject"
                        ? "destructive"
                        : actionType === "block"
                        ? "destructive"
                        : "secondary"
                }

            />
            <RejectReasonModal
    isOpen={isRejectModalOpen}
    onClose={() => {
        setIsRejectModalOpen(false);
        setRejectionReason("");
    }}
    reason={rejectionReason}
    onReasonChange={(e) =>
        setRejectionReason(e.target.value)
    }
    onSubmit={handleRejectSubmit}
/>

        </div>
        

    );

};

export default VendorManagement;