"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, User, Calendar, Heart, Bell, Settings, HelpCircle, LogOut, Shield, Briefcase } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";

export default function ProfileDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handleActionAlert = (actionName: string) => {
    setIsOpen(false);
    alert(`Mock navigation triggered for: "${actionName}"!`);
  };

  return (
    <div ref={containerRef} className="relative z-50">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-slate-200 bg-white hover:border-slate-300 transition duration-150 shadow-xs cursor-pointer select-none active:scale-[0.98]"
        aria-label="Toggle profile menu"
      >
        <div className="size-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 shadow-xs border border-slate-200/50 overflow-hidden">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="size-full object-cover"
            />
          ) : (
            <User className="size-4 text-slate-400 stroke-[2]" />
          )}
        </div>
        <span className="text-xs sm:text-sm font-extrabold text-slate-800 hidden xs:inline max-w-[90px] sm:max-w-[120px] truncate leading-none">
          {user.name}
        </span>
        <ChevronDown className={`size-3.5 text-slate-500 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu Overlay */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-60 bg-white border border-slate-200/80 shadow-2xl rounded-2xl py-2 text-left animate-in fade-in slide-in-from-top-2 duration-150 select-none">
          
          {/* User Brief header info */}
          <div className="px-4 py-2.5 border-b border-slate-100 flex flex-col gap-1">
            <span className="text-xs font-black text-slate-900 leading-none">{user.name}</span>
            <span className="text-[10px] text-slate-400 font-bold leading-none truncate">{user.email}</span>
            <div className="mt-1.5 flex">
              <Badge variant="rose" className="text-[9px] px-2 py-0.5 border-rose-100 bg-rose-50 text-rose-700 leading-none">
                {user.role}
              </Badge>
            </div>
          </div>

          <div className="py-1">
            {/* Standard Dropdown items */}
            <Link
              href="/profile?tab=profile"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-4 py-2 text-xs sm:text-sm text-slate-650 font-bold hover:bg-slate-50 hover:text-slate-950 transition cursor-pointer"
            >
              <User className="size-4 text-slate-400" />
              <span>My Profile</span>
            </Link>

            <Link
              href="/profile?tab=bookings"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-4 py-2 text-xs sm:text-sm text-slate-650 font-bold hover:bg-slate-50 hover:text-slate-950 transition cursor-pointer"
            >
              <Calendar className="size-4 text-slate-400" />
              <span>My Bookings</span>
            </Link>

            <Link
              href="/profile?tab=wishlist"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-4 py-2 text-xs sm:text-sm text-slate-650 font-bold hover:bg-slate-50 hover:text-slate-950 transition cursor-pointer"
            >
              <Heart className="size-4 text-slate-400" />
              <span>Wishlist</span>
            </Link>

            <Link
              href="/profile?tab=notifications"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-4 py-2 text-xs sm:text-sm text-slate-650 font-bold hover:bg-slate-50 hover:text-slate-950 transition cursor-pointer"
            >
              <Bell className="size-4 text-slate-400" />
              <span>Notifications</span>
            </Link>

            <Link
              href="/profile?tab=settings"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-4 py-2 text-xs sm:text-sm text-slate-650 font-bold hover:bg-slate-50 hover:text-slate-950 transition cursor-pointer"
            >
              <Settings className="size-4 text-slate-400" />
              <span>Settings</span>
            </Link>
          </div>

          {/* Role-Based Action blocks */}
          <div className="border-t border-slate-100 py-1.5 px-3">
            {user.role === "User" && (
              <Link
                href="/profile?tab=become-owner"
                onClick={handleLinkClick}
                className="block w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer border border-rose-100/50 text-center active:scale-[0.98]"
              >
                Become a Venue Owner
              </Link>
            )}

            {user.role === "Venue Owner" && (
              <Link
                href="/profile?tab=my-venues"
                onClick={handleLinkClick}
                className="w-full py-2 bg-slate-900 hover:bg-slate-950 text-white text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer border-none text-center flex items-center justify-center gap-1.5 active:scale-[0.98]"
              >
                <Briefcase className="size-3.5" />
                <span>My Venues</span>
              </Link>
            )}

            {user.role === "Admin" && (
              <div className="space-y-1.5">
                <Link
                  href="/profile?tab=my-venues"
                  onClick={handleLinkClick}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-950 text-white text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer border-none text-center flex items-center justify-center gap-1.5 active:scale-[0.98]"
                >
                  <Briefcase className="size-3.5" />
                  <span>My Venues</span>
                </Link>
                <Link
                  href="/profile?tab=listing-requests"
                  onClick={handleLinkClick}
                  className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer border border-rose-100/50 text-center flex items-center justify-center gap-1.5 active:scale-[0.98]"
                >
                  <Shield className="size-3.5 text-rose-600" />
                  <span>Listing Requests</span>
                </Link>
              </div>
            )}
          </div>

          {/* Help & Support / Logout footer */}
          <div className="border-t border-slate-100 pt-1">
            <button
              onClick={() => handleActionAlert("Help & Support")}
              className="w-full flex items-center gap-3 px-4 py-2 text-xs sm:text-sm text-slate-650 font-bold hover:bg-slate-50 hover:text-slate-950 transition cursor-pointer text-left border-0 bg-transparent"
            >
              <HelpCircle className="size-4 text-slate-400" />
              <span>Help & Support</span>
            </button>
            
            <button
              onClick={() => { setIsOpen(false); logout(); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs sm:text-sm text-red-650 font-bold hover:bg-red-50 hover:text-red-700 transition cursor-pointer text-left border-0 bg-transparent"
            >
              <LogOut className="size-4 text-red-400" />
              <span>Log Out</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
