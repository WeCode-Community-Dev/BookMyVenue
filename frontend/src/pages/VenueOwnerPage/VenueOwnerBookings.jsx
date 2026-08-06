import { useMemo, useState } from "react";
import { CalendarCheck, Clock3, Wallet, Users } from "lucide-react";
import { StatCard } from "../../components/venueOwner/StatCard";
import { MiniCalendar } from "../../components/venueOwner/MiniCalendar";
import { DaySchedule } from "../../components/venueOwner/DaySchedule";
import { BookingHistory } from "../../components/venueOwner/BookingHistory";
import { fmtKey } from "../../utils/ownerPageUtils";

const TODAY = new Date();
const Y = TODAY.getFullYear();
const M = TODAY.getMonth();

const BOOKINGS = {
  [fmtKey(Y, M, 3)]: [
    { id: "b1", venue: "Royal Grand Hall", customer: "Rahul Menon", start: "10:00", end: "14:00", guests: 220, amount: 65000, status: "confirmed" },
  ],
  [fmtKey(Y, M, 8)]: [
    { id: "b2", venue: "Backwater Resort", customer: "Anjali Nair", start: "09:00", end: "23:00", guests: 180, amount: 120000, status: "confirmed" },
    { id: "b3", venue: "The Garden Café", customer: "Team Innovate", start: "15:00", end: "18:00", guests: 40, amount: 18000, status: "pending" },
  ],
  [fmtKey(Y, M, 12)]: [
    { id: "b4", venue: "Royal Grand Hall", customer: "Sunitha Joseph", start: "11:00", end: "16:00", guests: 300, amount: 85000, status: "confirmed" },
  ],
  [fmtKey(Y, M, 17)]: [
    { id: "b5", venue: "Skyline Auditorium", customer: "TechFest Committee", start: "08:00", end: "20:00", guests: 500, amount: 150000, status: "confirmed" },
  ],
  [fmtKey(Y, M, 21)]: [
    { id: "b6", venue: "The Garden Café", customer: "Priya Varma", start: "17:00", end: "21:00", guests: 60, amount: 22000, status: "confirmed" },
    { id: "b7", venue: "Backwater Resort", customer: "Vishnu & Family", start: "12:00", end: "22:00", guests: 90, amount: 70000, status: "pending" },
  ],
  [fmtKey(Y, M, 25)]: [
    { id: "b8", venue: "Royal Grand Hall", customer: "Meera Pillai", start: "10:00", end: "15:00", guests: 250, amount: 78000, status: "cancelled" },
  ],
};

const RECENT_HISTORY = [
  { id: "h1", venue: "Royal Grand Hall", customer: "Arun Das", date: "Jun 14, 2026", amount: 92000, status: "completed" },
  { id: "h2", venue: "Backwater Resort", customer: "Lakshmi Krishnan", date: "Jun 11, 2026", amount: 135000, status: "completed" },
  { id: "h3", venue: "The Garden Café", customer: "Sneha Thomas", date: "Jun 9, 2026", amount: 16000, status: "completed" },
  { id: "h4", venue: "Skyline Auditorium", customer: "Kerala Startup Mission", date: "Jun 5, 2026", amount: 145000, status: "completed" },
  { id: "h5", venue: "Royal Grand Hall", customer: "Devika Suresh", date: "May 30, 2026", amount: 60000, status: "completed" },
];

export function VenueOwnerBookings() {
  const [viewYear, setViewYear] = useState(Y);
  const [viewMonth, setViewMonth] = useState(M);
  const [selectedDay, setSelectedDay] = useState(null);

  const monthBookings = useMemo(() => BOOKINGS, []); 

  function changeMonth(delta) {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setViewMonth(m);
    setViewYear(y);
    setSelectedDay(null);
  }

  const totalThisMonth = Object.values(monthBookings).flat().length;
  const totalRevenueUpcoming = Object.values(monthBookings)
    .flat()
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + b.amount, 0);
  const pendingCount = Object.values(monthBookings).flat().filter((b) => b.status === "pending").length;

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
      </section>

      <section>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={CalendarCheck}
            title="Bookings This Month"
            value={totalThisMonth}
            sub="Across all venues"
            iconBg="bg-red-50"
            iconColor="text-red-600"
          />
          <StatCard
            icon={Clock3}
            title="Pending Confirmation"
            value={pendingCount}
            sub="Needs your action"
            iconBg="bg-yellow-50"
            iconColor="text-yellow-600"
          />
          <StatCard
            icon={Wallet}
            title="Expected Revenue"
            value={`₹${(totalRevenueUpcoming / 1000).toFixed(0)}K`}
            sub="From confirmed + pending"
            iconBg="bg-green-50"
            iconColor="text-green-600"
          />
          <StatCard
            icon={Users}
            title="Guests Hosted (30d)"
            value="1,240"
            sub="Estimated, last 30 days"
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <MiniCalendar
          year={viewYear}
          month={viewMonth}
          onMonthChange={changeMonth}
          bookingsByDay={monthBookings}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
        />
        <DaySchedule
          dayKey={selectedDay}
          bookings={selectedDay ? (monthBookings[selectedDay] || []) : []}
          onClose={() => setSelectedDay(null)}
        />
      </section>

      <section>
        <BookingHistory history={RECENT_HISTORY} />
      </section>
    </div>
  );
}