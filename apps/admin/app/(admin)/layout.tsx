"use client";

import { useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { TopBar } from "../../components/TopBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="h-screen flex overflow-hidden bg-background">
            <div className="w-56 shrink-0 hidden lg:block">
                <Sidebar setSidebarOpen={setSidebarOpen} />
            </div>

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
                    {children}
                </main>
            </div>
        </div>
    );
}
