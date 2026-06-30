'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  IconBuilding,
  IconCash,
  IconClock,
  IconCheck,
  IconStarFilled,
  IconCalendar,
  IconTrendingUp,
  IconUsers,
  IconArrowUpRight,
  IconChevronRight,
  IconSearch,
  IconMapPin,
  IconCreditCard,
  IconPlus,
  IconAlertCircle,
  IconHistory,
  IconUser,
  IconSquareRoundedCheckFilled
} from '@tabler/icons-react'
import { VenueLister } from '@/components/venueLister'
import { UpComing } from '@/components/upComing'
import { Review } from '@/components/review'
import { Cancel } from '@/components/cancel'
import { Reject } from '@/components/reject'

// --- Mock Data ---

const MOCK_LISTED_VENUES = [
  {
    id: 101,
    name: "Al Saj Convention Center (Arena)",
    location: "Kazhakkoottam, Trivandrum",
    rating: 4.5,
    cats: ["Wedding", "Conference", "Exhibition"],
    image: "https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png",
    status: "Active",
    bookingsThisMonth: 14,
    revenueThisMonth: 12400,
    revenueThisYear: 88000,
  },
  {
    id: 102,
    name: "Grand Palace Orchid Gardens",
    location: "Nemom, Trivandrum",
    rating: 4.2,
    cats: ["Birthday", "Workshop", "Meetup"],
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600",
    status: "Active",
    bookingsThisMonth: 8,
    revenueThisMonth: 7200,
    revenueThisYear: 45000,
  },
  {
    id: 103,
    name: "Whispering Palms Resort Hall",
    location: "Varkala Beach, Trivandrum",
    rating: 4.7,
    cats: ["Wedding", "Party", "Conference"],
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600",
    status: "Active",
    bookingsThisMonth: 12,
    revenueThisMonth: 9500,
    revenueThisYear: 68000,
  },
  {
    id: 104,
    name: "Lakeside Open Turf & Banquet",
    location: "Akkulam, Trivandrum",
    rating: 4.6,
    cats: ["Sport", "Birthday", "Meetup"],
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=600",
    status: "Active",
    bookingsThisMonth: 18,
    revenueThisMonth: 5800,
    revenueThisYear: 39000,
  }
];

const MOCK_PENDING_APPROVAL_VENUES = [
  {
    id: 201,
    name: "Golden Pavilion Banquet Hall",
    location: "Pattom, Trivandrum",
    cats: ["Wedding", "Conference"],
    submissionDate: "2026-05-28",
    status: "Document Verification",
    completionPercentage: 65,
    notes: "Awaiting verification of the local building license certificate."
  },
  {
    id: 202,
    name: "The Hive Rooftop & Cafe Workspace",
    location: "Vazhuthacaud, Trivandrum",
    cats: ["Workshop", "Meetup"],
    submissionDate: "2026-06-02",
    status: "Physical Inspection",
    completionPercentage: 35,
    notes: "Site inspection scheduled for tomorrow at 11:00 AM."
  },
  {
    id: 203,
    name: "Coral Cove Beachfront Gardens",
    location: "Kovalam, Trivandrum",
    cats: ["Wedding", "Party"],
    submissionDate: "2026-06-03",
    status: "Admin Approval Sign-off",
    completionPercentage: 90,
    notes: "Inspection passed. Final approval from regional lead pending."
  }
];

// Graph mock data matching filters
const MONTH_DATA = [
  { label: "W1", amount: 6200 },
  { label: "W2", amount: 8400 },
  { label: "W3", amount: 11200 },
  { label: "W4", amount: 9100 },
];

const YEAR_DATA = [
  { label: "Jan", amount: 18000 },
  { label: "Feb", amount: 22000 },
  { label: "Mar", amount: 25000 },
  { label: "Apr", amount: 29000 },
  { label: "May", amount: 34900 },
  { label: "Jun", amount: 41000 },
  { label: "Jul", amount: 38000 },
  { label: "Aug", amount: 45000 },
  { label: "Sep", amount: 49000 },
  { label: "Oct", amount: 56000 },
  { label: "Nov", amount: 52000 },
  { label: "Dec", amount: 68000 },
];

