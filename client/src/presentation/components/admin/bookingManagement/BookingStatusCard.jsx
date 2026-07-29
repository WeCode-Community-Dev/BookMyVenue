import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

const BookingStatusCard = ({ booking }) => {

    const getStatusVariant = (status) => {

        switch (status) {

            case "confirmed":
                return "default";

            case "pending":
                return "secondary";

            case "cancelled":
                return "destructive";

            case "completed":
                return "outline";

            default:
                return "secondary";

        }

    };

    const formatDate = (date) => {

        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-IN", {

            day: "2-digit",

            month: "long",

            year: "numeric",

        });

    };

    return (

        <Card>

            <CardHeader>

                <CardTitle>

                    Booking Status

                </CardTitle>

            </CardHeader>

            <CardContent>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    <div>

                        <p className="text-sm text-muted-foreground">

                            Status

                        </p>

                        <Badge variant={getStatusVariant(booking.status)}>

                            {booking.status}

                        </Badge>

                    </div>

                    <div>

                        <p className="text-sm text-muted-foreground">

                            Payment Status

                        </p>

                        <Badge variant="outline">

                            {booking.paymentStatus}

                        </Badge>

                    </div>

                    <div>

                        <p className="text-sm text-muted-foreground">

                            Booking Date

                        </p>

                        <p className="font-medium">

                            {formatDate(booking.bookingDate)}

                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-muted-foreground">

                            Created At

                        </p>

                        <p className="font-medium">

                            {formatDate(booking.createdAt)}

                        </p>

                    </div>

                </div>

            </CardContent>

        </Card>

    );

};

export default BookingStatusCard;