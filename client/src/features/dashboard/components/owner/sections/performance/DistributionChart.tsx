import type { RevenueDistributionProps } from '@/features/dashboard/types/ownerDashbord.types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export const COLORS = [
  '#e21a47', // Wedding Hall (Red)
  '#f59e0b', // Conference Hall (Amber)
  '#10b981', // Party Hall (Emerald)
  '#3b82f6', // Sports Venue (Blue)
  '#6366f1', // Other (Indigo)
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/85 p-3 rounded-2xl shadow-xl">
        <p className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider mb-1">
          {data.category}
        </p>
        <p className="text-xs font-black text-black dark:text-white">
          ₹{data.revenue.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function RevenueDistributionChart({ data }: RevenueDistributionProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="revenue"
          nameKey="category"
          cx="50%"
          cy="50%"
          innerRadius={68}
          outerRadius={88}
          paddingAngle={5}
          cornerRadius={6}
          stroke="none"
        >
          {data.map((_, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
              className="outline-none focus:outline-none transition-all duration-300 hover:opacity-90"
            />
          ))}
        </Pie>

        <Tooltip content={<CustomTooltip />} cursor={false} />
      </PieChart>
    </ResponsiveContainer>
  );
}
