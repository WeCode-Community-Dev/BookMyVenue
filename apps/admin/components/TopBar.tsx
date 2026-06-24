"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

const TITLES: Record<string, string> = {
    "/": "Dashboard",
    "/venues": "Venues",
    "/users": "Users",
    "/bookings": "Bookings",
};

interface TopBarProps {
    setSidebarOpen: (open: boolean) => void;
}

export function TopBar({ setSidebarOpen }: TopBarProps) {
    const pathname = usePathname();
    const title = TITLES[pathname] ?? "Dashboard";

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
                    <h1 className="font-bold text-foreground text-base">{title}</h1>
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
