"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/home/search-bar";
import { useAuth } from "@/context/AuthContext";
import ProfileDropdown from "@/components/profile/ProfileDropdown";

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function Navbar({ searchQuery, setSearchQuery }: NavbarProps) {
  const { isLoggedIn } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/85 backdrop-blur-md border-b border-slate-100 shadow-xs"
          : "bg-white/60 backdrop-blur-xs border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-1.5 font-bold text-lg tracking-tight select-none shrink-0">
          <Image
            src="/logo.jpg"
            alt="BookMyVenue Logo"
            width={32}
            height={32}
            className="rounded-lg object-contain border border-slate-100 shadow-xs"
          />
          <span className="hidden min-[480px]:inline text-slate-900 font-extrabold text-[15px] sm:text-lg">
            BookMy<span className="text-rose-600">Venue</span>
          </span>
        </Link>

        {/* Center: Search Bar */}
        <SearchBar
          variant="nav"
          placeholder="Search spaces..."
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {isLoggedIn ? (
            <ProfileDropdown />
          ) : (
            <Button
              variant="outline"
              asChild
              className="rounded-full border-slate-200 hover:border-slate-350 text-slate-700 bg-white font-semibold shadow-xs hover:bg-slate-55 h-9 px-3 sm:px-4 text-xs sm:text-sm transition-all hover:text-rose-600 cursor-pointer"
            >
              <Link href="/login">
                <span className="hidden sm:inline">Sign In / Sign Up</span>
                <span className="sm:hidden">Sign In</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
