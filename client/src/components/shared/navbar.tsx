// src/components/shared/navbar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, User as UserIcon, LogOut, LayoutDashboard } from "lucide-react";

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  const user = {
    name: "Alex Rivera",
    email: "alex@example.com",
    role: "CUSTOMER", 
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-4">
          
          <div className="flex-shrink-0 font-fraunces">
            <Link href="/venues" className="text-xl font-extrabold tracking-tight text-black">
              BOOK<span className="text-gray-500">MYVENUE</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href={isLoggedIn ? "/customer/messages" : "/login"} 
              className="relative p-2 text-gray-600 hover:text-black rounded-full hover:bg-gray-50 transition-colors"
            >
              <Mail className="h-5 w-5" />
              {isLoggedIn && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-black ring-2 ring-white" />
              )}
            </Link>

            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 p-1.5 rounded-full border border-gray-200 hover:shadow-sm transition-all focus:outline-none"
                >
                  <div className="w-7 h-7 rounded-full bg-black text-white text-xs font-semibold flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium pr-1 text-gray-700 hidden sm:inline">
                    {user.name.split(" ")[0]}
                  </span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 text-sm text-gray-700 font-medium animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-4 py-2 border-b border-gray-50 text-xs text-gray-400 truncate">
                      {user.email}
                    </div>
                    <Link
                      href={`/${user.role.toLowerCase()}`}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setIsLoggedIn(false);
                        setShowDropdown(false);
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-gray-700 hover:text-black px-3 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-semibold bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-all shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}