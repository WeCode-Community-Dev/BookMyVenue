import {
    ResponsiveContainer,
    LineChart,
    Line,
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

const RevenueChart = ({ data }) => {
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

                    Revenue Overview

                </CardTitle>

            </CardHeader>

            <CardContent>

                <div className="h-[350px]">

                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >

                        <LineChart
                            data={chartData}
                        >

                            <CartesianGrid
                                strokeDasharray="3 3"
                            />

                            <XAxis
                                dataKey="month"
                            />

                            <YAxis />

                            <Tooltip
                                formatter={(value) =>
                                    `₹${value.toLocaleString()}`
                                }
                            />

                            <Line
                                dataKey="revenue"
                                stroke="#FE9A00"
                                strokeWidth={3}
                                dot={{ fill: "#FE9A00" }}
                                activeDot={{ fill: "#E88700", r: 6 }}
                            />

                        </LineChart>

                    </ResponsiveContainer>

                </div>

            </CardContent>

        </Card>

    );

};

export default RevenueChart;