import {
    CreditCard,
    CheckCircle,
    Clock3,
    XCircle,
    RotateCcw,
    IndianRupee,
} from "lucide-react";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

const PaymentStats = ({ stats }) => {

    const cards = [

        {
            title: "Total Payments",
            value: stats?.totalPayments || 0,
            icon: CreditCard,
            color: "text-blue-600",
        },

        {
            title: "Successful",
            value: stats?.successfulPayments || 0,
            icon: CheckCircle,
            color: "text-green-600",
        },

        {
            title: "Pending",
            value: stats?.pendingPayments || 0,
            icon: Clock3,
            color: "text-yellow-600",
        },

        {
            title: "Failed",
            value: stats?.failedPayments || 0,
            icon: XCircle,
            color: "text-red-600",
        },

        {
            title: "Refunded",
            value: stats?.refundedPayments || 0,
            icon: RotateCcw,
            color: "text-purple-600",
        },

        {
            title: "Revenue",
            value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
            icon: IndianRupee,
            color: "text-emerald-600",
        },

    ];

    return (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">

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

export default PaymentStats;