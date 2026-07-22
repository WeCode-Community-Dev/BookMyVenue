"use client";

import React, { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Calendar, Heart, Bell, Settings, BadgeCheck, Briefcase, PlusCircle, Loader2, Camera } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import * as profileService from "@/services/profile.service";

interface ProfileSidebarProps {
  avatar: string;
  name: string;
  role: string;
  memberSince: string;
}

export default function ProfileSidebar({ avatar, name, role, memberSince }: ProfileSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "profile";
  const { updateUser } = useAuth();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const result = await profileService.uploadProfilePicture(formData);
      await updateUser({ avatar: result.imageUrl });
    } catch (error: any) {
      console.error("Failed to upload profile picture:", error);
      alert(error.response?.data?.message || "Failed to upload profile picture. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleTabClick = (tabKey: string) => {
    router.push(`/profile?tab=${tabKey}`);
  };

  // Define nav items list dynamically based on role
  const navItems = [
    { label: "Profile Info", key: "profile", icon: <User className="size-4.5" /> },
    { label: "My Bookings", key: "bookings", icon: <Calendar className="size-4.5" /> },
    { label: "Wishlist", key: "wishlist", icon: <Heart className="size-4.5" /> },
    { label: "Notifications", key: "notifications", icon: <Bell className="size-4.5" /> },
    { label: "Settings", key: "settings", icon: <Settings className="size-4.5" /> },
  ];

  if (role === "User") {
    navItems.push({
      label: "Become a Host",
      key: "become-owner",
      icon: <PlusCircle className="size-4.5 text-rose-500" />,
    });
  } else {
    navItems.push({
      label: "Manage Venues",
      key: "my-venues",
      icon: <Briefcase className="size-4.5 text-slate-700" />,
    });
  }

  return (
    <div className="bg-white border border-slate-200/60 shadow-xs rounded-3xl p-6 space-y-6 select-none text-center">
      
      {/* Avatar & Basic Info */}
      <div className="flex flex-col items-center">
        
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Avatar picture container */}
        <button
          type="button"
          onClick={handleAvatarClick}
          disabled={isUploading}
          className="relative size-24 rounded-full bg-slate-100 flex items-center justify-center mb-3.5 shadow-xs border border-slate-200/60 cursor-pointer transition hover:bg-slate-200/50 active:scale-95 border-none p-0 outline-none overflow-hidden group animate-in duration-205"
          aria-label="Change profile picture"
        >
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="size-full object-cover"
            />
          ) : (
            <User className="size-12 text-slate-400 stroke-[1.5]" />
          )}

          {/* Uploading indicator */}
          {isUploading && (
            <div className="absolute inset-0 bg-slate-900/65 flex items-center justify-center">
              <Loader2 className="size-6 text-white animate-spin" />
            </div>
          )}

          {/* Hover Overlay */}
          {!isUploading && (
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="size-6 text-white" />
            </div>
          )}
        </button>

        <h2 className="text-lg font-black text-slate-900 flex items-center justify-center gap-1 leading-none">
          {name}
        </h2>
        <span className="text-[11px] font-bold text-slate-400 mt-1 block">
          Member since {memberSince.split(" ").slice(-1)[0]}
        </span>
        <div className="mt-2.5 flex justify-center">
          <Badge variant="rose" className="text-[10px] px-2.5 py-0.5 border-rose-100 bg-rose-50 text-rose-700 font-extrabold uppercase leading-none">
            {role}
          </Badge>
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* Nav Menu */}
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.key || (item.key === "my-venues" && activeTab === "add-venue");
          return (
            <button
              key={item.key}
              onClick={() => handleTabClick(item.key)}
              type="button"
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer border-none text-left ${
                isActive
                  ? "bg-rose-50 text-rose-700"
                  : "bg-transparent text-slate-650 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className={isActive ? "text-rose-600" : "text-slate-400"}>
                {item.icon}
              </div>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-100" />

      {/* Identity Verification status card */}
      <div className="bg-slate-50/50 border border-slate-200/40 rounded-2xl p-4 text-left space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
          <BadgeCheck className="size-4.5 text-emerald-600 fill-emerald-50" />
          <span>Identity Verified</span>
        </div>
        <p className="text-[11px] font-medium text-slate-500 leading-normal">
          We have verified the government ID and billing documents connected to this profile.
        </p>
      </div>

      {/* Profile Picture Modal overlay helper */}

    </div>
  );
}
