import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

const BookingActionCard = ({ booking }) => {

    const getBadgeClass = (status) => {

        switch (status?.toLowerCase()) {

            // Booking Status
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-300";

            case "confirmed":
                return "bg-green-100 text-green-800 border-green-300";

            case "completed":
                return "bg-blue-100 text-blue-800 border-blue-300";

            case "cancelled":
                return "bg-red-100 text-red-800 border-red-300";

            // Payment Status
            case "partial":
                return "bg-sky-100 text-sky-800 border-sky-300";

            case "paid":
            case "success":
                return "bg-green-100 text-green-800 border-green-300";

            case "failed":
                return "bg-red-100 text-red-800 border-red-300";

            case "refunded":
                return "bg-purple-100 text-purple-800 border-purple-300";

            default:
                return "";
        }

    };
console.log("Booking:", booking);

    return (

        <Card>

            <CardHeader>

                <CardTitle>

                    Booking Status

                </CardTitle>

            </CardHeader>

            <CardContent className="space-y-6">

                {/* Booking Status */}

                <div>

                    <p className="text-sm text-muted-foreground mb-2">

                        Booking Status

                    </p>

                    <Badge
                        variant="outline"
                        className={getBadgeClass(booking?.status)}
                    >
                        {booking?.status}
                    </Badge>

                </div>

                {/* Payment Status */}

                <div>

                    <p className="text-sm text-muted-foreground mb-2">

                        Payment Status

                    </p>

                    <Badge
                        variant="outline"
                        className={getBadgeClass(booking?.paymentStatus)}
                    >
                        {booking?.paymentStatus}
                    </Badge>

                </div>

                {/* Cancellation Reason */}

                {booking?.cancellationReason && (

                    <div>

                        <p className="text-sm text-muted-foreground mb-2">

                            Cancellation Reason

                        </p>

                        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">

                            {booking.cancellationReason}

                        </div>

                    </div>

                )}

            

            </CardContent>

        </Card>

    );

};

export default BookingActionCard;