function Page() {
  const [timeFilter, setTimeFilter] = useState<'month' | 'year'>('month');
  const [hoveredPoint, setHoveredPoint] = useState<{ index: number; x: number; y: number } | null>(null);

  // Derive stats based on filter
  const totalListedVenues = MOCK_LISTED_VENUES.length;
  const pendingApprovalsCount = MOCK_PENDING_APPROVAL_VENUES.length;

  const totalMoney = timeFilter === 'month'
    ? MOCK_LISTED_VENUES.reduce((acc, curr) => acc + curr.revenueThisMonth, 0)
    : MOCK_LISTED_VENUES.reduce((acc, curr) => acc + curr.revenueThisYear, 0);

  const totalBookings = timeFilter === 'month'
    ? MOCK_LISTED_VENUES.reduce((acc, curr) => acc + curr.bookingsThisMonth, 0)
    : MOCK_LISTED_VENUES.reduce((acc, curr) => acc + (curr.bookingsThisMonth * 10), 0); // Mock year bookings

  const graphData = timeFilter === 'month' ? MONTH_DATA : YEAR_DATA;

  // SVG Chart Config
  const chartHeight = 220;
  const chartWidth = 720;
  const paddingX = 40;
  const paddingY = 30;

  const maxVal = Math.max(...graphData.map(d => d.amount)) * 1.1; // 10% headroom
  const minVal = 0;

  // Calculate coordinates
  const points = graphData.map((d, index) => {
    const x = paddingX + (index / (graphData.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - ((d.amount - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2);
    return { x, y, label: d.label, amount: d.amount };
  });

  // SVG path definitions
  const linePath = points.length > 0
    ? points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    : '';

  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
    : '';

  return (
    <div className="w-full px-4 md:max-w-7xl mx-auto my-6 flex flex-col gap-6 font-sans">

      {/* Header and Filter bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight text-foreground flex items-center gap-2">
            Admin Panel
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your venues, monitor bookings, trace the financial trajectory and feel the beat of BMV
          </p>
        </div>
        
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Money Card */}
        <Card className="hover:shadow-lg transition-all duration-300 border-border dark:bg-secondary/30 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">No Of Venues Listed</CardTitle>
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <IconBuilding size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
              ${totalMoney.toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-xs font-semibold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <IconTrendingUp size={12} /> +12.4%
              </span>
              <span className="text-xs text-muted-foreground">
                vs last {timeFilter === 'month' ? 'month' : 'year'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Listed Venues Card */}
        <Card className="hover:shadow-lg transition-all duration-300 border-border dark:bg-secondary/30 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Users Registered Through BMV</CardTitle>
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <IconBuilding size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {totalListedVenues}
            </div>
            <p className="text-xs text-muted-foreground mt-2.5">
              34 owners and 290 guests.
            </p>
          </CardContent>
        </Card>

        {/* Bookings Card */}
        <Card className="hover:shadow-lg transition-all duration-300 border-border dark:bg-secondary/30 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Transactions Through BMV</CardTitle>
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <IconUsers size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {totalBookings}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-xs font-semibold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <IconTrendingUp size={12} /> 5%
              </span>
              <span className="text-xs text-muted-foreground">
                commision fees
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals Card */}
       
      </div>

      {/* Trajectory Graph & Approval Queue section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Trajectory Graph Container (2 Cols) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card className="h-full border-border dark:bg-secondary/30">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold">Transaction Trajectory</CardTitle>
                  <CardDescription>Visualizing revenue flows and scaling trends</CardDescription>
                </div>
                <Badge variant="outline" className="border-primary flex items-center gap-1">
                  <IconTrendingUp size={12} className="text-primary" /> Active Flow
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 relative">

              {/* Custom SVG Line Chart */}
              <div className="relative w-full overflow-hidden select-none">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="w-full h-auto drop-shadow-sm"
                >
                  <defs>
                    {/* Shadow / Area gradient */}
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                    const y = paddingY + ratio * (chartHeight - paddingY * 2);
                    const val = maxVal - ratio * (maxVal - minVal);
                    return (
                      <g key={i}>
                        <line
                          x1={paddingX}
                          y1={y}
                          x2={chartWidth - paddingX}
                          y2={y}
                          stroke="currentColor"
                          strokeOpacity="0.05"
                          strokeDasharray="4 4"
                        />
                        <text
                          x={paddingX - 8}
                          y={y + 4}
                          textAnchor="end"
                          className="fill-muted-foreground text-[10px] font-mono"
                        >
                          ${Math.round(val).toLocaleString()}
                        </text>
                      </g>
                    );
                  })}

                  {/* Area fill */}
                  {points.length > 0 && (
                    <path
                      d={areaPath}
                      fill="url(#chartGradient)"
                    />
                  )}

                  {/* Line stroke */}
                  {points.length > 0 && (
                    <path
                      d={linePath}
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Axis labels & interactive markers */}
                  {points.map((p, index) => {
                    const isHovered = hoveredPoint?.index === index;
                    return (
                      <g key={index}>
                        {/* Vertical highlight line on hover */}
                        {isHovered && (
                          <line
                            x1={p.x}
                            y1={paddingY}
                            x2={p.x}
                            y2={chartHeight - paddingY}
                            stroke="var(--primary)"
                            strokeOpacity="0.25"
                            strokeWidth="1.5"
                            strokeDasharray="2 2"
                          />
                        )}

                        {/* X Axis labels */}
                        <text
                          x={p.x}
                          y={chartHeight - paddingY + 16}
                          textAnchor="middle"
                          className="fill-muted-foreground text-[11px] font-medium font-sans"
                        >
                          {p.label}
                        </text>

                        {/* Data point circle */}
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={isHovered ? 6 : 4}
                          fill={isHovered ? "var(--primary)" : "var(--background)"}
                          stroke="var(--primary)"
                          strokeWidth="2.5"
                          className="transition-all duration-150 cursor-pointer"
                        />
                      </g>
                    );
                  })}

                  {/* Invisible broad hover columns for smooth interactivity */}
                  {points.map((p, index) => {
                    const widthPerCol = (chartWidth - paddingX * 2) / (points.length - 1 || 1);
                    const rectX = p.x - widthPerCol / 2;
                    return (
                      <rect
                        key={index}
                        x={index === 0 ? paddingX : rectX}
                        y={paddingY}
                        width={index === 0 || index === points.length - 1 ? widthPerCol / 2 : widthPerCol}
                        height={chartHeight - paddingY * 2}
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredPoint({ index, x: p.x, y: p.y })}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    );
                  })}
                </svg>
              </div>

              {/* Floating Tooltip details */}
              <div className="mt-2 h-6 flex items-center justify-center">
                {hoveredPoint ? (
                  <div className="bg-secondary px-3 py-1 rounded-lg border border-border text-xs font-semibold text-foreground flex items-center gap-2 animate-fade-in">
                    <span className="text-primary font-bold">{points[hoveredPoint.index].label}:</span>
                    <span className="font-mono">${points[hoveredPoint.index].amount.toLocaleString()}</span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground italic">
                    Hover over data points to inspect detailed value logs
                  </span>
                )}
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Approval Queue Section (1 Col) */}
        <Card className="hover:shadow-lg transition-all h-fit duration-300 border-border dark:bg-secondary/30 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue Made By BMV</CardTitle>
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <IconUsers size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {totalBookings}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-xs font-semibold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <IconTrendingUp size={12} /> 5%
              </span>
              <span className="text-xs text-muted-foreground">
                commision fees
              </span>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Existing Listed Venues Section */}
      <div className="mt-4 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-border/80 pb-2">
          <div>
            <h2 className="text-xl font-heading font-bold tracking-tight text-foreground flex items-center gap-2">
              <IconBuilding className="text-primary" /> Venues Waiting Approval
            </h2>
            <p className="text-sm text-muted-foreground">Go through the venues , approve them and earn through it.</p>
          </div>
          <Badge variant="outline" className="border-border text-muted-foreground font-mono">
            {totalListedVenues} Total
          </Badge>
        </div>

        <div>
          <div className='w-full '>
            <div className='flex flex-col gap-2   h-96 overflow-y-scroll no-scrollbar'>
                <div className='w-full border dark:bg-secondary/30 border-border flex-col md:flex-row gap-4  rounded-xl flex md:items-center md:justify-between py-2 px-2'>
                    <div className='flex items-center gap-2'>
                    <div className='w-16 h-16 bg-primary rounded-xl'>

                    </div>
                    <div className='flex flex-col gap-1'>
                        
                        <div className='mx-2'>
                        <h3 className='flex items-center font-heading font-bold'>Al Saj Arena, nemom, tvm, kerala</h3>
                        <h3 className='flex items-center text-muted-foreground italic'>ziya123@gmail.com</h3>
                        
                        </div>
                    </div>
                    </div>
                    <div className='flex gap-2 justify-end w-full'>
                        <Reject />
                        <Button className='bg-green-500'><IconSquareRoundedCheckFilled />Approve Venue</Button>
                    </div>
                </div>
                 <div className='w-full border dark:bg-secondary/30 border-border flex-col md:flex-row gap-4  rounded-xl flex md:items-center md:justify-between py-2 px-2'>
                    <div className='flex items-center gap-2'>
                    <div className='w-16 h-16 bg-primary rounded-xl'>

                    </div>
                    <div className='flex flex-col gap-1'>
                        
                        <div className='mx-2'>
                        <h3 className='flex items-center'>Al Saj Arena, nemom, tvm, kerala</h3>
                        <h3 className='flex items-center'>ziya123@gmail.com</h3>
                        
                        </div>
                    </div>
                    </div>
                    <div className='flex gap-2 justify-end w-full'>
                        <Reject />
                        <Button className='bg-green-500'><IconCheck />Approve</Button>
                    </div>
                </div>
                 <div className='w-full border dark:bg-secondary/30 border-border flex-col md:flex-row gap-4  rounded-xl flex md:items-center md:justify-between py-2 px-2'>
                    <div className='flex items-center gap-2'>
                    <div className='w-16 h-16 bg-primary rounded-xl'>

                    </div>
                    <div className='flex flex-col gap-1'>
                        
                        <div className='mx-2'>
                        <h3 className='flex items-center'>Al Saj Arena, nemom, tvm, kerala</h3>
                        <h3 className='flex items-center'>ziya123@gmail.com</h3>
                        
                        </div>
                    </div>
                    </div>
                    <div className='flex gap-2 justify-end w-full'>
                        <Reject />
                        <Button className='bg-green-500'><IconCheck />Approve</Button>
                    </div>
                </div>
                 <div className='w-full border dark:bg-secondary/30 border-border flex-col md:flex-row gap-4  rounded-xl flex md:items-center md:justify-between py-2 px-2'>
                    <div className='flex items-center gap-2'>
                    <div className='w-16 h-16 bg-primary rounded-xl'>

                    </div>
                    <div className='flex flex-col gap-1'>
                        
                        <div className='mx-2'>
                        <h3 className='flex items-center'>Al Saj Arena, nemom, tvm, kerala</h3>
                        <h3 className='flex items-center'>ziya123@gmail.com</h3>
                        
                        </div>
                    </div>
                    </div>
                    <div className='flex gap-2 justify-end w-full'>
                        <Reject />
                        <Button className='bg-green-500'><IconCheck />Approve</Button>
                    </div>
                </div>
                 <div className='w-full border dark:bg-secondary/30 border-border flex-col md:flex-row gap-4  rounded-xl flex md:items-center md:justify-between py-2 px-2'>
                    <div className='flex items-center gap-2'>
                    <div className='w-16 h-16 bg-primary rounded-xl'>

                    </div>
                    <div className='flex flex-col gap-1'>
                        
                        <div className='mx-2'>
                        <h3 className='flex items-center'>Al Saj Arena, nemom, tvm, kerala</h3>
                        <h3 className='flex items-center'>ziya123@gmail.com</h3>
                        
                        </div>
                    </div>
                    </div>
                    <div className='flex gap-2 justify-end w-full'>
                        <Reject />
                        <Button className='bg-green-500'><IconCheck />Approve</Button>
                    </div>
                </div>
            </div>

            
        </div>
        </div>
      </div>
    </div>
  );
}

export default Page