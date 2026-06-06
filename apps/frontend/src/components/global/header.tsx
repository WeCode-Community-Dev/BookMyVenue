"use client";

import { useState } from "react";
import { Bell, ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 h-[72px] border-b border-slate-200 bg-white">
        <div className="grid h-full grid-cols-[1fr_auto] items-center px-4 md:px-6 lg:grid-cols-[1fr_auto_1fr]">

          {/* Left */}
          <div className="flex items-center justify-start gap-3">

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden h-full w-p bg-slate-200 md:block" />

            <Image
              src="/assets/logos/logo.png"
              alt="BookMyVenue Logo"
              width={290}
              height={200}
              priority
              className=" w-auto object-contain md:h-14"
            />
          </div>

          {/* Center Navigation */}
          <nav className="hidden items-center justify-center gap-10 lg:flex">

            <button className="relative text-sm font-semibold text-slate-900">
              Explore
              <span className="absolute -bottom-[26px] left-0 h-[3px] w-full rounded-full bg-teal-700" />
            </button>

            <button className="text-sm font-semibold text-slate-600 transition hover:text-slate-900">
              Venues Near Me
            </button>

            <button className="relative text-sm font-semibold text-slate-600 transition hover:text-slate-900">
              Offers

              <span
                className="absolute -right-4 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
                style={{ backgroundColor: "#FF6B6B" }}
              >
                12
              </span>
            </button>

          </nav>

          {/* Right */}
          <div className="flex items-center justify-end gap-2 md:gap-4">

            <button className="relative rounded-lg p-2 transition hover:bg-slate-100">
              <Bell className="h-5 w-5 text-slate-700" />

              <span
                className="absolute right-1 top-1 hidden h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white sm:flex"
                style={{ backgroundColor: "#FF6B6B" }}
              >
                3
              </span>
            </button>

            <button className="flex items-center gap-2 rounded-full border border-slate-200 px-2 py-1 transition hover:bg-slate-50">

              <img
                src="https://i.pravatar.cc/100?img=12"
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover md:h-9 md:w-9"
              />

              <ChevronDown className="hidden h-4 w-4 text-slate-500 sm:block" />

            </button>

          </div>

        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          mobileMenuOpen ? "visible" : "invisible"
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute left-0 top-0 h-full w-[280px] bg-white shadow-xl transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="font-semibold text-slate-900">Menu</h2>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg p-2 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex flex-col p-4">

            <button className="rounded-lg px-3 py-3 text-left font-medium text-slate-700 hover:bg-slate-100">
              Explore
            </button>

            <button className="rounded-lg px-3 py-3 text-left font-medium text-slate-700 hover:bg-slate-100">
              Venues Near Me
            </button>

            <button className="rounded-lg px-3 py-3 text-left font-medium text-slate-700 hover:bg-slate-100">
              Offers
            </button>

            <hr className="my-3" />

            <button className="rounded-lg px-3 py-3 text-left font-medium text-slate-700 hover:bg-slate-100">
              My Bookings
            </button>

            <button className="rounded-lg px-3 py-3 text-left font-medium text-slate-700 hover:bg-slate-100">
              Wishlist
            </button>

            <button className="rounded-lg px-3 py-3 text-left font-medium text-slate-700 hover:bg-slate-100">
              Recently Viewed
            </button>

            <button className="rounded-lg px-3 py-3 text-left font-medium text-slate-700 hover:bg-slate-100">
              Support
            </button>

          </div>
        </div>
      </div>
    </>
  );
}
