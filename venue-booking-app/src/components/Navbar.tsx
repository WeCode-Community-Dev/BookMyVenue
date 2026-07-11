"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Menu, X, Calendar, LayoutDashboard, Search, Sparkles, LogOut, LogIn } from "lucide-react";

export default function Navbar() {
  const { user, role, setRole, logout } = useApp();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    router.push("/login");
  };

  // Determine navigation items by user role
  const getNavItems = () => {
    if (!user) {
      return [{ label: "Find Venues", href: "/venues", icon: Search }];
    }

    if (user.role === "admin") {
      return [
        { label: "Admin Dashboard", href: "/host", icon: LayoutDashboard },
        { label: "Manage Spaces", href: "/venues", icon: Search },
        { label: "All Reservations", href: "/bookings", icon: Calendar },
      ];
    }

    if (user.role === "owner") {
      return role === "host"
        ? [
            { label: "Host Dashboard", href: "/host", icon: LayoutDashboard },
            { label: "Browse as Guest", href: "/venues", icon: Search },
          ]
        : [
            { label: "Find Venues", href: "/venues", icon: Search },
            { label: "My Bookings", href: "/bookings", icon: Calendar },
            { label: "Host Dashboard", href: "/host", icon: LayoutDashboard },
          ];
    }

    // Customer
    return [
      { label: "Find Venues", href: "/venues", icon: Search },
      { label: "My Bookings", href: "/bookings", icon: Calendar },
    ];
  };

  const currentNavItems = getNavItems();
  
  // Initials for avatar
  const getInitials = () => {
    if (!user) return "GU";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-transform group-hover:scale-105">
            <Sparkles className="h-5.5 w-5.5" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary via-blue-600 to-indigo-600 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            BookMyVenue
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {currentNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Role Toggle Switch - only show to Venue Owners or Admins */}
          {user && (user.role === "owner" || user.role === "admin") && (
            <div className="flex items-center space-x-2 bg-secondary p-1 rounded-xl border border-border">
              <button
                onClick={() => {
                  setRole("guest");
                  router.push("/venues");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  role === "guest"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Booker
              </button>
              <button
                onClick={() => {
                  setRole("host");
                  router.push("/host");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  role === "host"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {user.role === "admin" ? "Admin Panel" : "Host Portal"}
              </button>
            </div>
          )}

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-xl hover:bg-accent"
            aria-label="Toggle Theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Auth Button */}
          {user ? (
            <div className="flex items-center space-x-3">
              {/* Profile initials badge */}
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-extrabold text-xs border border-blue-200 dark:border-blue-800">
                {getInitials()}
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="rounded-xl font-semibold text-muted-foreground hover:text-destructive flex items-center hover:bg-rose-50 dark:hover:bg-rose-950/20"
              >
                <LogOut className="h-4 w-4 mr-1.5" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm" className="rounded-xl font-semibold bg-primary text-primary-foreground flex items-center">
                <LogIn className="h-4 w-4 mr-1.5" />
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu triggers */}
        <div className="flex items-center space-x-2 md:hidden">
          {/* Theme Toggle Mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-xl"
            aria-label="Toggle Theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background py-4 px-6 space-y-4 animate-in fade-in slide-in-from-top-5 duration-200">
          {user && (
            <div className="flex items-center space-x-3 pb-3 border-b border-border">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-extrabold text-sm">
                {getInitials()}
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">{user.name}</div>
                <div className="text-xxs text-muted-foreground uppercase font-bold tracking-wider">{user.role} Account</div>
              </div>
            </div>
          )}

          <div className="space-y-1">
            {currentNavItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-border flex flex-col space-y-3">
            {user ? (
              <>
                {/* Switch Role for Mobile (only owners/admins) */}
                {(user.role === "owner" || user.role === "admin") && (
                  <Button
                    onClick={() => {
                      setRole(role === "guest" ? "host" : "guest");
                      setMobileMenuOpen(false);
                      if (role === "guest") router.push("/host");
                      else router.push("/venues");
                    }}
                    variant="outline"
                    className="w-full justify-center rounded-xl"
                  >
                    Switch to {role === "guest" ? (user.role === "admin" ? "Admin Panel" : "Host Portal") : "Booker View"}
                  </Button>
                )}
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full justify-center rounded-xl"
                >
                  <LogOut className="h-5 w-5 mr-1.5" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full justify-center rounded-xl bg-primary text-primary-foreground">
                  <LogIn className="h-5 w-5 mr-1.5" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
