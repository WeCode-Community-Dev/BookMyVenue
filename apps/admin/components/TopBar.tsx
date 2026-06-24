"use client";

import { Bell, AlertTriangle, Menu } from "lucide-react";
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'

import { Tab } from "./data";

interface TopBarProps {
    tab: Tab;
    setTab: (t: Tab) => void;
    setSidebarOpen: (open: boolean) => void;
    pendingVenues: number;
}

export function TopBar({ tab, setTab, setSidebarOpen, pendingVenues }: TopBarProps) {
    return (
        <header className="bg-card border-b border-border px-4 sm:px-6 h-14 flex items-center justify-between shrink-0 z-30">
            <div className="flex items-center gap-3">
                <button
                    className="lg:hidden p-1.5 rounded-lg hover:bg-muted transition-colors"
                    onClick={() => setSidebarOpen(true)}
                >
                    <Menu className="w-5 h-5 text-foreground" />
                </button>
                <div>
                    <h1 className="font-bold text-foreground text-base capitalize">
                        {tab === "overview" ? "Dashboard" : tab}
                    </h1>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                        {new Date().toLocaleDateString("en-IN", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {pendingVenues > 0 && (
                    <button
                        onClick={() => setTab("venues")}
                        className="hidden sm:flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors"
                    >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {pendingVenues} pending approval
                    </button>
                )}
                <Show when="signed-out">
                    <SignInButton />
                </Show>
                <Show when="signed-in">
                    <UserButton />
                </Show>
            </div>
        </header>
    );
}
