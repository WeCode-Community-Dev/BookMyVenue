import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { 
  Users, Building, Calendar, DollarSign, ArrowUpRight, 
  Clock, CheckCircle, ArrowRight 
} from 'lucide-react';
import type { Venue, Booking } from '../data/mockStore';

interface DashboardViewProps {
  onNavigate: (section: string) => void;
  onSelectVenue: (venue: Venue) => void;
  onSelectBooking: (booking: Booking) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onSelectVenue, onSelectBooking }) => {
  const { stats, bookings, venues, approveVenue, rejectVenue } = useAdmin();
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; val: string; label: string } | null>(null);

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // SVG Area Chart Data (Revenue Trend - last 7 days simulation)
  const revenueTrendData = [
    { label: 'Mon', rev: 45000, bk: 1 },
    { label: 'Tue', rev: 110000, bk: 2 },
    { label: 'Wed', rev: 70000, bk: 1 },
    { label: 'Thu', rev: 180000, bk: 3 },
    { label: 'Fri', rev: 155000, bk: 2 },
    { label: 'Sat', rev: 275000, bk: 4 },
    { label: 'Sun', rev: 220000, bk: 3 }
  ];

  // SVG dimensions
  const width = 500;
  const height = 180;
  const padding = 30;
  
  // Calculate points
  const maxRevenue = Math.max(...revenueTrendData.map(d => d.rev));
  const points = revenueTrendData.map((d, i) => {
    const x = padding + (i * (width - 2 * padding)) / (revenueTrendData.length - 1);
    const y = height - padding - (d.rev * (height - 2 * padding)) / maxRevenue;
    return { x, y, val: formatCurrency(d.rev), label: `${d.label}: ${d.bk} Bookings` };
  });

  const pathD = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
    : '';

  // Bar Chart Data (Top 4 booked venues)
  const topVenues = [...venues]
    .sort((a, b) => b.bookingCount - a.bookingCount)
    .slice(0, 4);

  const pendingVenues = venues.filter(v => v.status === 'pending').slice(0, 3);
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Operational Dashboard</h1>
          <p className="text-slate-400 mt-1">Real-time stats and management overview for BookMyVenue.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-300">
          <Clock className="w-4 h-4 text-primary" />
          <span>System Live: 2026-05-24</span>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="glass-panel rounded-xl p-5 border border-slate-800 hover:border-slate-700 transition duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8 blur-xl group-hover:bg-primary/10 transition-colors"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Users</p>
              <h3 className="text-3xl font-bold text-white mt-2">{stats.totalUsers + stats.totalVenueOwners}</h3>
              <div className="flex items-center gap-1 mt-2 text-xs text-emerald-400 font-medium">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+12% vs last month</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-900 text-xs text-slate-400">
            <span>Customers: {stats.totalUsers}</span>
            <span>Owners: {stats.totalVenueOwners}</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="glass-panel rounded-xl p-5 border border-slate-800 hover:border-slate-700 transition duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full -mr-8 -mt-8 blur-xl group-hover:bg-accent/10 transition-colors"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Venues</p>
              <h3 className="text-3xl font-bold text-white mt-2">{stats.totalVenues}</h3>
              <div className="flex items-center gap-1 mt-2 text-xs text-emerald-400 font-medium">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Active: {stats.activeVenuesCount}</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 text-accent">
              <Building className="w-6 h-6" />
            </div>
          </div>
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-900 text-xs text-slate-400">
            <span className="text-amber-400">Pending: {stats.pendingVenueApprovals}</span>
            <span className="text-red-400">Blocked: {stats.blockedVenuesCount}</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="glass-panel rounded-xl p-5 border border-slate-800 hover:border-slate-700 transition duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-8 -mt-8 blur-xl group-hover:bg-emerald-500/10 transition-colors"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Bookings</p>
              <h3 className="text-3xl font-bold text-white mt-2">{stats.totalBookings}</h3>
              <div className="flex items-center gap-1 mt-2 text-xs text-emerald-400 font-medium">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Today bookings: {stats.todayBookingsCount}</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-900 text-xs text-slate-400">
            <span className="text-blue-400">Upcoming: {stats.upcomingBookingsCount}</span>
            <span>Others: {stats.totalBookings - stats.upcomingBookingsCount}</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="glass-panel-glow rounded-xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-8 -mt-8 blur-xl"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Platform Commission</p>
              <h3 className="text-3xl font-bold text-white mt-2">{formatCurrency(stats.revenueOverview.totalCommissionRevenue)}</h3>
              <div className="flex items-center gap-1 mt-2 text-xs text-primary font-medium">
                <span>Commission: {useAdmin().settings.commissionPercentage}%</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-primary/20 border border-primary/30 text-primary">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
            <span>Volume: {formatCurrency(stats.revenueOverview.totalBookingRevenue)}</span>
            <span className="text-amber-400">Payouts pending: {formatCurrency(stats.revenueOverview.pendingPayouts)}</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts & Top Venues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Area Chart */}
        <div className="glass-panel rounded-xl p-5 border border-slate-800 lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-900 pb-3">
            <div>
              <h4 className="font-bold text-white text-base">Weekly Revenue Trend</h4>
              <p className="text-xs text-slate-400">Calculated dynamic booking volume and platform earnings.</p>
            </div>
            <span className="text-xs font-medium text-emerald-400 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">Active Event Week</span>
          </div>

          <div className="relative pt-2">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#aa3bff" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#aa3bff" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Y Axis Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const y = padding + ratio * (height - 2 * padding);
                const val = Math.round(maxRevenue * (1 - ratio));
                return (
                  <g key={idx} className="opacity-20">
                    <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#94a3b8" strokeDasharray="3,3" />
                    <text x={padding - 5} y={y + 4} fill="#f8fafc" fontSize="8" textAnchor="end">{formatCurrency(val / 1000)}k</text>
                  </g>
                );
              })}

              {/* X Axis Labels */}
              {revenueTrendData.map((d, idx) => {
                const x = padding + (idx * (width - 2 * padding)) / (revenueTrendData.length - 1);
                return (
                  <text key={idx} x={x} y={height - 10} fill="#94a3b8" fontSize="9" textAnchor="middle" className="opacity-70">
                    {d.label}
                  </text>
                );
              })}

              {/* Area */}
              <path d={areaD} fill="url(#chartGradient)" />

              {/* Line */}
              <path d={pathD} fill="none" stroke="#aa3bff" strokeWidth="2.5" strokeLinecap="round" />

              {/* Interactive Points */}
              {points.map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r="4.5"
                  fill="#11131e"
                  stroke="#22d3ee"
                  strokeWidth="2"
                  className="cursor-pointer hover:scale-150 hover:fill-primary transition duration-150"
                  onMouseEnter={() => {
                    setHoveredPoint({ x: pt.x, y: pt.y - 12, val: pt.val, label: pt.label });
                  }}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}

              {/* Tooltip Overlay */}
              {hoveredPoint && (
                <g>
                  {/* Tooltip background */}
                  <rect
                    x={Math.max(padding, hoveredPoint.x - 65)}
                    y={hoveredPoint.y - 30}
                    width="130"
                    height="28"
                    rx="4"
                    fill="#0a0b10"
                    stroke="#aa3bff"
                    strokeWidth="1"
                    className="opacity-95"
                  />
                  {/* Tooltip text */}
                  <text
                    x={Math.max(padding + 65, hoveredPoint.x)}
                    y={hoveredPoint.y - 18}
                    fill="#f8fafc"
                    fontSize="8.5"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {hoveredPoint.val}
                  </text>
                  <text
                    x={Math.max(padding + 65, hoveredPoint.x)}
                    y={hoveredPoint.y - 8}
                    fill="#94a3b8"
                    fontSize="7.5"
                    textAnchor="middle"
                  >
                    {hoveredPoint.label}
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Top Booked Venues */}
        <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-4">
          <div className="border-b border-slate-900 pb-3">
            <h4 className="font-bold text-white text-base">Top Performing Venues</h4>
            <p className="text-xs text-slate-400">Venues driving the highest event volumes.</p>
          </div>

          <div className="space-y-4">
            {topVenues.map((venue) => {
              const maxBookings = Math.max(...venues.map(v => v.bookingCount), 1);
              const percentage = (venue.bookingCount / maxBookings) * 100;
              return (
                <div key={venue.id} className="space-y-2 cursor-pointer group" onClick={() => onSelectVenue(venue)}>
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-300 group-hover:text-primary transition-colors line-clamp-1">{venue.name}</span>
                    <span className="font-bold text-white whitespace-nowrap">{venue.bookingCount} events ({formatCurrency(venue.revenue)})</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 border border-slate-900 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-500" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <button 
            onClick={() => onNavigate('venues-all')}
            className="w-full mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-primary hover:text-white bg-primary/5 hover:bg-primary border border-primary/20 hover:border-primary rounded-lg py-2.5 transition duration-300"
          >
            <span>View All Venues</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Operational Queue (Venue Approvals & Recent Bookings) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* High Frequency Venue Approvals Queue */}
        <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-900 pb-3">
            <div>
              <h4 className="font-bold text-white text-base flex items-center gap-2">
                <span>Approval Queue</span>
                {pendingVenues.length > 0 && (
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
                    {pendingVenues.length} pending
                  </span>
                )}
              </h4>
              <p className="text-xs text-slate-400">Review newly uploaded business listings.</p>
            </div>
            <button 
              onClick={() => onNavigate('venues-pending')}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Manage Queue
            </button>
          </div>

          {pendingVenues.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-950/40 rounded-lg border border-slate-900 border-dashed">
              <CheckCircle className="w-8 h-8 text-emerald-500/80 mb-2" />
              <p className="text-sm font-semibold text-slate-300">Approval Queue Clean</p>
              <p className="text-xs text-slate-500 mt-1">All venue applications have been processed.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingVenues.map((venue) => (
                <div key={venue.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-lg bg-slate-950/50 border border-slate-900 gap-3 hover:border-slate-800 transition">
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectVenue(venue)}>
                    <img 
                      src={venue.photos[0]} 
                      alt={venue.name} 
                      className="w-12 h-12 rounded object-cover border border-slate-800"
                    />
                    <div>
                      <h5 className="text-sm font-bold text-white hover:text-primary transition">{venue.name}</h5>
                      <p className="text-xs text-slate-400">{venue.location} | Cap: {venue.capacity}</p>
                      <p className="text-xs text-primary font-medium mt-0.5">{formatCurrency(venue.pricePerDay)}/day</p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => rejectVenue(venue.id)}
                      className="flex-1 sm:flex-none text-xs px-2.5 py-1.5 rounded bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 transition"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => approveVenue(venue.id)}
                      className="flex-1 sm:flex-none text-xs px-2.5 py-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 transition font-bold"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Platform Bookings */}
        <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-900 pb-3">
            <div>
              <h4 className="font-bold text-white text-base">Recent Bookings</h4>
              <p className="text-xs text-slate-400">Latest user bookings and cash flows.</p>
            </div>
            <button 
              onClick={() => onNavigate('bookings-all')}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              All Bookings
            </button>
          </div>

          <div className="divide-y divide-slate-900 max-h-[220px] overflow-y-auto pr-1 space-y-2">
            {recentBookings.map((booking) => (
              <div 
                key={booking.id} 
                className="flex justify-between items-center py-2 hover:bg-slate-900/30 px-2 rounded transition cursor-pointer"
                onClick={() => onSelectBooking(booking)}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">{booking.id}</span>
                    <span className="text-sm font-semibold text-white line-clamp-1">{booking.venueName}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                    <span>{booking.customerName}</span>
                    <span>•</span>
                    <span>Event: {booking.eventDate}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-white block">{formatCurrency(booking.amount)}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full inline-block font-medium ${
                    booking.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    booking.status === 'upcoming' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    booking.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
