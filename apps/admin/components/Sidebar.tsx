"use client";

import { MapPin, Settings, LogOut } from "lucide-react";
import { NAV, Tab } from "./data";

interface SidebarProps {
  tab: Tab;
  setTab: (t: Tab) => void;
  setSidebarOpen: (open: boolean) => void;
  mobile?: boolean;
}

export function Sidebar({ tab, setTab, setSidebarOpen, mobile = false }: SidebarProps) {
  return (
    <div className={`${mobile ? "flex" : "hidden lg:flex"} flex-col bg-primary text-primary-foreground h-full`}>
      <div className="px-5 py-5 border-b border-primary-foreground/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm" >BookMyVenues</p>
            <p className="text-primary-foreground/50 text-xs">Admin Console</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ key, label, icon: Icon, badge }) => (
          <button
            key={key}
            onClick={() => { setTab(key); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === key
                ? "bg-primary-foreground/15 text-primary-foreground"
                : "text-primary-foreground/60 hover:bg-primary-foreground/10 hover:text-primary-foreground"
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="flex-1 text-left">{label}</span>
            {badge ? (
              <span className="bg-accent text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                {badge}
              </span>
            ) : null}
          </button>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-primary-foreground/10 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-primary-foreground/60 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-all">
          <Settings className="w-4 h-4" /> Settings
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-primary-foreground/60 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-all">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  );
}
