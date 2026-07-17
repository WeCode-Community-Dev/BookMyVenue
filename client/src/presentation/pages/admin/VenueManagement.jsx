import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import PageHeader from "@/presentation/components/admin/common/PageHeader";
import VenueFilters from "@/presentation/components/admin/venueManagement/VenueFilters";
import VenueTable from "@/presentation/components/admin/venueManagement/VenueTable";

import Pagination from "@/presentation/components/common/Pagination";
import ConfirmationModal from "@/presentation/components/modal/ConfirmationModal";
import RejectReasonModal from "@/presentation/components/modal/RejectReasonModal";

import useDebounce from "@/hooks/useDebounce";

import {
    getVenues,
    approveVenue,
    rejectVenue,
    updateVenueStatus,
} from "@/redux/slices/AdminVenueSlice";
console.log("getVenues =", getVenues);

const VenueManagement = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const {

        venues,

        loading,

        error,

        pagination,

    } = useSelector(
        (state) => state.adminVenue
    );

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);

    const limit = 10;

    const [activeTab, setActiveTab] = useState("all");

    const [category, setCategory] = useState("");

    const [approvalStatus, setApprovalStatus] =
        useState(undefined);

    const [isBlocked, setIsBlocked] =
        useState(undefined);

    const [selectedVenue, setSelectedVenue] =
        useState(null);

    const [actionType, setActionType] =
        useState(null);

    const [isConfirmationOpen, setIsConfirmationOpen] =
        useState(false);

    const [isRejectModalOpen, setIsRejectModalOpen] =
        useState(false);

            const debouncedSearch =
        useDebounce(search, 500);

            useEffect(() => {
console.log("useEffect executed");
        dispatch(

            getVenues({

                search: debouncedSearch,

                category,

                approvalStatus,

                isBlocked,

                page,

                limit,

            })

        );

    }, [

        dispatch,

        debouncedSearch,

        category,

        approvalStatus,

        isBlocked,

        page,

    ]);

    const handleView = (venue) => {

    navigate(`/admin/venues/${venue.id}`);

};

const handleApprove = (venue) => {

    setSelectedVenue(venue);

    setActionType("approve");

    setIsConfirmationOpen(true);

};

const handleReject = (venue) => {

    setSelectedVenue(venue);

    setActionType("reject");

    setIsConfirmationOpen(true);

};

const handleBlock = (venue) => {

    setSelectedVenue(venue);

    setActionType("block");

    setIsConfirmationOpen(true);

};

const handleUnblock = (venue) => {

    setSelectedVenue(venue);

    setActionType("unblock");

    setIsConfirmationOpen(true);

};

const handleConfirm = async () => {

    switch (actionType) {

        case "approve":

            await dispatch(
                approveVenue(selectedVenue.id)
            );

            break;

        case "reject":

            setIsConfirmationOpen(false);

            setIsRejectModalOpen(true);

            return;

        case "block":

            await dispatch(
                updateVenueStatus({
                    venueId: selectedVenue.id,
                    isBlocked: true,
                })
            );

            break;

        case "unblock":

            await dispatch(
                updateVenueStatus({
                    venueId: selectedVenue.id,
                    isBlocked: false,
                })
            );

            break;

        default:

            break;
    }

    setIsConfirmationOpen(false);

    dispatch(
        getVenues({
            search: debouncedSearch,
            category,
            approvalStatus,
            isBlocked,
            page,
            limit,
        })
    );
};

const handleRejectSubmit = async (reason) => {

    await dispatch(

        rejectVenue({

            venueId: selectedVenue.id,

            rejectionReason: reason,

        })

    );

    setIsRejectModalOpen(false);

    dispatch(

        getVenues({

            search: debouncedSearch,

            category,

            approvalStatus,

            isBlocked,

            page,

            limit,

        })

    );

};
return (

    <div>

        <PageHeader
            title="Venue Management"
            subtitle="Manage platform venues"
        />

        <VenueFilters
            search={search}
            onSearchChange={(e) => setSearch(e.target.value)}
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

                        setApprovalStatus("ACTIVE");
                        setIsBlocked(false);

                        break;

                    case "rejected":

                        setApprovalStatus("REJECTED");
                        setIsBlocked(false);

                        break;

                    case "blocked":

                        setApprovalStatus("ACTIVE");
                        setIsBlocked(true);

                        break;

                    default:

                        break;
                }

            }}

            category={category}

            onCategoryChange={(value) => {

                setCategory(value);

                setPage(1);

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

                    <VenueTable

                        venues={venues}

                        onView={handleView}

                        onApprove={handleApprove}

                        onReject={handleReject}

                        onBlock={handleBlock}

                        onUnblock={handleUnblock}

                    />

                    <div className="mt-6">

                        <Pagination

                            currentPage={page}

                            totalPages={pagination?.totalPages || 1}

                            onPageChange={setPage}

                        />

                    </div>

                </>

            )

        }

        <ConfirmationModal

            isOpen={isConfirmationOpen}

            onClose={() => setIsConfirmationOpen(false)}

            onConfirm={handleConfirm}

            title={

                actionType === "approve"

                    ? "Approve Venue"

                    : actionType === "reject"

                    ? "Reject Venue"

                    : actionType === "block"

                    ? "Block Venue"

                    : "Unblock Venue"

            }

            message={

                actionType === "approve"

                    ? "Are you sure you want to approve this venue?"

                    : actionType === "reject"

                    ? "Are you sure you want to reject this venue?"

                    : actionType === "block"

                    ? "Are you sure you want to block this venue?"

                    : "Are you sure you want to unblock this venue?"

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

            onClose={() => setIsRejectModalOpen(false)}

            onSubmit={handleRejectSubmit}

            title="Reject Venue"

        />

    </div>

);
}
export default VenueManagement;