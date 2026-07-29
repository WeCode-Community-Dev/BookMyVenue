import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const BookingOverviewChart = ({ data }) => {
    const getMonthName = (monthNumber) => {
        return new Date(
            2000,
            monthNumber - 1
        ).toLocaleString("en-US", {
            month: "short",
        });
    };

    const chartData = data.map((item) => ({
        ...item,
        month: getMonthName(item.month),
    }));

    return (

        <Card>

            <CardHeader>

                <CardTitle>

                    Booking Overview

                </CardTitle>

            </CardHeader>

            <CardContent>

                <div className="h-[350px]">

                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >

                        <BarChart
                            data={chartData}
                        >

                            <CartesianGrid
                                strokeDasharray="3 3"
                            />

                            <XAxis
                                dataKey="month"
                            />

                            <YAxis
                                allowDecimals={false}
                            />

                            <Tooltip />

                            <Bar
                                dataKey="bookings"
                                fill="#FE9A00"
                                radius={[6, 6, 0, 0]}
                            />

                        </BarChart>

                    </ResponsiveContainer>

                </div>

            </CardContent>

        </Card>

    );

};

export default BookingOverviewChart;