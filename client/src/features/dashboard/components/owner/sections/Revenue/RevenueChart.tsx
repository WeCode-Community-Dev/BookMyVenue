import type { RevenueChartProps } from '@/features/dashboard/types/ownerDashbord.types';
import { BarChart3 } from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    name: string;
    value: number;
    dataKey: string | number;
  }[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/85 p-4 rounded-2xl shadow-xl">
        <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2.5">
          {label}
        </p>
        <div className="space-y-2">
          {payload.map((entry, index) => {
            const isRevenue = entry.dataKey === 'revenue';
            const valStr = isRevenue
              ? `₹${entry.value.toLocaleString()}`
              : `${entry.value} bookings`;

            const dotColor = isRevenue ? 'var(--color-primary)' : 'var(--color-warning)';

            return (
              <div key={index} className="flex items-center justify-between gap-8">
                <span className="text-xs text-zinc-600 dark:text-zinc-350 flex items-center gap-2 font-medium">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: dotColor }}
                  />
                  {entry.name}:
                </span>
                <span className="text-xs font-black text-zinc-900 dark:text-white">{valStr}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export default function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="w-full h-[40vh] lg:h-[280px] mt-6 relative z-10">
      {data.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
            <BarChart3 className="w-6 h-6 text-zinc-400" />
          </div>

          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            No revenue data available
          </p>

          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
            Revenue and booking trends will appear here once bookings are made.
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{
              top: 10,
              right: 0,
              left: -15,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.8} />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.05} />
              </linearGradient>
              <filter id="lineShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow
                  dx="0"
                  dy="4"
                  stdDeviation="4"
                  floodColor="var(--color-warning)"
                  floodOpacity="0.35"
                />
              </filter>
            </defs>

            <CartesianGrid
              stroke="currentColor"
              opacity={0.08}
              strokeDasharray="4 4"
              vertical={false}
              className="text-zinc-200 dark:text-zinc-800"
            />

            <XAxis
              dataKey="period"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 550 }}
              className="text-zinc-400 dark:text-zinc-500"
              dy={8}
            />

            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 550 }}
              tickFormatter={(val) => (val >= 1000 ? `₹${(val / 1000).toFixed(0)}k` : `₹${val}`)}
              className="text-zinc-400 dark:text-zinc-500"
              dx={-8}
            />

            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 550 }}
              tickFormatter={(val) => `${val}`}
              className="text-zinc-400 dark:text-zinc-500"
              dx={8}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: 'currentColor',
                strokeWidth: 1,
                strokeOpacity: 0.08,
                strokeDasharray: '4 4',
              }}
            />

            <Legend
              verticalAlign="top"
              align="right"
              height={40}
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="text-zinc-500 dark:text-zinc-400 font-bold tracking-wider text-xs uppercase ml-1.5">
                  {value}
                </span>
              )}
              wrapperStyle={{
                paddingBottom: '20px',
              }}
            />

            <Bar
              yAxisId="left"
              dataKey="revenue"
              name="Revenue"
              fill="url(#revenueGrad)"
              radius={[6, 6, 0, 0]}
              maxBarSize={36}
              activeBar={{
                fill: 'var(--color-primary)',
                opacity: 0.95,
              }}
            />

            <Line
              yAxisId="right"
              dataKey="bookings"
              name="Bookings"
              type="monotone"
              stroke="var(--color-warning)"
              strokeWidth={3}
              dot={{
                r: 4.5,
                stroke: 'var(--color-warning)',
                strokeWidth: 2,
                fill: 'var(--color-card)',
              }}
              activeDot={{
                r: 6.5,
                stroke: 'var(--color-warning)',
                strokeWidth: 2,
                fill: 'var(--color-card)',
              }}
              filter="url(#lineShadow)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
