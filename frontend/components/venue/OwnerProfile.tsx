import React from "react";
import Image from "next/image";
import { BadgeCheck, MessageSquare, Shield, Clock } from "lucide-react";
import VenueSection from "./VenueSection";

interface Owner {
  name: string;
  avatar: string;
  verified: boolean;
  hostingSince: string;
  responseTime: string;
  responseRate: string;
  languages: string[];
  bio: string;
}

interface OwnerProfileProps {
  owner: Owner;
  onContactClick: () => void;
}

export default function OwnerProfile({ owner, onContactClick }: OwnerProfileProps) {
  return (
    <VenueSection title="Meet your Host" id="host">
      <div className="bg-slate-50/60 border border-slate-200/50 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
        
        {/* Profile Card Summary */}
        <div className="bg-white border border-slate-200/50 rounded-3xl p-5 shadow-xs flex flex-col items-center text-center w-full md:w-64 shrink-0 hover:shadow-md transition-shadow">
          <div className="relative size-20 rounded-full overflow-hidden bg-slate-100 mb-3.5 shadow-sm">
            <Image
              src={owner.avatar}
              alt={owner.name}
              fill
              className="object-cover"
            />
          </div>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-1">
            {owner.name}
            {owner.verified && (
              <BadgeCheck className="size-5 fill-rose-600 text-white shrink-0" />
            )}
          </h3>
          <span className="text-xs font-bold text-slate-400 mt-1 select-none">
            Verified Host
          </span>

          <div className="w-full border-t border-slate-100 my-4 pt-4 flex justify-around text-slate-700 select-none">
            <div>
              <p className="text-lg font-extrabold text-slate-900 leading-tight">6</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Years Active</p>
            </div>
            <div className="border-r border-slate-100" />
            <div>
              <p className="text-lg font-extrabold text-slate-900 leading-tight">{owner.responseRate}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Response Rate</p>
            </div>
          </div>
        </div>

        {/* Profile details text */}
        <div className="flex-grow space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider select-none">
              Host Biography
            </h4>
            <p className="text-sm font-medium text-slate-600 leading-relaxed">
              {owner.bio}
            </p>
          </div>

          {/* Quick Host Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-semibold text-slate-700 pt-2 select-none">
            <div className="flex items-center gap-2.5">
              <Shield className="size-4.5 text-rose-600 shrink-0" />
              <span>Identity Verified</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="size-4.5 text-rose-600 shrink-0" />
              <span>Replies {owner.responseTime}</span>
            </div>
            <div className="flex items-center gap-2.5 sm:col-span-2">
              <MessageSquare className="size-4.5 text-rose-600 shrink-0" />
              <span>Speaks: {owner.languages.join(", ")}</span>
            </div>
          </div>

          {/* Contact button inside host section */}
          <div className="pt-3">
            <button
              onClick={onContactClick}
              className="bg-slate-900 hover:bg-slate-950 text-white font-bold h-10 px-5 text-sm rounded-xl cursor-pointer shadow-xs active:translate-y-px transition-all border-none"
            >
              Contact Owner
            </button>
          </div>
        </div>

      </div>
    </VenueSection>
  );
}
