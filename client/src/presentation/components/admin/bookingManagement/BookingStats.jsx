import {
    CalendarCheck,
    Clock3,
    CheckCircle,
    XCircle,
    CalendarDays,
} from "lucide-react";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

const BookingStats = ({ stats }) => {

    const cards = [
        {
            title: "TotalBookings",
            value: stats?.totalBookings || 0,
            icon: CalendarDays,
            color: "text-blue-600",
        },
        {
            title: "Pending",
            value: stats?.pendingBookings || 0,
            icon: Clock3,
            color: "text-yellow-600",
        },
        {
            title: "Confirmed",
            value: stats?.confirmedBookings || 0,
            icon: CheckCircle,
            color: "text-green-600",
        },
       
        {
            title: "Cancelled",
            value: stats?.cancelledBookings || 0,
            icon: XCircle,
            color: "text-red-600",
        },
        {
            title: "Completed",
            value: stats?.completedBookings || 0,
            icon: CalendarCheck,
            color: "text-indigo-600",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">

            {cards.map((card) => {

                const Icon = card.icon;

                return (

                    <Card key={card.title}>

                        <CardContent className="flex items-center justify-between p-5">

                            <div>

                                <p className="text-sm text-muted-foreground">

                                    {card.title}

                                </p>

                                <h2 className="text-3xl font-bold">

                                    {card.value}

                                </h2>

                            </div>

                            <Icon
                                className={`h-9 w-9 ${card.color}`}
                            />

                        </CardContent>

                    </Card>

                );

            })}

        </div>
    );
};

export default BookingStats;