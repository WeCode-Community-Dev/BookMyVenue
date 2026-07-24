import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const bookingData = [
  { month: "Jan", bookings: 15, revenue: 12000 },
  { month: "Feb", bookings: 20, revenue: 15000 },
  { month: "Mar", bookings: 25, revenue: 18000 },
  { month: "Apr", bookings: 30, revenue: 20000 },
  { month: "May", bookings: 28, revenue: 22000 },
  { month: "Jun", bookings: 35, revenue: 25000 },
];

const BookingTrends = () => {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>
          Booking Trends
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <LineChart data={bookingData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="bookings"
              stroke="#4F46E5"
              strokeWidth={2}
            />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10B981"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BookingTrends;