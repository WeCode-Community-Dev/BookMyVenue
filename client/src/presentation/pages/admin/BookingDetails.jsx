

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { ArrowLeft } from "lucide-react";

import { getBookingById } from "@/redux/slices/AdminBookingSlice";

import { Button } from "@/components/ui/button";

import BookingStatusCard from "@/presentation/components/admin/bookingManagement/BookingStatusCard";
import UserInfoCard from "@/presentation/components/admin/bookingManagement/UserInfoCard";
import VendorInfoCard from "@/presentation/components/admin/bookingManagement/VendorInfoCard";
import VenueInfoCard from "@/presentation/components/admin/bookingManagement/VenueInfoCard";
import BookingPaymentCard from "@/presentation/components/admin/bookingManagement/BookingPaymentCard";
import BookingTimelineCard from "@/presentation/components/admin/bookingManagement/BookingTimelineCard";
import BookingActionCard from "@/presentation/components/admin/bookingManagement/BookingActionCard";

const BookingDetails = () => {

    const { bookingId } = useParams();

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const {
        selectedBooking,
        loading,
        error,
    } = useSelector((state) => state.adminBooking);

    useEffect(() => {

        if (bookingId) {

            dispatch(getBookingById(bookingId));

        }

    }, [dispatch, bookingId]);

    if (loading) {

        return (
            <div className="flex justify-center py-20">
                Loading...
            </div>
        );

    }

    if (error) {

        return (
            <div className="text-center text-red-500 py-20">
                {error}
            </div>
        );

    }

    if (!selectedBooking) {

        return null;

    }

    return (

        <div className="space-y-6">

            {/* Header */}

            <div className="flex justify-between items-center">

                <div>

                    <h1 className="text-3xl font-bold">
                        Booking Details
                    </h1>

                    <p className="text-muted-foreground">
                        Booking ID : {selectedBooking.id}
                    </p>

                </div>

                <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>

            </div>

            {/* Status */}

            <BookingStatusCard
                booking={selectedBooking}
            />

            {/* User + Vendor */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <UserInfoCard
                    user={selectedBooking.userId}
                />

                <VendorInfoCard
                    vendor={selectedBooking.vendorId}
                />

            </div>

            {/* Venue */}

            <VenueInfoCard
                venue={selectedBooking.venueId}
            />

            {/* Payment */}

            <BookingPaymentCard
                booking={selectedBooking}
            />

            {/* Timeline */}

            <BookingTimelineCard
                booking={selectedBooking}
            />

            {/* Actions / Reason */}

            <BookingActionCard
                booking={selectedBooking}
            />

        </div>

    );

};

export default BookingDetails;