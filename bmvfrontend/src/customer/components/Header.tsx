"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSession, clearSession, UserSession } from "@/src/lib/authStore";
import { Button } from "@/components/ui/button";
import { User, LogOut, Menu, X, Heart, Calendar } from "lucide-react";
import { LogoTicket } from "@/components/Logo";

export default function Header() {
  const [session, setSessionState] = useState<UserSession | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Load session on mount and when pathname changes (to reflect login status instantly)
  useEffect(() => {
    setSessionState(getSession());
  }, [pathname]);

  const handleLogout = () => {
    clearSession();
    setSessionState(null);
    router.push("/");
  };

  const navLinks = [
    { label: "Find Venues", path: "/venues" },
    { label: "Partner Area", path: "/partner" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <LogoTicket />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium transition-colors hover:text-teal-primary ${
                  pathname.startsWith(link.path) ? "text-teal-primary" : "text-neutral-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              {session.role === "venue_owner" ? (
                <Link href="/partner/dashboard">
                  <Button variant="outline" className="border-teal-primary text-teal-primary hover:bg-teal-light">
                    Partner Dashboard
                  </Button>
                </Link>
              ) : (
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-medium text-neutral-dark">Hello, {session.name}</span>
                  <Link href="/customer/bookings">
                    <Button variant="outline" className="border-teal-primary text-teal-primary hover:bg-teal-light flex items-center gap-1.5 py-1 px-3.5 rounded-xl h-9 text-xs font-semibold">
                      <Calendar className="h-3.5 w-3.5" />
                      My Bookings
                    </Button>
                  </Link>
                  <div className="h-8 w-px bg-border" />
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-neutral-muted hover:text-destructive flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/partner">
                <span className="text-xs font-semibold text-teal-primary hover:underline cursor-pointer mr-2">
                  List Your Venue
                </span>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="border-neutral-dark text-neutral-dark hover:bg-neutral-light rounded-full px-5">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-teal-primary text-white hover:bg-teal-hover rounded-full px-5">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
          {!session && (
            <Link href="/login">
              <Button size="sm" variant="outline" className="text-xs px-3 py-1 h-8 rounded-full border-teal-primary text-teal-primary">
                Login
              </Button>
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-neutral-dark hover:text-teal-primary p-2 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3 animate-fade-in shadow-xl">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium px-2 py-1.5 rounded-md ${
                  pathname.startsWith(link.path)
                    ? "bg-teal-light text-teal-primary"
                    : "text-neutral-dark hover:bg-neutral-light"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <hr className="border-border my-2" />

          {session ? (
            <div className="space-y-3 pt-2">
              <div className="px-2">
                <p className="text-xs text-neutral-muted">Logged in as</p>
                <p className="text-sm font-semibold text-neutral-dark">{session.name} ({session.role})</p>
              </div>
              {session.role === "venue_owner" ? (
                <Link href="/partner/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-teal-primary text-white hover:bg-teal-hover">
                    Go to Partner Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/customer/bookings" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-teal-primary text-white hover:bg-teal-hover flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    My Bookings
                  </Button>
                </Link>
              )}
              <Button
                variant="outline"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-destructive border-destructive/20 hover:bg-destructive/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/partner" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full border-teal-primary text-teal-primary hover:bg-teal-light">
                  List Your Venue (Free)
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-teal-primary text-white hover:bg-teal-hover">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
