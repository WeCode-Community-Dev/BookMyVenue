import {
    Users,
    UserCheck,
    Building2,
    CalendarDays,
    IndianRupee,
    Clock3,
    BadgeCheck,
} from "lucide-react";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

const DashboardStats = ({ stats }) => {

    const cards = [

        {
            title: "Total Users",
            value: stats?.summary?.totalUsers || 0,
            icon: Users,
            color: "text-blue-600",
        },

        {
            title: "Total Vendors",
            value: stats?.summary?.totalVendors || 0,
            icon: UserCheck,
            color: "text-green-600",
        },

        {
            title: "Total Venues",
            value: stats?.summary?.totalVenues || 0,
            icon: Building2,
            color: "text-purple-600",
        },

        {
            title: "Total Bookings",
            value: stats?.summary?.totalBookings || 0,
            icon: CalendarDays,
            color: "text-orange-600",
        },

        {
            title: "Revenue",
            value: `₹${(stats?.summary?.totalRevenue || 0).toLocaleString()}`,
            icon: IndianRupee,
            color: "text-emerald-600",
        },

        {
            title: "Pending Vendors",
            value: stats?.summary?.pendingVendorApprovals || 0,
            icon: Clock3,
            color: "text-yellow-600",
        },

        {
            title: "Pending Venues",
            value: stats?.summary?.pendingVenueApprovals || 0,
            icon: BadgeCheck,
            color: "text-red-600",
        },

    ];

    return (

        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-4">

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

export default DashboardStats;