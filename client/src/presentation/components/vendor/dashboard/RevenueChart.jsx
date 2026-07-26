import {
Card,
CardHeader,
CardTitle,
CardContent,
} from "@/components/ui/card";

import {
BarChart,
Bar,
XAxis,
YAxis,
CartesianGrid,
Tooltip,
ResponsiveContainer,
} from "recharts";

const RevenueChart = ({ data = [] }) => {
return ( 
<Card> 
  <CardHeader>
     <CardTitle>Revenue (₹)</CardTitle> 
    </CardHeader>

  <CardContent>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="month" />

        <YAxis />

        <Tooltip
          formatter={(value) => [`₹${value}`, "Revenue"]}
        />

        <Bar
          dataKey="revenue"
          fill="#db9e42"
        />
      </BarChart>
    </ResponsiveContainer>
  </CardContent>
</Card>


);
};

export default RevenueChart;
