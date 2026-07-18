import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const BookingPaymentCard = ({ booking }) => {

    const paymentStatusColor = {

        pending: "text-yellow-600",

        partial: "text-orange-600",

        paid: "text-green-600",

        failed: "text-red-600",

        refunded: "text-blue-600",

        success: "text-green-600",

    };

    return (

        <Card>

            <CardHeader>

                <CardTitle>

                    Payment Information

                </CardTitle>

            </CardHeader>

            <CardContent className="space-y-4">

                <div className="grid grid-cols-2 gap-4">

                    <div>

                        <p className="text-sm text-muted-foreground">

                            Total Amount

                        </p>

                        <p className="font-semibold">

                            ₹ {booking?.totalAmount ?? 0}

                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-muted-foreground">

                            Advance Amount

                        </p>

                        <p className="font-semibold">

                            ₹ {booking?.advanceAmount ?? 0}

                        </p>

                    </div>

                </div>

                <div className="grid grid-cols-2 gap-4">

                    <div>

                        <p className="text-sm text-muted-foreground">

                            Paid Amount

                        </p>

                        <p className="font-semibold text-green-600">

                            ₹ {booking?.paidAmount ?? 0}

                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-muted-foreground">

                            Remaining Amount

                        </p>

                        <p className="font-semibold text-red-600">

                            ₹ {booking?.remainingAmount ?? 0}

                        </p>

                    </div>

                </div>

                <div>

                    <p className="text-sm text-muted-foreground">

                        Payment Status

                    </p>

                    <p
                        className={`font-semibold capitalize ${paymentStatusColor[booking?.paymentStatus]}`}
                    >

                        {booking?.paymentStatus || "-"}

                    </p>

                </div>

            </CardContent>

        </Card>

    );

};

export default BookingPaymentCard;