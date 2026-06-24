"use client";

import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { TopBar } from "../components/TopBar";
import { OverviewTab } from "../components/tabs/OverviewTab";
import { VenuesTab } from "../components/tabs/VenuesTab";
import { UsersTab } from "../components/tabs/UsersTab";
import { BookingsTab } from "../components/tabs/BookingsTab";
import { ReportsTab } from "../components/tabs/ReportsTab";
import {
  Tab, VenueStatus, UserRole, BookingStatus,
  Venue, User,
  VENUES, USERS, BOOKINGS,
} from "../components/data";

export default function App() {
  const [tab, setTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [venueSearch, setVenueSearch] = useState("");
  const [venueFilter, setVenueFilter] = useState<VenueStatus | "All">("All");
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<UserRole | "All">("All");
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingFilter, setBookingFilter] = useState<BookingStatus | "All">("All");

  const [venues, setVenues] = useState<Venue[]>(VENUES);
  const [users, setUsers] = useState<User[]>(USERS);

  const pendingVenues = venues.filter(v => v.status === "Pending").length;
  const totalRevenue = BOOKINGS.filter(b => b.status === "Confirmed").reduce((s, b) => s + b.amount, 0);

  const approveVenue = (id: string) => setVenues(v => v.map(x => x.id === id ? { ...x, status: "Active" } : x));
  const rejectVenue  = (id: string) => setVenues(v => v.map(x => x.id === id ? { ...x, status: "Rejected" } : x));
  const suspendVenue = (id: string) => setVenues(v => v.map(x => x.id === id ? { ...x, status: "Suspended" } : x));
  const suspendUser  = (id: string) => setUsers(u => u.map(x => x.id === id ? { ...x, status: x.status === "Suspended" ? "Active" : "Suspended" } : x));

  const filteredVenues = venues.filter(v => {
    const ms = venueFilter === "All" || v.status === venueFilter;
    const mq = v.name.toLowerCase().includes(venueSearch.toLowerCase()) ||
      v.owner.toLowerCase().includes(venueSearch.toLowerCase()) ||
      v.location.toLowerCase().includes(venueSearch.toLowerCase());
    return ms && mq;
  });

  const filteredUsers = users.filter(u => {
    const mr = userRoleFilter === "All" || u.role === userRoleFilter;
    const mq = u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    return mr && mq;
  });

  const filteredBookings = BOOKINGS.filter(b => {
    const ms = bookingFilter === "All" || b.status === bookingFilter;
    const mq = b.client.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.venue.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.id.toLowerCase().includes(bookingSearch.toLowerCase());
    return ms && mq;
  });

  return (
    <div className="h-screen flex overflow-hidden bg-background" >
      {/* Sidebar desktop */}
      <div className="w-56 shrink-0 hidden lg:block">
        <Sidebar tab={tab} setTab={setTab} setSidebarOpen={setSidebarOpen} />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-56 h-full shadow-2xl">
            <Sidebar tab={tab} setTab={setTab} setSidebarOpen={setSidebarOpen} mobile />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar tab={tab} setTab={setTab} setSidebarOpen={setSidebarOpen} pendingVenues={pendingVenues} />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          {tab === "overview" && (
            <OverviewTab venues={venues} users={users} totalRevenue={totalRevenue} setTab={setTab} />
          )}
          {tab === "venues" && (
            <VenuesTab
              venues={venues}
              filteredVenues={filteredVenues}
              venueSearch={venueSearch}
              setVenueSearch={setVenueSearch}
              venueFilter={venueFilter}
              setVenueFilter={setVenueFilter}
              approveVenue={approveVenue}
              rejectVenue={rejectVenue}
              suspendVenue={suspendVenue}
            />
          )}
          {tab === "users" && (
            <UsersTab
              users={users}
              filteredUsers={filteredUsers}
              userSearch={userSearch}
              setUserSearch={setUserSearch}
              userRoleFilter={userRoleFilter}
              setUserRoleFilter={setUserRoleFilter}
              suspendUser={suspendUser}
            />
          )}
          {tab === "bookings" && (
            <BookingsTab
              filteredBookings={filteredBookings}
              bookingSearch={bookingSearch}
              setBookingSearch={setBookingSearch}
              bookingFilter={bookingFilter}
              setBookingFilter={setBookingFilter}
            />
          )}
          {tab === "reports" && <ReportsTab />}
        </main>
      </div>
    </div>
  );
}
