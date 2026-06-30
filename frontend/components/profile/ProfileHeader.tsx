import React from "react";
import { BadgeCheck, Calendar, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProfileHeaderProps {
  name: string;
  email: string;
  memberSince: string;
  role: string;
}

export default function ProfileHeader({ name, email, memberSince, role }: ProfileHeaderProps) {
  return (
    <div className="bg-white border border-slate-200/60 shadow-xs rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 select-none">
      <div className="space-y-2 text-left">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-1.5 leading-none">
            {name}
          </h1>
          <BadgeCheck className="size-6 fill-rose-600 text-white shrink-0" />
          <Badge variant="rose" className="text-[10px] uppercase font-black px-2.5 py-0.5 border-rose-100 bg-rose-50 text-rose-700 leading-none">
            {role}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm font-semibold text-slate-500">
          <div className="flex items-center gap-1.5">
            <Mail className="size-4 text-slate-400" />
            <span>{email}</span>
          </div>
          <div className="hidden sm:block text-slate-350">•</div>
          <div className="flex items-center gap-1.5">
            <Calendar className="size-4 text-slate-400" />
            <span>Member since {memberSince}</span>
          </div>
        </div>
      </div>

      <div className="bg-rose-50/50 border border-rose-100/40 rounded-2xl px-5 py-3 shrink-0 text-left">
        <p className="text-[9px] text-rose-600 font-extrabold uppercase tracking-wider mb-0.5 leading-none">
          Account Status
        </p>
        <p className="text-sm font-black text-slate-900 leading-none">
          Fully Verified
        </p>
      </div>
    </div>
  );
}
