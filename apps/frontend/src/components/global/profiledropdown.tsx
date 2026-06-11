"use client";

import {
  User,
  Settings,
  Languages,
  Palette,
  Headphones,
  LogOut,
} from "lucide-react";

interface ProfileDropdownProps {
  open: boolean;
}

export default function ProfileDropdown({
  open,
}: ProfileDropdownProps) {
  if (!open) return null;

  const menuItems = [
    {
      icon: User,
      label: "Profile",
    },
    {
      icon: Settings,
      label: "Settings",
    },
    {
      icon: Languages,
      label: "Language",
    },
    {
      icon: Palette,
      label: "Theme",
    },
  ];

  return (
    <div className="absolute right-0 top-[60px] z-50 w-[280px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
      {/* User Info */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-4 text-white">
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/100?img=12"
            alt="Profile"
            className="h-12 w-12 rounded-full border-2 border-white object-cover"
          />

          <div>
            <h3 className="font-semibold">
              Vishnu Raj
            </h3>

            <p className="text-sm text-teal-50">
              Venue Owner
            </p>
          </div>
        </div>
      </div>

      {/* Main Menu */}
      <div className="py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
            >
              <Icon className="h-5 w-5 text-slate-500" />

              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mx-3 h-px bg-slate-200" />

      {/* Support */}
      <div className="py-2">
        <button className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50">
          <Headphones className="h-5 w-5 text-slate-500" />
          Support
        </button>
      </div>

      <div className="mx-3 h-px bg-slate-200" />

      {/* Logout */}
      <div className="py-2">
        <button className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 transition hover:bg-red-50">
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}