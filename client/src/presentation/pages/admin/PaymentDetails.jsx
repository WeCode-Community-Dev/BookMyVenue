import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "@/presentation/components/admin/common/PageHeader";

import PaymentSummaryCard from "@/presentation/components/admin/paymentManagement/PaymentSummaryCard";
import BookingInfoCard from "@/presentation/components/admin/paymentManagement/BookingInfoCard";
import PaymentInfoCard from "@/presentation/components/admin/paymentManagement/PaymentInfoCard";

import UserInfoCard from "@/presentation/components/admin/bookingManagement/UserInfoCard";
import VendorInfoCard from "@/presentation/components/admin/bookingManagement/VendorInfoCard";

import { getPaymentById } from "@/redux/slices/AdminPaymentSlice";

const PaymentDetails = () => {
    const dispatch = useDispatch();

    const { paymentId } = useParams();
    const navigate = useNavigate();

    const {
        loading,
        error,
        selectedPayment,
    } = useSelector((state) => state.adminPayment);

    useEffect(() => {
        if (paymentId) {
            dispatch(getPaymentById(paymentId));
        }
    }, [dispatch, paymentId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-20 text-red-500">
                {error}
            </div>
        );
    }

    if (!selectedPayment) {
        return (
            <div className="flex items-center justify-center py-20">
                Payment not found.
            </div>
        );
    }

    return (
        <div className="space-y-6">

            <PageHeader
                title="Payment Details"
                subtitle="View complete payment information"
            />
            <Button
                variant="outline"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </Button>

            {/* Payment Summary */}
            <PaymentSummaryCard payment={selectedPayment} />

            {/* User & Vendor */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <UserInfoCard
                    user={selectedPayment.userId}
                />

                <VendorInfoCard
                    vendor={selectedPayment.vendorId}
                />

            </div>

            {/* Booking & Payment */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <BookingInfoCard
                    booking={selectedPayment.bookingId}
                />

                <PaymentInfoCard
                    payment={selectedPayment}
                />

            </div>

        </div>
    );
};

export default PaymentDetails;