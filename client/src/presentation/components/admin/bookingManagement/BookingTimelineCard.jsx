import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const BookingTimelineCard = ({ booking }) => {

    const formatDate = (date) => {

        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    };

    const formatDateTime = (date) => {

        if (!date) return "-";

        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    };

    return (

        <Card>

            <CardHeader>

                <CardTitle>

                    Booking Timeline

                </CardTitle>

            </CardHeader>

            <CardContent className="space-y-4">

                <div className="grid grid-cols-2 gap-4">

                    <div>

                        <p className="text-sm text-muted-foreground">

                            Booking Date

                        </p>

                        <p className="font-medium">

                            {formatDate(booking?.bookingDate)}

                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-muted-foreground">

                            Guest Count

                        </p>

                        <p className="font-medium">

                            {booking?.guestCount}

                        </p>

                    </div>

                </div>

                <div className="grid grid-cols-2 gap-4">

                    <div>

                        <p className="text-sm text-muted-foreground">

                            Start Time

                        </p>

                        <p className="font-medium">

                            {booking?.startTime}

                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-muted-foreground">

                            End Time

                        </p>

                        <p className="font-medium">

                            {booking?.endTime}

                        </p>

                    </div>

                </div>

                <div>

                    <p className="text-sm text-muted-foreground">

                        Created At

                    </p>

                    <p className="font-medium">

                        {formatDateTime(booking?.createdAt)}

                    </p>

                </div>

                <div>

                    <p className="text-sm text-muted-foreground">

                        Last Updated

                    </p>

                    <p className="font-medium">

                        {formatDateTime(booking?.updatedAt)}

                    </p>

                </div>

            </CardContent>

        </Card>

    );

};

export default BookingTimelineCard;