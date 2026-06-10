import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
//import axios from "axios";

const RevenueChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Dummy data 
    setData([
      { month: "Jan", revenue: 12000 },
      { month: "Feb", revenue: 15000 },
      { month: "Mar", revenue: 18000 },
      { month: "Apr", revenue: 20000 },
      { month: "May", revenue: 22000 },
      { month: "Jun", revenue: 25000 },
    ]);
  }, []);

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
            <Tooltip />
            <Bar dataKey="revenue" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
