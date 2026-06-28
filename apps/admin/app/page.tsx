"use client";

import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { TopBar } from "../components/TopBar";
import { OverviewPage } from "../components/tabs/Overview";

import { Venue, User, USERS, BOOKINGS } from "../components/data";

export default function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [venues, setVenues] = useState<Venue[]>([]);
    const [users, setUsers] = useState<User[]>(USERS);

    const totalRevenue = BOOKINGS.filter((b) => b.status === "CONFIRMED").reduce((s, b) => s + b.amount, 0);

    return (
        <div className="h-screen flex overflow-hidden bg-background">
            {/* Sidebar desktop */}
            <div className="w-56 shrink-0 hidden lg:block">
                <Sidebar setSidebarOpen={setSidebarOpen} />
            </div>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                    <div className="relative w-56 h-full shadow-2xl">
                        <Sidebar setSidebarOpen={setSidebarOpen} mobile />
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <TopBar setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
                    <OverviewPage venues={venues} users={users} totalRevenue={totalRevenue} />
                </main>
            </div>
        </div>
    );
}
