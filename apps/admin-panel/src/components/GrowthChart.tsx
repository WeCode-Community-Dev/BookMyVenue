import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { RefreshCw } from 'lucide-react'
import { createClient, adminGrowthEndpoints } from '@venue404/api-client'
import type { GrowthPeriod, GrowthStats } from '@venue404/api-client'
import { SectionHeader } from '@venue404/ui'

const api = adminGrowthEndpoints(createClient())

const SERIES = [
  { key: 'users', label: 'Users', color: '#6366f1' },
  { key: 'owners', label: 'Owners', color: '#f59e0b' },
  { key: 'venues', label: 'Venues', color: '#10b981' },
  { key: 'bookings', label: 'Bookings', color: '#ef4444' },
] as const

const PERIODS: { label: string; value: GrowthPeriod }[] = [
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: '3M', value: '3m' },
  { label: '6M', value: '6m' },
  { label: '12M', value: '12m' },
]

function fmt(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

function TotalPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="ml-auto text-sm font-semibold tabular-nums text-zinc-900">
        {value.toLocaleString('en-IN')}
      </span>
    </div>
  )
}

function ChartBody({ data }: { data: GrowthStats }) {
  const chartData = data.labels.map((label, i) => ({
    label,
    users: data.users[i],
    owners: data.owners[i],
    venues: data.venues[i],
    bookings: data.bookings[i],
  }))

  return (
    <div className="flex h-full flex-col">
      {/* Totals strip */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 border-b border-zinc-100 px-5 py-3">
        {SERIES.map((s) => (
          <TotalPill key={s.key} label={s.label} value={data.totals[s.key]} color={s.color} />
        ))}
      </div>

      {/* Chart */}
      <div className="flex-1 px-2 pb-2 pt-3" style={{ minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 4, right: 16, bottom: 0, left: -8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: '#a1a1aa' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#a1a1aa' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={fmt}
              width={32}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '0.75rem',
                border: '1px solid #e4e4e7',
                boxShadow: '0 4px 16px 0 rgba(0,0,0,0.08)',
                fontSize: 12,
                padding: '8px 12px',
              }}
              labelStyle={{ fontWeight: 600, color: '#18181b', marginBottom: 4 }}
              formatter={(value, name) => [
                typeof value === 'number' ? value.toLocaleString('en-IN') : value,
                typeof name === 'string' ? name.charAt(0).toUpperCase() + name.slice(1) : name,
              ]}
            />
            <Legend
              iconType="circle"
              iconSize={7}
              wrapperStyle={{ fontSize: 11, paddingTop: 6 }}
              formatter={(value) => (
                <span style={{ color: '#71717a' }}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </span>
              )}
            />
            {SERIES.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                stroke={s.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function GrowthChart() {
  const [period, setPeriod] = useState<GrowthPeriod>('30d')

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'growth-stats', period],
    queryFn: () => api.getGrowthStats(period),
  })

  const periodDesc = period.endsWith('d')
    ? `Last ${period.slice(0, -1)} days — daily`
    : `Last ${period.slice(0, -1)} months — monthly`

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-zinc-100 px-5 py-4">
        <SectionHeader
          title="Platform Growth"
          description={periodDesc}
          action={
            <div className="flex items-center gap-0.5 rounded-lg border border-zinc-200 bg-zinc-50 p-0.5">
              {PERIODS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPeriod(p.value)}
                  className={[
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none',
                    period === p.value
                      ? 'bg-white text-zinc-900 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-600',
                  ].join(' ')}
                >
                  {p.label}
                </button>
              ))}
            </div>
          }
        />
      </div>

      {/* Body */}
      <div className="flex-1" style={{ minHeight: 0 }}>
        {isLoading || !data ? (
          <div className="flex h-full items-center justify-center py-10">
            <RefreshCw className="h-4 w-4 animate-spin text-zinc-300" />
          </div>
        ) : (
          <ChartBody data={data} />
        )}
      </div>
    </div>
  )
}
